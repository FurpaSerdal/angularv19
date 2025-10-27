import { Component, ViewChild, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';

import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GenelİslemService } from '../../../services/geneli̇slem.service';
import { UserService } from '../../../services/data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-firma-fatura',
  standalone: true,
  templateUrl: './firma-fatura.component.html',
  styleUrls: ['./firma-fatura.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule 
  ],
  providers: [DatePipe]
})
export class FirmaFaturaComponent {
  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });
selection = new SelectionModel<any>(true, []); // true => çoklu seçim

  yukleniyor = signal(false);
  gorevid = signal(0);
  gorevadi = signal('');

  displayedColumns = ['select','seri', 'sira', 'belgeNo', 'tarih', 'kaynak', 'hedef', 'durum', 'islemler'];
  DataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private genelservice: GenelİslemService,
    private meservice: UserService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private breakpointObserver: BreakpointObserver
  ) {}
  
 ngOnInit() {
  // 1. Seçili görev ID'sini servisten dinleyip local değişkene set ediyoruz
  this.meservice.SeçiliGörevid$.subscribe(data =>
    this.gorevid.set(data)
  );

  // 2. Seçili görev adını servisten dinleyip local değişkene set ediyoruz
  this.meservice.selectedGörevadi$.subscribe(data =>
    this.gorevadi.set(data)
  );

  // 3. Sayfa yüklendiğinde veri çekme işlemi
//  this.loadData();
}

  ngAfterViewInit() {
    this.DataSource.sort = this.sort;
    this.DataSource.paginator = this.paginator;
  }

  loadData(): void {
    this.yukleniyor.set(true);
    this.genelservice.listele(this.gorevid(), 'bugun').subscribe({
      next: (data: any[]) => {
        this.DataSource.data = data;
        this.yukleniyor.set(false);
      },
      error: () => {
        this.toastr.error('Veri yüklenirken hata oluştu', 'Hata');
        this.yukleniyor.set(false);
      }
    });
  }

  onDateChanged(): void {
    const baslangic = this.datePipe.transform(this.dateRange.get('start')?.value, 'yyyy-MM-dd');
    const bitis = this.datePipe.transform(this.dateRange.get('end')?.value, 'yyyy-MM-dd');

    if (baslangic && bitis) {
      this.yukleniyor.set(true);
      this.genelservice.bekleyeEbelgeListele(this.gorevid(), `aralik-${baslangic}-${bitis}`,true).subscribe({
        next: (data: any) => {
          this.DataSource.data = data.evrakListesi;
          this.yukleniyor.set(false);
        },
        error: () => {
          this.toastr.error('Filtreleme sırasında hata oluştu', 'Hata');
          this.yukleniyor.set(false);
        }
      });
    }
  }

  // evrakdetay(sth_Guid: string): void {
  //   this.dialog.open(EvrakdetayComponent, {
  //     width: '40vw',
  //     height: '80vh',
  //     data: { gorevadi: this.gorevadi(), sth_Guid }
  //   });
  // }

  // yeniEvrak(): void {
  //   const isMobile = this.breakpointObserver.isMatched(Breakpoints.Handset);

  //   this.dialog.open(YeniEvrakEkleComponent, {
  //     width: isMobile ? '100vw' : '40vw',
  //     height: isMobile ? '100vh' : '70vh',
  //     maxWidth: '100vw',
  //     panelClass: isMobile ? 'full-screen-dialog' : '',
  //     data: [this.gorevid()],
  //   });
  // }

  // pdfindir(id: string) {
  //   this.genelservice.PDFİndir(id, this.gorevadi()).subscribe({
  //     next: (pdfUrl) => {
  //       this.dialog.open(PdfComponent, {
  //         width: '50vw',
  //         height: '80vh',
  //         data: { url: pdfUrl }
  //       });
  //     },
  //     error: () => {
  //       this.toastr.error('PDF indirilirken hata oluştu', 'Hata');
  //     }
  //   });
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.DataSource.filterPredicate = (data: any, filter: string) => {
      return Object.keys(data).some(key => {
        const value = data[key as keyof any];
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


  /** Tablodaki tüm satırlar seçili mi kontrolü */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.DataSource.data.length;
  return numSelected === numRows;
}

/** Tüm satırları seçme / temizleme */
masterToggle() {
  this.isAllSelected()
    ? this.selection.clear()
    : this.DataSource.data.forEach(row => this.selection.select(row));
}

/** Tek satır seçimini toggle et */
toggleRow(row: any) {
  this.selection.toggle(row);
}

/** Seçilen fatura ID’lerini görmek için */
getSelectedInvoices() {
  const selected = this.selection.selected;
  const evraklar: TopluCevirRequestDto = {
    evrakIdleri: selected.map(item => item.id)
  };

  console.log('Gönderilen JSON:', evraklar);

  this.genelservice.topluEvrakCevir(this.gorevid(), evraklar).subscribe({
    next: () => {
      this.toastr.success('Faturalar görevler arası başarıyla çevrildi', 'Başarılı');
    },
    error: () => {
      this.toastr.error('Faturalar görevler arası çevrilemedi', 'Hata');
    }
  });

  this.toastr.info(`${selected.length} fatura seçildi`);
}


}
export interface TopluCevirRequestDto {
  evrakIdleri: string[];
}
