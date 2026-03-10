import { BreakpointObserver,Breakpoints } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import {
Component,
computed,
effect,
signal,
ViewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl,FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { finalize } from 'rxjs/operators';

import { BaseComponent } from '../../../../../core/base/base-component/base-component';
import { SharedImports } from '../../../../../core/pipes/shared-imports';
import { MeService } from '../../../../../services/meservice.service';
import { SalesOrdersService } from '../../../../../services/orders/sales-orders.service';

import { WarehouseOrderComponent } from '../create/warehouse-order';
import { WarehouseSaleOrderDetailComponent } from '../detail/detail';

import { AlinanDepoSiparisleriAyrintiDto } from '../../../../../models/ayrinti-dtolari.model';
import { AlinanDepoSiparisleriListeDto } from '../../../../../models/liste-dtolari.model';
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


  // -------------------- UI STATE --------------------
  currentView: 'table' | 'card' = 'table';
  selectedRow: AlinanDepoSiparisleriListeDto | null = null;

  displayedColumns = ['evrakNo', 'tarih', 'transfer', 'durum', 'islemler'];
  DataSource = new MatTableDataSource<AlinanDepoSiparisleriListeDto>([]);

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
  readonly nextgorevid = computed(() => {
    const gorev = this.meservice.selectedGorev();
    return gorev?.siradakiGorev?.id ?? null;
  });
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
        next: (data: AlinanDepoSiparisleriListeDto[]) => {
          this.DataSource.data = data;
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
        next: (data: AlinanDepoSiparisleriListeDto[]) => {
          this.DataSource.data = data;
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
        next: (data: AlinanDepoSiparisleriAyrintiDto) => {
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

  return(evrak: AlinanDepoSiparisleriListeDto): void {
    this.startLoading();
    const isMobile = this.breakpointObserver.isMatched(Breakpoints.Handset);

    this.saleOrdersService
      .detailsBranchOrder(
        this.gorevid(),
        evrak.seri ?? '',
        evrak.sira ?? 0
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: AlinanDepoSiparisleriAyrintiDto) => {
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

    this.DataSource.filterPredicate = (data: AlinanDepoSiparisleriListeDto, filter: string) => {
      return Object.keys(data).some(key => {
        const value = data[key as keyof AlinanDepoSiparisleriListeDto];
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

  selectRow(row: AlinanDepoSiparisleriListeDto) {
    this.selectedRow = this.selectedRow === row ? null : row;
  }

  getStatusText(e: AlinanDepoSiparisleriListeDto): string {
    if (e.durumu=== '1') {
      return 'siparişi verildi/alındı';
    }
    else if (e.durumu === '2') {
      return 'Sevk Hazır / irsaliye bekleniyor';}
    else if (e.durumu === '3') {
      return 'Yolda';}
    else if (e.durumu === '4') {
      return 'Mal Kabulu Yapıldı';
    }
    else {
      return 'Bilinmeyen Durum';
    }
  }

  getStatusClass(e: AlinanDepoSiparisleriListeDto): string {
    if (e.durumu === '1') {
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

  getStatusIcon(e: AlinanDepoSiparisleriListeDto): string {
    if (e.durumu === '1') {
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
