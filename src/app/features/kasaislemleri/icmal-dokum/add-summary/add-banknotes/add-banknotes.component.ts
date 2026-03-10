import { CommonModule } from '@angular/common';
import { Component,Inject,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource,MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';
import { BanknoteMovements } from '../../../../../models/eskiAngular';

@Component({
  selector: 'app-add-banknotes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './add-banknotes.component.html',
  styleUrls: ['./add-banknotes.component.css']
})
export class AddBanknotesComponent implements OnInit {

  constructor(
    private dialogRef:MatDialogRef<AddBanknotesComponent>,
    @Inject(MAT_DIALOG_DATA) private banknoteMovements: BanknoteMovements[],
  ) { }
  tableSourceBanknote = new MatTableDataSource<BanknoteMovements>();
  tableColumnsBanknote = ["value", "quantity", "total"];
  ngOnInit() {
    this.tableSourceBanknote = new MatTableDataSource(this.banknoteMovements);
  }
  getTotalAmount() {
    return this.banknoteMovements.map(t => t.quantity * t.value).reduce((acc, value) => acc + value, 0);
  }
  getTotalQuantity() {
    return this.banknoteMovements.map(t => t.quantity).reduce((acc, value) => acc + value, 0);
  }
  AddBanknotes(){

    if(this.banknoteMovements.find(x => x.quantity == null || x.quantity < 0)){
      Swal.fire({
        title:"Banknot Adetleri\nBoş ve Negatif Olamaz.\nAncak 0 veya Üstü Olabilir.",
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

    this.banknoteMovements.forEach(x=>{x.total = (x.value * x.quantity)});
    this.dialogRef.close(this.banknoteMovements);
  }

  CloseDialog() {
    this.dialogRef.close();
  }
}
