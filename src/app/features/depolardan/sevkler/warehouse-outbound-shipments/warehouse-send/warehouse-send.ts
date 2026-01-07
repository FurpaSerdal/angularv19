import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';


import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EvrakEkleDto, StokAraCT } from '../../../../../models/evrakKaydet';
import { WarehouseService } from '../../../../../services/warehouse.service';



@Component({
  selector: 'app-warehouse-send',
  imports: [CommonModule, MatTableModule, FormsModule, MatIconModule],
  templateUrl: './warehouse-send.html',
  styleUrl: './warehouse-send.css',
})
export class WarehouseSend {

 karsidepo: number = 109 // default seçili depo

  kendiDepom = signal<number>(0);
  seciliGorev = signal<number>(0);
  gorevAdi = signal<string>('');
  aramaGirdisi = signal<string>('');
  gonderiliyor = signal<boolean>(false);
  

  
  postorder: EvrakEkleDto = this.initializeForm();
  urunListesi = signal<any[]>([]);
  bulunanUrunler = signal<StokAraCT[]>([]);
  secilenUrun = signal<StokAraCT | null>(null);
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['UrunAdi', 'UrunKodu', 'MalKabulMiktari', 'aksiyon'];

  constructor(
    private warehouseservice: WarehouseService,
    
    private dialog: MatDialog,
    private toastr: ToastrService,
  ) {}

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
    const depom = localStorage.getItem('depoNo');
    const seciliGorevId = localStorage.getItem('seçiliGörevid');
    const gorevAdi = localStorage.getItem('seçiliGörevadi');
    this.seciliGorev.set(Number(seciliGorevId));
    this.kendiDepom.set(Number(depom));
    this.gorevAdi.set(gorevAdi ?? '');
  }


  urunAra(aranacak: string) {
    const aranacakKelime = aranacak.toLocaleLowerCase();
    
 ;

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
    this.postorder.muhatapDepo.no = this.karsidepo;
    console.log("POST ORDER", this.postorder);

    const toastRef = this.toastr.show('Gönderiliyor...', '', {
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
   }

  temizle() {
    this.urunListesi.set([]);
    this.dataSource.data = [];
    this.bulunanUrunler.set([]);
    this.postorder = this.initializeForm();
    this.toastr.info('Form temizlendi', '', { timeOut: 2000 });
  }

  kapat() {
    // Dialog kapatma veya sayfadan çıkma işlemi
  }

  get formValid(): boolean {
    return this.dataSource.data.length > 0 &&
           this.dataSource.data.every(item => (item.MalKabulMiktari ?? 0) > 0);
  }
}

