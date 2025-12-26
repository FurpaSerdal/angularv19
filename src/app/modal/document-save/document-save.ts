// document-save.component.ts
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CariHesapAraCT, StokAraCT, StokBulDto } from '../../models/documentSave';
import { CompanyService } from '../../../services/company.service';
import { warehouse } from '../../../services/warehouse.service';
import { ToastrService } from 'ngx-toastr';
import { EvrakEkleDto, Kalem } from '../../models/evrak_ekle';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CrudService } from '../../../services/crud.service';
import { Evrak, UrunList } from '../../models/evrakDetay';
import { RefundConfirmDialogComponent } from '../refund-confirm-dialog/refund-confirm-dialog';
import { UserService } from '../../../services/data.service';

@Component({
  selector: 'app-document-save',
  imports: [CommonModule, FormsModule],
  templateUrl: './document-save.html',
  styleUrl: './document-save.css',
})
export class DocumentSave {
  @ViewChild('qrInput') qrInput!: ElementRef;

  // Form verileri
  postorder: EvrakEkleDto = this.initializeForm();

  // Arama değişkenleri
  searchInput: string = '';
  arananUrun: string = '';
  bulunanFirmalar: CariHesapAraCT[] = [];
  bulunanUrunler: StokAraCT[] = [];
  karsidepo: { depoNo: number; depoAdi: string } | null = null;

  urunlist: UrunList[] = [];

  // QR için yeni sinyaller
  qrIrsaliyeNo = signal<string>("");
  qrGorunurVeri = signal<string>("");
  qrParsed = signal<boolean>(false);
  qrOkunuyor = signal<boolean>(false);

  // Tablo verileri
  displayedColumns: string[] = ['UrunAdi', 'UrunKodu', 'MalKabulMiktari', 'aksiyon'];
  altmenuid: number = 0
  gorevid: number = 0



  // Seçim durumları
  seciliFirma: CariHesapAraCT | null = null;
  seciliUrun: StokAraCT | null = null;

  constructor(
    private companyService: CompanyService,
    private warehouseService: warehouse,
    private crudService: CrudService,
    public meService : UserService,
    private toastr: ToastrService,
    private dialog: MatDialog, // 👈 EKLENDİ

    public dialogRef: MatDialogRef<DocumentSave>,
    @Inject(MAT_DIALOG_DATA) public data: Evrak
  ) { }

  private initializeForm(): EvrakEkleDto {
    return {
      kareKod: null,
      kareKodIrsaliyenindir: null,
      evrakNoSeri: null,
      evrakNoSira: null,
      teslimTarihi: null,
      belgeNo: "",
      iadedir: null,
      teslimAlan: null,
      teslimEden: null,
      muhatabiFirmadir: null,
      sfdsEvrakidir:null,

      depo: {
        no: null,
        isim: ""
      },

      muhatapDepo: {
        no: null,
        isim: "",
      },

      muhatapFirma: {
        no: "",
        isim: "",
        adresi: ""
      },

      aciklama: null,
      kalemler: []
    };
  }
  ngOnInit(): void {


    this.altmenuid=  this.meService.selectedAltMenu()?.id ?? 0
    this.gorevid =    this.meService.selectedGorev()?.id ?? 0



    this.urunlist = this.data?.kalemler?.map(x => ({
      id:  this.generateUUID(),
      stok: x.stok,
      siparisGuid: x.siparisGuid,
      sevkGuid: x.sevkGuid,
      faturaGuid: x.faturaGuid,
      eIrsaliyeEttn: x.eIrsaliyeEttn,
      eFaturaEttn: x.eFaturaEttn,
      iadeyeKonuIrsaliyeGuidi: x.iadeyeKonuIrsaliyeGuidi,
      siparisMiktari: x.siparisMiktari,
      onerilenSiparisMiktari: x.onerilenSiparisMiktari,
      sevkMiktari: x.sevkMiktari,
      malKabulMiktari: x.malKabulMiktari,
      sevkMalKabulFarkMiktari: x.sevkMalKabulFarkMiktari,
      miktar: 0,
      aciklama: x.aciklama,
      sonKullanimTarihi: x.sonKullanimTarihi,
      evrakId: x.evrakId,
      evrak: x.evrak
    })) ?? []; // 👈 BURASI KRİTİK

    if (this.data) {
      this.postorder.depo = this.data.depo;
      this.postorder.muhatapDepo = this.data.muhatapDepo;
      this.postorder.evrakNoSeri = this.data.evrakNoSeri;
      this.postorder.evrakNoSira = this.data.evrakNoSira;

    }
  }

  // === FIRMA OPERASYONLARI ===
  firmaAra(): void {
    const query = this.searchInput.trim();

    if (!query) {
      this.bulunanFirmalar = [];
      this.seciliFirma = null;
      return;
    }

    if (query.length < 2) {
      this.bulunanFirmalar = [];
      return;
    }

    this.companyService.cariAra(query).subscribe({
      next: (res) => {
        this.bulunanFirmalar = res;
        console.log('Bulunan firmalar:', this.bulunanFirmalar);
      },
      error: (err) => {
        console.error('Cari arama hatası', err);
        this.bulunanFirmalar = [];
      }
    });
  }

