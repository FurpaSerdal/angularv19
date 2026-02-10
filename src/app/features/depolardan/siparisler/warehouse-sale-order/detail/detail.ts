import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DetayResponse, SiparisDetayResponse } from '../../../../../models/detay';

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
    @Inject(MAT_DIALOG_DATA) public data: SiparisDetayResponse,
  ) {}

  ngOnInit() {
  console.log(this.data);
  }

  kapat() {
    this.dialogRef.close();
  }
}