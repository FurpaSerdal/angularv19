import { CommonModule } from '@angular/common';
import { Component, effect, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { WarehouseService } from '../../../../../services/warehouse.service';
import { SubeyeSevketDto } from '../../../../../models/subeyeSevkModel';
import { ShipmentNotesService } from '../../../../../services/shipments/shipment-notes.service';
import { MeService } from '../../../../../services/meservice.service';
import Swal from 'sweetalert2';
import { StokAraCT } from '../../../../../models/ortakModeller';


@Component({
  selector: 'app-company-purchase-order-to-shipment',
  imports: [CommonModule, MatTableModule, FormsModule, MatIconModule],
  templateUrl: './company-purchase-order-to-shipment.html',
  styleUrls: ['./company-purchase-order-to-shipment.css'],
})
export class companyPurchaseOrderToShipment {
  urunAraMetni: string = '';
  kendiDepom = signal<number>(0);
  karsiDepo = signal<any>(null);
  seciliAltMenu = signal<number>(0);
  gonderiliyor = signal<boolean>(false);
  
  postorder: SubeyeSevketDto = this.initializeForm();
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['UrunAdi', 'UrunKodu', 'MalKabulMiktari', 'aksiyon'];

  constructor(
    private meservice: MeService,
    private shipmentnoteservice: ShipmentNotesService,
    private warehouseService: WarehouseService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<companyPurchaseOrderToShipment>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  ) 
  {
    effect(() => {
      this.seciliAltMenu.set(this.meservice.selectedAltMenu()?.id ?? 0);
    });

  }


  private initializeForm(): SubeyeSevketDto {
    return {
      iadedir: false,
      muhatapDepoNo: 0,
      kalemler: []
    };
  }

  ngOnInit(): void {
    console.log('Gelen Data:', this.data);
this.dataSource.data = this.data.siparis.kalemler || [];
console.log('DataSource:', this.dataSource.data);
this.karsiDepo.set(this.data.siparis.muhatapDepo);
  }
  urunEkle() {
    const aranacak = this.urunAraMetni.trim();
    if (!aranacak) {
      this.toastr.warning('Lütfen bir ürün kodu veya adı girin.', '', { timeOut: 2000 });
      return;
    }
    this.warehouseService.searchStock(aranacak).subscribe({
      next: (stoklar: StokAraCT[]) => {
        if (stoklar.length === 0) {
          this.toastr.info('Aranan kriterlere uygun ürün bulunamadı.', '', { timeOut: 2000 });
          return;
        }
        const secilenStok = stoklar[0];
        const mevcutUrun = this.dataSource.data.find(item => item.UrunKodu === secilenStok.stokKod);
        if (mevcutUrun) {
         this.dataSource.data = this.dataSource.data.map(item => {
            if (item.UrunKodu === secilenStok.stokKod) {
              return {
                ...item,
                MalKabulMiktari: (item.MalKabulMiktari || 0) + (secilenStok.birimKatsayisi || 1)
              };
            }
            return item;
          });
          this.toastr.info('Ürün zaten listede mevcut, miktarı güncellendi.', '', { timeOut: 2000 });

          return;
        }
        const yeniUrun = {
          UrunKodu: secilenStok.stokKod,
          UrunAdi: secilenStok.stokIsim,
          MalKabulMiktari: secilenStok.birimKatsayisi || 1
        };
        this.dataSource.data = [...this.dataSource.data, yeniUrun];
        this.toastr.success('Ürün başarıyla eklendi.', '', { timeOut: 2000 });
      },
      error: (err) => {
        this.toastr.error('Ürün aranırken bir hata oluştu.', '', { timeOut: 2000 });
        console.error(err);
      }
    });
    this.urunAraMetni = '';
  }
 urunCikar(urun: any) {
  Swal.fire({
    title: 'Emin misiniz?',
    text: 'Bu ürünü listeden çıkarmak üzeresiniz',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Evet, sil',
    cancelButtonText: 'Vazgeç',
    confirmButtonColor: '#198754',
    cancelButtonColor: '#dc3545',
    allowOutsideClick: false,
    allowEscapeKey: false
  }).then((result) => {
    if (result.isConfirmed) {
      console.log('Silinen Ürün:', urun);
      this.dataSource.data = this.dataSource.data
        .filter(item => item.stok.stokKod !== urun.stok.stokKod);

      Swal.fire({
        icon: 'success',
        title: 'Silindi',
        text: 'Ürün listeden çıkarıldı',
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
}

  kaydet() {
    this.gonderiliyor.set(true);
    this.postorder.muhatapDepoNo = this.karsiDepo().no;
    this.postorder.kalemler = this.dataSource.data;

    const toastRef = this.toastr.show('Gönderiliyor...', '', {
      disableTimeOut: true,
      progressBar: true,
      tapToDismiss: false,
      closeButton: false,
      toastClass: 'ngx-toastr info-toast'
    });

    this.shipmentnoteservice.createBranchShipment(this.seciliAltMenu(), this.postorder)
      .subscribe({
        next: (res) => {
          this.toastr.clear(toastRef.toastId);
          this.toastr.success('Başarıyla kaydedildi!');
          this.gonderiliyor.set(false);
        },
        error: (err) => {
          this.toastr.clear(toastRef.toastId);
          this.toastr.error('Kaydedilirken hata oluştu!');
          console.error(err);
          this.gonderiliyor.set(false);
        }
      });
  }

  temizle() {
    this.dataSource.data = [];
    this.postorder = this.initializeForm();
    this.toastr.info('Form temizlendi', '', { timeOut: 2000 });
  }

  kapat() {
    this.dialogRef.close();
  }

}
