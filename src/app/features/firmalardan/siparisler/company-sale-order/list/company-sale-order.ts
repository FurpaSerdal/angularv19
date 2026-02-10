
import { Component, computed, effect, signal, ViewChild } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { User } from '../../../../../models/user';
import { MeService } from '../../../../../services/meservice.service';
import { PurchaseOrdersService } from '../../../../../services/orders/purchase-orders.service';
import { SharedImports } from '../../../../../core/pipes/shared-imports';
import { CompanyOrder } from '../create/company-order/company-order';
import { EvrakListResponse } from '../../../../../models/evrakListModel';
import { CompanySaleOrderDetailComponent } from '../detail/detail';
import { DetayResponse } from '../../../../../models/detay';

@Component({
  selector: 'app-company-sale-order',
  standalone: true,
  imports: [...SharedImports],
  templateUrl: './company-sale-order.html',
  styleUrl: './company-sale-order.css',
  providers: [DatePipe]
})
export class CompanySaleOrder {

  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });
  // -------------------- SIGNAL STATE --------------------
  yukleniyor = signal(false);
  // Signals ekle
pageIndex = signal(0);
pageSize = signal(10);
  
  // Yeni değişkenler
  currentView: 'table' | 'card' = 'table';
  selectedRow: any = null;
  
  // Tablo kolonları güncellendi
  displayedColumns = ['evrakNo', 'tarih', 'transfer', 'durum', 'islemler'];
  DataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // --- SADECE EFFECT MİMARİSİ (3 EFFECT) ---
// Bu bölümü OrtakMenu constructor içine birebir koyabilirsin

private lastKey = '';

constructor(
  private salseOrdersService: PurchaseOrdersService,
  private meservice: MeService,
  private dialog: MatDialog,
  private datePipe: DatePipe,
  private toastr: ToastrService,
  private route: ActivatedRoute,
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

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.DataSource.sort = this.sort;
    this.DataSource.paginator = this.paginator;

this.paginator.page.subscribe((event) => {
  this.pageIndex.set(event.pageIndex);
  this.pageSize.set(event.pageSize);
});
  }

  loadData(): void {
    this.DataSource.data = [];

    this.yukleniyor.set(true);
    this.salseOrdersService.getCompanyOrders(this.gorevid(), "bugun").subscribe({
      next: (data: EvrakListResponse) => {
        this.DataSource.data = data.evraklar;
        this.yukleniyor.set(false);
      },
      error: () => {
        this.toastr.error('Veriler yüklenirken hata oluştu', 'Hata');
        this.yukleniyor.set(false);
      }
    });
  }

  onDateChanged(): void {
    const baslangic = this.datePipe.transform(this.dateRange.get('start')?.value, 'yyyy-MM-dd');
    const bitis = this.datePipe.transform(this.dateRange.get('end')?.value, 'yyyy-MM-dd');

    if (baslangic && bitis) {
      this.yukleniyor.set(true);
      this.salseOrdersService.getCompanyOrders(this.gorevid(), "").subscribe({
        next: (data: EvrakListResponse) => {
          this.DataSource.data = data.evraklar;
          this.yukleniyor.set(false);
        },
        error: () => {
          this.toastr.error('Filtreleme sırasında hata oluştu', 'Hata');
          this.yukleniyor.set(false);
        }
      });
    }
  }

  taskDetay(seri: string, sira: number): void {
    this.yukleniyor.set(true);
    this.salseOrdersService.detailsCompanyOrder(this.gorevid(), seri, sira).subscribe({
      next: (data: DetayResponse) => {
        this.yukleniyor.set(false);
        this.dialog.open(CompanySaleOrderDetailComponent, {
          width: "50%",
          height: "70%",
          data: data
        });
      },
      error: () => {
        this.yukleniyor.set(false);
        this.toastr.error('Task detayı alınırken hata oluştu', 'Hata');
      },
      complete: () => this.yukleniyor.set(false)
    });
  }

  yeniEvrak(): void {
    const isMobile = this.breakpointObserver.isMatched(Breakpoints.Handset);

    this.dialog.open(CompanyOrder, {
      width: isMobile ? '100vw' : '40vw',
      height: isMobile ? '100vh' : '70vh',
      maxWidth: '100vw',
      panelClass: isMobile ? 'full-screen-dialog' : '',
      data: [this.gorevadi(), this.gorevid()]
    });
  }

  // EVRAK ÇEVİR
  return(evrak: any) {
    this.yukleniyor.set(true);
    this.salseOrdersService.detailsCompanyOrder(this.gorevid(), evrak.evrakNoSeri, evrak.evrakNoSira).subscribe({
      next: (data: DetayResponse) => {
        this.yukleniyor.set(false);
        this.dialog.open(CompanyOrder, {
          width: '50vw',
          height: '70vh',
          data: data
        });
      },
      error: () => {
        this.yukleniyor.set(false);
        this.toastr.error('Task detayı alınırken hata oluştu', 'Hata');
      },
      complete: () => this.yukleniyor.set(false)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.DataSource.filterPredicate = (data: any, filter: string) => {
      return Object.keys(data).some(key => {
        const value = data[key as keyof any];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(filter);
        } else if (typeof value === 'number') {
          return value.toString().includes(filter);
        } else if (value && typeof value === 'object') {
          // Depo objelerini de filtrele
          if (key === 'depo' || key === 'muhatapDepo') {
            return value.no.toString().includes(filter) || 
                   value.isim.toLowerCase().includes(filter);
          }
        }
        return false;
      });
    };
    this.DataSource.filter = filterValue;
  }

  // YENİ FONKSİYONLAR

  // Görünüm değiştirme
  setView(view: 'table' | 'card'): void {
    this.currentView = view;
  }

isSFDS(evrak: any): boolean {
  return evrak.evrakNoSeri?.startsWith('SFDS') ?? false;
}
  // Satır seçme
  selectRow(row: any): void {
    this.selectedRow = this.selectedRow === row ? null : row;
  }

  // Durum class'larını belirleyen fonksiyon
  getStatusClass(evrak: any): string {
     if (evrak.siparisSevkOlundu == true) {
        return 'status-success';
      }
    if (evrak.onaylandi && evrak.sevkTeslimAlindi) {
      return 'status-success';
    } else if (evrak.onaylandi && !evrak.sevkTeslimAlindi) {
      return 'status-warning';
    } else {
     
      return 'status-pending';
    }
  }

  // Durum icon'larını belirleyen fonksiyon
  getStatusIcon(evrak: any): string {
      if (evrak.siparisSevkOlundu == true) {
        return 'bi bi-check-circle';
      }

    if (evrak.onaylandi && evrak.sevkTeslimAlindi) {
      return 'bi bi-check-circle';
    } else if (evrak.onaylandi && !evrak.sevkTeslimAlindi) {
      return 'bi bi-clock';
    } else {
    
      return 'bi bi-hourglass';
    }
  }

  // Durum metnini belirleyen fonksiyon
  getStatusText(evrak: any): string {
         if (evrak.siparisSevkOlundu == true) {
        return 'Sevk Edildi';
      }
    if (evrak.onaylandi && evrak.sevkTeslimAlindi) {
      return 'Teslim Edildi';
    } else if (evrak.onaylandi && !evrak.sevkTeslimAlindi) {
      return 'Onaylandı';
    } else {
 
      return 'Bekliyor';
    }
  }
}