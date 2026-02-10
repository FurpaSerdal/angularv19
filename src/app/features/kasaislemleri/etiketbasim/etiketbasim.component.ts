import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { FiyatetiketComponent } from './a4-fiyat-etiketi/fiyatetiket.component';
import { NgxPrintModule } from 'ngx-print';
import { etiket } from '../../../models/etiket';
import { RafetiketiComponent } from "./raf-etiketi/rafetiketi.component";
import { A5IkiliFiyatEtiketiComponent } from './a5-ikili-fiyat-etiketi/a5-ikili-fiyat-etiketi.component';
import { RafEtiketA5Component } from './raf-etiket-a5/raf-etiket-a5.component';
import { A5IkiliAyinEtiketiComponent } from './a5-ikili-ayin-etiketi/a5-ikili-ayin-etiketi.component';
import { EtiketService } from '../../../services/etiket.service';
import { LabelDocuments } from '../../../models/lastDocuments';
import { MatDialog } from '@angular/material/dialog';
import { AddLabel } from './add-label/add-label';
import { PrintChangePrice } from './print-change-price/print-change-price';

@Component({
  selector: 'app-etiketbasim',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    FiyatetiketComponent,
    NgxPrintModule,
    RafetiketiComponent,
    A5IkiliFiyatEtiketiComponent,
    RafEtiketA5Component,
    A5IkiliAyinEtiketiComponent,
    PrintChangePrice
  ],
  templateUrl: './etiketbasim.component.html',
  styleUrls: ['./etiketbasim.component.css']
})
export class EtiketbasimComponent implements OnInit, OnDestroy {  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private destroy$ = new Subject<void>();
  // Formlar
  etiketTipiFormu!: FormGroup;
  tarihSaatFiltreFormu!: FormGroup;
  etiketEvragiFormu!: FormGroup;
  etiketEvragiAramaFormu!: FormGroup;
  

  // Tarih ve Etiket Tipleri
  today: string = this.getFormattedDateTime();

