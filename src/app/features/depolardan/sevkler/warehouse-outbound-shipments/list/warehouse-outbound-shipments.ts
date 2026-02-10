
import { Component, computed, effect, signal, ViewChild } from '@angular/core';
;
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
;
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SharedImports } from '../../../../../core/pipes/shared-imports';
import { User } from '../../../../../models/user';
import { MeService } from '../../../../../services/meservice.service';
import { ShipmentNotesService } from '../../../../../services/shipments/shipment-notes.service';
import { WarehouseSend } from '../create/warehouse-send';
import { WarehouseOutboundShipmentsDetailComponent } from '../detail/detail';
import { ConvertToEWaybillComponent } from '../convert-to-ewaybill-component/convert-to-ewaybill-component';
import { EvrakListResponse } from '../../../../../models/evrakListModel';
import { DetayResponse } from '../../../../../models/detay';



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
  selectedRow: any = null;
  
  // Tablo kolonları güncellendi
  displayedColumns = ['evrakNo', 'tarih', 'transfer', 'durum', 'islemler'];
  DataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;




// Computed signal ekle
paginatedCardData = computed(() => {
  const filtered = this.DataSource.filteredData;
  const start = this.pageIndex() * this.pageSize();
  const end = start + this.pageSize();
  return filtered.slice(start, end);
});



private lastKey = '';

constructor(
  private meservice: MeService, 
  private shipmentNotesService: ShipmentNotesService,
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
    // ngAfterViewInit() içine ekle:
this.paginator.page.subscribe((event) => {
  this.pageIndex.set(event.pageIndex);
  this.pageSize.set(event.pageSize);
});
  }

  loadData(): void {
    this.DataSource.data = [];

    this.yukleniyor.set(true);
    this.shipmentNotesService.getBranchShipments(this.gorevid(), "bugun").subscribe({
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
      const zamanlama: string = `aralik-${baslangic}-${bitis}`;
    this.DataSource.data = [];

   
      this.yukleniyor.set(true);
      this.shipmentNotesService.getBranchShipments(this.gorevid(), zamanlama).subscribe({
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
  irsaliyeCevir(evrak: any): void {
    this.yukleniyor.set(true);
    this.shipmentNotesService.detailsBranchShipment(this.gorevid(), evrak.seri, evrak.sira).subscribe({
      next: (data: any) => {
        this.yukleniyor.set(false);
        const isMobile = this.breakpointObserver.isMatched(Breakpoints.Handset);  
        this.dialog.open(ConvertToEWaybillComponent, {
          width: isMobile ? '100vw' : '50vw',
          height: isMobile ? '100vh' : '70vh',
          maxWidth: '100vw',
          disableClose: true,
          panelClass: isMobile ? 'full-screen-dialog' : '',
          data: data
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
      next: (data: DetayResponse) => {
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

  // EVRAK ÇEVİR
  return(evrak: any) {
    this.yukleniyor.set(true);
    this.shipmentNotesService.detailsBranchShipment(this.gorevid(), evrak.seri, evrak.sira).subscribe({
      next: (data: DetayResponse) => {
        this.yukleniyor.set(false);
        this.dialog.open(WarehouseSend, {
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