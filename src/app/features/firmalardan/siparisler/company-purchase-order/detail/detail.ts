import { CommonModule } from '@angular/common';
import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { VerilenSiparislerAyrintiDto } from '../../../../../models/ayrinti-dtolari.model';

@Component({
  selector: 'app-company-purchase-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl:'./detail.html',
  styleUrls: ['./detail.css']
})
export class CompanyPurchaseOrderDetailComponent  {


  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CompanyPurchaseOrderDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VerilenSiparislerAyrintiDto,
  ) {}

  ngOnInit() {

  }

  kapat() {
    this.dialogRef.close();
  }
}