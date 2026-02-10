import {
  Component,
  computed,
  effect,
  signal,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { SharedImports } from '../../../../../core/pipes/shared-imports';
import { BaseComponent } from '../../../../../core/base/base-component/base-component';
import { MeService } from '../../../../../services/meservice.service';
import { SalesOrdersService } from '../../../../../services/orders/sales-orders.service';

import { WarehouseOrderComponent } from '../create/warehouse-order';
import { WarehouseSaleOrderDetailComponent } from '../detail/detail';

import { EvrakListResponse } from '../../../../../models/evrakListModel';
import { DetayResponse, SiparisDetayResponse } from '../../../../../models/detay';
import { WarehouseSalesOrderToShipment } from '../to-shipment/warehouse-sales-order-to-shipment';

@Component({
  selector: 'app-warehouse-sale-order',
  standalone: true,
  imports: [...SharedImports],
  templateUrl: './warehouse-sale-order.html',
  styleUrl: './warehouse-sale-order.css',
  providers: [DatePipe]
})
export class WarehouseSaleOrder extends BaseComponent {

  // -------------------- FORM --------------------
  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });

  // -------------------- SIGNAL STATE --------------------
  nextgorevid = signal<number | null>(null);

  // -------------------- UI STATE --------------------
  currentView: 'table' | 'card' = 'table';
  selectedRow: any = null;

  displayedColumns = ['evrakNo', 'tarih', 'transfer', 'durum', 'islemler'];
  DataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

    // -------------------- PAGINATION SIGNALS --------------------
    pageIndex = signal(0);
    pageSize = signal(10);

  constructor(
    private meservice: MeService,
    private saleOrdersService: SalesOrdersService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver
  ) {
    super();

    /* 🔥 EFFECT → görev değişince data yükle */
    effect(() => {
      const gorevId = this.gorevid();
      if (!gorevId) return;

      this.loadData();
    });
  }

  // -------------------- GLOBAL STATE (SERVICE) --------------------

  readonly user = computed(() => this.meservice.userSignal());
  readonly userdepo = computed(() =>
    this.meservice.userSignal()?.subeNo  ?? 0
  );

  readonly gorevid = computed(() =>
    this.meservice.selectedGorev()?.id ?? 0
  );

  readonly gorevadi = computed(() =>
    this.meservice.selectedGorev()?.isim ?? ''
  );

  readonly altmenuid = computed(() =>
    this.meservice.selectedAltMenu()?.id ?? 0
  );

  readonly anaekran = computed(() => {
    const m = this.meservice.selectedMenu();
    const a = this.meservice.selectedAltMenu();
    const g = this.meservice.selectedGorev();

    if (!m || !a || !g) return '';

    return `${m}-${a.id}-${g.id}`;
  });

  readonly yanekran = computed(() => {
    const a = this.meservice.selectedAltMenu();
    const g = this.meservice.selectedGorev();

    if (!a || !g) return '';

    return `${a.isim} -*- ${g.isim}`;
  });

  // --------------------

    // Kart görünümü için paginated data
    readonly paginatedCardData = computed(() => {
      const filtered = this.DataSource.filteredData;
      const start = this.pageIndex() * this.pageSize();
      const end = start + this.pageSize();
      return filtered.slice(start, end);
    });

  ngAfterViewInit() {
    this.DataSource.sort = this.sort;
    this.DataSource.paginator = this.paginator;

      // Paginator değişikliklerini izle
      this.paginator.page.subscribe((event) => {
        this.pageIndex.set(event.pageIndex);
        this.pageSize.set(event.pageSize);
      });
  }

  // -------------------- DATA --------------------

  loadData(): void {
    this.DataSource.data = [];
    this.startLoading();

    this.saleOrdersService
      .getBranchOrders(this.gorevid(), 'bugun')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.stopLoading())
      )
      .subscribe({
        next: (data: EvrakListResponse) => {
          this.DataSource.data = data.evraklar;
          this.nextgorevid.set(data.siradakiGorev?.id ?? null);
        },
        error: () => this.error('Veriler yüklenirken hata oluştu')
      });
  }

  onDateChanged(): void {
    const start = this.datePipe.transform(
      this.dateRange.get('start')?.value,
      'yyyy-MM-dd'
    );

    const end = this.datePipe.transform(
      this.dateRange.get('end')?.value,
      'yyyy-MM-dd'
    );

    if (!start || !end) return;

    this.startLoading();
    this.DataSource.data = [];

    const zamanlama = `aralik-${start}-${end}`;

    this.saleOrdersService
      .getBranchOrders(this.gorevid(), zamanlama)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.stopLoading())
      )
      .subscribe({
        next: (data: EvrakListResponse) => {
          this.DataSource.data = data.evraklar;
          this.nextgorevid.set(data.siradakiGorev?.id ?? null);
        },
        error: () => this.error('Filtreleme sırasında hata oluştu')
      });
  }

  // -------------------- ACTIONS --------------------

  taskDetay(seri: string, sira: number): void {
    this.startLoading();
    this.saleOrdersService
      .detailsBranchOrder(this.gorevid(), seri, sira)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: SiparisDetayResponse) => {
          this.stopLoading();
          this.dialog.open(WarehouseSaleOrderDetailComponent, {
            width: '50%',
            height: '70%',
             disableClose: true,
            data
          });
        },
        error: () => {
          this.stopLoading();
          this.error('Detay alınamadı');
        },
        complete: () => this.stopLoading()
      });
  }

  yeniEvrak(): void {
    const isMobile = this.breakpointObserver.isMatched(Breakpoints.Handset);

    this.dialog.open(WarehouseOrderComponent, {
      width: isMobile ? '100vw' : '40vw',
      height: isMobile ? '100vh' : '70vh',
      maxWidth: '100vw',
      disableClose: true,
      panelClass: isMobile ? 'full-screen-dialog' : ''
    });
  }

  return(evrak: any) {
    this.startLoading();
    const isMobile = this.breakpointObserver.isMatched(Breakpoints.Handset);

    this.saleOrdersService
      .detailsBranchOrder(
        this.gorevid(),
        evrak.seri,
        evrak.sira
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: SiparisDetayResponse) => {
          this.dialog.open(WarehouseSalesOrderToShipment, {
            width: isMobile ? '100vw' : '40vw',
            height: isMobile ? '100vh' : '70vh',
            maxWidth: '100vw',
             disableClose: true,

  panelClass: 'click-through-dialog',
            data: {
              detay: data,
              nextgorevid: this.nextgorevid()
            }
          });
        },
        error: () => {
          this.error('Task detayı alınırken hata oluştu');
          this.stopLoading();
        },
        complete: () => this.stopLoading()
      });
  }

  // -------------------- FILTER --------------------

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement)
      .value
      .trim()
      .toLowerCase();

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

  isSFDS(e: any): boolean {
    return e.evrakNoSeri?.startsWith('SFDS') ?? false;
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
