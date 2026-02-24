import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AlinanDepoSiparisleriAyrintiDto } from '../../../../../models/ayrinti-dtolari.model';

@Component({
  selector: 'app-warehouse-sale-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail.html',
  styleUrls: ['./detail.css']
})
export class WarehouseSaleOrderDetailComponent {
  

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<WarehouseSaleOrderDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlinanDepoSiparisleriAyrintiDto,
  ) {}

  ngOnInit() {
  }

    getStatusText(e: AlinanDepoSiparisleriAyrintiDto): string {
      if (e.durumu=== '1') {
        return 'siparişi verildi/alındı';
      }
      else if (e.durumu === '2') {
        return 'Sevk Hazır / irsaliye bekleniyor';}
      else if (e.durumu === '3') {
        return 'Yolda';}
      else if (e.durumu === '4') {
        return 'Mal Kabulu Yapıldı';
      }
      else {
        return 'Bilinmeyen Durum';
      }
    }
  

  kapat() {
    this.dialogRef.close();
  }
}