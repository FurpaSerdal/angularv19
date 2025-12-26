import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EvrakKaydetDto, StokAraCT, UrunListesi } from '../../models/documentSave';
import { CompanyService } from '../../../services/company.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CrudService } from '../../../services/crud.service';

@Component({
  selector: 'app-company-refund',
  imports: [CommonModule, MatTableModule, FormsModule, MatIconModule],
  templateUrl: './company-refund.html',
  styleUrl: './company-refund.css',
})
export class CompanyRefund {


  
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
  
  postorder: EvrakKaydetDto = this.initializeForm();
  urunListesi = signal<UrunListesi[]>([]);
  bulunanUrunler = signal<StokAraCT[]>([]);
  secilenUrun = signal<StokAraCT | null>(null);
  dataSource = new MatTableDataSource<UrunListesi>([]);
  displayedColumns: string[] = ['UrunAdi', 'UrunKodu', 'MalKabulMiktari', 'aksiyon'];

  constructor(
    private companyservice: CompanyService,
        private crudservice:CrudService,
    
    private dialog: MatDialog,
    private toastr: ToastrService,
  ) {}

  private initializeForm(): EvrakKaydetDto {
    return {
      evrakNoSeri: null,
      evrakNoSira: null,

      depo: {
        depoNo: 109,
        depoIsmi: null,
        sofor: {
          adi: null,
          soyAdi: null,
          aracPlakasi: null,
          tcknVkn: null
        }
      },

      muhatapDepo: {
        depoNo: 0,
        depoIsmi: null,
        yetkiliadisoyadi: "",
        sofor: {
          adi: null,
          soyAdi: null,
          aracPlakasi: null,
          tcknVkn: null
        }
      },

      muhatapFirma: {
        cariKodu: null,
        tcknVkn: null,
        sofor: {
          adi: null,
          soyAdi: null,
          aracPlakasi: null,
          tcknVkn: null
        }
      },

      kalemler: [],
      aciklama: null
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


  urunAra(aranacak: string) {
    const aranacakKelime = aranacak.toLocaleLowerCase();
    
    const dto = {
      CariKod: this.postorder.muhatapFirma.cariKodu ?? '',
      Bul: aranacakKelime
    };

    this.companyservice
      .stokCariKodIleAra(dto)
      .subscribe({
        next: value => this.bulunanUrunler.set(value),
        error: err => console.error('StokAra hatası:', err)
      });
  }

  firmaAra() {
    const query = this.postorder.muhatapFirma.cariKodu ?? '';
    this.companyservice.cariAra(query).subscribe(data => {
      this.bulunancariler.set(data);
      console.log(data);
    });
  }

  firmaSec(firma: any) {
    this.postorder.muhatapFirma.cariKodu = firma.cariKod;
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

    const eklenecekUrun: UrunListesi = {
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
      stok: {
        depoNo: 109,
        barKodu: item.barkodu,
        stokKod: item.UrunKodu,
        stokIsim: item.sto_birim_ad,
        fiyati: item.fiyat,
        birimAd: '',
        birimKatsayisi: item.birimkatsayisi,
        satisDursun: 0,
        sipDursun: 0,
        malKabulDursun: 0,
        urunSorumlusu: null
      },
      siparisGuid: null,
      siparisMiktari: item.verilenSiparisMiktari,
      sevkMiktari: item.malKabulIrsaliyesiMiktari,
      malKabulMiktari: item.MalKabulMiktari,
      aciklama: null,
      SonKullanimTarihi: null
    }));

    this.postorder.kalemler = kalemler;
    console.log("POST ORDER", this.postorder);

    const toastRef = this.toastr.show('Gönderiliyor...', '', {
      disableTimeOut: true,
      progressBar: true,
      tapToDismiss: false,
      closeButton: false,
      toastClass: 'ngx-toastr info-toast'
    });

    // this.crudservice.documentSave(2, this.postorder)
    //   .subscribe({
    //     next: (res) => {
    //       this.toastr.clear(toastRef.toastId);
    //       this.toastr.success('Başarıyla kaydedildi!');
    //       this.gonderiliyor.set(false);
    //     },
    //     error: (err) => {
    //       this.toastr.clear(toastRef.toastId);
    //       this.toastr.error('Kaydedilirken hata oluştu!');
    //       console.error(err);
    //       this.gonderiliyor.set(false);
    //     }
    //   });
  }

  temizle() {
    this.urunListesi.set([]);
    this.dataSource.data = [];
    this.bulunanUrunler.set([]);
    this.bulunancariler.set([]);
    this.postorder = this.initializeForm();
    this.toastr.info('Form temizlendi', '', { timeOut: 2000 });
  }

  kapat() {
    // Dialog kapatma veya sayfadan çıkma işlemi
  }

  get formValid(): boolean {
    return !!this.postorder.muhatapFirma.cariKodu && 
           this.dataSource.data.length > 0 &&
           this.dataSource.data.every(item => (item.MalKabulMiktari ?? 0) > 0);
  }
}
