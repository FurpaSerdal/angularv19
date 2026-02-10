import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PaymentTypes } from '../../../../../models/eskiAngular';

@Component({
  selector: 'app-add-food-checks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './add-food-checks.component.html',
  styleUrls: ['./add-food-checks.component.css']
})
export class AddFoodChecksComponent implements OnInit {

  constructor(
    private dialogRef:MatDialogRef<AddFoodChecksComponent>,
    @Inject(MAT_DIALOG_DATA) private foodChecks: PaymentTypes[]
    ) { }
    tableSourceFoodChecks = new MatTableDataSource<PaymentTypes>();
    tableColumnsFoodChecks = ["paymentName", "slipNumber", "amountValue"];
  ngOnInit() {
    this.tableSourceFoodChecks = new MatTableDataSource(this.foodChecks);
  }
  getTotalAmount() {
    return this.foodChecks.map(t => t.amountValue).reduce((acc, value) => acc + value, 0).toFixed(2);
  }
  getTotalQuantity() {
    return this.foodChecks.map(t => t.slipNumber).reduce((acc, value) => acc + value, 0);
  }
  AddFoodChecks(){
    if(this.foodChecks.find(x => x.slipNumber == null || x.amountValue == null || x.slipNumber < 0 || x.amountValue < 0)){
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
    if((this.foodChecks.find(x => x.slipNumber != 0 && (x.amountValue == null || x.amountValue == 0))) 
      || this.foodChecks.find(x => x.amountValue != 0 && (x.slipNumber == null || x.slipNumber == 0))){
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
    this.dialogRef.close(this.foodChecks);
  }

  CloseDialog() {
    this.dialogRef.close();
  }
}
