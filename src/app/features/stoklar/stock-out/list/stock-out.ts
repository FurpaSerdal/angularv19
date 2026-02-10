import { DatePipe } from "@angular/common";
import { SharedImports } from "../../../../core/pipes/shared-imports";
import { Component, effect, signal, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { User } from "../../../../models/user";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MeService } from "../../../../services/meservice.service";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { StockOutService } from "../../../../services/inventory/stock-out.service";
import { DetailStockOut } from "../detail-stock-out/detail-stock-out";
import { NewStockOut } from "../new-stock-out/new-stock-out";


@Component({
  selector: 'app-stock-out',
  imports: [...SharedImports],
  templateUrl: './stock-out.html',
  styleUrls: ['./stock-out.css'],
    providers: [DatePipe]

})

export class StockOut {

  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });

  user = signal<User | null>(null);
  yukleniyor = signal(false);
  gorevid = signal(0);
  iadegorevid = signal(0);
  gorevadi = signal('');
  altmenuid = signal(0);

  anaekran:string=""
  yanekran:string=""
  
  // Yeni değişkenler
  currentView: 'table' | 'card' = 'table';
  selectedRow: any = null;
  
  // Tablo kolonları güncellendi
  displayedColumns = ['seri', 'sayan', 'tarih'];
  DataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // --- SADECE EFFECT MİMARİSİ (3 EFFECT) ---
// Bu bölümü OrtakMenu constructor içine birebir koyabilirsin

private lastKey = '';

constructor(
  private meservice: MeService, 
  private stockOutService: StockOutService,
  private dialog: MatDialog,
  private datePipe: DatePipe,
  private toastr: ToastrService,
  private breakpointObserver: BreakpointObserver
) {

  /*
   * EFFECT #1→ UI SYNC
   * User signal'ını component state'e bağlar
   */
  effect(() => {
    const user = this.meservice.userSignal();
    this.user.set(user);

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

    const key = `${menu}-${altmenu.id}-${gorev.id}`;
    this.anaekran=key
    this.yanekran=`${altmenu.isim} -*- ${gorev.isim}`

    // Aynı kombinasyonda tekrar yükleme
    if (key === this.lastKey) return;
    this.lastKey = key;

    this.altmenuid.set(altmenu.id);
    this.gorevid.set(gorev.id);
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
    this.stockOutService.getReceipts(this.gorevid(), "bugun").subscribe({
      next: (data: any) => {
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

    if (baslangic && bitis) {
      this.yukleniyor.set(true);
      this.stockOutService.getReceipts(this.gorevid(), zamanlama).subscribe({
        next: (data: any) => {
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
  }

  taskDetay(seri: string, sira: number): void {
    this.yukleniyor.set(true);
    this.stockOutService.detailsReceipt(this.gorevid(), seri, sira).subscribe({
      next: (data: any) => {
        this.yukleniyor.set(false);
        this.dialog.open(DetailStockOut, {
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

    this.dialog.open(NewStockOut, {
      width: isMobile ? '100vw' : '40vw',
      height: isMobile ? '100vh' : '70vh',
      maxWidth: '100vw',
      disableClose: true,
      panelClass: isMobile ? 'full-screen-dialog' : '',
      data: { id: this.gorevid() , depono  : this.user()?.subeNo }    });
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


  // Görünüm değiştirme
  setView(view: 'table' | 'card'): void {
    this.currentView = view;
  }





}
 