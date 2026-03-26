
import { BreakpointObserver,Breakpoints } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { Component,computed,effect,signal,ViewChild } from '@angular/core';
import { FormControl,FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { SharedImports } from '../../../../../core/pipes/shared-imports';
import { PdfComponent } from '../../../../../modal/pdf/pdf.component';
import { DepolaraSevkIrsaliyeleriAyrintiDto } from '../../../../../models/ayrinti-dtolari.model';
import { DepolaraSevkIrsaliyeleriListeDto } from '../../../../../models/liste-dtolari.model';
import { MeService } from '../../../../../services/meservice.service';
import { ShipmentNotesService } from '../../../../../services/shipments/shipment-notes.service';
import { WarehouseService } from '../../../../../services/warehouse.service';
import { ConvertToEWaybillComponent } from '../convert-to-ewaybill-component/convert-to-ewaybill-component';
import { WarehouseSend } from '../create/warehouse-send';
import { WarehouseOutboundShipmentsDetailComponent } from '../detail/detail';
;
;



@Component({
  selector: 'app-warehouse-outbound-shipments',
  standalone: true,
  imports: [...SharedImports],
  templateUrl: './warehouse-outbound-shipments.html',
  styleUrl: './warehouse-outbound-shipments.css',
  providers: [DatePipe] 
})
export class WarehouseOutboundShipments {
  // Signals ekle
pageIndex = signal(0);
pageSize = signal(10);

  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });

  yukleniyor = signal(false);

  // Yeni değişkenler
  currentView: 'table' | 'card' = 'table';
  selectedRow: DepolaraSevkIrsaliyeleriListeDto | null = null;
  
  // Tablo kolonları güncellendi
  displayedColumns = ['evrakNo', 'tarih', 'belgeNo', 'kaynak', 'hedef', 'durum', 'islemler'];
  DataSource: MatTableDataSource<DepolaraSevkIrsaliyeleriListeDto> = new MatTableDataSource<DepolaraSevkIrsaliyeleriListeDto>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;




// Computed signal ekle
paginatedCardData = computed(() => {
  const filtered = this.DataSource.filteredData;
  const start = this.pageIndex() * this.pageSize();
  const end = start + this.pageSize();
  return filtered.slice(start, end);
});

