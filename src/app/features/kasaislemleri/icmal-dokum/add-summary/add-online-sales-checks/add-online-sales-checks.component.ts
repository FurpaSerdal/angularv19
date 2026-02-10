import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { PaymentTypes } from '../../../../../models/eskiAngular';

@Component({
  selector: 'app-add-online-sales-checks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './add-online-sales-checks.component.html',
  styleUrls: ['./add-online-sales-checks.component.css']
})
export class AddOnlineSalesChecksComponent implements OnInit {

  constructor(
    private dialogRef:MatDialogRef<AddOnlineSalesChecksComponent>,
    @Inject(MAT_DIALOG_DATA) private onlineSalesChecks: PaymentTypes[]
    ) { }
    tableSourceOnlineSalesChecks = new MatTableDataSource<PaymentTypes>();
    tableColumnsOnlineSalesChecks = ["paymentName", "slipNumber", "amountValue"];
  ngOnInit() {
    this.tableSourceOnlineSalesChecks= new MatTableDataSource(this.onlineSalesChecks);
  }
  getTotalAmount() {
    return this.onlineSalesChecks.map(t => t.amountValue).reduce((acc, value) => acc + value, 0).toFixed(2);
  }
  getTotalQuantity() {
    return this.onlineSalesChecks.map(t => t.slipNumber).reduce((acc, value) => acc + value, 0);
  }
  AddOnlineSalesChecks(){
    if(this.onlineSalesChecks.find(x => x.slipNumber == null || x.amountValue == null || x.slipNumber < 0 || x.amountValue < 0)){
      Swal.fire({
        title:"Slip Sayıları ve Tutarlar\nBoş ve Negatif Olamaz.\nAncak 0 veya Üstü Olabilir.",
        icon:"error",
        position:"center",
        confirmButtonText:"Tamam",
        showConfirmButton:true,
        focusConfirm:true,
        allowEnterKey:false,
        allowOutsideClick:false,
        heightAuto:true,
      });
      return;
    }
    if((this.onlineSalesChecks.find(x => x.slipNumber != 0 && (x.amountValue == null || x.amountValue == 0))) 
      || this.onlineSalesChecks.find(x => x.amountValue != 0 && (x.slipNumber == null || x.slipNumber == 0))){
      Swal.fire({
        title:"Lütfen Slip Sayılarını ve Tutarları\nDoğru Şekilde Giriniz.",
        icon:"error",
        position:"center",
        confirmButtonText:"Tamam",
        showConfirmButton:true,
        focusConfirm:true,
        allowEnterKey:false,
        allowOutsideClick:false,
        heightAuto:true,
      });
      return;
    }
    this.dialogRef.close(this.onlineSalesChecks);
  }

  CloseDialog() {
    this.dialogRef.close();
  }
}
