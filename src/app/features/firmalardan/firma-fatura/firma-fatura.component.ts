// src/app/pages/firma-fatura/firma-fatura.component.ts
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule,DatePipe } from '@angular/common';
import { AfterViewInit,Component,DestroyRef,effect,inject,OnInit,signal,ViewChild } from '@angular/core';
import { FormControl,FormGroup,FormsModule,ReactiveFormsModule,Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog,MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator,MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSort,MatSortModule } from '@angular/material/sort';
import { MatTableDataSource,MatTableModule } from '@angular/material/table';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ToastrService } from 'ngx-toastr';
import { PdfComponent } from '../../../modal/pdf/pdf.component';
import { invoice,TopluCevirRequestDto } from '../../../models/invoice';
import { GenelİslemService } from '../../../services/geneli̇slem.service';
import { MeService } from '../../../services/meservice.service';


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
    MatCheckboxModule,
    MatProgressBarModule
  ],
  providers: [DatePipe]
})
export class FirmaFaturaComponent implements OnInit, AfterViewInit {
  private destroyRef = inject(DestroyRef);
  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null, [Validators.required]),
    end: new FormControl<Date | null>(null, [Validators.required])
  });

  selection = new SelectionModel<any>(true, []);
  gonderildi = signal(false);
  efaturaMi = signal(true);
  yukleniyor = signal(false);
  gorevid = signal(21);
  gorevadi = signal('');
  selectedCount = signal(0);

  displayedColumns = [
    'select',
    'evrakNo',
    'tarih',
    'belgeTarihi',
    'irsaliyeTarihi',
    'irsaliyeNo',
    'eBelgeTuru',
    'evrakTip',
    'belgeNo',
    'musteriAdi',
    'aciklama',
    'tutar',
    'faturaMail',
    'islemler'
  ];

  DataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private genelservice: GenelİslemService,
    private meservice: MeService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private toastr: ToastrService,
  ) {
        effect(() => {
      this.meservice.userSignal();
      const gorevIdFromService = this.meservice.selectedGorev();
      this.gorevid.set(gorevIdFromService?.id ?? 0);
      const gorevAdiFromService = this.meservice.selectedGorev();
      this.gorevadi.set(gorevAdiFromService?.isim ?? '');
    });
   }

  ngOnInit() {

    // CRUD Service testi
//     this.crudservice.taskList(26,  new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 gün önce
//  new Date(), 109).subscribe(data => {
//       console.log('CRUD Service Data:');
//       console.log('CRUD Service Data:', data);
//     });
;
    // Sinyallerle görevid ve görevadi güncelleme

  }

  ngAfterViewInit() {
    this.DataSource.sort = this.sort;
    this.DataSource.paginator = this.paginator;

    this.DataSource.sortingDataAccessor = (item: any, property: string) => {
      switch (property) {
        case 'tarih':
        case 'belgeTarihi':
        case 'irsaliyeTarihi':
          if (!item[property]) return 0;
          const time = new Date(item[property]).getTime();
          return Number.isFinite(time) ? time : 0;

        case 'tutar':
          return typeof item.tutar === 'number' ? item.tutar : Number(String(item.tutar).replace(/\s/g, '')) || 0;

        case 'musteriAdi':
        case 'aciklama':
        case 'faturaMail':
        case 'belgeNo':
        case 'evrakNo':
          return (item[property] ?? '').toString().replace(/\u00A0/g, ' ').trim().toLocaleLowerCase('tr');

        case 'eBelgeTuru':
        case 'evrakTip':
          return Number(item[property]) || 0;

        default:
          return item[property] ?? '';
      }
    };

    this.DataSource.sortData = (data: any[], sort) => {
      const active = sort.active;
      const dir = sort.direction === 'asc' ? 1 : -1;
      if (!active || !sort.direction) return data;

      return [...data].sort((a, b) => {
        const va = this.DataSource.sortingDataAccessor(a, active);
        const vb = this.DataSource.sortingDataAccessor(b, active);

        const aEmpty = va === null || va === undefined || va === '' || va === 0;
        const bEmpty = vb === null || vb === undefined || vb === '' || vb === 0;
        if (aEmpty && !bEmpty) return 1;
        if (!aEmpty && bEmpty) return -1;
        if (aEmpty && bEmpty) return 0;

        if (typeof va === 'number' && typeof vb === 'number') {
          return (va - vb) * dir;
        }

        return String(va).localeCompare(String(vb), 'tr', { numeric: true }) * dir;
      });
    };
  }

  loadInitialData(): void {
    const today = new Date();
    this.dateRange.patchValue({ start: today, end: today });
    this.onDateChanged();
  }

  onDateChanged(): void {
    console.log('Tarih aralığı değişti:', this.dateRange.value);
    this.selection.clear();
    this.selectedCount.set(0);

    const baslangic = this.datePipe.transform(this.dateRange.get('start')?.value, 'yyyy-MM-dd');
    const bitis = this.datePipe.transform(this.dateRange.get('end')?.value, 'yyyy-MM-dd');

    if (baslangic && bitis && this.gorevid() > 0) {
      this.yukleniyor.set(true);
      this.genelservice
        .bekleyeEbelgeListele(this.gorevid(), `aralik-${baslangic}-${bitis}`, this.gonderildi(), this.efaturaMi())
        .subscribe({
          next: (data: any) => {
            this.DataSource.data = data.evrakListesi ?? [];
            this.DataSource.sort = this.sort;
            this.DataSource.paginator = this.paginator;
            this.yukleniyor.set(false);
          },
          error: (error) => {
            console.error('Filtreleme hatası:', error);
            this.toastr.error('Filtreleme sırasında hata oluştu', 'Hata');
            this.yukleniyor.set(false);
          }
        });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.DataSource.filterPredicate = (data: any, filter: string) => {
      if (!data) return false;
      return Object.keys(data).some(key => {
        const value = (data as any)[key];
        if (value == null) return false;
        if (typeof value === 'string') return value.toLowerCase().includes(filter);
        if (typeof value === 'number') return value.toString().includes(filter);
        if (typeof value === 'boolean') return value.toString().includes(filter);
        return false;
      });
    };

    this.DataSource.filter = filterValue;
  }

  applyColumnFilter(event: Event, column: string) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.DataSource.filterPredicate = (data: any, filter: string) => {
      const value = (data as any)[column];
      if (value == null) return false;
      if (typeof value === 'string') return value.toLowerCase().includes(filter);
      if (typeof value === 'number') return value.toString().includes(filter);
      if (typeof value === 'boolean') return value.toString().includes(filter);
      return false;
    };

    this.DataSource.filter = filterValue;
  }

  // 👇 Yeni fonksiyon: görünürdeki veriyi al
