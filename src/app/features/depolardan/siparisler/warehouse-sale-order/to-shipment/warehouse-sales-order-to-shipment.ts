import { CommonModule } from '@angular/common';
import { Component, effect, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { WarehouseService } from '../../../../../services/warehouse.service';
import { SubeyeSevketDto } from '../../../../../models/subeyeSevkModel';
import { StokAraCT } from '../../../../../models/genelModel';
import { ShipmentNotesService } from '../../../../../services/shipments/shipment-notes.service';
import { MeService } from '../../../../../services/meservice.service';


@Component({
  selector: 'app-warheosue-receipt',
  imports: [CommonModule, MatTableModule, FormsModule, MatIconModule],
  templateUrl: './warehouse-sales-order-to-shipment.html',
  styleUrl: './warehouse-sales-order-to-shipment.css',
})
export class warehouseSalesOrderToShipment {

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
    public dialogRef: MatDialogRef<warehouseSalesOrderToShipment>,
  @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
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
this.dataSource.data = this.data.siparis.kalemler || [];
this.karsiDepo.set(this.data.siparis.muhatapDepo);
  }


  kaydet() {
    this.gonderiliyor.set(true);
    this.postorder.muhatapDepoNo = this.karsiDepo().no;
    this.postorder.kalemler = this.dataSource.data;

 
  
    console.log("POST ORDER", this.postorder);

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

  get formValid(): boolean {
    return this.dataSource.data.length > 0 &&
           this.dataSource.data.every(item => (item.MalKabulMiktari ?? 0) > 0);
  }
}
