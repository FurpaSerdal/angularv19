import { CommonModule } from '@angular/common';
import { Component, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EvrakEkleDto, StokAraCT } from '../../../../../models/evrakKaydet';
import { CompanyService } from '../../../../../services/company.service';
import { FirmayaSevketDto } from '../../../../../models/firmayaSevkModel';
import { Kalem } from '../../../../../models/ortakModeller';

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
  

  
  postorder: FirmayaSevketDto = this.initializeForm();
  urunListesi = signal<any[]>([]);
  bulunanUrunler = signal<StokAraCT[]>([]);
  secilenUrun = signal<StokAraCT | null>(null);
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['UrunAdi', 'UrunKodu', 'MalKabulMiktari', 'aksiyon'];

  constructor(
    private companyservice: CompanyService,
    
    private dialog: MatDialog,
    private toastr: ToastrService,
   public dialogRef: MatDialogRef<CompanyRefund>,
     
  ) {}

private initializeForm(): FirmayaSevketDto {
    return {
      iadedir: true,
      muhattapfirmaNo: "",
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
    
    const dto = {
      CariKod: this.postorder.muhattapfirmaNo ?? '',
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
    const query = this.postorder.muhattapfirmaNo ?? '';
    this.companyservice.searchCustomerAccount(query).subscribe(data => {
      this.bulunancariler.set(data);
      console.log(data);
    });
  }

firmaSec(firma: any) {

  this.postorder.muhattapfirmaNo = firma.cariKod;

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
      SevkMMiktari: 1,
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

const kalemler: Kalem[] = this.urunListesi().map(urun => {
  console.log('ÜRÜN', urun);

  return {
    id: crypto.randomUUID(),

    aciklama: urun.aciklama || '',

    sevkMiktari: urun.SevkMMiktari ?? 0,
   
    siparisGuid: urun.sipId || undefined,

    stok: {
      stokKod: urun.UrunKodu,
      stokIsim: urun.UrunAdi,
      birimAd: urun.sto_birim_ad,

      tedarikciStokKod: urun.tedarikciStokKod || undefined,

      barkodlar: urun.barkodu
        ? [
            {
              barKodu: urun.barkodu,
              stokKod: urun.UrunKodu,
              birimAd: urun.sto_birim_ad,
              birimKatSayisi: urun.birimkatsayisi ?? 1
            }
          ]
        : [],


    }
  };
});


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
this.dialogRef.close();
  }


}
