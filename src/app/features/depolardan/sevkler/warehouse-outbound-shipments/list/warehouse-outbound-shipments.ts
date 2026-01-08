
import { Component, effect, signal, ViewChild } from '@angular/core';
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
import { WarehouseSend } from '../warehouse-send/warehouse-send';
import { Detail } from '../detail/detail';



@Component({
  selector: 'app-warehouse-outbound-shipments',
  standalone: true,
  imports: [...SharedImports],
  templateUrl: './warehouse-outbound-shipments.html',
  styleUrl: './warehouse-outbound-shipments.css',
  providers: [DatePipe] 
})
export class WarehouseOutboundShipments {

  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });

  user = signal<User | null>(null);
  yukleniyor = signal(false);
  gorevid = signal(0);
  gorevadi = signal('');
  altmenuid = signal(0);

  anaekran:string=""
  yanekran:string=""
  
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
  private meservice: MeService, 
  private shipmentNotesService: ShipmentNotesService,
  private dialog: MatDialog,
  private datePipe: DatePipe,
  private toastr: ToastrService,
  private route: ActivatedRoute,
  private breakpointObserver: BreakpointObserver
) {

  /*
   * EFFECT #1→ UI SYNC
   * User signal'ını component state'e bağlar
   */
  effect(() => {
    const user = this.meservice.userSignal();
    console.log(user)
    this.user.set(user);
    console.log(Number(this.user()?.depoNo))

  });

  /*
   * EFFECT #2→ BUSINESS (loadData)
   * Menü + Alt Menü + Görev hazırsa veri yükler
   */
  effect(() => {
    const menu = this.meservice.selectedMenu();
    const altmenu = this.meservice.selectedAltMenu();
    const gorev = this.meservice.selectedGorev();

    // Eksik state varsa DUR
    if (!menu || !altmenu || !gorev) {
      this.lastKey = '';
      return;
    }

    const key = `${menu}-${altmenu.id}-${gorev.kimlik}`;
    this.anaekran=key
    this.yanekran=`${altmenu.isim} -*- ${gorev.isim}`

    // Aynı kombinasyonda tekrar yükleme
    if (key === this.lastKey) return;
    this.lastKey = key;

    this.altmenuid.set(altmenu.id);
    this.gorevid.set(gorev.kimlik);

    console.log('loadData tetiklendi:', key);
    this.loadData();
  });
}


  ngOnInit() {

  }

  ngAfterViewInit() {
    this.DataSource.sort = this.sort;
    this.DataSource.paginator = this.paginator;
  }

  loadData(): void {
    this.DataSource.data = [];

    this.yukleniyor.set(true);
    this.shipmentNotesService.getBranchShipments(this.altmenuid(), "bugun").subscribe({
      next: (data: any) => {
        this.DataSource.data = data.sevkler;
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
      this.shipmentNotesService.getBranchShipments(this.altmenuid(), zamanlama).subscribe({
        next: (data: any) => {
          this.DataSource.data = data.sevkler;
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
    this.toastr.show('Task detayı yükleniyor...', '', { tapToDismiss: false, extendedTimeOut: 1000, progressBar: true});
    this.shipmentNotesService.detailsBranchShipment(this.gorevid(), seri, sira).subscribe({
      next: (data: any) => {
        this.dialog.open(Detail, {
          width: "50%",
          height: "70%",
          data: data.sevk
        });
        console.log('Task Detay:', data);
      },
      error: () => {
        this.toastr.error('Task detayı alınırken hata oluştu', 'Hata');
      }
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
    this.shipmentNotesService.detailsBranchShipment(this.gorevid(), evrak.evrakNoSeri, evrak.evrakNoSira).subscribe({
      next: (data: any) => {
        this.dialog.open(WarehouseSend, {
          width: '50vw',
          height: '70vh',
          data: data
        });
      },
      error: () => {
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