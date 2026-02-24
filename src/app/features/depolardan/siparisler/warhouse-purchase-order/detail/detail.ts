import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { VerilenDepoSiparisleriAyrintiDto } from '../../../../../models/ayrinti-dtolari.model';

@Component({
  selector: 'app-warehouse-purchase-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail.html',
  styleUrls: ['./detail.css']
})
export class WarehousePurchaseOrderDetailComponent {

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<WarehousePurchaseOrderDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VerilenDepoSiparisleriAyrintiDto,
  ) {}

  ngOnInit() {
  }

    getStatusText(e: VerilenDepoSiparisleriAyrintiDto): string {
       if (e.durumu=== '1') {
         return 'Sevke Hazırlanıyor';
       }
       else if (e.durumu === '2') {
         return 'Sevk Hazır';}
       else if (e.durumu === '3') {
         return 'Yolda';}
       else if (e.durumu === '4') {
         return 'Mal Kabulü Yapıldı';
       }
       else {
         return 'Bilinmeyen Durum';
       }
     }

  kapat() {
    this.dialogRef.close();
  }
}