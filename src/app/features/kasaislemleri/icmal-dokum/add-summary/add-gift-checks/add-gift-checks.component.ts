import { CommonModule } from '@angular/common';
import { Component,Inject,OnInit } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource,MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';
import { GiftCheckMovements } from '../../../../../models/eskiAngular';

@Component({
  selector: 'app-add-gift-checks',
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
  templateUrl: './add-gift-checks.component.html',
  styleUrls: ['./add-gift-checks.component.css']
})
export class AddGiftChecksComponent implements OnInit {

  constructor(
    private dialogRef:MatDialogRef<AddGiftChecksComponent>,
    @Inject(MAT_DIALOG_DATA) private giftCheckMovements: GiftCheckMovements[],
  ) { }

  tableSourceGiftChecks = new MatTableDataSource<GiftCheckMovements>();
  tableColumnsGiftChecks = ["value", "quantity", "total"];
  ngOnInit() {
    this.tableSourceGiftChecks = new MatTableDataSource(this.giftCheckMovements);
  }
  getTotalAmount() {
    return this.giftCheckMovements.map(t => t.quantity * t.value).reduce((acc, value) => acc + value, 0).toFixed(2);
  }
  getTotalQuantity() {
    return this.giftCheckMovements.map(t => t.quantity).reduce((acc, value) => acc + value, 0);
  }
  AddGiftChecks(){
    if(this.giftCheckMovements.find(x => x.quantity == null || x.quantity < 0)){
      Swal.fire({
        title:"Hediye Çeklerinin Adetleri\nBoş ve Negatif Olamaz.\nAncak 0 veya Üstü Olabilir.",
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

    this.giftCheckMovements.forEach(x=>{x.total = (x.value * x.quantity)});
    this.dialogRef.close(this.giftCheckMovements);
  }
  CloseDialog() {
    this.dialogRef.close();
  }

}
