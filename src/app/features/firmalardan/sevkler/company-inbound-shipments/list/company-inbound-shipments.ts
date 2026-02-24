

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
import { MeService } from '../../../../../services/meservice.service';
import { GoodsReceiptNotesService } from '../../../../../services/receipts/goods-receipt-notes.service';
import { CompanyGoodsReceipt } from '../../../siparisler/company-purchase-order/company-goods-receipt/company-goods-receipt';
import { CompanyInboundShipmentsDetailComponent } from '../detail/detail';
import { SevkIrsaliyeleriAyrintiDto } from '../../../../../models/ayrinti-dtolari.model';
import { MalKabulIrsaliyeleriListeDto } from '../../../../../models/liste-dtolari.model';


@Component({
  selector: 'app-company-inbound-shipments',
  standalone: true,
  imports: [...SharedImports],
  templateUrl: './company-inbound-shipments.html',
  styleUrls: ['./company-inbound-shipments.css'],
  providers: [DatePipe]
})
export class CompanyInboundShipments {

  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });
  // Signals ekle
   pageIndex = signal(0);
  pageSize = signal(10);
  yukleniyor = signal(false);

  
  // Yeni değişkenler
  currentView: 'table' | 'card' = 'table';
  selectedRow: MalKabulIrsaliyeleriListeDto | null = null;
  
  // Tablo kolonları güncellendi
  displayedColumns = ['evrakNo', 'tarih', 'transfer', 'durum', 'islemler'];
  DataSource: MatTableDataSource<MalKabulIrsaliyeleriListeDto> = new MatTableDataSource<MalKabulIrsaliyeleriListeDto>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // --- SADECE EFFECT MİMARİSİ (3 EFFECT) ---
// Bu bölümü OrtakMenu constructor içine birebir koyabilirsin

private lastKey = '';

constructor(
  private goodreceiptnotesService: GoodsReceiptNotesService,
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
    this.goodreceiptnotesService.getCompanyReceipts(this.gorevid(), "bugun").subscribe({
      next: (data: MalKabulIrsaliyeleriListeDto[]) => {
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

      const zamanlama: string = `aralik-${baslangic}-${bitis}`;

    this.DataSource.data = [];

    if (baslangic && bitis) { 
      this.yukleniyor.set(true);
      this.goodreceiptnotesService.getCompanyReceipts(this.gorevid(), zamanlama).subscribe({
        next: (data: MalKabulIrsaliyeleriListeDto[]) => {
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
    this.goodreceiptnotesService.detailsCompanyReceipt(this.gorevid(), seri, sira).subscribe({
      next: (data: SevkIrsaliyeleriAyrintiDto) => {
        this.yukleniyor.set(false);
        this.dialog.open(CompanyInboundShipmentsDetailComponent, {
          width: "50%",
          height: "70%",
           disableClose: true,

          data: data,
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

    this.dialog.open(CompanyGoodsReceipt, {
      width: isMobile ? '100vw' : '40vw',
      height: isMobile ? '100vh' : '70vh',
      maxWidth: '100vw',
      panelClass: isMobile ? 'full-screen-dialog' : '',
      disableClose: true,
     data: {  mode:'Scan'   }    });
  }
    farkMalkabul(): void {
    const isMobile = this.breakpointObserver.isMatched(Breakpoints.Handset);

    this.dialog.open(CompanyGoodsReceipt, {
      width: isMobile ? '100vw' : '40vw',
      height: isMobile ? '100vh' : '70vh',
      maxWidth: '100vw',
      panelClass: isMobile ? 'full-screen-dialog' : '',
     data: {  mode:'Fark'   }    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.DataSource.filterPredicate = (data: MalKabulIrsaliyeleriListeDto, filter: string) => {
      return Object.keys(data).some(key => {
        const value = data[key as keyof MalKabulIrsaliyeleriListeDto];
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
  }

  // Satır seçme
  selectRow(row: MalKabulIrsaliyeleriListeDto): void {
    this.selectedRow = this.selectedRow === row ? null : row;
  }

  // Durum class'larını belirleyen fonksiyon
  getStatusClass(evrak: MalKabulIrsaliyeleriListeDto): string {

    return 'status-pending';
  }

  // Durum icon'larını belirleyen fonksiyon
  getStatusIcon(evrak: MalKabulIrsaliyeleriListeDto): string {

    return 'bi bi-hourglass';
  }

  // Durum metnini belirleyen fonksiyon
  getStatusText(evrak: MalKabulIrsaliyeleriListeDto): string {

    return 'Bekliyor';
  }
}