  private getFormattedDateTime(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  getFormattedDateTimeForDisplay(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  }

  selectedEtiket: etiket | undefined;

  // Evrak Listesi
  LastDocumentsList :LabelDocuments[] = [];

  // Tablo Kolonları
  columnsToDisplay = [
    'productCode',
    'barCode',
    'productName',
    'oldPrice',
    'newPrice',
    'differencePrice',
    'changeDate',
    'actions'
  ];

  dataSource = new MatTableDataSource<any>([]);



  constructor(
    private fb: FormBuilder,
    private etiketservice: EtiketService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
 this.getlastDocuments();
    
    // Formları Başlat
    this.etiketTipiFormu = this.fb.group({
      labelType: [],
    });

    this.tarihSaatFiltreFormu = this.fb.group({
        filtre: [
        this.today,
        [
          Validators.required,
          Validators.pattern(
            /(3[01]|[12][0-9]|0[1-9]).(1[0-2]|0[1-9]).[0-9]{4} (2[0-3]|[01]?[0-9]\d):([0-5]?[0-9]\d):([0-5]?[0-9]\d)/
          )
        ]
      ]
    });

    this.etiketEvragiFormu = this.fb.group({
      labelDocumentNo: [null],
    });

    this.etiketEvragiAramaFormu = this.fb.group({
      labelDocumentNoSearch: [null],
    });

    // Etiket tipi değişikliklerini dinle
    this.etiketTipiFormu.get('labelType')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.selectedEtiket = this.etiketTip().find((tip: etiket) => tip.etiketTipi === value);
      });
  }

  ngAfterViewInit(): void {
    // Paginator ve Sort'u bağla
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getlastDocuments() {
    this.etiketservice.getLastDocuments().pipe(takeUntil(this.destroy$)).subscribe((documents) => {
      this.LastDocumentsList = documents;
    });
  }

  // Satır Ekleme
  openAddLineModal(): void {

    this.dialog.open(AddLabel, {
      width: '800px',
      height: '300px',
      disableClose: true

    }).afterClosed().subscribe(result => {
      if (result) {
        // Modal'dan dönen ürün bilgisi ile tabloya yeni satır ekleyin
        const currentData = this.dataSource.data;
        this.dataSource.data = [...currentData, result];
        this.toastr.success('Ürün başarıyla eklendi');
      }
    });
    
  }

  // Satır Silme
  removeLine(productCode: string): void {
    const currentData = this.dataSource.data;
    this.dataSource.data = currentData.filter(item => item.productCode !== productCode);
    this.toastr.success('Ürün listeden kaldırıldı');
  }

  // Listeyi Temizleme
  clearList(): void {
    this.dataSource.data = [];
    this.etiketTipiFormu.reset({ labelType: null });
    this.tarihSaatFiltreFormu.reset({ filtre: this.today });
    this.etiketEvragiFormu.reset();
    this.toastr.info('Liste temizlendi');
  }

  getByPriceChangeDate(): void {
    const selectedDate = this.tarihSaatFiltreFormu.get('filtre')?.value;
    if (!selectedDate) {
      this.toastr.warning('Lütfen bir tarih seçin');
      return;
    }
    // yyyy-MM-ddThh:mm formatını dd.MM.yyyy HH:mm:ss formatına çevir
    const [datePart, timePart] = selectedDate.split('T');
    const [year, month, day] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');
    const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}:00`;
    
    this.etiketservice.getByDateForLabel(formattedDate).pipe(takeUntil(this.destroy$)).subscribe((product) => {
      this.dataSource.data = product;
    });
    
    // TODO: API çağrısı yapılacak
    this.toastr.info(`${formattedDate} tarihinden itibaren veriler getirilecek`);
    // this.etiket.getByPriceChangeDate(selectedDate).pipe(takeUntil(this.destroy$)).subscribe(...);
  }

  // Evrak Numarasına Göre Filtreleme (Dropdown)
  getLabelDocument(): void {
    const docNo = this.etiketEvragiFormu.value.labelDocumentNo;
    if (!docNo) {
      this.toastr.warning('Lütfen bir evrak numarası seçin');
      return;
    }
    this.etiketservice.getDocument(docNo).pipe(takeUntil(this.destroy$)).subscribe((products) => {
      this.dataSource.data = products;

    });    
    
    // TODO: API çağrısı yapılacak
    this.toastr.info(`Evrak No ${docNo} getiriliyor...`);
    // this.etiket.getLabelDocument(docNo).pipe(takeUntil(this.destroy$)).subscribe(...);
  }

  // Evrak Numarası ile Arama (Input)
  searchLabelDocument(): void {
    const searchNo = this.etiketEvragiAramaFormu.value.labelDocumentNoSearch;
    if (!searchNo) {
      this.toastr.warning('Lütfen bir evrak numarası girin');
      return;
    }
      this.etiketservice.getDocument(searchNo).pipe(takeUntil(this.destroy$)).subscribe((products) => {
        this.dataSource.data = products;
      });
    
    // TODO: API çağrısı yapılacak
    this.toastr.info(`Evrak No ${searchNo} aranıyor...`);
    // this.etiket.searchLabelDocument(searchNo).pipe(takeUntil(this.destroy$)).subscribe(...);
  }

  // Yazdırma İşlemi
  yazdir(): void {
    if (!this.selectedEtiket?.etiketTipi) {
      this.toastr.warning('Lütfen bir etiket tipi seçin');
      return;
    }

    if (this.dataSource.data.length === 0) {
      this.toastr.warning('Yazdırılacak ürün bulunmamaktadır');
      return;
    }

    this.toastr.success('Yazdırma işlemi başlatıldı');
  }

  // Etiket Tiplerini Getir
  etiketTip() {
    return this.etiketservice.etiketTip(); 
  }


}