getVisibleRows(): any[] {
  let data = this.DataSource._orderData(this.DataSource.filteredData); // sıralı veri
  if (this.DataSource.paginator) {
    const start = this.DataSource.paginator.pageIndex * this.DataSource.paginator.pageSize;
    return data.slice(start, start + this.DataSource.paginator.pageSize);
  }
  return data;
}
  isAllSelected(): boolean {
    const visibleRows = this.getVisibleRows();
    return visibleRows.length > 0 && visibleRows.every(row => this.selection.isSelected(row));
  }

  masterToggle(): void {
    const visibleRows = this.getVisibleRows();
    if (this.isAllSelected()) {
      visibleRows.forEach(row => this.selection.deselect(row));
    } else {
      visibleRows.forEach(row => this.selection.select(row));
    }
    this.selectedCount.set(this.selection.selected.length);
  }

  toggleRow(row: any) {
    this.selection.toggle(row);
    this.selectedCount.set(this.selection.selected.length);
  }


  sorguyuCalistir() {
    this.yukleniyor.set(true);
    this.toastr.info(` sorgu çalısıyor...`);

    this.genelservice.sorguCalistir().subscribe({
      next: (data: any) => {
        const mesaj = `Eklenen belge sayısı: ${data.eklenenBelgeNoSayisi}, İade alış faturası: ${data.iadeyeKonuAlisFaturasiSayisi}`;
        this.toastr.success(`Sorgu başarıyla çalıştırıldı. ${mesaj}`, 'Başarılı');
        this.yukleniyor.set(false);
      },
      error: (error) => {
        console.error('Sorgu hatası:', error);
        this.toastr.error('Sorgu çalıştırılırken hata oluştu', 'Hata');
        this.yukleniyor.set(false);
      }
    });
  }

  PostSelectedInvoices() {
    const selected = this.selection.selected;
    if (selected.length === 0) {
      this.toastr.warning('Lütfen en az bir fatura seçin.', 'Uyarı');
      return;
    }

    const evraklar: TopluCevirRequestDto = { CevirilecekEvraklar: selected };
    this.toastr.info(`${selected.length} fatura işleniyor...`);
    this.yukleniyor.set(true);

    this.genelservice.topluEvrakCevir(this.gorevid(), evraklar).subscribe({
      next: (data: any) => {
        this.toastr.success(
          `Faturalar başarıyla görevler arası çevrildi.\nEklenen belge sayısı: ${data.faturaSayisi || 0}`,
          'Başarılı'
        );
        this.DataSource.data = this.DataSource.data.filter(item => !this.selection.isSelected(item));
        this.selection.clear();
        this.selectedCount.set(0);
        // veri değişti -> sort/paginator koru
        this.DataSource.sort = this.sort;
        this.DataSource.paginator = this.paginator;
        this.yukleniyor.set(false);
      },
      error: (error) => {
        console.error('Toplu evrak çevirme hatası:', error);
        this.toastr.error('Faturalar görevler arası çevrilemedi', error || 'Hata');
        this.yukleniyor.set(false);
      }
    });
  }

  durumDegisti() {
    this.gonderildi.set(!this.gonderildi());
    this.onDateChanged();
  }

  efaturaDurumDegisti() {
    this.efaturaMi.set(!this.efaturaMi());
    this.onDateChanged();
  }

  viewInvoice(evrak: invoice): void {
    if (evrak.belgeNo) {
      this.yukleniyor.set(true);
      this.genelservice.getPdfFromUyumsoft(this.gorevid(), evrak.fatGuid.toLowerCase()).subscribe({
        next: (res) => {
          const dialogRef = this.dialog.open(PdfComponent, {
            width: '70vw',
            height: '80vh',
            data: { url: res }
          });
          this.yukleniyor.set(false);
          dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => URL.revokeObjectURL(res));
        },
        error: (error) => {
          console.error('PDF alma hatası:', error);
          this.toastr.error('Fatura PDF\'i alınırken hata oluştu', 'Hata');
          this.yukleniyor.set(false);
        }
      });
      return;
    }

    else {

      this.yukleniyor.set(true);
      this.genelservice.createPdf(this.gorevid(), evrak).subscribe({
        next: (res: Blob) => {
          const url = URL.createObjectURL(res);
          const dialogRef = this.dialog.open(PdfComponent, {
            width: '70vw',
            height: '80vh',
            data: { url: url }
          });
          this.yukleniyor.set(false);
          dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => URL.revokeObjectURL(url));
        },
        error: (error) => {
          console.error('PDF oluşturma hatası:', error);
          this.toastr.error('Fatura oluşturulurken hata oluştu', 'Hata');
          this.yukleniyor.set(false);
        }
      });
    }
  }
}

