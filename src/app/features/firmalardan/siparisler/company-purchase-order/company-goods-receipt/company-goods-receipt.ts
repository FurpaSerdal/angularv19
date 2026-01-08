import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, Inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { WarehouseService } from '../../../../../services/warehouse.service';
import { depoMalKabulModel } from '../../../../../models/depoMalKabulModel';
import { MeService } from '../../../../../services/meservice.service';
import { Kalem, NoksanFazlaIadesi, StokAraCT } from '../../../../../models/genelModel';

import { ShipmentNotesService } from '../../../../../services/shipments/shipment-notes.service';
import { GoodsReceiptNotesService } from '../../../../../services/receipts/goods-receipt-notes.service';
import { SalesOrdersService } from '../../../../../services/orders/sales-orders.service';
import { RefundConfirmDialogComponent } from '../../../../../modal/refund-confirm-dialog/refund-confirm-dialog';
import { SubeSiparisiAlDto } from '../../../../../models/depoSipAlModel';
import { ExcessConfirmDialogComponent } from '../../../../../modal/ExcessConfirmDialogComponent';
import { ConfirmDialogComponent } from '../../../../../modal/ConfirmDialogComponent';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { FirmaMalKabulModel } from '../../../../../models/firmaMalKabulModel';


@Component({
  selector: 'app-company-goods-receipt',
  imports: [CommonModule, MatTableModule, FormsModule, MatIconModule, MatProgressSpinner],
  templateUrl: './company-goods-receipt.html',
  styleUrl: './company-goods-receipt.css',
})
export class CompanyGoodsReceipt {

  seriNoGirdisi = signal<string>('');
  siraNoGirdisi = signal<number>(0);
  evrakdetay = signal<any>(null);
  muhatapDepoNo = signal<number>(0);
  barkodGirdisi = signal<string>('');
  altmenu = signal(0);
  aramaGirdisi = signal<string>('');
  gonderiliyor = signal<boolean>(false);


    // QR için yeni sinyaller
      @ViewChild('qrInput') qrInput!: ElementRef;

  qrIrsaliyeNo = signal<string>("");
  qrGorunurVeri = signal<string>("");
  qrParsed = signal<boolean>(false);
  qrOkunuyor = signal<boolean>(false);



  postorder: FirmaMalKabulModel = {
    evrakNoSeri: '',
    evrakNoSira: null,
    qrstring: '',
    kalemler: []
  };
  urunListesi = signal<any[]>([]);
  bulunanUrunler = signal<StokAraCT[]>([]);
  secilenUrun = signal<StokAraCT | null>(null);
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['UrunAdi', 'UrunKodu', 'MalKabulMiktari', 'aksiyon'];

  constructor(
    private meservice: MeService,
    private goodsReceiptNotesService: GoodsReceiptNotesService,
    private salesOrdersService: SalesOrdersService,
    private dialog: MatDialog,

    private warehouseservice: WarehouseService,
    public dialogRef: MatDialogRef<CompanyGoodsReceipt>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
  ) {
    effect(() => {
      this.altmenu.set(this.meservice.selectedAltMenu()?.id ?? 0);
    });


  }

  ngOnInit(): void {
    if (this.data && this.data.shipment) {
      this.evrakdetay.set(this.data.shipment);
      console.log('Gelen Data Shipment:', this.data.shipment);
      this.tabloMapForReturn(this.evrakdetay());

    }

  }

