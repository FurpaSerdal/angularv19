import { CommonModule } from '@angular/common';
import { Component,Inject,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource,MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';
import { PaymentTypes } from '../../../../../models/eskiAngular';

@Component({
  selector: 'app-add-credit-cards',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './add-credit-cards.component.html',
  styleUrls: ['./add-credit-cards.component.css']
})
export class AddCreditCardsComponent implements OnInit {

  constructor(
    private dialogRef:MatDialogRef<AddCreditCardsComponent>,
    @Inject(MAT_DIALOG_DATA) private creditCards: PaymentTypes[],
  ) { }
  tableSourceCreditCards = new MatTableDataSource<PaymentTypes>();
  tableColumnsCreditCards = ["paymentName", "terminalId", "slipNumber", "amountValue"];
  ngOnInit() {
    this.tableSourceCreditCards = new MatTableDataSource(this.creditCards);
  }  
  getTotalAmount() {
    return this.creditCards.map(t => (t.amountValue)).reduce((acc, value) => acc + value, 0).toFixed(2);
  }
  getTotalQuantity() {
    return this.creditCards.map(t => (t.slipNumber)).reduce((acc, value) => acc + value, 0);
  }
  AddCreditCards(){
    if(this.creditCards.find(x => x.slipNumber == null || x.amountValue == null || x.slipNumber < 0 || x.amountValue < 0)){
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

    if( 
      (this.creditCards.find(x => x.slipNumber != 0 && (x.amountValue == null || x.amountValue == 0))) 
      || this.creditCards.find(x => x.amountValue != 0 && (x.slipNumber == null || x.slipNumber == 0))
      ){
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

    this.dialogRef.close(this.creditCards);
  }
  CloseDialog() {
    this.dialogRef.close();
  }
}

