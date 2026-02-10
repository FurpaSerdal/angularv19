import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DetayResponse, SiparisDetayResponse } from '../../../../../models/detay';

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
    @Inject(MAT_DIALOG_DATA) public data: SiparisDetayResponse,
  ) {}

  ngOnInit() {
  }

  kapat() {
    this.dialogRef.close();
  }
}