import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { IcmalDetay } from './icmal-detay/icmal-detay';
import { SummariesCT } from '../../../models/eskiAngular';
import { EskiAngularService } from '../../../services/eskiAngular.service';

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
  ],
  templateUrl: './icmal-dokum.component.html',
  styleUrls: ['./icmal-dokum.component.css'],
})
export class IcmalDokumComponent {
  public kullaniciAdi: string = 'MERKEZ OFİS';
  public maxTarih: Date = new Date();

  public tabloVerisi :SummariesCT[] = [];

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

  ngOnInit() {
    const today = new Date();
    this.maxTarih = today;
    this.tarihDegisti({ value: today });
  }

  constructor(private eskiAngularService: EskiAngularService ,private dialog: MatDialog) {
    
  }

  tarihDegisti(event: any) {
    this.tabloVerisi = [];  
  this.eskiAngularService.GetSummaries(event.value.toISOString()).subscribe({
    next: (veri) => {
      this.tabloVerisi = veri;
    },
    error: (hata) => {
      console.error('İcmal verisi alınırken hata oluştu:', hata);
    }   
  });

  }

  filtreUygula(event: Event) {
    const aramaDegeri = (event.target as HTMLInputElement).value;
    console.log('Arama Yapılıyor:', aramaDegeri);
  }


  detayGoster(kayit: SummariesCT) {
    this.dialog.open(IcmalDetay, {
      width: '900px',
      data: kayit,
    });

 
  }
}
