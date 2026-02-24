
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
import { SharedImports } from '../../../../../core/pipes/shared-imports';
import { PurchaseOrdersService } from '../../../../../services/orders/purchase-orders.service';
import { MeService } from '../../../../../services/meservice.service';
import { CompanyGoodsReceipt } from '../company-goods-receipt/company-goods-receipt';
import { CompanyOrder } from '../company-order/company-order';
import { CompanyPurchaseOrderDetailComponent } from '../detail/detail';
import { VerilenSiparislerListeDto } from '../../../../../models/liste-dtolari.model';
import { VerilenSiparislerAyrintiDto } from '../../../../../models/ayrinti-dtolari.model';


@Component({
  selector: 'app-company-purchase-order',
  standalone: true,
  imports: [...SharedImports],
  templateUrl: './company-purchase-order.html',
  styleUrl: './company-purchase-order.css',
  providers: [DatePipe]
})
export class CompanyPurchaseOrder {

  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });


  yukleniyor = signal(false);
  // Signals ekle
pageIndex = signal(0);
pageSize = signal(10);


  // Yeni değişkenler
  currentView: 'table' | 'card' = 'table';
  selectedRow: VerilenSiparislerListeDto | null = null;
  
  // Tablo kolonları güncellendi
  displayedColumns = ['evrakNo', 'tarih', 'transfer', 'durum', 'onay', 'islemler'];
  DataSource: MatTableDataSource<VerilenSiparislerListeDto> = new MatTableDataSource<VerilenSiparislerListeDto>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // --- SADECE EFFECT MİMARİSİ (3 EFFECT) ---
// Bu bölümü OrtakMenu constructor içine birebir koyabilirsin

private lastKey = '';

constructor(
  private purchaseOrdersService: PurchaseOrdersService,
  private meservice: MeService,
  private dialog: MatDialog,
  private datePipe: DatePipe,
  private toastr: ToastrService,
  private route: ActivatedRoute,
  private breakpointObserver: BreakpointObserver
){

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
  readonly nextTaskId = computed(() =>
    this.meservice.selectedGorev()?.siradakiGorev?.id ?? 0
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
    this.purchaseOrdersService.getCompanyOrders(this.gorevid(), "bugun").subscribe({
      next: (data: VerilenSiparislerListeDto[]) => {
        this.DataSource.data = data;
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
      const zamanlama: string = `aralik-${baslangic}-${bitis}`;
    

     this.DataSource.data = [];
      this.yukleniyor.set(true);
      this.purchaseOrdersService.getCompanyOrders(this.gorevid(), zamanlama).subscribe({
        next: (data: VerilenSiparislerListeDto[]) => {
          this.DataSource.data = data;

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
    this.purchaseOrdersService.detailsCompanyOrder(this.gorevid(), seri, sira).subscribe({
      next: (data: VerilenSiparislerAyrintiDto) => {
        this.yukleniyor.set(false);
        this.dialog.open(CompanyPurchaseOrderDetailComponent, {
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
      maxHeight: '100vh',
      disableClose: true,
      panelClass: isMobile ? 'full-screen-dialog' : '',
      data: [this.gorevadi(), this.gorevid()]
    });
  }

  // EVRAK ÇEVİR
  return(evrak: VerilenSiparislerListeDto) {
    this.yukleniyor.set(true);
    this.purchaseOrdersService.detailsCompanyOrder(this.gorevid(), evrak.seri ?? '', evrak.sira ?? 0).subscribe({
      next: (data: VerilenSiparislerAyrintiDto) => {
        this.yukleniyor.set(false);
        this.dialog.open(CompanyGoodsReceipt, {
          width: '50vw',
          height: '70vh',
          panelClass: 'full-screen-dialog',
          disableClose: true,
           data: {
                          detay: data,
                          mode: 'select' ,
                          nextTaskId: this.nextTaskId
                          }
        });
      },
      error: () => {
        this.toastr.error('Task detayı alınırken hata oluştu', 'Hata');
        this.yukleniyor.set(false);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.DataSource.filterPredicate = (data: VerilenSiparislerListeDto, filter: string) => {
      return Object.keys(data).some(key => {
        const value = data[key as keyof VerilenSiparislerListeDto];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(filter);
        } else if (typeof value === 'number') {
          return value.toString().includes(filter);
        } else if (value && typeof value === 'object') {
          // Depo ve Firma objelerini de filtrele
          if (key === 'depo' || key === 'musteriFirma') {
            if ('no' in value && 'isim' in value) {
              return (value as any).no?.toString().includes(filter) || 
                     (value as any).isim?.toLowerCase().includes(filter);
            }
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


  // Satır seçme
  selectRow(row: VerilenSiparislerListeDto): void {
    this.selectedRow = this.selectedRow === row ? null : row;
  }

  // Durum class'larını belirleyen fonksiyon
  getStatusClass(evrak: VerilenSiparislerListeDto): string {
      if (evrak.durumu === '1') {
        return 'sipariş verildi';
      } else if (evrak.durumu === '2') {
        return 'sevk edildi';
      }
      else if (evrak.durumu === '3') {
        return 'mal kabul yapıldı';
      }
      else {
        return 'order unknown';
      }
  
  }

  // Durum icon'larını belirleyen fonksiyon
  getStatusIcon(evrak: VerilenSiparislerListeDto): string {
      if (evrak.durumu === '1') {
        return 'bi bi-hourglass';
      } else if (evrak.durumu === '2') {
        return 'local_shipping';
      }
      else if (evrak.durumu === '3') {
        return 'inventory';
      }
      else {
        return 'help_outline';
      }

  
  }

  // Durum metnini belirleyen fonksiyon
  getStatusText(evrak: VerilenSiparislerListeDto): string {
     if (evrak.durumu === '1') {
       return 'sipariş verildi';
     } else if (evrak.durumu === '2') {
       return 'sevk edildi';
     }
     else if (evrak.durumu === '3') {
       return 'mal kabul yapıldı';
     }
     else {
       return 'Bilinmiyor';
     }
    }
  }