import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';


import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { WarehouseService } from '../../../../../services/warehouse.service';
import { SubeyeSevketDto } from '../../../../../models/subeyeSevkModel';
import { MeService } from '../../../../../services/meservice.service';
import { StokAraCT } from '../../../../../models/genelModel';
import { ShipmentNotesService } from '../../../../../services/shipments/shipment-notes.service';



@Component({
  selector: 'app-warehouse-send',
  standalone: true,
  imports: [CommonModule, MatTableModule, FormsModule, MatIconModule, MatDialogModule],
  templateUrl: './warehouse-send.html',
  styleUrls: ['./warehouse-send.css'],
})
export class WarehouseSend {

  karsiDepo :number=0;
  seciliAltMenu = signal<number>(0);
  iade = signal<boolean>(false);
  gorevAdi = signal<string>('');
  aramaGirdisi = signal<string>('');
  gonderiliyor = signal<boolean>(false);
  

  
  postorder: SubeyeSevketDto = {
    iadedir: false,
    muhatapDepoNo: 0,
    kalemler: []
  }
  urunListesi = signal<any[]>([]);
  bulunanUrunler = signal<StokAraCT[]>([]);
  secilenUrun = signal<StokAraCT | null>(null);
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['UrunAdi', 'UrunKodu', 'MalKabulMiktari', 'aksiyon'];

  constructor(
    private warehouseservice: WarehouseService,
    private meservice: MeService,
    private shipmentnoteservice: ShipmentNotesService,
    private dialog: MatDialog,
    private toastr: ToastrService,
  ) {
     effect(() => {
      this.seciliAltMenu.set(this.meservice.selectedAltMenu()?.id ?? 0);
    });
  }



  ngOnInit(): void {
  
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

 
    this.shipmentnoteservice.createBranchShipment(this.seciliAltMenu(),
    {
      iadedir: this.iade(), 
      muhatapDepoNo: this.karsiDepo,
         kalemler: this.urunListesi().map(k => ({
                id: k.id,
                siparisGuid: k.siparisGuid,
                siparisMiktari: Math.abs(k.sevkMalKabulFarkMiktari ?? 0),
                sevkMiktari: k.sevkMiktari,
                malKabulMiktari: k.malKabulMiktari,
                sevkMalKabulFarkMiktari: k.sevkMalKabulFarkMiktari,
                iadeyeKonuIrsaliyeGuidi: k.iadeyeKonuIrsaliyeGuidi,
                 aciklama: 'Fazla mal iade sevkiyatı',
                 barkodlar: [k.barkodu],
                 fiyat: k.fiyat,
                 birimkatsayisi: k.birimkatsayisi,
                  stok: {
                    stokKod: k.UrunKodu,
                     stokIsim: k.UrunAdi, 
                       birimAd: k.sto_birim_ad,
                  
                 }
              }))
    })
      .subscribe({
        next: (res) => {
          this.toastr.success('Başarıyla kaydedildi!');
          this.gonderiliyor.set(false);
        },
        error: (err) => {
          this.toastr.error('Kaydedilirken hata oluştu!');
          console.error(err);
          this.gonderiliyor.set(false);
        }
      });
    

    console.log("POST ORDER", this.postorder);

    const toastRef = this.toastr.show('Gönderiliyor...', '', {
      disableTimeOut: true,
      progressBar: true,
      tapToDismiss: false,
      closeButton: false,
      toastClass: 'ngx-toastr info-toast'
    });

   }

  temizle() {
    this.urunListesi.set([]);
    this.dataSource.data = [];
    this.bulunanUrunler.set([]);
    this.postorder = {
      iadedir: false,
      muhatapDepoNo: 0,
      kalemler: []
    };
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