  firmaSec(firma: CariHesapAraCT): void {
    this.seciliFirma = firma;

    if (this.postorder.muhatapFirma) {
      this.postorder.muhatapFirma.no = firma.cariKod;
    }

    this.searchInput = `${firma.cariKod} - ${firma.cariUnvan}`;
    this.bulunanFirmalar = [];
  }

  deposec() {
    if (this.karsidepo) {
      // muhatapDepo yoksa oluştur
      this.postorder.muhatapDepo ??= { isim: "", no: 0 };
      this.postorder.depo ??= { isim: this.meService.userSignal()?.depoIsmi??"", no: Number(this.meService.userSignal()?.depoNo) ?? 0 };

      // değerleri ata
      this.postorder.muhatapDepo.isim = this.karsidepo.depoAdi ?? "";
      this.postorder.muhatapDepo.no = this.karsidepo.depoNo ?? 0;
    }

    console.log(this.karsidepo, this.postorder.muhatapDepo);
  }

  // === ÜRÜN OPERASYONLARI ===
  urunAra(): void {
    const query = this.arananUrun.trim();

    if (!query) {
      this.bulunanUrunler = [];
      return;
    }

    if (query.length < 2) {
      this.bulunanUrunler = [];
      return;
    }

    if (query && !this.postorder.muhatapFirma?.no) {
      this.warehouseService.stokAra(query).subscribe({
        next: (urunler) => {
          this.bulunanUrunler = urunler;
        },
        error: (err) => {
          console.error('Ürün arama hatası', err);
          this.bulunanUrunler = [];
        }
      })
    } else {
      const dto: StokBulDto = {
        CariKod: this.postorder.muhatapFirma?.no ?? "",
        Bul: query
      };

      this.companyService.stokCariKodIleAra(dto).subscribe({
        next: (urunler) => {
          this.bulunanUrunler = urunler;
        },
        error: (err) => {
          console.error('Ürün arama hatası', err);
          this.bulunanUrunler = [];
        }
      });
    }
  }

  urunSec(urun: StokAraCT): void {
    this.seciliUrun = urun;
const item = this.urunlist.find(
  x => x.stok.stokKod === urun.stokKod
);

if (item) {
item.miktar = (item.miktar ?? 0) + (this.seciliUrun?.birimKatsayisi ?? 0);
    this.arananUrun = '';
    this.bulunanUrunler = [];
return
}


    const yeniKalem: UrunList = {
      id: this.generateUUID(),

      stok: {
        stokKod: urun.stokKod,
        stokIsim: urun.stokIsim ?? "",
        birimAd: urun.birimAd ?? "",
        birimKatSayisi: urun.birimKatsayisi ?? 1,
        barkodlar: [
          {
            barKodu: urun.barKodu,
            stokKod: urun.stokKod,
            birimAd: urun.birimAd ?? "",
            birimKatSayisi: urun.birimKatsayisi ?? 1
          }
        ],
        fiyat: {
          depoNo: urun.depoNo,
          fiyati: urun.fiyati ?? null,
          satisDursun: urun.satisDursun ?? null,
          sipDursun: urun.sipDursun ?? null,
          malKabulDursun: urun.malKabulDursun ?? null
        }
      },
      

      siparisGuid: null as any, // backend sonra verecekse

      sevkGuid: null,
      faturaGuid: null,
      eIrsaliyeEttn: null,
      eFaturaEttn: null,
      iadeyeKonuIrsaliyeGuidi: null,

      // 👇 ZORUNLU SAYISAL ALANLAR
      siparisMiktari: null,
      onerilenSiparisMiktari: null,
      sevkMiktari: null,
      malKabulMiktari: null,
      sevkMalKabulFarkMiktari: null,

      // 👇 UI'da kullanılan miktar
      miktar: this.seciliUrun.birimKatsayisi,

      aciklama: null,
      sonKullanimTarihi: null,
      evrakId: null,
      evrak: null
    };

    this.urunlist = [...(this.urunlist ?? []), yeniKalem];

    this.arananUrun = '';
    this.bulunanUrunler = [];
  }

private generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

  hesaplaFark(kalem: UrunList): void {
    const sevk = Number(kalem.sevkMiktari ?? 0);
    if (sevk==0) 
    {
      return
    }
    const miktar = Number(kalem.miktar ?? 0);
    kalem.sevkMalKabulFarkMiktari = (sevk - miktar)
  }

