

import { BreakpointObserver,Breakpoints } from '@angular/cdk/layout';
import { CommonModule,DatePipe,NgForOf,NgIf } from '@angular/common';
import { Component,computed,effect,signal,ViewChild } from '@angular/core';
import { FormControl,FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { SharedImports } from '../../../../../core/pipes/shared-imports';
import { DepolardanMalKabulIrsaliyeleriAyrintiDto } from '../../../../../models/ayrinti-dtolari.model';
import { DepolardanMalKabulIrsaliyeleriListeDto } from '../../../../../models/liste-dtolari.model';
import { MeService } from '../../../../../services/meservice.service';
import { GoodsReceiptNotesService } from '../../../../../services/receipts/goods-receipt-notes.service';
import { WarehouseInboundShipmentsDetailComponent } from '../detail/detail';
import { WarehouseGoodsReceipt } from '../warehouse-goods-receipt/warehouse-goods-receipt';
;
;




@Component({
  selector: 'app-warehouse-inbound-shipments',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf, ...SharedImports],
  templateUrl: './warehouse-inbound-shipments.html',
  styleUrls: ['./warehouse-inbound-shipments.css'],
  providers: [DatePipe]
})
export class WarehouseInboundShipments {

  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });

  yukleniyor = signal(false);
  pageIndex = signal(0);
  pageSize = signal(10);

  
  // Yeni değişkenler
  currentView: 'table' | 'card' = 'table';
  selectedRow: DepolardanMalKabulIrsaliyeleriListeDto | null = null;
  
  // Tablo kolonları güncellendi
  displayedColumns = ['seri', 'sira', 'tarih', 'hedef','kaynak','belgeNo', 'durum', 'islemler'];
  DataSource: MatTableDataSource<DepolardanMalKabulIrsaliyeleriListeDto> = new MatTableDataSource<DepolardanMalKabulIrsaliyeleriListeDto>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Kart görünümü için paginated data
  paginatedCardData = computed(() => {
    const filtered = this.DataSource.filteredData;
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return filtered.slice(start, end);
  });

  // --- SADECE EFFECT MİMARİSİ (3 EFFECT) ---
  // Bu bölümü OrtakMenu constructor içine birebir koyabilirsin

constructor(
  private meservice: MeService, 
  private goodsReceiptNotesService: GoodsReceiptNotesService,
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

  // -------------------- GLOBAL STATE (SERVICE) --------------------

  readonly user = computed(() => this.meservice.userSignal());

  readonly gorevid = computed(() =>
    this.meservice.selectedGorev()?.id ?? 0
  );

  readonly gorevadi = computed(() =>
    this.meservice.selectedGorev()?.isim ?? ''
  );
  readonly iadegorevid = computed(() =>
    this.meservice.selectedGorev()?.iadeGorevi?.id ?? 0
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
    
    // Paginator değişikliklerini izle
    this.paginator.page.subscribe((event) => {
      this.pageIndex.set(event.pageIndex);
      this.pageSize.set(event.pageSize);
    });
  }

  ngOnDestroy() {
  }

  loadData(): void {
    this.DataSource.data = [];


    this.yukleniyor.set(true);
    this.goodsReceiptNotesService.getBranchReceipts(this.gorevid(), "bugun").subscribe({
      next: (data: DepolardanMalKabulIrsaliyeleriListeDto[]) => {
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

    if (baslangic && bitis) {
      this.yukleniyor.set(true);
      this.goodsReceiptNotesService.getBranchReceipts(this.gorevid(), zamanlama).subscribe({
        next: (data: DepolardanMalKabulIrsaliyeleriListeDto[]) => {
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
  }

  taskDetay(seri: string, sira: number): void {
    this.yukleniyor.set(true);
    this.goodsReceiptNotesService.detailsBranchReceipt(this.gorevid(), seri, sira).subscribe({
      next: (data: DepolardanMalKabulIrsaliyeleriAyrintiDto) => {
        this.yukleniyor.set(false);
        this.dialog.open(WarehouseInboundShipmentsDetailComponent, {
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

    this.dialog.open(WarehouseGoodsReceipt, {
      width: isMobile ? '100vw' : '40vw',
      height: isMobile ? '100vh' : '70vh',
      maxWidth: '100vw',
                disableClose: true,

      panelClass: isMobile ? 'full-screen-dialog' : '',
         data: {  mode:'Scan'   }
    });
  }

  // EVRAK ÇEVİR
  return(evrak: DepolardanMalKabulIrsaliyeleriListeDto) {

    this.yukleniyor.set(true);
     this.toastr.show('Evrak Çevirme İşlemi Başlatıldı irsaliye bilgileri alınıyor', 'Bilgi' ,
      { timeOut: 10000, progressBar: true, progressAnimation: 'increasing' , }
     );
    this.goodsReceiptNotesService.detailsBranchReceipt(this.gorevid(), evrak.seri ?? '', evrak.sira ?? 0).subscribe({
      next: (data: DepolardanMalKabulIrsaliyeleriAyrintiDto) => {
        this.yukleniyor.set(false);
        this.dialog.open(WarehouseGoodsReceipt, {
          width: '50vw',
          height: '70vh',
          disableClose: true,
           data: {
                 detay: data,
                 mode: 'select' ,
                 iadegorevid: this.iadegorevid()
                 }
        });
      },
      error: () => {
        this.yukleniyor.set(false);
        this.toastr.error('Task detayı alınırken hata oluştu', 'Hata');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.DataSource.filterPredicate = (data: DepolardanMalKabulIrsaliyeleriListeDto, filter: string) => {
      return Object.keys(data).some(key => {
        const value = data[key as keyof DepolardanMalKabulIrsaliyeleriListeDto];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(filter);
        } else if (typeof value === 'number') {
          return value.toString().includes(filter);
        } else if (value && typeof value === 'object') {
      
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
    // Görünüm değiştiğinde sayfalamayı sıfırla
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }


  // Satır seçme
  selectRow(row: DepolardanMalKabulIrsaliyeleriListeDto): void {
    this.selectedRow = this.selectedRow === row ? null : row;
  }

  // Durum class'larını belirleyen fonksiyon
  getStatusClass(evrak: DepolardanMalKabulIrsaliyeleriListeDto): string {
      if (evrak.durumu === '1') {
        return "siparis-hazir";
      } else if (evrak.durumu === '2') {
        return 'sevk-hazir';
      } else if (evrak.durumu === '3') {
        return 'yolda';
      }
        else if (evrak.durumu === '4') {
          return 'mal-kabulu-yapildi';
        }
      return 'status-default';
  }

  // Durum icon'larını belirleyen fonksiyon
  getStatusIcon(evrak: DepolardanMalKabulIrsaliyeleriListeDto): string {

      if (evrak.durumu === '1') {
        return 'bi bi-hourglass';
      } else if (evrak.durumu === '2') {
        return 'bi bi-check-lg';
      } else if (evrak.durumu === '3') {
        return 'bi bi-truck';
      }
        else if (evrak.durumu === '4') {
          return 'bi bi-check-circle';
        }
      return 'bi bi-question-circle';
  }

  // Durum metnini belirleyen fonksiyon
  getStatusText(evrak: DepolardanMalKabulIrsaliyeleriListeDto): string {
 
      if (evrak.durumu === '1') {
        return 'Sipariş Hazır';
      }
      else if (evrak.durumu === '2') {
        return 'Sevk Hazır';
      }
      else if (evrak.durumu === '3') {
        return 'Yolda';
      }
        else if (evrak.durumu === '4') {
          return 'Mal Kabulu Yapıldı';
        }
      return 'Bilinmeyen Durum';
  }
}