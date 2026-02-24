import { CommonModule } from '@angular/common';
import { Component, computed, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

import { RefundConfirmDialogComponent } from '../../../../../modal/refund-confirm-dialog/refund-confirm-dialog';
import { StokAraCT } from '../../../../../models/ortakModeller';
import { MeService } from '../../../../../services/meservice.service';
import { GoodsReceiptNotesService } from '../../../../../services/receipts/goods-receipt-notes.service';
import { ShipmentNotesService } from '../../../../../services/shipments/shipment-notes.service';
import { WarehouseService } from '../../../../../services/warehouse.service';

import { DepolardanMalKabulIrsaliyeleriAyrintiDto, KalemDto } from '../../../../../models/ayrinti-dtolari.model';
import { DepolaraSevkIrsaliyeleriEkleDto, DepolardanMalKabulIrsaliyeleriEkleDto } from '../../../../../models/ekle-dtolari.model';


@Component({
  selector: 'app-warehouse-goods-receipt',
  imports: [CommonModule, MatTableModule, FormsModule, MatIconModule, MatProgressSpinner],
  templateUrl: './warehouse-goods-receipt.html',
  styleUrl: './warehouse-goods-receipt.css',
})
export class WarehouseGoodsReceipt {
  seriNoGirdisi = signal<string>('');
  siraNoGirdisi = signal<number>(0);
  urunAramaTerimi = signal<string>('');
  evrakdetay = signal<DepolardanMalKabulIrsaliyeleriAyrintiDto | null>(null);
  muhatapDepoNo = signal<number>(0);
  barkodGirdisi = signal<string>('');
  
  aramaGirdisi = signal<string>('');
  gonderiliyor = signal<boolean>(false);

  // Computed state from MeService
  readonly gorevid = computed(() => 
    this.meservice.selectedGorev()?.id ?? 0
  );
  
  // iadegorevid override edilebilir (data'dan gelebilir)
  readonly iadegorevid = computed(() => 
 this.meservice.selectedGorev()?.iadeGorevi?.id ?? 0
  );

  postorder: DepolardanMalKabulIrsaliyeleriEkleDto = {
    kalemler: [],
    seri: '',
    sira: 0,
    teslimAlanAdSoyad: '',

  };
  urunListesi = signal<any[]>([]);
  bulunanUrunler = signal<StokAraCT[]>([]);
  secilenUrun = signal<StokAraCT | null>(null);
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['UrunAdi', 'UrunKodu', 'MalKabulMiktari', 'aksiyon'];

  constructor(
    private meservice: MeService,
    private goodsReceiptNotesService: GoodsReceiptNotesService,
    private shipmentnoteservice: ShipmentNotesService,
    private dialog: MatDialog,
    private warehouseservice: WarehouseService,
    public dialogRef: MatDialogRef<WarehouseGoodsReceipt>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {

    if (this.data && this.data.detay) {
      this.evrakdetay.set(this.data.detay);
      this.muhatapDepoNo.set(this.evrakdetay()?.muhatapDepoNo ?? 0);
      
      
      this.tabloMapForReturn(this.evrakdetay());
    }
  }

  tabloMapForReturn(data: DepolardanMalKabulIrsaliyeleriAyrintiDto | null) {
    const veri = data?.kalemler?.map((urun: KalemDto) => {
      const sevkMiktari = urun.sevkMiktari ?? 0;
      const malKabulMiktari = urun.malKabulMiktari ?? 0;

      return {
        UrunAdi: urun.stokIsmi,
        UrunKodu: urun.stokKodu,
        verilenSiparisMiktari: urun.siparisMiktari ?? 0,
        sevkmiktari: sevkMiktari,
        MalKabulMiktari: malKabulMiktari,
        sipId: urun.siparisGuid,
        sevkId: urun.sevkGuid,
        fark: malKabulMiktari - sevkMiktari
      };
    }) ?? [];
    
    this.urunListesi.set(veri);
    this.dataSource.data = veri;
  }

  barkodOku(barkod: string) {
    this.goodsReceiptNotesService.findshipmentnote(this.gorevid(), barkod, undefined)
      .subscribe({
        next: value => {
          this.evrakdetay.set(value);
          this.tabloMapForReturn(value);
          this.barkodGirdisi.set('');
        },
        error: err => {
          this.toastr.error('Barkod ile sevk bulunamadı', 'Hata');
          console.error('BarkodOku hatası:', err);
        }
      });
  }
  seriNoIleAra() {
    const seriNo = this.seriNoGirdisi();
    const siraNo = this.siraNoGirdisi();
    this.gonderiliyor.set(true);
    
    this.goodsReceiptNotesService.detailsBranchReceipt(this.gorevid(), seriNo, siraNo)
      .subscribe({
        next: value => {
          this.evrakdetay.set(value);
          this.tabloMapForReturn(value);
          this.seriNoGirdisi.set('');
          this.siraNoGirdisi.set(0);
          this.gonderiliyor.set(false);
        },
        error: err => {
          this.toastr.error('Seri No ve Sıra No ile sevk bulunamadı', 'Hata');
          console.error('SeriNoİleAra hatası:', err);
          this.gonderiliyor.set(false);
        }
      });
  }

  urunAra(aranacak: string) {
    if (!aranacak || aranacak.trim() === '') {
      this.bulunanUrunler.set([]);
      return;
    }
    if (!this.evrakdetay()) {
      this.toastr.warning('Önce evrak detayı yüklenmeli', 'Uyarı');
      
      return;
    }
    
    const aranacakKelime = aranacak.toLocaleLowerCase();

    this.warehouseservice.searchStock(aranacakKelime)
      .subscribe({
        next: res => {
          const isMobile = window.innerWidth <= 768;
          if (isMobile) {
            this.urunSec(res[0]);
          } else {
            this.bulunanUrunler.set(res);
          }
        },
        error: err => console.error('StokAra hatası:', err)
      });
  }


  urunSec(urun: StokAraCT) {
    this.secilenUrun.set(urun);
    this.urunEkle();
    this.bulunanUrunler.set([]);
  }

 urunEkle() {

  const secilenUrun = this.secilenUrun();
  if (!secilenUrun) return;

  const evrak = this.evrakdetay();
  if (!evrak) return;

  const isEvraktaVar = evrak.kalemler
    ?.some(u => u.stokKodu === secilenUrun.stokKod);

  if (!isEvraktaVar) {
    this.toastr.warning('Bu ürün sevk irsaliyesinde yok', 'Uyarı');
    return;
  }

  const eklenecekUrun = {
    UrunAdi: secilenUrun.stokIsim,
    UrunKodu: secilenUrun.stokKod,
    barkodu: secilenUrun.barKodu,
    fiyat: secilenUrun.fiyati,
    sevkMiktari: evrak.kalemler?.find(u => u.stokKodu === secilenUrun.stokKod)?.sevkMiktari ?? 0,
    birimkatsayisi: secilenUrun.birimKatsayisi,
    sto_birim_ad: secilenUrun.birimAd,
    MalKabulMiktari: secilenUrun.birimKatsayisi || 1,
  };

  const existingIndex = this.urunListesi()
    .findIndex(u => u.UrunKodu === eklenecekUrun.UrunKodu);

  if (existingIndex !== -1) {

    const updatedList = this.urunListesi().map((item, index) =>
      index === existingIndex
        ? {
            ...item,
            MalKabulMiktari:
              (item.MalKabulMiktari ?? 0) +
              (secilenUrun.birimKatsayisi || 1)
          }
        : item
    );

    this.urunListesi.set(updatedList);
    this.onMalKabulChange(updatedList[existingIndex]);

  } else {
    this.urunListesi.set([
      ...this.urunListesi(),
      eklenecekUrun
    ]);
  }

  this.dataSource.data = this.urunListesi();
}

  urunSil(index: number) {
    const newList = [...this.urunListesi()];
    newList.splice(index, 1);
    this.urunListesi.set(newList);
    this.dataSource.data = this.urunListesi();
  }

kaydet() {

  // 🔒 Double submit engelleme
  if (this.gonderiliyor()) return;

  this.gonderiliyor.set(true);

  // 📌 Evrak kontrolü
  const evrak = this.evrakdetay();
  if (!evrak) {
    this.toastr.error('Evrak bulunamadı');
    this.gonderiliyor.set(false);
    return;
  }

  // 📦 Kalem DTO oluşturma
  const kalemler: KalemDto[] = this.urunListesi().map(urun => ({
    siparisGuid: urun.sipId,
    malKabulMiktari: urun.MalKabulMiktari ?? 0, // 0 olabilir
    sevkMiktari: urun.sevkmiktari,
    sevkMalKabulFarkMiktari: urun.fark,
    stokKodu: urun.UrunKodu,
    aciklama: urun.aciklama || '',
    siparisMiktari: urun.verilenSiparisMiktari || null,
    sevkGuid: urun.sevkId || null,
  }));

  // 🚨 Negatif miktar kontrolü (0 serbest)
  const negatifVarMi = kalemler.some(
    k => (k.malKabulMiktari ?? 0) < 0
  );

  if (negatifVarMi) {
    this.toastr.warning('Mal kabul miktarı negatif olamaz', 'Uyarı');
    this.gonderiliyor.set(false);
    return;
  }

  // 🔍 İrsaliyede olmayan stok kontrolü (performanslı Set kullanımı)
  const irsaliyeStokSet = new Set(
    evrak.kalemler?.map(k => k.stokKodu?.toLowerCase())
  );

  const stokKoduFarklari = kalemler.filter(
    k => !irsaliyeStokSet.has(k.stokKodu?.toLowerCase())
  );

  if (stokKoduFarklari.length > 0) {
    this.toastr.warning(
      `İrsaliyede bulunmayan stoklar: ${
        stokKoduFarklari.map(k => k.stokKodu).join(', ')
      }`,
      'Uyarı'
    );
    this.gonderiliyor.set(false);
    return;
  }

  // ⚖ Sevk miktarını aşma kontrolü
  for (const kalem of kalemler) {

    const sevkKalemi = evrak.kalemler
      ?.find(k => k.stokKodu === kalem.stokKodu);

    if (!sevkKalemi) continue;

    if ((kalem.malKabulMiktari ?? 0) > (sevkKalemi.sevkMiktari ?? 0)) {
      this.toastr.error(
        `${kalem.stokKodu} için kabul miktarı sevk miktarını aşamaz`
      );
      this.gonderiliyor.set(false);
      return;
    }
  }

  // 📊 Fark analizleri
  const malkabulFarkiPozitifler = kalemler.filter(
    k => (k.sevkMalKabulFarkMiktari ?? 0) > 0
  );

  const malkabulFarkiNegatifler = kalemler.filter(
    k => (k.sevkMalKabulFarkMiktari ?? 0) < 0
  );

  // 🧾 Post edilecek evrak objesi
  const postData = {
    ...this.postorder,
    seri: evrak.seri ?? '',
    sira: evrak.sira ?? 0,
    teslimAlanAdSoyad: this.postorder.teslimAlanAdSoyad || '',
    kalemler
  };

  // ⏳ Loading toast
  const toastRef = this.toastr.show('Gönderiliyor...', '', {
    disableTimeOut: true,
    progressBar: true,
    tapToDismiss: false,
    closeButton: false,
  });

  // 🚀 API çağrısı
  this.goodsReceiptNotesService
    .createBranchReceipt(this.gorevid(), postData)
    .subscribe({

      next: () => {

        this.toastr.clear(toastRef.toastId);
        this.toastr.success('Mal kabul başarıyla kaydedildi', 'Başarılı');
        this.gonderiliyor.set(false);

        // 🔄 Fark senaryosu akışı
        const proceedWithPositives = () => {
          if (malkabulFarkiPozitifler.length > 0) {
            this.handlePositiveDifferences(malkabulFarkiPozitifler);
          } else {
            this.kapat();
          }
        };

        if (malkabulFarkiNegatifler.length > 0) {
          this.handleNegativeDifferences(
            malkabulFarkiNegatifler,
            proceedWithPositives
          );
        } else {
          proceedWithPositives();
        }
      },

      error: err => {

        this.toastr.clear(toastRef.toastId);

        this.toastr.error(
          err?.error?.message || 'Mal kabul kaydedilirken hata oluştu',
          'Hata'
        );

        console.error(err);
        this.gonderiliyor.set(false);
      }
    });
}


  // duzeltme iade sevki
  private handleNegativeDifferences(
    malkabulFarkiNegatifler: KalemDto[],
    onComplete: () => void
  ) {
    this.toastr.info(
      'Mal kabul miktarı sevk miktarından az olan kalemler düzeltme gerekiyor',
      'Bilgi'
    );

    this.dialog
      .open(RefundConfirmDialogComponent, {
        width: '50vw',
        height: '70vh',
        data: {
          kalemler: malkabulFarkiNegatifler.map(k => ({ ...k }))
        }
      })
      .afterClosed()
      .subscribe(confirm => {
        if (confirm !== true) {
          onComplete();
          return;
        }

        const Kalemler: KalemDto[] = malkabulFarkiNegatifler.map(k => ({
          aciklama: k.aciklama,
          sevkMalKabulFarkMiktari: Math.abs(k.sevkMalKabulFarkMiktari ?? 0),
          siparisGuid: null,
          sevkMiktari: Math.abs(k.sevkMalKabulFarkMiktari ?? 0),
          stokKodu: k.stokKodu,
          iadeyeKonuIrsaliyeGuidi: k.sevkGuid,
          duzeltmedir: true,
        }));

        const newData: DepolaraSevkIrsaliyeleriEkleDto = {
          muhatapDepoNo: this.muhatapDepoNo(),
          sevkedenAdSoyad: "",
          iadedir:true,
          kalemler: Kalemler
        };

        this.shipmentnoteservice
          .createBranchShipment(this.iadegorevid(), newData)
          .subscribe({
            next: () => {
              this.toastr.success(
                'Noksan mal iade siparişi başarıyla oluşturuldu',
                'Başarılı'
              );
              onComplete();
            },
            error: err => {
              this.toastr.error(
                'Noksan mal iade siparişi oluşturulurken hata oluştu',
                'Hata'
              );
              console.error(err);
              onComplete();
            }
          });
      });
  }

  private handlePositiveDifferences(malkabulFarkiPozitifler: KalemDto[]) {
    this.toastr.info(
      'Mal kabul miktarı sevk miktarından fazla olan kalemler için işlem seçiniz',
      'Bilgi'
    );

      this.handleCorrectionDecision(malkabulFarkiPozitifler);


    // this.dialog
    //   .open(ExcessConfirmDialogComponent, { width: '450px' })
    //   .afterClosed()
    //   .subscribe((decision: 'return' | 'correction' | null) => {

    //     // iade sevkiyatı oluştur
    //     if (decision === 'return') {
    //       this.createReturnShipment(malkabulFarkiPozitifler);
    //       return;
    //     }
    //      // düzeltme işlemi yap 
    //     if (decision === 'correction') {
    //       this.handleCorrectionDecision(malkabulFarkiPozitifler);
    //       return;
    //     }

    //     this.kapat();
    //   });
  }


  private handleCorrectionDecision(kalemler: KalemDto[]) {

           this.toastr.success(
            'Fazla mal kabul düzeltmesi onaylandı bısey yapmanıza gerek yok',
            'Başarılı'
          );
          this.kapat();
    // const buildpostorder: DepolaraSevkIrsaliyeleriEkleDto = {
    //   muhatapFirma: null,
    //   muhatapSube: {
    //     cariKod: '',
    //     depoNo: this.muhatapDepoNo(),
    //     adres: '',
    //     vergiDairesi: '',
    //     yetkiliAdSoyad: '',
    //     il: '',
    //     ilce: '',
    //     unvan: ''
    //   },
    //   sevkTarihi: new Date(),
    //   nakliyeDeposu: {
    //     depoNo: this.muhatapDepoNo(),
    //     plaka: '',
    //     soforAdSoyad: ''
    //   },
    //   iadedir: true,
    //   kalemler
    // };
    // this.dialog
    //   .open(ConfirmDialogComponent, { width: '400px' })
    //   .afterClosed()
    //   .subscribe(confirmed => {
    //     if (confirmed) {
    //       this.toastr.success(
    //         'Fazla mal kabul düzeltmesi onaylandı bısey yapmanıza gerek yok',
    //         'Başarılı'
    //       );
    //       this.kapat();
    //     } else {
    //       this.shipmentnoteservice
    //         .createBranchShipment(this.iadegorevid(), buildpostorder)
    //         .subscribe({
    //           next: () => {
    //             this.toastr.success(
    //               'Fazla mal iade sevkiyatı başarıyla oluşturuldu',
    //               'Başarılı'
    //             );
    //           },
    //           error: err => {
    //             this.toastr.error(
    //               'Fazla mal iade sevkiyatı oluşturulurken hata oluştu',
    //               'Hata'
    //             );
    //             console.error(err);
    //           },
    //           complete: () => this.kapat()
    //         });
    //     }
    //   });
  }



  onMalKabulChange(element: any) {
    console.log('Mal Kabul Değişti:', element);
    const sevk = element.sevkmiktari ?? 0;
    const kabul = element.MalKabulMiktari ?? 0;
    element.fark = kabul - sevk;
  }

  toplamKabul(): number {
    return this.dataSource.data.reduce((acc, item) => acc + (item.MalKabulMiktari || 0), 0);
  }

  toplamFark(): number {
    return this.dataSource.data.reduce((acc, item) => acc + (item.fark || 0), 0);
  }

  temizle() {
    this.urunListesi.set([]);
    this.dataSource.data = [];
    this.bulunanUrunler.set([]);
    this.postorder = {
      kalemler: [],
      seri: '',
      sira: 0,
      teslimAlanAdSoyad: '',
    };
 
    this.toastr.info('Form temizlendi', '', { timeOut: 2000 });
  }

  kapat() {
    this.dialogRef.close();
  }
}
