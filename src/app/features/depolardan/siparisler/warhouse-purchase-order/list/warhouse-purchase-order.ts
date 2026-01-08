import {
  Component,
  effect,
  signal,
  ViewChild,
  DestroyRef,
  inject
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SharedImports } from '../../../../../core/pipes/shared-imports';
import { User } from '../../../../../models/user';
import { MeService } from '../../../../../services/meservice.service';
import { PurchaseOrdersService } from '../../../../../services/orders/purchase-orders.service';
import { WarehouseOrderComponent } from '../create/warehouse-order';
import { Detail } from '../detail/detail';


@Component({
  selector: 'app-warhouse-purchase-order',
  standalone: true,
  imports: [...SharedImports],
  templateUrl: './warhouse-purchase-order.html',
  styleUrl: './warhouse-purchase-order.css',
  providers: [DatePipe]
})
export class WarhousePurchaseOrder {

  private destroyRef = inject(DestroyRef);

  // -------------------- FORM --------------------
  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });

  // -------------------- SIGNAL STATE --------------------
  user = signal<User | null>(null);
  yukleniyor = signal(false);
  gorevid = signal(0);
  gorevadi = signal('');
  altmenuid = signal(0);

  anaekran = '';
  yanekran = '';

  // -------------------- UI STATE --------------------
  currentView: 'table' | 'card' = 'table';
  selectedRow: any = null;

  displayedColumns = ['evrakNo', 'tarih', 'transfer', 'durum', 'islemler'];
  DataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // -------------------- EFFECT CONTROL --------------------
  private lastKey = '';

  constructor(
    private meservice: MeService,
    private purchaseOrdersService: PurchaseOrdersService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver
  ) {

    /* EFFECT #1 → USER SYNC */
    effect(() => {
      this.user.set(this.meservice.userSignal());
    });

    /* EFFECT #2 → MENU / GÖREV BASED LOAD */
    effect(() => {
      const menu = this.meservice.selectedMenu();
      const altmenu = this.meservice.selectedAltMenu();
      const gorev = this.meservice.selectedGorev();

      if (!menu || !altmenu || !gorev) {
        this.lastKey = '';
        return;
      }

      const key = `${menu}-${altmenu.id}-${gorev.kimlik}`;
      if (key === this.lastKey) return;

      this.lastKey = key;

      this.anaekran = key;
      this.yanekran = `${altmenu.isim} -*- ${gorev.isim}`;

      this.altmenuid.set(altmenu.id);
      this.gorevid.set(gorev.kimlik);
      this.gorevadi.set(gorev.isim);

      this.loadData();
    });
  }

  // -------------------- LIFECYCLE --------------------
  ngAfterViewInit() {
    this.DataSource.sort = this.sort;
    this.DataSource.paginator = this.paginator;
  }

  // -------------------- DATA --------------------
  loadData(): void {
    this.DataSource.data = [];
    this.yukleniyor.set(true);

    this.purchaseOrdersService
      .getBranchOrders(this.altmenuid(), 'bugun')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.yukleniyor.set(false))
      )
      .subscribe({
        next: (data: any) => this.DataSource.data = data.siparisler,
        error: () => this.toastr.error('Veriler yüklenirken hata oluştu', 'Hata')
      });
  }

  onDateChanged(): void {
    const start = this.datePipe.transform(this.dateRange.get('start')?.value, 'yyyy-MM-dd');
    const end = this.datePipe.transform(this.dateRange.get('end')?.value, 'yyyy-MM-dd');

    if (!start || !end) return;

    this.yukleniyor.set(true);
    this.DataSource.data = [];

    const zamanlama = `aralik-${start}-${end}`;

    this.purchaseOrdersService
      .getBranchOrders(this.altmenuid(), zamanlama)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.yukleniyor.set(false))
      )
      .subscribe({
        next: (data: any) => this.DataSource.data = data?.siparisler ?? [],
        error: () => this.toastr.error('Filtreleme sırasında hata oluştu', 'Hata')
      });
  }

  // -------------------- ACTIONS --------------------
  taskDetay(seri: string, sira: number): void {
    this.purchaseOrdersService
      .detailsBranchOrder(this.gorevid(), seri, sira)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: any) => {
          this.dialog.open(Detail, {
            width: '50%',
            height: '70%',
            data: data.siparis
          });
        },
        error: () => this.toastr.error('Detay alınamadı', 'Hata')
      });
  }

  yeniEvrak(): void {
    const isMobile = this.breakpointObserver.isMatched(Breakpoints.Handset);

    this.dialog.open(WarehouseOrderComponent, {
      width: isMobile ? '100vw' : '40vw',
      height: isMobile ? '100vh' : '70vh',
      maxWidth: '100vw',
      disableClose: true,
      panelClass: isMobile ? 'full-screen-dialog' : '',
      data: [this.gorevadi(), this.gorevid()]
    });
  }

  
  // EVRAK ÇEVİR
  return(evrak: any) {
    this.purchaseOrdersService.detailsBranchOrder(this.gorevid(), evrak.evrakNoSeri, evrak.evrakNoSira).subscribe({
      next: (data: any) => {
        this.dialog.open(WarehouseOrderComponent, {
          width: '50vw',
          height: '70vh',
          data: data
        });
      },
      error: () => {
        this.toastr.error('Task detayı alınırken hata oluştu', 'Hata');
      }
    });
  }


  // -------------------- FILTER --------------------
  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.DataSource.filterPredicate = (data: any, filter: string) =>
      Object.values(data).some(v =>
        typeof v === 'string'
          ? v.toLowerCase().includes(filter)
          : typeof v === 'number'
          ? v.toString().includes(filter)
          : false
      );

    this.DataSource.filter = value;
  }

  // -------------------- UI HELPERS --------------------
  setView(view: 'table' | 'card') {
    this.currentView = view;
  }

  selectRow(row: any) {
    this.selectedRow = this.selectedRow === row ? null : row;
  }

  getStatusText(e: any): string {
    if (e.siparisSevkOlundu) return 'Sevk Edildi';
    if (e.onaylandi && e.sevkTeslimAlindi) return 'Teslim Edildi';
    if (e.onaylandi) return 'Onaylandı';
    return 'Bekliyor';
  }

  getStatusClass(e: any): string {
    if (e.siparisSevkOlundu) return 'status-success';
    if (e.onaylandi && e.sevkTeslimAlindi) return 'status-success';
    if (e.onaylandi) return 'status-warning';
    return 'status-pending';
  }

  getStatusIcon(e: any): string {
    if (e.siparisSevkOlundu) return 'bi bi-check-circle';
    if (e.onaylandi && e.sevkTeslimAlindi) return 'bi bi-check-circle';
    if (e.onaylandi) return 'bi bi-clock';
    return 'bi bi-hourglass';
  }
}
