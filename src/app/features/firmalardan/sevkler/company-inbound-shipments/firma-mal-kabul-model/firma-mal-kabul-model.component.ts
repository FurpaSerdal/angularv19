import { CommonModule } from '@angular/common';
import { Component,ElementRef,signal,ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource,MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { StokAraCT } from '../../../../../models/ortakModeller';
import { CompanyService } from '../../../../../services/company.service';






@Component({
  selector: 'app-firma-mal-kabul',
  imports: [CommonModule, MatTableModule, FormsModule, MatIconModule],
  templateUrl: './firma-mal-kabul-model.component.html',
  styleUrls: ['./firma-mal-kabul-model.component.css']
})
export class FirmaMalKabulModelComponent {
  @ViewChild('qrInput') qrInput!: ElementRef;
  
  bulunancariler = signal<any[]>([]);
  secilencari = signal<any>(null);
  kendiDepom = signal<number>(0);
  seciliGorev = signal<number>(0);
  gorevAdi = signal<string>('');
  aramaGirdisi = signal<string>('');
  gonderiliyor = signal<boolean>(false);
  
  // QR için yeni sinyaller
  qrIrsaliyeNo = signal<string>("");
  qrGorunurVeri = signal<string>("");
  qrParsed = signal<boolean>(false);
  qrOkunuyor = signal<boolean>(false);
  
  postorder: any = this.initializeForm();
  urunListesi = signal<any[]>([]);
  bulunanUrunler = signal<StokAraCT[]>([]);
  secilenUrun = signal<StokAraCT | null>(null);
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['UrunAdi', 'UrunKodu', 'MalKabulMiktari', 'aksiyon'];

  constructor(
    private companyservice: CompanyService,
    private toastr: ToastrService,
  ) {}

  private initializeForm(): any {
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
    const depom = localStorage.getItem('depoNo');
    const seciliGorevId = localStorage.getItem('seçiliGörevid');
    const gorevAdi = localStorage.getItem('seçiliGörevadi');
    this.seciliGorev.set(Number(seciliGorevId));
    this.kendiDepom.set(Number(depom));
    this.gorevAdi.set(gorevAdi ?? '');
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
      
      // QR'dan gelen ek bilgileri doldur
      // if (parsedData.plaka) {
      //   this.postorder.depo.sofor!.aracPlakasi = parsedData.plaka;
      // }
      
   
      
      if (parsedData.cariKod) {
        this.postorder.muhatapFirma.no = parsedData.cariKod;
        // Firma otomatik aranabilir
       // this.firmaAra();
      }
      
      if (parsedData.muhatapAdi) {
        this.postorder.muhatapFirma.isim = parsedData.muhatapAdi;
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
    this.postorder.evrakNoSeri = null;
    this.postorder.evrakNoSira = null;
    // this.postorder.depo.sofor!.adi = null;
    // this.postorder.depo.sofor!.soyAdi = null;
    // this.postorder.depo.sofor!.aracPlakasi = null;
    this.postorder.muhatapFirma.isim = '';
    this.qrParsed.set(false);
    this.qrGorunurVeri.set("");
    this.qrIrsaliyeNo.set("");
  }

  urunAra(aranacak: string) {
    const aranacakKelime = aranacak.toLocaleLowerCase();
    
    const dto = {
      CariKod: this.postorder.muhatapFirma.no ?? '',
      Bul: aranacakKelime
    };

    this.companyservice
      .searchStockByCustomerCode(dto)
      .subscribe({
        next: value => this.bulunanUrunler.set(value),
        error: err => console.error('StokAra hatası:', err)
      });
  }

  firmaAra() {
    const query = this.postorder.muhatapFirma.no ?? '';
    this.companyservice.searchCustomerAccount(query).subscribe(data => {
      this.bulunancariler.set(data);
      console.log(data);
    });
  }

  firmaSec(firma: any) {
    this.postorder.muhatapFirma.no = firma.cariKod;
    this.secilencari.set(firma.id);
    this.bulunancariler.set([]);
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

         const kalemler = this.urunListesi().map(item => ({
  aciklama: null,
    evrak: null,
    evrakId: null,

    faturaGuid: null,
    sevkGuid: null,
    siparisGuid: null,
    iadeyeKonuIrsaliyeGuidi: null,

    miktar: 0,
    sonKullanimTarihi: null,

    eFaturaEttn: null,
    eIrsaliyeEttn: null,

    stok: {
      stokKod: item.stokKod,
      stokIsim: item.stokIsim,
      birimAd: item.birimAd,
      birimKatSayisi: item.birimKatsayisi ?? 1,

      barkodlar: item.barKodu
        ? [{
            barKodu: item.barKodu,
            stokKod: item.stokKod,
            birimAd: item.birimAd,
            birimKatSayisi: item.birimKatsayisi ?? 1
          }]
        : [],

      fiyat: {
        depoNo: 0,
        fiyati: 0,
        satisDursun: 0,
        sipDursun: 0,
        malKabulDursun: 0
      }
    }
    }));

    this.postorder.kalemler = kalemler;
    console.log("POST ORDER", this.postorder);

    this.toastr.show('Gönderiliyor...', '', {
      disableTimeOut: true,
      progressBar: true,
      tapToDismiss: false,
      closeButton: false,
      toastClass: 'ngx-toastr info-toast'
    });

  //   this.crudservice.documentSave(2, this.postorder)
  //     .subscribe({
  //       next: (res) => {
  //         this.toastr.clear(toastRef.toastId);
  //         this.toastr.success('Başarıyla kaydedildi!');
  //         this.gonderiliyor.set(false);
  //       },
  //       error: (err) => {
  //         this.toastr.clear(toastRef.toastId);
  //         this.toastr.error('Kaydedilirken hata oluştu!');
  //         console.error(err);
  //         this.gonderiliyor.set(false);
  //       }
  //     });
  // }
  }
  temizle() {
    this.urunListesi.set([]);
    this.dataSource.data = [];
    this.bulunanUrunler.set([]);
    this.bulunancariler.set([]);
    this.postorder = this.initializeForm();
    this.qrSonuclariniTemizle();
    this.toastr.info('Form temizlendi', '', { timeOut: 2000 });
  }

  kapat() {
    // Dialog kapatma veya sayfadan çıkma işlemi
  }

  get formValid(): boolean {
    return !!this.postorder.muhatapFirma.no && 
           this.dataSource.data.length > 0 &&
           this.dataSource.data.every(item => (item.MalKabulMiktari ?? 0) > 0);
  }
}