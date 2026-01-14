import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, Inject, signal, ViewChild, computed } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { WarehouseService } from '../../../../../services/warehouse.service';
import { MeService } from '../../../../../services/meservice.service';

import { ShipmentNotesService } from '../../../../../services/shipments/shipment-notes.service';
import { GoodsReceiptNotesService } from '../../../../../services/receipts/goods-receipt-notes.service';
import { SalesOrdersService } from '../../../../../services/orders/sales-orders.service';
import { RefundConfirmDialogComponent } from '../../../../../modal/refund-confirm-dialog/refund-confirm-dialog';
import { ExcessConfirmDialogComponent } from '../../../../../modal/ExcessConfirmDialogComponent';
import { ConfirmDialogComponent } from '../../../../../modal/ConfirmDialogComponent';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { CompanyService } from '../../../../../services/company.service';
import { FirmayaSevketDto } from '../../../../../models/firmayaSevkModel';
import { finalize } from 'rxjs';
import { FirmaMalKabulModel } from '../../../../../models/firmaMalKabulModel';
import { Kalem, StokAraCT, StokBulDto } from '../../../../../models/ortakModeller';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-company-goods-receipt',
  imports: [CommonModule, MatTableModule, FormsModule, MatIconModule, MatProgressSpinner],
  templateUrl: './company-goods-receipt.html',
  styleUrl: './company-goods-receipt.css',
})
export class CompanyGoodsReceipt {

  bulunancariler = signal<any[]>([]);
  secilencari = signal<number | null>(null);
  seriNoGirdisi = signal<string>('');
  siraNoGirdisi = signal<number>(0);
  evrakdetay = signal<any>(null);
  firmaNo = signal<number>(0);
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
    cariKod:"",
      teslimEdenAdSoyad: '',
      qrData: '',
   
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
    private shipmentnoteservice: ShipmentNotesService,
    private dialog: MatDialog,

