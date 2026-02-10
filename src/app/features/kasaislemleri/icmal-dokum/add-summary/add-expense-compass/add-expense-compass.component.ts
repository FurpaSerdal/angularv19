import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  selector: 'app-add-expense-compass',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './add-expense-compass.component.html',
  styleUrls: ['./add-expense-compass.component.css']
})
export class AddExpenseCompassComponent implements OnInit {
  value = 'Temizle';
  constructor(
    private dialogRef:MatDialogRef<AddExpenseCompassComponent>,
    @Inject(MAT_DIALOG_DATA) private expenseCompasses: PaymentTypes[],
  ) { }
  tableSourceExpenseCompass = new MatTableDataSource<PaymentTypes>();
  tableColumnsExpenseCompass = ["paymentName", "slipNumber", "amountValue"];
  ngOnInit() {
    this.tableSourceExpenseCompass= new MatTableDataSource(this.expenseCompasses);
  }
  AddExpenseCompass(){
    if(this.expenseCompasses.find(x => x.slipNumber == null || x.amountValue == null || x.slipNumber < 0 || x.amountValue < 0)){
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
    if((this.expenseCompasses.find(x => x.slipNumber != 0 && (x.amountValue == null || x.amountValue == 0))) 
      || this.expenseCompasses.find(x => x.amountValue != 0 && (x.slipNumber == null || x.slipNumber == 0))){
      Swal.fire({
        title:"Lütfen Gider Fiş Sayılarını\nve Tutarları Doğru Şekilde Giriniz.",
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
    this.dialogRef.close(this.expenseCompasses);
  }
  CloseDialog() {
    this.dialogRef.close();
  }
}
