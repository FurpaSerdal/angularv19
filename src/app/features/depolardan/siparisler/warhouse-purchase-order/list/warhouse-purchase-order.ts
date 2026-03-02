import {
  Component,
  effect,
  signal,
  ViewChild,
  DestroyRef,
  inject,
  computed
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SharedImports } from '../../../../../core/pipes/shared-imports';
import { MeService } from '../../../../../services/meservice.service';
import { PurchaseOrdersService } from '../../../../../services/orders/purchase-orders.service';
import { WarehouseOrderComponent } from '../create/warehouse-order';
import { WarehousePurchaseOrderDetailComponent } from '../detail/detail';
import { VerilenDepoSiparisleriListeDto } from '../../../../../models/liste-dtolari.model';
import { VerilenDepoSiparisleriAyrintiDto } from '../../../../../models/ayrinti-dtolari.model';


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
  yukleniyor = signal(false);
    // Signals ekle
  pageIndex = signal(0);
  pageSize = signal(10);

  // -------------------- UI STATE --------------------
  currentView: 'table' | 'card' = 'table';
  selectedRow: VerilenDepoSiparisleriListeDto | null = null;

  displayedColumns = ['evrakNo', 'tarih', 'kaynak', 'hedef', 'durum', 'islemler'];
  DataSource = new MatTableDataSource<VerilenDepoSiparisleriListeDto>([]);

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
    private breakpointObserver: BreakpointObserver
  ) {

    /* 🔥 EFFECT → görev değişince data yükle */
    effect(() => {
      const gorevId = this.gorevid();
      if (!gorevId) return;

      this.loadData();
    });
  }



  // Computed signal ekle
  paginatedCardData = computed(() => {
    const filtered = this.DataSource.filteredData;
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return filtered.slice(start, end);
  });

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
  // -------------------- LIFECYCLE --------------------
  ngAfterViewInit() {
    this.DataSource.sort = this.sort;
    console.log('MatSort initialized:', this.sort); 
    this.DataSource.paginator = this.paginator;

    this.paginator.page.subscribe((event) => {
      this.pageIndex.set(event.pageIndex);
      this.pageSize.set(event.pageSize);
    });
  }

  // -------------------- DATA --------------------
  loadData(): void {
    this.DataSource.data = [];
    this.yukleniyor.set(true);

    this.purchaseOrdersService
      .getBranchOrders(this.gorevid(), 'bugun')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.yukleniyor.set(false))
      )
      .subscribe({
        next: (data: VerilenDepoSiparisleriListeDto[]) => this.DataSource.data = data,
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
      .getBranchOrders(this.gorevid(), zamanlama)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.yukleniyor.set(false))
      )
      .subscribe({
        next: (data: VerilenDepoSiparisleriListeDto[]) => this.DataSource.data = data,
        error: () => this.toastr.error('Filtreleme sırasında hata oluştu', 'Hata')
      });
  }

  // -------------------- ACTIONS --------------------
  taskDetay(seri: string, sira: number): void {
    this.yukleniyor.set(true);
    this.purchaseOrdersService
      .detailsBranchOrder(this.gorevid(), seri, sira)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: VerilenDepoSiparisleriAyrintiDto) => {
          this.dialog.open(WarehousePurchaseOrderDetailComponent, {
            width: '50%',
            height: '70%',
            maxWidth: '100vw',
            disableClose: true,
            panelClass: '',
            data: data

          });
          this.yukleniyor.set(false);
        },
        error: () => {
          this.toastr.error('Detay alınamadı', 'Hata');
          this.yukleniyor.set(false);
        },
        complete: () => this.yukleniyor.set(false)
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



  // -------------------- FILTER --------------------
  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.DataSource.filterPredicate = (data: VerilenDepoSiparisleriListeDto, filter: string) => {
      return Object.keys(data).some(key => {
        const value = data[key as keyof VerilenDepoSiparisleriListeDto];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(filter);
        }
        if (typeof value === 'number') {
          return value.toString().includes(filter);
        }
        return false;
      });
    };

    this.DataSource.filter = value;
  }


  
  // -------------------- UI HELPERS --------------------
  setView(view: 'table' | 'card') {
    this.currentView = view;
  }

  selectRow(row: VerilenDepoSiparisleriListeDto) {
    this.selectedRow = this.selectedRow === row ? null : row;
  }

  getStatusText(e: VerilenDepoSiparisleriListeDto): string {
     if (e.durumu=== '1') {
       return 'Sevke Hazırlanıyor';
     }
     else if (e.durumu === '2') {
       return 'Sevk Hazır';}
     else if (e.durumu === '3') {
       return 'Yolda';}
     else if (e.durumu === '4') {
       return 'Mal Kabulü Yapıldı';
     }
     else {
       return 'Bilinmeyen Durum';
     }
   }
 
   getStatusClass(e: VerilenDepoSiparisleriListeDto): string {
     if (e.durumu === ' 1') {
       return 'badge bg-warning';
     }
     if (e.durumu === '2') {
       return 'badge bg-info';
     }
     if (e.durumu === '3') {
       return 'badge bg-primary';
     }
     if (e.durumu === '4') {
       return 'badge bg-success';
     }
     return 'badge bg-secondary';
   }
 
   getStatusIcon(e: VerilenDepoSiparisleriListeDto): string {
     if (e.durumu === ' 1') {
       return 'bi bi-hourglass-split';
     }
     if (e.durumu === '2') {
       return 'bi bi-check2-circle';
     }
     if (e.durumu === '3') {
       return 'bi bi-truck';
     }
     if (e.durumu === '4') {
       return 'bi bi-check-circle';
     }
     return 'bi bi-question-circle';
 
   
   }
}
