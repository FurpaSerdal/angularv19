import { CommonModule } from '@angular/common';
import { Component, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EvrakKaydetDto, StokAraCT, UrunListesi } from '../../models/documentSave';
import { CompanyService } from '../../../services/company.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { warehouse } from '../../../services/warehouse.service';
import { CrudService } from '../../../services/crud.service';

@Component({
  selector: 'app-warheosue-receipt',
  imports: [CommonModule, MatTableModule, FormsModule, MatIconModule],
  templateUrl: './warheosue-receipt.html',
  styleUrl: './warheosue-receipt.css',
})
export class WarheosueReceipt {

    karsidepo: number = 0 // default seçili depo

  kendiDepom = signal<number>(0);
  seciliGorev = signal<number>(0);
  gorevAdi = signal<string>('');
  aramaGirdisi = signal<string>('');
  gonderiliyor = signal<boolean>(false);
  

  
  postorder: EvrakKaydetDto = this.initializeForm();
  urunListesi = signal<UrunListesi[]>([]);
  bulunanUrunler = signal<StokAraCT[]>([]);
  secilenUrun = signal<StokAraCT | null>(null);
  dataSource = new MatTableDataSource<UrunListesi>([]);
  displayedColumns: string[] = ['UrunAdi', 'UrunKodu', 'MalKabulMiktari', 'aksiyon'];

  constructor(
    private warehouseservice: warehouse,
    private crudservice:CrudService,
    public dialogRef: MatDialogRef<WarheosueReceipt>,
  @Inject(MAT_DIALOG_DATA) public data: any,
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
    if (this.data) {
      this.sevkdenmalkabul(this.data)
    }
  }

sevkdenmalkabul(data: any) {
  this.postorder.evrakNoSeri = data.evrakNoSeri;
  this.postorder.evrakNoSira = data.evrakNoSira;

  const veri: UrunListesi[] = data.kalemleri?.map((urun: any) => ({
    UrunAdi: urun.stokAdi,
    UrunKodu: urun.stokKodu,
    tedarikciStokKod: null,
    onerilenMiktar: null,
    verilenSiparisMiktari: urun.miktar,
    malKabulIrsaliyesiMiktari: null,
    MalKabulMiktari: null,
    barkodu: urun.barkodu,
    fiyat: 0,
    birimkatsayisi: 1,
    sto_birim_ad: urun.birim,
    aciklama: "",
    sipId: urun.sipUId,
    fark: null
  })) ?? [];

  this.urunListesi.set(veri);
  this.dataSource.data=veri
}

  urunAra(aranacak: string) {
    const aranacakKelime = aranacak.toLocaleLowerCase();
    
 ;

    this.warehouseservice
      .stokAra(aranacakKelime)
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