  tabloMapForReturn(data: any) {

    console.log('Tablo Map Data:', data);
    const veri = data?.siparis.kalemler?.map((urun: Kalem) => {
      const sevkMiktari = urun.sevkMiktari ?? 0;
       const siparisMiktari = urun.siparisMiktari ?? 0;
      const malKabulMiktari = 0;

      return {
        UrunAdi: urun.stok.stokIsim,
        UrunKodu: urun.stok.stokKod,
        verilenSiparisMiktari: urun.siparisMiktari,
        sevkmiktari: sevkMiktari,
        MalKabulMiktari: malKabulMiktari,
        barkodu: urun.stok?.barkodlar?.[0]?.barKodu ?? '',
        fiyat: urun.stok.fiyat?.fiyati ?? 0,
        birimkatsayisi: urun.stok.barkodlar?.[0]?.birimKatSayisi ?? 1,
        sto_birim_ad: urun.stok.birimAd,
        aciklama: '',
        stok: urun.stok,

        sipId: urun.siparisGuid,

        fark: malKabulMiktari - siparisMiktari
      };
    }) ?? [];
    this.urunListesi.set(veri);
    this.dataSource.data = veri
  }
  tabloMap(data: any) {

    console.log('Tablo Map Data:', data);
    const veri = data.malKabulIrsaliyesi?.malKabul?.kalemler?.map((urun: Kalem) => {
      const sevkMiktari = urun.sevkMiktari ?? 0;
      const malKabulMiktari = 0;
      console.log('Sevk Miktari:', sevkMiktari, 'Mal Kabul Miktari:', malKabulMiktari);
      return {
        UrunAdi: urun.stok.stokIsim,
        UrunKodu: urun.stok.stokKod,
        verilenSiparisMiktari: urun.siparisMiktari,
        sevkmiktari: sevkMiktari,
        MalKabulMiktari: malKabulMiktari,
        barkodu: urun.stok?.barkodlar?.[0]?.barKodu ?? '',
        fiyat: urun.stok.fiyat?.fiyati ?? 0,
        birimkatsayisi: urun.stok.barkodlar?.[0]?.birimKatSayisi ?? 1,
        sto_birim_ad: urun.stok.birimAd,
        aciklama: '',
        stok: urun.stok,

        sipId: urun.siparisGuid,

        fark: malKabulMiktari - sevkMiktari
      };
    }) ?? [];
    this.urunListesi.set(veri);
    this.dataSource.data = veri
  }


