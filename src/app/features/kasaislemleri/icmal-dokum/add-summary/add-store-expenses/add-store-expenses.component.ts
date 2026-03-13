import { CommonModule } from '@angular/common';
import { Component,Inject,OnInit } from '@angular/core';
import { FormBuilder,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource,MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';
import { AddStoreExpenses,PaymentTypes,StoreExpenses } from '../../../../../models/eskiAngular';
import { EskiAngularService } from '../../../../../services/eskiAngular.service';

@Component({
  selector: 'app-add-store-expenses',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatGridListModule
  ],
  templateUrl: './add-store-expenses.component.html',
  styleUrls: ['./add-store-expenses.component.css']
})
export class AddStoreExpensesComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<AddStoreExpensesComponent>,
    private eskiAngularService: EskiAngularService,
    @Inject(MAT_DIALOG_DATA) public storeExpensesData: StoreExpenses[],
    private formBuilder:FormBuilder
  ) { }

  ngOnInit() {
    this.CreateStoreExpensesForm();
    this.GetStoreExpenses();
    var Index = this.storeExpensesData.findIndex(x=>x.amountValue == null);
    if(Index == 0)
    {
      this.storeExpensesData.splice(Index, 1);
      this.tableSource = new MatTableDataSource(this.storeExpensesData);
    }
    else{
      this.tableSource = new MatTableDataSource(this.storeExpensesData);
    }
  }
  tableSource = new MatTableDataSource<StoreExpenses>();
  tableColumns = ["storeExpensesType", "description", "amountValue", "delete"];

  storeExpensesForm!:FormGroup;
  CreateStoreExpensesForm(){
    this.storeExpensesForm=this.formBuilder.group({
      storeExpensesType:["", Validators.required],
      description:["", Validators.required],
      amountValue:["", [Validators.required
        ,Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,3})?$")
      ]]
    });
  }

  storeExpensesList!:PaymentTypes[];
  GetStoreExpenses(){
    this.eskiAngularService.GetPaymentTypesByStoreExpenses().subscribe(storeExpenses=>{
      this.storeExpensesList = storeExpenses;
    });
  }
  AddStoreExpenses(){
    let Lines:AddStoreExpenses={ storeExpenses: [] };
    Object.assign(Lines, this.storeExpensesForm.value);
    Lines.storeExpenses = this.storeExpenses.storeExpenses;
    this.dialogRef.close(Lines.storeExpenses);
  }
  storeExpenses: AddStoreExpenses = { storeExpenses: [] };
  AddToCart(){
    let Lines: StoreExpenses = Object.assign(
      {},
      this.storeExpensesForm.value
    );
    let storeExpensesIndex = this.storeExpensesData.findIndex(
      x => x.amountValue == null
    );
    if(storeExpensesIndex == 0){
      this.storeExpensesData.splice(storeExpensesIndex, 1);
    }
    this.storeExpenses.storeExpenses = this.storeExpensesData;
    this.storeExpenses.storeExpenses.push(Lines);
    this.tableSource = new MatTableDataSource(this.storeExpenses.storeExpenses);
    this.storeExpensesForm.reset();
  }
  removeLine(storeExpenses:StoreExpenses){
    Swal.fire({
      title: storeExpenses.storeExpensesType +"\n"+ storeExpenses.description +"\n"+ storeExpenses.amountValue +"\n"+ "Silinecek !",
      text: "Onaylıyor musunuz?",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet!',
      cancelButtonText:'Vazgeç',
      allowOutsideClick:false,
      allowEnterKey:false,
      allowEscapeKey:false,
    }).then((result) => {
      if (result.value) {
        let storeExpensesIndex = this.storeExpenses.storeExpenses.findIndex(
          (p: StoreExpenses) => p.description == storeExpenses.description
        );
        this.storeExpenses.storeExpenses.splice(storeExpensesIndex, 1);
        this.refreshTable();
        }
     });
  }
  refreshTable() {
    this.tableSource = new MatTableDataSource(this.storeExpenses.storeExpenses);
  }
  CloseDialog() {
    this.dialogRef.close();
  }
}