  kalemSil(index: number): void {
    this.urunlist.splice(index, 1);
  }
  trackByKalemIndex(index: number, _item: Kalem): number {
    return index;
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
      this.postorder.evrakNoSeri = parsedData.seri;
      this.postorder.evrakNoSira = Number(parsedData.sira);

      if (parsedData.cariKod) {
        if (this.postorder.muhatapFirma) {
          this.postorder.muhatapFirma.no = parsedData.cariKod;
        }
      }

      if (parsedData.muhatapAdi) {
        if (this.postorder.muhatapFirma) {
          this.postorder.muhatapFirma.isim = parsedData.muhatapAdi;
        }
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

saveDocument() {

/* -----------------------------
   * 1️⃣ NORMAL EVRAK KALEMLERİ
   * ----------------------------- */
  const normalKalemler: Kalem[] = this.urunlist.map(x => ({
    aciklama: x.aciklama,
    evrak: x.evrak,
    evrakId: x.evrakId,

    faturaGuid: x.faturaGuid,
    sevkGuid: x.sevkGuid,
    siparisGuid: x.siparisGuid,

    iadeyeKonuIrsaliyeGuidi: x.iadeyeKonuIrsaliyeGuidi,

    miktar: x.miktar,

    sonKullanimTarihi: x.sonKullanimTarihi,
    eFaturaEttn: x.eFaturaEttn,
    eIrsaliyeEttn: x.eIrsaliyeEttn,

    stok: x.stok
  }));

    // 👉 MAL KABULDE FAZLA MAL VAR MI?
const fazlaMalVarMi = this.urunlist.some(
  x => (x.sevkMalKabulFarkMiktari ?? 0) > 0
);


// 👉 NORMAL EVRAK PAYLOAD 
const savePayload: EvrakEkleDto = {
  ...this.postorder,
  iadedir: false,

  kalemler: normalKalemler
};


  // 👉 FAZLA MAL VARSA FLAGI EKLE

  if (fazlaMalVarMi || this.data?.sfdsEvrakidir) {
    savePayload.sfdsEvrakidir = true;
  }


  /* -----------------------------
   * 2️⃣ NORMAL EVRAK KAYDET
   * ----------------------------- */
  this.crudService
    .documentSave(this.altmenuid, this.data.goreve ?? this.gorevid, savePayload)
    .subscribe({
      next: () => {
        this.toastr.success('Evrak kaydedildi', 'OK');

        /* -----------------------------
         * 3️⃣ İADE KALEMLERİ (FARK > 0)  iadeden sev edıyoruz gercekde gonderılmıycek 
         * ----------------------------- */


        const iadeKalemleri: Kalem[] = this.urunlist
       .filter(x =>
  x.sevkMalKabulFarkMiktari != null &&
  x.sevkMalKabulFarkMiktari > 0
)
          .map(x => ({
            aciklama: x.aciklama,
            evrak: x.evrak,
            evrakId: x.evrakId,

            faturaGuid: x.faturaGuid,
            sevkGuid: x.sevkGuid,
            siparisGuid: x.siparisGuid,

            iadeyeKonuIrsaliyeGuidi: x.sevkGuid,

            miktar: Math.abs(x.sevkMalKabulFarkMiktari as number),

            sonKullanimTarihi: x.sonKullanimTarihi,
            eFaturaEttn: x.eFaturaEttn,
            eIrsaliyeEttn: x.eIrsaliyeEttn,

            stok: x.stok
          }));


        // 👉 İADE YOKSA BİTİR
        if (iadeKalemleri.length === 0) {
          return;
        }

        // 👉 İADE KİMLİKLERİ YOKSA BİTİR
        if (!this.data?.iadeEvrakKimlik || !this.data?.farkGorevKimlik) {
          return;
        }

        /* -----------------------------
         * 4️⃣ KULLANICI ONAY DIALOG
         * ----------------------------- */
        const dialogRef = this.dialog.open(
          RefundConfirmDialogComponent,
          {
            width: '600px',
            disableClose: true,
            data: {
              kalemler: iadeKalemleri
            }
          }
        );

        dialogRef.afterClosed().subscribe(onaylandi => {

          // ❌ Kullanıcı vazgeçti
          if (!onaylandi) {
            this.toastr.info('İade iptal edildi', 'Bilgi');
            return;
          }

          /* -----------------------------
           * 5️⃣ İADE PAYLOAD
           * ----------------------------- */
          const refundPayload: EvrakEkleDto = {
            ...this.postorder,
            iadedir: true,
            kalemler: iadeKalemleri
          };

          this.toastr.info('İade oluşturuluyor...', 'İade');

          /* -----------------------------
           * 6️⃣ İADEYİ GÖNDER
           * ----------------------------- */
          this.crudService
            .documentSave(
            this.data.iadeGorevKimlik ?? 0,
            this.data.iadeEvrakKimlik ?? 0,
              refundPayload
            )
            .subscribe({
              next: () => {
                this.toastr.success(
                  'İade başarıyla yapıldı',
                  'Başarılı'
                );
              },
              error: (err) => {
                console.error(err);
                this.toastr.error(
                  'İade sırasında hata oluştu',
                  'Hata'
                );
              }
            });
        });
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Evrak kaydedilemedi', 'Hata');
      }
    });
}

}   