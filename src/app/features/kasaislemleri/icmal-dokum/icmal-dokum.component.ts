import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, computed, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SummariesCT } from '../../../models/eskiAngular';
import { IcmalDetay } from './icmal-detay/icmal-detay';
import { SummaryService } from '../../../services/summary/summary.service';
import { MeService } from '../../../services/meservice.service';

@Component({
  selector: 'app-icmal-dokum',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  templateUrl: './icmal-dokum.component.html',
  styleUrls: ['./icmal-dokum.component.css'],
  providers: [DatePipe]
})
export class IcmalDokumComponent implements AfterViewInit {
  public kullaniciAdi: string = 'MERKEZ OFİS';
  public maxTarih: Date = new Date();

  public tableSource = new MatTableDataSource<SummariesCT>([]);

  public tabloKolonlari: string[] = [
    'sube',
    'evrakSeri',
    'evrakSiraNo',
    'kasaNo',
    'zRaporNo',
    'kasiyer',
    'duzenleyen',
    'toplam',
    'işlemler',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    const today = new Date();
    this.maxTarih = today;
    this.tarihDegisti({ value: this.foramatDate(today) });
  }

  constructor(private summaryService: SummaryService ,private dialog: MatDialog,private meservice: MeService,private datePipe: DatePipe) {}
  taskİd = computed(() => this.meservice.selectedGorev()?.id ?? 0);

  ngAfterViewInit(): void {
    this.tableSource.paginator = this.paginator;
    this.tableSource.sort = this.sort;
  }

  tarihDegisti(event: any) {
  this.tableSource.data = [];
  this.summaryService.GetSummaries(this.taskİd(), this.foramatDate(event.value)).subscribe({
    next: (veri) => {
      this.tableSource.data = veri;
      if (this.tableSource.paginator) {
        this.tableSource.paginator.firstPage();
      }
    },
    error: (hata) => {
      console.error('İcmal verisi alınırken hata oluştu:', hata);
    }   
  });

  }

  filtreUygula(event: Event) {
    const aramaDegeri = (event.target as HTMLInputElement).value;
    this.tableSource.filter = aramaDegeri.trim().toLowerCase();
    if (this.tableSource.paginator) {
      this.tableSource.paginator.firstPage();
    }
  }


  detayGoster(kayit: SummariesCT) {
    this.dialog.open(IcmalDetay, {
      width: '900px',
      data: kayit,
    });

 
  }

  foramatDate(date: Date): string {
    const parsedDate = new Date(date);
    return this.datePipe.transform(parsedDate, 'yyyy-MM-dd') ?? '';
  }
}
