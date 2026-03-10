import { CommonModule } from '@angular/common';
import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { DepolardanMalKabulIrsaliyeleriAyrintiDto } from '../../../../../models/ayrinti-dtolari.model';

@Component({
  selector: 'app-warehouse-inbound-shipments-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail.html',
  styleUrls: ['./detail.css']
})
export class WarehouseInboundShipmentsDetailComponent {
  
  constructor(
    public dialogRef: MatDialogRef<WarehouseInboundShipmentsDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DepolardanMalKabulIrsaliyeleriAyrintiDto,
  ) {}

  ngOnInit() {
    
  }
  kapat() {
    this.dialogRef.close();
  }

  getStatusText(evrak: DepolardanMalKabulIrsaliyeleriAyrintiDto): string {
    if (evrak.durumu === '1') {
          return "Sipariş Hazır";
        } else if (evrak.durumu === '2') {
          return 'Sevk Hazır';
        }
          else if (evrak.durumu === '3') {
            return 'Yolda';
          }
            else if (evrak.durumu === '4') {
              return 'Mal Kabulü Yapıldı';
            }
        return 'Bilinmeyen Durum';
    }


  getStatusClass(evrak: DepolardanMalKabulIrsaliyeleriAyrintiDto): string {
    if (evrak.durumu === '1') {
          return "bg-warning bg-opacity-10 text-warning";
  } else if (evrak.durumu === '2') {
        return "bg-info bg-opacity-10 text-info";
  } else if (evrak.durumu === '3') {
        return "bg-primary bg-opacity-10 text-primary";
  } else if (evrak.durumu === '4') {
        return "bg-success bg-opacity-10 text-success";   
       
  }
    return 'bg-secondary bg-opacity-10 text-secondary';


  }
  
}