constructor(
  private meservice: MeService, 
  private shipmentNotesService: ShipmentNotesService,
  private warehouseService: WarehouseService,
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
  loadData(): void {
    this.DataSource.data = [];

    this.yukleniyor.set(true);
    this.shipmentNotesService.getBranchShipments(this.gorevid(), "bugun").subscribe({
      next: (data: DepolaraSevkIrsaliyeleriListeDto[]) => {
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
      this.shipmentNotesService.getBranchShipments(this.gorevid(), zamanlama).subscribe({
        next: (data: DepolaraSevkIrsaliyeleriListeDto[]) => {
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
  irsaliyeCevir(evrak: DepolaraSevkIrsaliyeleriListeDto): void {
    this.yukleniyor.set(true);
    this.shipmentNotesService.detailsBranchShipment(this.gorevid(), evrak.seri ?? '', evrak.sira ?? 0).subscribe({
      next: (data: DepolaraSevkIrsaliyeleriAyrintiDto) => {
        this.yukleniyor.set(false);
        const isMobile = this.breakpointObserver.isMatched(Breakpoints.Handset);  
        this.dialog.open(ConvertToEWaybillComponent, {
          width: isMobile ? '100vw' : '50vw',
          height: isMobile ? '100vh' : '85vh',
          maxWidth: '100vw',
          disableClose: true,
          panelClass: isMobile ? 'full-screen-dialog' : '',
          data: {data : data, subeNo: this.user()?.subeNo ?? 0}
        });
      },
      error: () => {
        this.yukleniyor.set(false);
        this.toastr.error('Evrak detayları alınırken hata oluştu', 'Hata');
      },
      complete: () => this.yukleniyor.set(false)
    });
  }

  taskDetay(seri: string, sira: number): void {
    this.yukleniyor.set(true);
    this.shipmentNotesService.detailsBranchShipment(this.gorevid(), seri, sira).subscribe({
      next: (data: DepolaraSevkIrsaliyeleriAyrintiDto) => {
        this.yukleniyor.set(false);
        this.dialog.open(WarehouseOutboundShipmentsDetailComponent, {
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

    this.dialog.open(WarehouseSend, {
      width: isMobile ? '100vw' : '40vw',
      height: isMobile ? '100vh' : '70vh',
      maxWidth: '100vw',
      disableClose: true,
      panelClass: isMobile ? 'full-screen-dialog' : '',
      data: [this.gorevadi(), this.gorevid()]
    });
  }

  // // EVRAK ÇEVİR
  // return(evrak: DepolaraSevkIrsaliyeleriListeDto) {
  //   this.yukleniyor.set(true);
  //   this.shipmentNotesService.detailsBranchShipment(this.gorevid(), evrak.seri ?? '', evrak.sira ?? 0).subscribe({
  //     next: (data: DepolaraSevkIrsaliyeleriAyrintiDto) => {
  //       this.yukleniyor.set(false);
  //       this.dialog.open(WarehouseSend, {
  //         width: '50vw',
  //         height: '70vh',
  //         data: data
  //       });
  //     },
  //     error: () => {
  //       this.yukleniyor.set(false);
  //       this.toastr.error('Task detayı alınırken hata oluştu', 'Hata');
  //     }
  //   });
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.DataSource.filterPredicate = (data: DepolaraSevkIrsaliyeleriListeDto, filter: string) => {
      return Object.keys(data).some(key => {
        const value = data[key as keyof DepolaraSevkIrsaliyeleriListeDto];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(filter);
        } else if (typeof value === 'number') {
          return value.toString().includes(filter);
        }
        return false;
      });
    };
    this.DataSource.filter = filterValue;
  }

  // PDF indirme
  downloadPdf(İttn: string): void {
    this.yukleniyor.set(true);
    this.warehouseService.getEWaybillPdf(İttn).subscribe({
      next: (pdfData: Blob) => {
         this.yukleniyor.set(false);
         const url = window.URL.createObjectURL(pdfData);
         this.dialog.open(PdfComponent, {
           width: '80vw',
           height: '80vh',
           data: { url }
         });
      },
      error: (_error) => {
        this.toastr.error('PDF indirme sırasında hata oluştu', 'Hata');
      }
    });
  }

  // YENİ FONKSİYONLAR

  // Görünüm değiştirme
  setView(view: 'table' | 'card'): void {
    this.currentView = view;
  }

isSFDS(evrak: DepolaraSevkIrsaliyeleriListeDto): boolean {
  return evrak.seri?.startsWith('SFDS') ?? false;
}
  // Satır seçme
  selectRow(row: DepolaraSevkIrsaliyeleriListeDto): void {
    this.selectedRow = this.selectedRow === row ? null : row;
  }

  // Durum class'larını belirleyen fonksiyon
  // Durum class'larını belirleyen fonksiyon
  getStatusClass(evrak: DepolaraSevkIrsaliyeleriListeDto): string {
      if (evrak.durumu === '1') {
        return "bg-warning bg-opacity-10 text-warning";
      } else if (evrak.durumu === '2') {
        return 'bg-info bg-opacity-10 text-info';
      } else if (evrak.durumu === '3') {
        return 'bg-primary bg-opacity-10 text-primary';
      }
        else if (evrak.durumu === '4') {
          return 'bg-success bg-opacity-10 text-success';
        }
      return 'bg-secondary bg-opacity-10 text-secondary';
  }

  // Durum icon'larını belirleyen fonksiyon
  getStatusIcon(evrak: DepolaraSevkIrsaliyeleriListeDto): string {

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
  getStatusText(evrak: DepolaraSevkIrsaliyeleriListeDto): string {
 
      if (evrak.durumu === '1') {
        return 'Sipariş Hazır';
      }
      else if (evrak.durumu === '2') {
        return 'Sevk Hazır / İrsaliye Bekleniyor';
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