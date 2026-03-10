
import { Component,computed,effect,signal,ViewChild } from '@angular/core';

import { DatePipe } from '@angular/common';
import { FormControl,FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

import { BreakpointObserver,Breakpoints } from '@angular/cdk/layout';
import { SharedImports } from '../../../../../core/pipes/shared-imports';
import { PdfComponent } from '../../../../../modal/pdf/pdf.component';
import { SevkIrsaliyeleriAyrintiDto } from '../../../../../models/ayrinti-dtolari.model';
import { SevkIrsaliyeleriListeDto } from '../../../../../models/liste-dtolari.model';
import { CompanyService } from '../../../../../services/company.service';
import { MeService } from '../../../../../services/meservice.service';
import { ShipmentNotesService } from '../../../../../services/shipments/shipment-notes.service';
import { CompanyRefund } from '../company-refund/company-refund';
import { CompanyToEwaybill } from '../company-to-ewaybill/company-to-ewaybill';
import { CompanyOutboundShipmentsDetailComponent } from '../detail/detail';



@Component({
  selector: 'app-company-outbound-shipments',
  standalone: true,
  imports: [...SharedImports],
  templateUrl: './company-outbound-shipments.html',
  styleUrl: './company-outbound-shipments.css',
  providers: [DatePipe]
})
export class CompanyOutboundShipments {

  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });


  yukleniyor = signal(false);
pageIndex = signal(0);
pageSize = signal(10);
  
  // Yeni değişkenler
  currentView: 'table' | 'card' = 'table';
  selectedRow: SevkIrsaliyeleriListeDto | null = null;
  
  // Tablo kolonları güncellendi
  displayedColumns = ['evrakNo', 'belgeNo', 'tarih', 'kaynak', 'hedef', 'durum', 'islemler'];
  DataSource: MatTableDataSource<SevkIrsaliyeleriListeDto> = new MatTableDataSource<SevkIrsaliyeleriListeDto>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // --- SADECE EFFECT MİMARİSİ (3 EFFECT) ---
// Bu bölümü OrtakMenu constructor içine birebir koyabilirsin

private lastKey = '';

constructor(
  private shipmentNotesService: ShipmentNotesService,
  private meservice: MeService,
  private componyService: CompanyService,
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
    this.DataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'evrakNo':
          return `${item.seri ?? ''}/${item.sira ?? ''}`.toLowerCase();
        case 'kaynak':
          return `${this.user()?.subeNo ?? ''} ${this.user()?.sube ?? ''}`.toLowerCase();
        case 'hedef':
          return `${item.muhatap ?? ''} `.toLowerCase();
        case 'tarih':
          return item.tarih ? new Date(item.tarih).getTime() : 0;
        case 'durum':
          return `${item.durumu ?? ''}`.toLowerCase();
        case 'belgeNo':
          return `${item.belgeNo ?? ''}`.toLowerCase();
        default:
          return (item as unknown as Record<string, unknown>)[property] as string | number;
      }
    };
    this.DataSource.sort = this.sort;

    if (!this.paginator) {
      return;
    }

    this.DataSource.paginator = this.paginator;
    this.paginator.page.subscribe((event) => {
      this.pageIndex.set(event.pageIndex);
      this.pageSize.set(event.pageSize);
    });
  }

  loadData(): void {
    this.DataSource.data = [];

    this.yukleniyor.set(true);
    this.shipmentNotesService.getCompanyShipments(this.gorevid(),"bugun").subscribe({
      next: (data: SevkIrsaliyeleriListeDto[]) => {
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
      this.shipmentNotesService.getCompanyShipments(this.gorevid(), zamanlama).subscribe({
        next: (data: SevkIrsaliyeleriListeDto[]) => {
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
    this.shipmentNotesService.detailsCompanyShipment(this.gorevid(), seri, sira).subscribe({
      next: (data: SevkIrsaliyeleriAyrintiDto) => {
        this.yukleniyor.set(false);
        this.dialog.open(CompanyOutboundShipmentsDetailComponent, {
          width: "50%",
          height: "70%",
          data: data
        });
        console.log('Task Detay:', data);
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

    this.dialog.open(CompanyRefund, {
      width: isMobile ? '100vw' : '40vw',
      height: isMobile ? '100vh' : '70vh',
      maxWidth: '100vw',
      panelClass: isMobile ? 'full-screen-dialog' : '',
      data: [this.gorevadi(), this.gorevid()]
    });
  }

  // EVRAK ÇEVİR
  return(evrak: SevkIrsaliyeleriListeDto) {
    this.yukleniyor.set(true);
    this.shipmentNotesService.detailsCompanyShipment(this.gorevid(), evrak.seri ?? '', evrak.sira ?? 0).subscribe({
      next: (data: SevkIrsaliyeleriAyrintiDto) => {
        this.yukleniyor.set(false);
        this.dialog.open(CompanyToEwaybill, {
          width: '50vw',
          height: '70vh',
          data: data
        });
      },
      error: () => {
        this.yukleniyor.set(false);
        this.toastr.error('Task detayı alınırken hata oluştu', 'Hata');
      }
    });
  }
  showPdf(ittn: string): void {
    this.yukleniyor.set(true);
    this.componyService.getEWaybillPdf(ittn).subscribe({
      next: (pdfData: Blob) => {
        this.yukleniyor.set(false);
        const url = window.URL.createObjectURL(pdfData);
        this.dialog.open(PdfComponent, {
          width: '80vw',
          height: '80vh',
          data: { url }
        });
      },
      error: () => {
        this.yukleniyor.set(false);
        this.toastr.error('PDF yüklenirken hata oluştu', 'Hata');
      }
    });
  }

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.DataSource.filterPredicate = (data: SevkIrsaliyeleriListeDto, filter: string) => {
      return Object.keys(data).some(key => {
        const value = data[key as keyof SevkIrsaliyeleriListeDto];
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
  selectRow(row: SevkIrsaliyeleriListeDto): void {
    this.selectedRow = this.selectedRow === row ? null : row;
  }

  // Durum class'larını belirleyen fonksiyon
  getStatusClass(evrak: SevkIrsaliyeleriListeDto): string {
 
      return 'status-pending';

  }


  // Durum icon'larını belirleyen fonksiyon
  getStatusIcon(evrak: SevkIrsaliyeleriListeDto): string {
      return 'bi bi-hourglass';
 }


  // Durum metnini belirleyen fonksiyon
  getStatusText(evrak: SevkIrsaliyeleriListeDto): string {

    return 'Beklemede';
  }}
