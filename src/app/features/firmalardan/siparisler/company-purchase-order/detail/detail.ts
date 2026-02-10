import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DetayResponse } from '../../../../../models/detay';

@Component({
  selector: 'app-company-purchase-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail.html',
  styleUrls: ['./detail.css']
})
export class CompanyPurchaseOrderDetailComponent  {


  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CompanyPurchaseOrderDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DetayResponse,
  ) {}

  ngOnInit() {
    console.log('Gelen veri:', this.data);
    console.log('Gelen veri evrak:', this.data.evrak);
  }

  kapat() {
    this.dialogRef.close();
  }
}