import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component,computed,OnDestroy,OnInit,ViewChild } from '@angular/core';
import { FormBuilder,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator,MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort,MatSortModule } from '@angular/material/sort';
import { MatTableDataSource,MatTableModule } from '@angular/material/table';
import { NgxPrintModule } from 'ngx-print';
import { ToastrService } from 'ngx-toastr';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { etiket } from '../../../models/etiket';
import { LabelDocuments } from '../../../models/lastDocuments';
import { EtiketService } from '../../../services/etiket.service';
import { FiyatetiketComponent } from './a4-fiyat-etiketi/fiyatetiket.component';
import { A5IkiliAyinEtiketiComponent } from './a5-ikili-ayin-etiketi/a5-ikili-ayin-etiketi.component';
import { A5IkiliFiyatEtiketiComponent } from './a5-ikili-fiyat-etiketi/a5-ikili-fiyat-etiketi.component';
import { AddLabel } from './add-label/add-label';
import { PrintChangePrice } from './print-change-price/print-change-price';
import { RafEtiketA5Component } from './raf-etiket-a5/raf-etiket-a5.component';
import { RafetiketiComponent } from "./raf-etiketi/rafetiketi.component";
import { MeService } from '../../../services/meservice.service';
import { Product } from '../../../models/eskiAngular';

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
  styleUrls: ['./etiketbasim.component.css'],
    providers: [DatePipe]
  
})
export class EtiketbasimComponent implements OnInit, OnDestroy, AfterViewInit { 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private destroy$ = new Subject<void>();
  private documentLoadCancel$ = new Subject<void>();
  // Formlar
  etiketTipiFormu!: FormGroup;
  tarihSaatFiltreFormu!: FormGroup;
  etiketEvragiFormu!: FormGroup;
  etiketEvragiAramaFormu!: FormGroup;
 
productsHavingPromotions : Product[] = [];
filteredProductsForCrossedOut: Product[] = [];

  
  

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
    private dialog: MatDialog,
    private meService: MeService,
    private datePipe: DatePipe,
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
            /^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d$/
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
        console.log('Seçilen etiket tipi:', value);
        this.selectedEtiket = this.getEtiketTip().find((etk: etiket) => etk.etiketTipi === value);
      });

interval(60000)
  .pipe(takeUntil(this.destroy$))
  .subscribe(() => {
    this.today = this.getFormattedDateTime();

    this.tarihSaatFiltreFormu.patchValue({
      filtre: this.today
    });
  });
  }

  taskid = computed(() => {
    return this.meService.selectedGorev()?.id || 0;
  });
  depoNo = computed(() => {
    return this.meService.getUserSignal()()?.subeNo || 0;
  });

  ngAfterViewInit(): void {
    // Paginator ve Sort'u bağla
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.documentLoadCancel$.next();
    this.documentLoadCancel$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }

  getlastDocuments() {
    this.etiketservice.getLastDocuments(this.taskid(),this.depoNo()).pipe(takeUntil(this.destroy$)).subscribe((documents) => {
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
        console.log('Modaldan dönen ürün:', result); // Modal'dan dönen ürünü konsola yazdırarak kontrol edin
        this.dataSource.data = [...currentData, result];
        console.log('Güncellenmiş veri:', this.dataSource.data);
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

  // Seçilen tarih
  const selected = new Date(selectedDate);

  if (Number.isNaN(selected.getTime())) {
    this.toastr.warning('Geçerli bir tarih seçin');
    return;
  }

  // Şu an
  const now = new Date();

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');

    return `${y}-${m}-${d}-${h}-${min}-${s}`;
  };

  const startDate = formatDate(selected);
  const endDate = formatDate(now);

  const zamanlama = `aralik-${startDate}-${endDate}`;

  this.etiketservice
    .getByDateForLabel(this.taskid(), zamanlama)
    .pipe(takeUntil(this.destroy$))
    .subscribe((product) => {
      this.dataSource.data = product;
    });
}

  private resetDerivedProductLists(): void {
    this.productsHavingPromotions = [];
    this.filteredProductsForCrossedOut = [];
  }

  private loadLabelDocumentProducts(docNo: number): void {
    this.documentLoadCancel$.next();
    this.resetDerivedProductLists();

    this.etiketservice
      .getDocument(this.taskid(), docNo)
      .pipe(takeUntil(this.destroy$), takeUntil(this.documentLoadCancel$))
      .subscribe(products => {
        if (!products || products.length === 0) {
          this.toastr.info('Seçilen evrak numarasına ait ürün bulunamadı');
          this.dataSource.data = [];
          return;
        }

        const productList = [...products];

        productList.forEach(p => {
          if (p.oldPrice > p.price) {
            this.filteredProductsForCrossedOut.push(p);
          }
        });

        productList.forEach(p => {
          this.etiketservice
            .searchPromotionProducts(this.taskid(), p.pluNo)
            .pipe(takeUntil(this.destroy$), takeUntil(this.documentLoadCancel$))
            .subscribe(promoData => {
              if (promoData) {
                p.promotionPrice =
                  promoData.discountAmount === 0
                    ? p.price - (p.price * promoData.discountRate) / 100
                    : p.price - promoData.discountAmount;

                p.expirationDate =
                  this.datePipe.transform(promoData.expirationDate, 'dd-MM-yyyy') ?? '';

                this.productsHavingPromotions.push(p);
              }
            });
        });

        this.dataSource.data = productList;
      });
  }

  // Evrak Numarasına Göre Filtreleme (Dropdown)
  getLabelDocument(): void {
    const docNo = Number(this.etiketEvragiFormu.value.labelDocumentNo);

    if (!docNo || Number.isNaN(docNo)) {
      this.toastr.warning('Lütfen bir evrak numarası seçin');
      return;
    }

    this.toastr.info(`Evrak No ${docNo} getiriliyor...`);
    this.loadLabelDocumentProducts(docNo);
  }

  // Evrak Numarası ile Arama (Input)
  searchLabelDocument(): void {
    const searchNo = Number(this.etiketEvragiAramaFormu.value.labelDocumentNoSearch);

    if (!searchNo || Number.isNaN(searchNo)) {
      this.toastr.warning('Lütfen bir evrak numarası girin');
      return;
    }

    this.loadLabelDocumentProducts(searchNo);
    this.toastr.info(`Evrak No ${searchNo} aranıyor...`);
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
  getEtiketTip() {
    return this.etiketservice.etiketTip(); 
  }

 getPrintCss(): string {
  switch (this.selectedEtiket?.etiketTipi) {
    case 'a4_pricelabel':
      return '/assets/a4-price-label-print.css';
    case 'rack_label':
      return '/assets/rack-label-print.css';
    case 'a5_pricelabel':
      return '/assets/a5-dual-price-print.css';
    case 'rack_label_a4':
      return '/assets/rack-label-a4-print.css';
    case 'a5_pricelabel_advantage':
      return '/assets/a5-advantage-print.css';
    default:
      return '';
  }
}

}