    private warehouseservice: WarehouseService,
    private companyService: CompanyService,
    public dialogRef: MatDialogRef<CompanyGoodsReceipt>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
  ) {
    effect(() => {
      this.altmenu.set(this.meservice.selectedAltMenu()?.id ?? 0);
    });


  }

  ngOnInit(): void {

    const hasOtherOrdersForCompany = this.data && this.data.otherOrdersForCompany;
    if (hasOtherOrdersForCompany.length > 0) 
      {
  const htmlContent = `
  <p>Bu firmaya ait <b>${hasOtherOrdersForCompany.length}</b> adet başka sipariş bulunmaktadır.</p>
  <form id="orderForm">
    ${hasOtherOrdersForCompany.map((order:any) => `
      <input type="checkbox" name="orders" value="${order.siparisNo}" id="order-${order.siparisNo}">
      <label for="order-${order.siparisNo}">${order.siparisNo}</label><br>
    `).join('')}
  </form>
`;

Swal.fire({
  title: 'Dikkat!',
  html: htmlContent,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Seçilenleri Onayla',
  preConfirm: () => {
    const checkedOrders = Array.from(
      (document.querySelectorAll('input[name="orders"]:checked') as NodeListOf<HTMLInputElement>)
    ).map(el => el.value);
    return checkedOrders;
  }
}).then((result) => {
  if (result.isConfirmed) {
    console.log('Seçilen siparişler:', result.value); // seçilen siparişler

    // Seçilen siparişlere ait kalemleri al
    const secilenKalemler = this.evrakdetay().kalemler.filter((kalem: any) =>
      result.value.includes(kalem.siparisNo)
    );

    // Mevcut kalemlerin sonuna ekle (aynı kalemi tekrar eklememek için kontrol edebilirsin)
    const mevcutSiparisNo = this.evrakdetay().kalemler.map((k:any) => k.siparisNo);
    const yeniKalemler = secilenKalemler.filter((k:any) => !mevcutSiparisNo.includes(k.siparisNo));
    
    this.evrakdetay().kalemler.push(...yeniKalemler);

    // Tabloyu güncelle
    this.tabloMapForReturn(this.evrakdetay().kalemler);
  }
});


      }


    if (this.data && this.data.order) {
      this.evrakdetay.set(this.data.order);
      this.postorder.cariKod = this.evrakdetay().siparis.muhatapFirma?.no ?? 0 .toString();
      this.tabloMapForReturn(this.evrakdetay());

    }
    console.log('Gelen Data:', this.evrakdetay());

  }

  tabloMapForReturn(data: any) {

    console.log('Tablo Map Data:', data);
    const veri = data?.siparis.kalemler?.map((urun: Kalem) => {
      const sevkMiktari = urun.sevkMiktari ?? 0;
      const malKabulMiktari = 0;

      return {
        UrunAdi: urun.stok?.stokIsim,
        UrunKodu: urun.stok?.stokKod,
        verilenSiparisMiktari: urun.siparisMiktari,
        sevkmiktari: sevkMiktari,
        MalKabulMiktari: malKabulMiktari,
        barkodu: urun.stok?.barkodlar?.[0]?.barKodu ?? '',
        fiyat: urun.stok?.fiyat?.fiyati ?? 0,
        birimkatsayisi: urun.stok?.barkodlar?.[0]?.birimKatSayisi ?? 1,
        sto_birim_ad: urun.stok?.birimAd,
        aciklama: '',
        stok: urun.stok,

        sipId: urun.siparisGuid,

        fark: malKabulMiktari - sevkMiktari
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
        UrunAdi: urun.stok?.stokIsim,
        UrunKodu: urun.stok?.stokKod,
        verilenSiparisMiktari: urun.siparisMiktari,
        sevkmiktari: sevkMiktari,
        MalKabulMiktari: malKabulMiktari,
        barkodu: urun.stok?.barkodlar?.[0]?.barKodu ?? '',
        fiyat: urun.stok?.fiyat?.fiyati ?? 0,
        birimkatsayisi: urun.stok?.barkodlar?.[0]?.birimKatSayisi ?? 1,
        sto_birim_ad: urun.stok?.birimAd,
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
          this.firmaNo.set(value.firmaNo);
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
          this.firmaNo.set(value.firmaNo);
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
  if (!aranacak?.trim()) return;

  const aranacakKelime = aranacak.toLowerCase();

  // const kalem = this.urunListesi().find(urun =>
  //   urun.UrunKodu?.toLowerCase().includes(aranacakKelime) ||
  //   urun.UrunAdi?.toLowerCase().includes(aranacakKelime)
  // );

  // if (kalem) {
  //   this.toastr.success(
  //     'Aranan ürün mevcut sipariş kalemleri arasında bulundu ve eklendi.',
  //     'Başarılı',
  //     { timeOut: 3000 }
  //   );

  //   const varmi = this.dataSource.data.find(
  //     u => u.UrunKodu === kalem.UrunKodu
  //   );

  //   if (varmi) {
  //     this.dataSource.data = this.dataSource.data.map(u =>
  //       u.UrunKodu === kalem.UrunKodu
  //         ? { ...u, MalKabulMiktari: (u.MalKabulMiktari ?? 0) + 1 }
  //         : u
  //     );
  //   } else {
  //     this.dataSource.data = [
  //       ...this.dataSource.data,
  //       { ...kalem, MalKabulMiktari: 1 }
  //     ];
  //   }

  //   return;
  // }

  // // 🔍 Siparişte yok → stoktan ara
  // this.toastr.info(
  //   'Aranan ürün sipariş kalemlerinde bulunamadı. Stoktan aranıyor...',
  //   'Bilgi',
  //   { timeOut: 3000 }
  // );

const dto: StokBulDto = {
  CariKod:this.postorder.cariKod ?? '',
  Bul: aranacakKelime
};
  this.companyService.searchStockByCustomerCode(dto).subscribe({
    next: value =>{
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        this.secilenUrun.set(value[0]);
      }
      else {

      this.bulunanUrunler.set(value)
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
      fark: 0,

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

   firmaAra() {
      const query = this.postorder.cariKod ?? this.secilencari()?.toLocaleString() ?? '';
      this.companyService.searchCustomerAccount(query).subscribe(data => {
        this.bulunancariler.set(data);
      });
    }
  
    firmaSec(firma: any) {
      this.postorder.cariKod = firma.cariKod;
      this.secilencari.set(firma.id);
      this.firmaNo.set(firma.id);
    
    
      this.bulunancariler.set([]);
    }
  


kaydet() {
  this.setLoading(true);

  const kalemler = this.buildKalemler();
  const { pozitifler, negatifler } = this.analyzeDifferences(kalemler);

  this.warnIfPositiveDifference(pozitifler);
  this.buildPostOrder(kalemler);

  const toastRef = this.showLoadingToast();

  this.goodsReceiptNotesService
    .createCompanyReceipt(this.altmenu(), this.postorder)
    .pipe(finalize(() => this.clearLoading(toastRef)))
    .subscribe({
      next: () => this.handleAfterReceiptSaved(pozitifler, negatifler),
      error: err => this.handleError(err)
    });
}

/* =====================================================
 * LOADING / TOAST
 * ===================================================== */
private setLoading(state: boolean) {
  this.gonderiliyor.set(state);
}

private showLoadingToast() {
  return this.toastr.show('Gönderiliyor...', '', {
    disableTimeOut: true,
    progressBar: true,
    tapToDismiss: false,
    closeButton: false,
    toastClass: 'ngx-toastr info-toast'
  });
}

private clearLoading(toastRef: any) {
  this.toastr.clear(toastRef.toastId);
  this.setLoading(false);
}

private handleError(err: any) {
  this.toastr.error('Mal kabul kaydedilirken hata oluştu', 'Hata');
  console.error(err);
}

/* =====================================================
 * KALEMLER
 * ===================================================== */
private buildKalemler(): Kalem[] {
  return this.urunListesi().map(urun => ({
    id: crypto.randomUUID(),

    stok: {
      stokKod: urun.UrunKodu ?? '',
      stokIsim: urun.UrunAdi ?? '',
      birimAd: urun.sto_birim_ad ?? ''
    },

    siparisGuid: this.evrakdetay()?.siparis.id ?? null,

    sevkGuid: null,

    siparisMiktari: urun.siparisMiktari ?? 0,

    sevkMiktari: urun.sevkmiktari ?? 0,

    malKabulMiktari: urun.MalKabulMiktari ?? 0,

    sevkMalKabulFarkMiktari: urun.fark ?? 0,

    aciklama: ''
  }));
}

/* =====================================================
 * FARK ANALİZİ
 * ===================================================== */
private analyzeDifferences(kalemler: Kalem[]) {
  return {
    pozitifler: kalemler.filter(k => (k.sevkMalKabulFarkMiktari ?? 0) > 0),
    negatifler: kalemler.filter(k => (k.sevkMalKabulFarkMiktari ?? 0) < 0)
  };
}

private warnIfPositiveDifference(kalemler: Kalem[]) {
  if (!kalemler.length) return;

  this.toastr.warning(
    'Mal kabul miktarı sevk miktarından fazla olan kalemler var',
    'Uyarı'
  );
}

/* =====================================================
 * POST ORDER
 * ===================================================== */
private buildPostOrder(kalemler: Kalem[]) {
  this.postorder = {
    ...this.postorder,
    qrData: this.qrIrsaliyeNo(),
    cariKod: this.postorder.cariKod,
    teslimEdenAdSoyad: 'serdal test',
    belgeTarihi: new Date(),
    kalemler
  };
}

/* =====================================================
 * MAL KABUL SONRASI AKIŞ
 * ===================================================== */
private handleAfterReceiptSaved(
  pozitifler: Kalem[],
  negatifler: Kalem[]
) {
  this.toastr.success('Mal kabul başarıyla kaydedildi', 'Başarılı');

  const proceed = () =>
    pozitifler.length
      ? this.handlePositiveDifferences(pozitifler)
      : this.kapat();

  negatifler.length
    ? this.handleNegativeDifferences(negatifler, proceed)
    : proceed();
}

/* =====================================================
 * NEGATİF FARK – NOKSAN MAL
 * ===================================================== */
private buildIadeSevkKalemleri(kalemler: Kalem[]): Kalem[] {
  return kalemler.map(k => ({
    id: k.id,

    stok: {
      stokKod: k.stok?.stokKod ?? '',   // boş string fallback
      stokIsim: k.stok?.stokIsim ?? '',
      birimAd: k.stok?.birimAd ?? ''
    },

    siparisGuid: null,

    sevkGuid:null,

    sevkMiktari: Math.abs(k.sevkMalKabulFarkMiktari ?? 0),

    malKabulMiktari: k.malKabulMiktari ?? undefined,

    sevkMalKabulFarkMiktari: k.sevkMalKabulFarkMiktari ?? undefined,

    iadeyeKonuIrsaliyeGuidi: k.siparisGuid ?? undefined,

    aciklama: 'Noksan mal iade siparişi'
  }));
}


private handleNegativeDifferences(
  kalemler: Kalem[],
  onComplete: () => void
) {
  this.toastr.info(
    'Eksik gelen ürünler için iade işlemi gerekiyor',
    'Bilgi'
  );

  this.dialog
    .open(RefundConfirmDialogComponent, {
      width: '50vw',
      height: '70vh',
      data: { kalemler }
    })
    .afterClosed()
    .subscribe(confirm => {
      if (!confirm) return onComplete();

      const dto: FirmayaSevketDto = {
        iadedir: true,
        muhatapFirmaCariKod: this.postorder.cariKod ?? '',
        teslimTarihi: new Date(),
        siparisEden: 'serdal test',
        siparisAlan: 'serdal test',
        kalemler: this.buildIadeSevkKalemleri(kalemler)
      };

      this.shipmentnoteservice
        .createCompanyShipment(this.data.iadeGorevId, dto)
        .subscribe({
          next: () =>
            this.toastr.success(
              'Noksan mal iade siparişi oluşturuldu',
              'Başarılı'
            ),
          error: () =>
            this.toastr.error(
              'Noksan mal iade siparişi oluşturulamadı',
              'Hata'
            ),
          complete: onComplete
        });
    });
}

/* =====================================================
 * POZİTİF FARK – FAZLA MAL
 * ===================================================== */
private handlePositiveDifferences(kalemler: Kalem[]) {
  this.toastr.info(
    'Fazla gelen ürünler için işlem seçiniz',
    'Bilgi'
  );

  this.dialog
    .open(ExcessConfirmDialogComponent, { width: '450px' })
    .afterClosed()
    .subscribe((decision: 'return' | 'correction' | null) => {
      if (!decision) return this.kapat();

      decision === 'return'
        ? this.createFazlaMalIade(kalemler)
        : this.confirmCorrection();
    });
}

private createFazlaMalIade(kalemler: Kalem[]) {
  this.salesOrdersService
    .createBranchOrder(this.data.iadeGorevId, {
      noksanFazlaIadesi: 1,
      firmaNo: this.firmaNo(),
      kalemler: kalemler.map(k => ({
        ...k,
        siparisGuid: null,
        sevkGuid: null,
        iadeyeKonuIrsaliyeGuidi: k.siparisGuid,
        siparisMiktari: Math.abs(k.sevkMalKabulFarkMiktari ?? 0),
        aciklama: 'Fazla mal iade sevkiyatı'
      }))
    })
    .subscribe({
      next: () =>
        this.toastr.success(
          'Fazla mal iade sevkiyatı oluşturuldu',
          'Başarılı'
        ),
      error: () =>
        this.toastr.error(
          'Fazla mal iade sevkiyatı oluşturulamadı',
          'Hata'
        ),
      complete: () => this.kapat()
    });
}

private confirmCorrection() {
  this.dialog
    .open(ConfirmDialogComponent, { width: '400px' })
    .afterClosed()
    .subscribe(confirmed => {
      confirmed
        ? this.toastr.success(
            'Fazla mal kabul düzeltmesi onaylandı',
            'Başarılı'
          )
        : this.toastr.info(
            'Düzeltme reddedildi, işlem yapılmadı',
            'Bilgi'
          );

      this.kapat();
    });
}




  onMalKabulChange(element: any) {
    console.log('Mal Kabul Miktarı değişti:', element);
    const sevk = element.sevkmiktari ?? 0;
    const kabul = element.MalKabulMiktari ?? 0;
    element.fark = kabul - sevk;
    console.log('Güncellenen fark:', element.fark);
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