  barkodOku(barkod: string) {
    const aranacakKelime = barkod.toLocaleLowerCase();
    this.goodsReceiptNotesService.detailsBranchReceipt(this.altmenu(), barkod, 5)
      .subscribe({
        next: value => {
          this.evrakdetay.set(value);
          this.muhatapDepoNo.set(value.muhatapDepoNo);
          this.tabloMap(this.evrakdetay());

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
    this.goodsReceiptNotesService.detailsBranchReceipt(this.altmenu(), seriNo, siraNo)
      .subscribe({
        next: value => {
          this.evrakdetay.set(value);
          this.muhatapDepoNo.set(value.muhatapDepoNo);
          this.tabloMap(this.evrakdetay());
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
    const aranacakKelime = aranacak.toLocaleLowerCase();


    this.warehouseservice
      .searchStock(aranacakKelime)
      .subscribe({
        next: value => this.bulunanUrunler.set(value),
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

    const eklenecekUrun: any = {
      UrunAdi: secilenUrun.stokIsim,
      UrunKodu: secilenUrun.stokKod,
      barkodu: secilenUrun.barKodu,
      fiyat: secilenUrun.fiyati,
      birimkatsayisi: secilenUrun.birimKatsayisi,
      sto_birim_ad: secilenUrun.birimAd,
      onerilenMiktar: null,
      verilenSiparisMiktari: null,
      malKabulIrsaliyesiMiktari: null,
      MalKabulMiktari: 1,
      tedarikciStokKod: '',
      aciklama: '',
      fark: '',
      sipId: ''
    };

    const existingIndex = this.urunListesi().findIndex(
      u => u.UrunKodu === eklenecekUrun.UrunKodu
    );

    if (existingIndex !== -1) {
      const updatedList = this.urunListesi().map((item, index) =>
        index === existingIndex
          ? { ...item, MalKabulMiktari: (item.MalKabulMiktari ?? 0) + 1 }
          : item
      );
      this.urunListesi.set(updatedList);
    } else {
      this.urunListesi.set([...this.urunListesi(), eklenecekUrun]);
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
    this.gonderiliyor.set(true);

    /* ============================
     * 1️⃣ Kalemleri oluştur
     * ============================ */
    const kalemler: Kalem[] = this.urunListesi().map(urun => ({
      id: crypto.randomUUID(),
      stok: {
        stokKod: urun.UrunKodu,
        stokIsim: urun.UrunAdi,
        birimAd: urun.sto_birim_ad
      },
      siparisGuid: urun.siparisGuid,
      sevkGuid: urun.sevkGuid,
      siparisMiktari: urun.siparisMiktari ?? 0,
      sevkMiktari: urun.sevkMiktari ?? 0,
      malKabulMiktari: urun.MalKabulMiktari ?? 0,
      sevkMalKabulFarkMiktari: urun.fark ?? 0,
      aciklama: ''
    }));

    /* ============================
     * 2️⃣ Fark analizleri
     * ============================ */
    const malkabulFarkiPozitifler = kalemler.filter(
      k => (k.sevkMalKabulFarkMiktari ?? 0) > 0
    );

    const malkabulFarkiNegatifler = kalemler.filter(
      k => (k.sevkMalKabulFarkMiktari ?? 0) < 0
    );

    if (malkabulFarkiPozitifler.length > 0) {
      this.toastr.warning(
        'Mal kabul miktarı sevk miktarından fazla olan kalemler var',
        'Uyarı'
      );
    }

    /* ============================
     * 3️⃣ Evrak bilgileri
     * ============================ */
    this.postorder = {
      ...this.postorder,
      qrstring: this.qrIrsaliyeNo(),
      
      kalemler
    };

    /* ============================
     * 4️⃣ Gönderiliyor toast
     * ============================ */
    const toastRef = this.toastr.show('Gönderiliyor...', '', {
      disableTimeOut: true,
      progressBar: true,
      tapToDismiss: false,
      closeButton: false,
      toastClass: 'ngx-toastr info-toast'
    });

    /* ============================
     * 5️⃣ Mal kabul kaydet
     * ============================ */
    this.goodsReceiptNotesService
      .createCompanyReceipt(this.altmenu(), this.postorder)
      .subscribe({
        next: () => {
          this.toastr.clear(toastRef.toastId);
          this.toastr.success('Mal kabul başarıyla kaydedildi', 'Başarılı');
          this.gonderiliyor.set(false);

          // const proceedWithPositives = () => {
          //   if (malkabulFarkiPozitifler.length > 0) {
          //     this.handlePositiveDifferences(malkabulFarkiPozitifler);
          //   } else {
          //     this.kapat();
          //   }
          // };

          // if (malkabulFarkiNegatifler.length > 0) {
          //   this.handleNegativeDifferences(malkabulFarkiNegatifler, proceedWithPositives);
          // } else {
          //   proceedWithPositives();
          // }
        },

        error: err => {
          this.toastr.clear(toastRef.toastId);
          this.toastr.error('Mal kabul kaydedilirken hata oluştu', 'Hata');
          console.error(err);
          this.gonderiliyor.set(false);
        }
      });
  }

  private handleNegativeDifferences(
    malkabulFarkiNegatifler: Kalem[],
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
          kalemler: malkabulFarkiNegatifler.map(k => ({
            ...k,
            stok: { ...k.stok }
          }))
        }
      })
      .afterClosed()
      .subscribe(confirm => {
        if (confirm !== true) {
          onComplete();
          return;
        }

        const sipKalemler: Kalem[] = malkabulFarkiNegatifler.map(k => ({
          id: k.id,
          stok: { ...k.stok },
          siparisGuid: k.siparisGuid,
          sevkGuid: k.sevkGuid,
            siparisMiktari: Math.abs(k.sevkMalKabulFarkMiktari ?? 0),
          sevkMiktari: k.sevkMiktari,
          malKabulMiktari: k.malKabulMiktari,
          sevkMalKabulFarkMiktari: k.sevkMalKabulFarkMiktari,
          iadeyeKonuIrsaliyeGuidi:  this.evrakdetay().id,
          aciklama: 'Noksan mal iade siparişi'
        }));

        const newData: SubeSiparisiAlDto = {
          noksanFazlaIadesi: 0,
          muhatapDepoNo: this.muhatapDepoNo(),
          kalemler: sipKalemler
        };

        this.salesOrdersService
          .createBranchOrder(this.data.iadeGorevId, newData)
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

  private handlePositiveDifferences(malkabulFarkiPozitifler: Kalem[]) {
    this.toastr.info(
      'Mal kabul miktarı sevk miktarından fazla olan kalemler için işlem seçiniz',
      'Bilgi'
    );

    this.dialog
      .open(ExcessConfirmDialogComponent, {
        width: '450px'
      })
      .afterClosed()
      .subscribe((decision: 'return' | 'correction' | null) => {
        if (decision === 'return') {


          this.salesOrdersService
            .createBranchOrder(this.data.iadeGorevId, {
              noksanFazlaIadesi: 1,
              muhatapDepoNo: this.muhatapDepoNo(),
              kalemler: malkabulFarkiPozitifler.map(k => ({
                id: k.id,
                stok: { ...k.stok },
                siparisGuid: k.siparisGuid,
                siparisMiktari: Math.abs(k.sevkMalKabulFarkMiktari ?? 0),
                sevkMiktari: k.sevkMiktari,
                malKabulMiktari: k.malKabulMiktari,
                sevkMalKabulFarkMiktari: k.sevkMalKabulFarkMiktari,
                iadeyeKonuIrsaliyeGuidi: this.evrakdetay().id,
                aciklama: 'Fazla mal iade sevkiyatı'
              }))
       
            })
            .subscribe({
              next: () =>
             {
                this.toastr.success(
                  'Fazla mal iade sevkiyatı başarıyla oluşturuldu',
                  'Başarılı'
                );
              },
              error: err => {
                this.toastr.error(
                  'Fazla mal iade sevkiyatı oluşturulurken hata oluştu',
                  'Hata'
                );
                console.error(err);
              },
              complete: () => this.kapat()
            });
          return;
        }

        if (decision === 'correction') {
          this.dialog
            .open(ConfirmDialogComponent, { width: '400px' })
            .afterClosed()
            .subscribe(confirmed => {
              confirmed
                ? this.toastr.success(
                    'Fazla mal kabul düzeltmesi onaylandı bısey yapmanıza gerek yok',
                    'Başarılı'
                  )
                : this.salesOrdersService
            .createBranchOrder(this.data.iadeGorevId, {
              noksanFazlaIadesi: 1,
              muhatapDepoNo: this.muhatapDepoNo(),
              kalemler: malkabulFarkiPozitifler.map(k => ({
                id: k.id,
                stok: { ...k.stok },
                siparisGuid: k.siparisGuid,
                siparisMiktari: Math.abs(k.sevkMalKabulFarkMiktari ?? 0),
                sevkMiktari: k.sevkMiktari,
                malKabulMiktari: k.malKabulMiktari,
                sevkMalKabulFarkMiktari: k.sevkMalKabulFarkMiktari,
                iadeyeKonuIrsaliyeGuidi: this.evrakdetay().id,
                aciklama: 'Fazla mal iade sevkiyatı'
              }))
            })
            .subscribe({
              next: () =>
                this.toastr.success(
                  'Fazla mal iade sevkiyatı başarıyla oluşturuldu',
                  'Başarılı'
                ),
              error: err => {
                this.toastr.error(
                  'Fazla mal iade sevkiyatı oluşturulurken hata oluştu',
                  'Hata'
                );
                console.error(err);
              },
              complete: () => this.kapat()
            });
      


              this.kapat();
            });
          return;
        }

        this.kapat();
      });
  }



  onMalKabulChange(element: any) {
    const sevk = element.sevkmiktari ?? 0;
    const kabul = element.MalKabulMiktari ?? 0;
    element.fark = kabul - sevk;
  }
  temizle() {
    this.urunListesi.set([]);
    this.dataSource.data = [];
    this.bulunanUrunler.set([]);
    this.postorder = {
      evrakNoSeri: '',
      evrakNoSira: 0,
      kalemler: []
    };
    this.toastr.info('Form temizlendi', '', { timeOut: 2000 });
  }

  // QR okuma butonu için
  qrOkumayaBasla() {
    this.qrOkunuyor.set(true);
    this.qrIrsaliyeNo.set("");
    this.qrGorunurVeri.set("QR tarayıcıyı koda yaklaştırın...");
    
    // Input'u focusla
    setTimeout(() => {
      if (this.qrInput?.nativeElement) {
        this.qrInput.nativeElement.focus();
        this.qrInput.nativeElement.value = '';
      }
    }, 200);
    
    this.toastr.info('QR kodu okutmak için hazır', 'QR Okuma', { timeOut: 2000 });
  }

  qrOkumayiDurdur() {
    this.qrOkunuyor.set(false);
    this.qrGorunurVeri.set("");
    this.qrIrsaliyeNo.set("");
  }

  private qrTimer: any;

  qrVerisiAl(event: any) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    if (!value) return;

    // Eğer kullanıcı hızlıca karakter giriyorsa, timer'ı resetle
    clearTimeout(this.qrTimer);

    // 100ms içinde yeni karakter gelmezse veri tamamlanmış kabul et
    this.qrTimer = setTimeout(() => {
      console.log("QR tek seferde okundu:", value);
      this.qrIrsaliyeNo.set(value);

      if (this.qrOkunuyor()) {
        this.irsparcala(value);
      } else {
        this.irsparcala(value);
      }

      // Input'u temizle
      input.value = '';
    }, 100);
  }

  // Ana parse fonksiyonu
  irsparcala(qrData?: string) {
    const veri = qrData || this.qrIrsaliyeNo();
    console.log(veri)
    
    if (!veri || veri.trim() === '') {
      this.toastr.warning('Lütfen QR kodu veya irsaliye no giriniz!', 'Uyarı');
      return;
    }
    
    this.qrOkunuyor.set(true);
    this.qrGorunurVeri.set("İşleniyor...");
    
    // Parse işlemi
    const parsedData = this.parseIrsaliyeNo(veri);

    
    if (parsedData.success) {
      // Başarılı parse
    //  this.postorder.evrakNoSeri = parsedData.seri;
      //this.postorder.evrakNoSira = Number(parsedData.sira);
      
      // QR'dan gelen ek bilgileri doldur
      // if (parsedData.plaka) {
      //   this.postorder.depo.sofor!.aracPlakasi = parsedData.plaka;
      // }
      
   
      
      if (parsedData.cariKod) {
      //  this.postorder.muhatapFirma.no = parsedData.cariKod;
        // Firma otomatik aranabilir
       // this.firmaAra();
      }
      
      if (parsedData.muhatapAdi) {
      //  this.postorder.muhatapFirma.isim = parsedData.muhatapAdi;
      }
      
      // Görüntü için formatlı bilgi
      let gorunenBilgi = '';
      if (parsedData.seri || parsedData.sira) {
        gorunenBilgi = `İrsaliye: ${parsedData.seri || ''}${parsedData.sira || ''}`;
      }
      if (parsedData.plaka) {
        gorunenBilgi += ` | Plaka: ${parsedData.plaka}`;
      }
      if (parsedData.soforAdSoyad) {
        gorunenBilgi += ` | Şoför: ${parsedData.soforAdSoyad}`;
      }
      if (parsedData.cariKod) {
        gorunenBilgi += ` | Cari: ${parsedData.cariKod}`;
      }
      
      this.qrGorunurVeri.set(gorunenBilgi || 'QR okundu');
      this.qrParsed.set(true);
      
      this.toastr.success('QR başarıyla okundu!', 'Başarılı');
      
      // 3 saniye sonra QR alanını temizle
      setTimeout(() => {
        this.qrOkunuyor.set(false);
        this.qrIrsaliyeNo.set("");
        if (this.qrInput?.nativeElement) {
          this.qrInput.nativeElement.value = '';
        }
      }, 3000);
      
    } else {
      // Parse başarısız
      this.qrGorunurVeri.set("Geçersiz format!");
      this.qrParsed.set(false);
      this.toastr.error('Geçersiz QR/İrsaliye formatı!', 'Hata');
      
      setTimeout(() => {
        this.qrOkunuyor.set(false);
        this.qrGorunurVeri.set("");
      }, 2000);
    }
  }
public manuelparseIrsaliyeNo(): { seri: string | null; sira: string | null } {
    const irsaliyeNo = this.qrIrsaliyeNo();
    
    if (!irsaliyeNo?.trim()) {
        return { seri: null, sira: null };
    }

    const match = irsaliyeNo.match(/^([A-Za-z]+)(.*)$/);
    
    if (!match) {
        return { seri: null, sira: null };
    }

    const [, seri, rest] = match;
    const numericMatch = rest.match(/\d+$/);
    const numericPart = numericMatch?.[0] ?? '';
    
    // Sağdan ilk sıfırı bul ve sağındakileri al
    const lastZeroIndex = numericPart.lastIndexOf('0');
    const sira = lastZeroIndex === -1 
        ? numericPart || '0'
        : numericPart.substring(lastZeroIndex + 1) || '0';

    console.log('seri:', seri, 'sira:', sira);
    return { seri, sira };
}






  // İrsaliye numarasını parse eden ana fonksiyon
  private parseIrsaliyeNo(irsaliyeNo: string): { 
    success: boolean; 
    seri: string | null; 
    sira: string | null;
    cariKod: string | null;
    plaka?: string | null;
    soforAdSoyad?: string | null;
    muhatapAdi?: string | null;
    irsaliyeNo?: string | null;
  } {
    const temizNo = irsaliyeNo.trim();

    const toplamKarakter = temizNo.length;
console.log(toplamKarakter);


    // 1. EFatura QR formatı (Ğ ile başlayan - Türkiye QR formatı)
    if (temizNo.startsWith('Ğ')) {
      // Güvenli parse'ı dene
      const safeResult = this.parseEFaturaQRSafe(temizNo);
      if (safeResult.success && (safeResult.seri || safeResult.sira || safeResult.plaka || safeResult.cariKod)) {
        return safeResult;
      }
      // Güvenli parse başarısızsa normal parse'ı dene
      return this.parseEFaturaQR(temizNo);
    }
    
    // 2. IRS| formatı (QR standardı)
    if (temizNo.toUpperCase().startsWith('IRS|')) {
      const parcalar = temizNo.split('|');
      console.log('IRS format parçaları:', parcalar);
      
      if (parcalar.length >= 4) {
        return {
          success: true,
          seri: parcalar[2] || null,
          sira: parcalar[3] || null,
          cariKod: parcalar.length >= 6 ? parcalar[5] : null
        };
      }
    }
    
    // 3. Diğer formatlar
    const seriSiraRegex = /^([A-Z]{1,3})(\d{4,})$/;
    const seriSiraMatch = temizNo.toUpperCase().match(seriSiraRegex);
    if (seriSiraMatch) {
      return {
        success: true,
        seri: seriSiraMatch[1],
        sira: seriSiraMatch[2],
        cariKod: null
      };
    }
    
    const yilSiraRegex = /^(\d{4})\D+(\d+)$/;
    const yilSiraMatch = temizNo.match(yilSiraRegex);
    if (yilSiraMatch) {
      return {
        success: true,
        seri: yilSiraMatch[1],
        sira: yilSiraMatch[2],
        cariKod: null
      };
    }
    
    const sadeSayiRegex = /^(\d+)$/;
    const sadeSayiMatch = temizNo.match(sadeSayiRegex);
    if (sadeSayiMatch) {
      return {
        success: true,
        seri: null,
        sira: sadeSayiMatch[1],
        cariKod: null
      };
    }
    
    // Hiçbiri tutmazsa
    return {
      success: true,
      seri: null,
      sira: null,
      cariKod: null
    };
  }

  // EFatura QR formatını parse eden fonksiyon
  private parseEFaturaQR(qrData: string): { 
    success: boolean; 
    seri: string | null; 
    sira: string | null;
    cariKod: string | null;
    plaka?: string | null;
    soforAdSoyad?: string | null;
    muhatapAdi?: string | null;
    irsaliyeNo?: string | null;
  } {
    try {
      console.log('QR Data:', qrData);
      
      // Başlangıç değerleri
      const parsedData: any = {
        success: true,
        seri: null,
        sira: null,
        cariKod: null,
        plaka: null,
        soforAdSoyad: null,
        muhatapAdi: null,
        irsaliyeNo: null
      };
      
      // İlk karakteri atla (Ğ)
      const data = qrData.substring(1);
      console.log('Data without Ğ:', data);
      
      // Hem İÖİ hem İöİ için regex kullan (case-insensitive)
      const parts = data.split(/İ[Öö]İ/);
      console.log('Split parts:', parts);
      
      parts.forEach((part, index) => {
        console.log(`Part ${index}:`, part);
        
        // İŞİ veya İşi (büyük/küçük harf farkı)
        const keyValueMatch = part.match(/([^İşi]+)[İşi]+([^İşi]*)/i);
        
        if (keyValueMatch && keyValueMatch.length >= 3) {
          const key = keyValueMatch[1].toUpperCase();
          const value = keyValueMatch[2];
          
          console.log(`Key: ${key}, Value: ${value}`);
          
          switch (key) {
            case 'NO':
              parsedData.irsaliyeNo = value;
              console.log('İrsaliye No found:', value);
              
              // İrsaliye numarasından seri ve sırayı çıkar
              const irsMatch = value.match(/^([A-Za-z]+)(\d+)$/);
              if (irsMatch && irsMatch.length >= 3) {
                parsedData.seri = irsMatch[1];
                parsedData.sira = irsMatch[2];
                console.log('Seri/Sıra parsed:', parsedData.seri, parsedData.sira);
              } else {
                parsedData.sira = value;
              }
              break;
              
            case 'PLAKA':
              parsedData.plaka = value;
              console.log('Plaka found:', value);
              break;
              
            case 'TASIYICIADSOYAD':
              parsedData.soforAdSoyad = value;
              console.log('Şoför found:', value);
              break;
              
            case 'TEMSILCIADSOYAD':
              parsedData.muhatapAdi = value;
              console.log('Muhatap found:', value);
              break;
          }
        } else {
          // Direkt değer kontrolü (örneğin INCEİÜ)
          if (part.includes('INCEİÜ')) {
            parsedData.cariKod = 'INCEİÜ';
            console.log('Cari Kod found: INCEİÜ');
          }
        }
      });
      
      // Eğer cari kod bulunamadıysa, son part'a bak
      if (!parsedData.cariKod) {
        const lastPart = parts[parts.length - 1];
        if (lastPart && lastPart.includes('INCEİÜ')) {
          parsedData.cariKod = 'INCEİÜ';
          console.log('Cari Kod found in last part: INCEİÜ');
        }
      }
      
      console.log('EFatura QR Parse Sonucu:', parsedData);
      return parsedData;
      
    } catch (error) {
      console.error('EFatura QR parse hatası:', error);
      return {
        success: false,
        seri: null,
        sira: null,
        cariKod: null
      };
    }
  }

  // Daha basit ve güvenilir parse fonksiyonu
  private parseEFaturaQRSafe(qrData: string): { 
    success: boolean; 
    seri: string | null; 
    sira: string | null;
    cariKod: string | null;
    plaka?: string | null;
    soforAdSoyad?: string | null;
    muhatapAdi?: string | null;
    irsaliyeNo?: string | null;
  } {
    try {
      console.log('QR Data (safe parse):', qrData);
      
      // Başlangıç değerleri
      const parsedData: any = {
        success: true,
        seri: null,
        sira: null,
        cariKod: null,
        plaka: null,
        soforAdSoyad: null,
        muhatapAdi: null,
        irsaliyeNo: null
      };
      
      // Tüm veriyi büyük harfe çevir ve normalize et
      const upperData = qrData.toUpperCase();
      
      // 1. İrsaliye No'yu bul (NOİŞİZBU2025000113491)
      const noMatch = upperData.match(/NO[İI]Ş[İI]([A-Z0-9]+)/);
      if (noMatch && noMatch[1]) {
        parsedData.irsaliyeNo = noMatch[1];
        console.log('İrsaliye No:', parsedData.irsaliyeNo);
        
        // Seri ve sırayı ayır
        const match = parsedData.irsaliyeNo.match(/^([A-Z]+)(\d+)$/);
        if (match) {
          parsedData.seri = match[1];
          parsedData.sira = match[2].replace(/^0+/, '');
          console.log('Seri:', parsedData.seri, 'Sıra:', parsedData.sira);
        }
      }
      
      // 2. Plakayı bul (PLAKAİŞİ16LRC20)
      const plakaMatch = upperData.match(/PLAKA[İI]Ş[İI]([A-Z0-9]+)/);
      if (plakaMatch && plakaMatch[1]) {
        parsedData.plaka = plakaMatch[1];
        console.log('Plaka:', parsedData.plaka);
      }
      
      // 3. Şoför adını bul (TASIYICIADSOYADİŞİMEHMET EROGLU)
      const soforMatch = upperData.match(/TASIYICIADSOYAD[İI]Ş[İI]([A-Z\s]+)/);
      if (soforMatch && soforMatch[1]) {
        parsedData.soforAdSoyad = soforMatch[1].trim();
        console.log('Şoför:', parsedData.soforAdSoyad);
      }
      
      // 4. Muhatap adını bul (TEMSILCIADSOYADİŞİSMEYRA)
      const muhatapMatch = upperData.match(/TEMSILCIADSOYAD[İI]Ş[İI]([A-Z\s]+)/);
      if (muhatapMatch && muhatapMatch[1]) {
        parsedData.muhatapAdi = muhatapMatch[1].trim();
        console.log('Muhatap:', parsedData.muhatapAdi);
      }
      
      // 5. Cari kodu bul (INCEİÜ)
      if (upperData.includes('INCEİÜ')) {
        parsedData.cariKod = 'INCEİÜ';
        console.log('Cari Kod:', parsedData.cariKod);
      }
      
      console.log('Safe Parse Sonucu:', parsedData);
      return parsedData;
      
    } catch (error) {
      console.error('Safe parse hatası:', error);
      return {
        success: false,
        seri: null,
        sira: null,
        cariKod: null
      };
    }
  }

  // Parse sonuçlarını temizle
  qrSonuclariniTemizle() {
   // this.postorder.evrakNoSeri = null;
   // this.postorder.evrakNoSira = null;
    // this.postorder.depo.sofor!.adi = null;
    // this.postorder.depo.sofor!.soyAdi = null;
    // this.postorder.depo.sofor!.aracPlakasi = null;
   // this.postorder.muhatapFirma.isim = '';
    this.qrParsed.set(false);
    this.qrGorunurVeri.set("");
    this.qrIrsaliyeNo.set("");
  }

  kapat() {
    this.dialogRef.close();
  }

 
}
