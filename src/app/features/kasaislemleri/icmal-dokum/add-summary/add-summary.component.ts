import { Component,OnInit } from '@angular/core';

import { FormBuilder,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';

import { CommonModule,CurrencyPipe,DatePipe } from '@angular/common';

import { AddBanknotesComponent } from './add-banknotes/add-banknotes.component';
import { AddCreditCardsComponent } from './add-credit-cards/add-credit-cards.component';
import { AddFoodChecksComponent } from './add-food-checks/add-food-checks.component';
import { AddStoreExpensesComponent } from './add-store-expenses/add-store-expenses.component';

import { AddExpenseCompassComponent } from './add-expense-compass/add-expense-compass.component';

import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AddGiftChecksComponent } from './add-gift-checks/add-gift-checks.component';

import { AbstractControl,ValidationErrors } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerInputEvent,MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { AddStoreExpenses,BanknoteMovements,Cashier,CashRegisterDetails,CashRegistryDetail,GiftCheckMovements,PaymentTypes,StoreExpenses,SummaryForAdd,SummaryTable,Warehouse } from '../../../../models/eskiAngular';
import { AuthService } from '../../../../services/auth.service';
import { EskiAngularService } from '../../../../services/eskiAngular.service';
import { WarehouseService } from '../../../../services/warehouse.service';
import { AddOnlineSalesChecksComponent } from './add-online-sales-checks/add-online-sales-checks.component';


// Validator function for cashier
function ValidateCashier(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return { required: true };
  }
  return null;
}

@Component({
  selector: 'app-add-summary',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    CurrencyPipe
  ],
  templateUrl: './add-summary.component.html',
  styleUrls: ['./add-summary.component.css']
})
export class AddSummaryComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private eskiAngularService: EskiAngularService,
    private toastrService:ToastrService,
    private warehouseService: WarehouseService,
    private authService: AuthService
  ) { }

  tableSourceBanknote = new MatTableDataSource();
  tableColumnsBanknote = ["banknoteType", "quantity", "total"];

  tableSourceBank = new MatTableDataSource<CashRegistryDetail>();
  tableColumnsBank = ["paymentName", "terminalId", "slipNumber", "amountValue"];

  tableSourceSummary = new MatTableDataSource();
  tableColumnsSummary = ["cashNo", "zReportNo","total"];

  
  ngOnInit() {
    this.createFormGroup();
    this.GetCashRegistryDetails();
    this.getCashRegistryDetails();
    this.GetPaymentBanks();
    this.GetFoodChecks();
    this.GetExpenseCompass();
    this.GetBanknoteTypes();
    this.GetGiftCheckTypes();
    this.GetOnlineSalesTypes();
    this.storeExpenses  = { storeExpenses: [] };
    this.currentWarehouseNo = localStorage.getItem("currentWarehouseNo") || '';
    this.currentWarehouseNo == "1" ? this.isDisabled = true : this.isDisabled = false;
  }
  isDisabled!:Boolean;
  currentWarehouseNo=''
  cashRegistryDetailsForComp:CashRegistryDetail[] = [];
  public checkError = (controlName: string, errorName: string) => {
    return this.summaryForm.controls[controlName].hasError(errorName);
  }
  branches:Warehouse[] = [];
  // GetBranches(){
  //   this.warehouseService.GetBranches().subscribe((branches: Warehouse[])=>{
  //     this.branches=branches;
  //   })
  // }
  banknoteMovements: BanknoteMovements[] = [];
  giftChecksMovements: GiftCheckMovements[] = [];

  zTotalValue=0;
  GetZReportTotalValue(){
    var currentWarehouseNo =localStorage.getItem("currentWarehouseNo") || '';
    this.eskiAngularService.GetZReportTotalValue("0", 
    currentWarehouseNo == "1" 
    ? parseInt(this.summaryForm.get("warehouseNo")?.value || "1")
    : 1
    ,this.summaryForm.get("zNo")?.value || 0, this.summaryForm.get("cashNo")?.value || 0)
    .subscribe(response => {
          if(response.body == -1){
            this.zTotalValue = 0;
            this.toastrService.error("Uyarıları dikkate alınız.");
            Swal.fire({
              title:"Z Toplamı için Dikkat !\n• Poskon Klasörünü kontrol edin.\n• Kasa açık mı?\n• Kasada bağlantı var mı?\n• Z Noyu yazdığınızdan emin olun.\n• Z numarasının başında 0 olmayacak.",
              icon:"error",
              position:"center",
              confirmButtonText:"Tamam",
              showConfirmButton:true,
              focusConfirm:true,
              allowEnterKey:false,
              allowOutsideClick:false,
              allowEscapeKey:false,
              heightAuto:true,
            });
            return;
          }
          else{
            this.zTotalValue = response.body || 0;
            this.toastrService.success("Z Toplamı Başarıyla Getirildi.");
          }
    });
  }

  sum:SummaryTable[]=[];

  banknoteTotal=0;
  banknoteQuantity!:number;
  OpenBanknotesDialog(){
    this.banknoteTotal = 0.00;
    this.banknoteQuantity = 0.00;
    this.matDialog.open(AddBanknotesComponent,{
      width:"800px",
      height:"80%",
      disableClose:true,
      data:this.banknoteMovements
    }).afterClosed().subscribe(banknotes=>{
      if(banknotes!=undefined){
        this.banknoteMovements = banknotes;
        this.banknoteMovements.forEach(element => {
          this.banknoteTotal += element.total;
          this.banknoteQuantity += Number(element.quantity);
        });
      }
    });
  }
  creditCardsTotal=0;
  creditCardsQuantity!:number;
  OpenBanksDialog(){
    if(this.summaryForm.get("cashNo")?.value == null || this.summaryForm.get("cashNo")?.value == ""){
      Swal.fire({
          title:"Kredi Kartı Bilgileri için\nLütfen Kasa No belirtiniz.",
          icon:"warning",
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

    this.creditCardsTotal = 0.00;
    this.creditCardsQuantity = 0.00;
    this.matDialog.open(AddCreditCardsComponent,{
      width:"800px",
      height:"80%",
      disableClose:true,
      data:this.paymentBanks
    }).afterClosed().subscribe(creditCards=>{
      if(creditCards!=undefined){
        this.paymentBanks.forEach(element => {
          this.creditCardsTotal += Number(element.amountValue);
          this.creditCardsQuantity += Number(element.slipNumber);
        });
      }
    });
  }
  foodChecksTotal=0;
  foodChecksQuantity!:number;
  OpenFoodChecksDialog(){
    this.foodChecksTotal = 0.0;
    this.foodChecksQuantity = 0.0;
    this.matDialog.open(AddFoodChecksComponent,{
      width:"800px",
      height:"80%",
      disableClose:true,
      data:this.paymentFoodChecks
    }).afterClosed().subscribe(foodChecks=>{
      if(foodChecks!=undefined){
        this.paymentFoodChecks.forEach(element => {
          this.foodChecksTotal += Number(element.amountValue);
          this.foodChecksQuantity += Number(element.slipNumber);
        });
      }
    });
  }

  storeExpenses!:AddStoreExpenses;
  store: StoreExpenses = {} as StoreExpenses;
  storeExpensesTotal=0;
  storeExpensesQuantity!:number;
  OpenStoreExpensesDialog(){
    this.storeExpensesTotal = 0.0;
    this.storeExpensesQuantity = 0.0;
    if(this.storeExpenses.storeExpenses.length == 0){
      this.store.storeExpensesType = "";
      this.store.description = "";
      this.store.amountValue = 0.0;
      this.storeExpenses.storeExpenses.push(this.store)
    }
    this.matDialog.open(AddStoreExpensesComponent,{
      width:"800px",
      height:"80%",
      disableClose:true,
      data:this.storeExpenses.storeExpenses
    })
    .afterClosed().subscribe(storeExpenses=>{
      if(storeExpenses!=undefined){
        this.storeExpenses.storeExpenses = storeExpenses;
        this.storeExpenses.storeExpenses.forEach(element => {
          this.storeExpensesTotal += Number(element.amountValue);
        });
        this.storeExpensesQuantity = this.storeExpenses.storeExpenses.length;
      }
    });
  }
  expenseCompassTotal=0;
  expenseCompassQuantity!:number;
  OpenExpenseCompassDialog(){
    this.expenseCompassTotal = 0.0;
    this.expenseCompassQuantity = 0.0;
    this.matDialog.open(AddExpenseCompassComponent,{
      width:"800px",
      height:"80%",
      disableClose:true,
      data:this.expenseCompass
    }).afterClosed().subscribe(expenseCompass=>{
      if(expenseCompass!=undefined){
        this.expenseCompass.forEach(element => {
          this.expenseCompassTotal += Number(element.amountValue);
          this.expenseCompassQuantity += Number(element.slipNumber);
        });
      }
    });
  }

  giftCheckTotal=0;
  giftCheckQuantity!:number;
  OpenGiftCheksDialog(){
    this.giftCheckTotal = 0.00;
    this.giftCheckQuantity = 0.00;
    this.matDialog.open(AddGiftChecksComponent,{
      width:"800px",
      height:"80%",
      disableClose:true,
      data:this.giftChecksMovements
    }).afterClosed().subscribe(giftChecks=>{
      if(giftChecks!=undefined){
        this.giftChecksMovements = giftChecks;
        this.giftChecksMovements.forEach(element => {
          this.giftCheckTotal += element.total;
          this.giftCheckQuantity += Number(element.quantity);
        });
      }
    });
  }

  onlineSalesTotal=0;
  onlineSalesQuantity!:number;
  OpenOnlineSalesCheksDialog(){
    this.onlineSalesTotal = 0.00;
    this.onlineSalesQuantity = 0.00;
    this.matDialog.open(AddOnlineSalesChecksComponent,{
      width:"800px",
      height:"80%",
      disableClose:true,
      data:this.onlineSalesTypes
    }).afterClosed().subscribe(onlineSalesChecks=>{
      if(onlineSalesChecks!=undefined){
        onlineSalesChecks.forEach((element: PaymentTypes) => {
          this.onlineSalesTotal += Number(element.amountValue);
          this.onlineSalesQuantity += Number(element.slipNumber);
        });
      }
    });
  }

  maxDate=new Date(Date.now());
  pipe:any;
  summaryForm!: FormGroup;
  createFormGroup() {
    this.pipe = new DatePipe('en-US');
    var ddMMyyyy = this.pipe.transform(new Date(),"dd.MM.yyyy");
    this.summaryForm = this.formBuilder.group({
      cashNo:["", Validators.required],
      cashRegisterNo:[""],
      cashier:["", [Validators.required, ValidateCashier]],
      manager:["", [Validators.required, ValidateCashier]],
      zNo:[""],
      summaryToday:[ddMMyyyy],
      summaryDate:[],
      warehouseNo:[]
    });
  }
  selectedDate!:Date;
  OnDateChange(eventData:MatDatepickerInputEvent<Date>){
    this.selectedDate=new Date(eventData.value || new Date());
  }
  cashRegistryDetails!:CashRegistryDetail[];
  cashRegisterDetail!:CashRegisterDetails;
  storeExpensesData!:PaymentTypes[];
  getCashRegistryDetails(){
    this.eskiAngularService.GetCashRegistryDetails().subscribe(details => {
      this.cashRegistryDetails = details;
      // this.summariesList.forEach(x=>{
      //       var Index = this.cashRegistryDetails.findIndex(z=>z.cashRegisterNo == x.cashNo );
      //       this.cashRegistryDetails.splice(Index, 1);
      // });
    });
  }
  getCashRegistryDetailsByWarehouse(warehouseNo:number){
    this.eskiAngularService.GetCashRegistryDetailByWarehouse(warehouseNo).subscribe(details => {
      this.cashRegistryDetails = details;
    });
  }
  paymentBanks!:PaymentTypes[];
  GetPaymentBanks(){
    this.eskiAngularService.GetPaymentTypesByBanks(this.summaryForm.get("cashRegisterNo")?.value || '' ).subscribe(banks => {
      this.paymentBanks = banks;
    });
  }
  paymentFoodChecks!:PaymentTypes[];
  GetFoodChecks(){
    this.eskiAngularService.GetPaymentTypesByFoodChecks().subscribe(checks=>{
      this.paymentFoodChecks = checks;
    });
  }
  expenseCompass!:PaymentTypes[];
  GetExpenseCompass(){
    this.eskiAngularService.GetPaymentTypesByExpenseCompass().subscribe(expenseCompass=>{
      this.expenseCompass = expenseCompass;
    });
  }
  GetBanknoteTypes(){
    this.eskiAngularService.GetBanknoteTypes().subscribe(banknoteTypes=>{
      this.banknoteMovements = banknoteTypes;
    });
  }
  GetGiftCheckTypes(){
    this.eskiAngularService.GetGiftCheckTypes().subscribe(giftCheckTypes=>{
      this.giftChecksMovements = giftCheckTypes;
    });
  }
  onlineSalesTypes!:PaymentTypes[];
  GetOnlineSalesTypes(){
    this.eskiAngularService.GetPaymentTypesByOnlineSales().subscribe(onlineSaleTypes=>{
      this.onlineSalesTypes = onlineSaleTypes;
    });
  }

  DeleteCashNo(cashNo:number, zReportNo:number){
    Swal.fire({
      title: cashNo +" Kasanın\n" + zReportNo +" Z Rapor Numarasına ait\n"+ "İcmal Bilgileri Silinecek ! \nOnaylıyor musunuz?",
      text: "Silip tekrar oluşturabilirsiniz.",
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
          let Index = this.sum.findIndex(
            p => p.cashNo == cashNo
          );
          this.sum.splice(Index, 1);
      
          let IndexList = this.summariesList.findIndex(
            p => p.cashNo == cashNo
          );
          this.summariesList.splice(IndexList, 1);
          
          // this.cashRegistryDetails.push({branchNo:1, cashRegisterNo:cashNo, cashRegisterType:1, cashRegisterState:1});
          this.cashRegistryDetails = this.cashRegistryDetails.sort((a,b)=>a.cashRegisterNo - b.cashRegisterNo);
          this.toastrService.info(cashNo.toString()+" Kasanın İcmal Bilgileri Silindi.\nTekrar Oluşturabilirsiniz.");
        }
     });
  }

  summariesList:SummaryForAdd[]=[];
  summary!:SummaryForAdd;
  summaryLine !:SummaryTable;
  SubeTLKasası!:PaymentTypes[];
  AddCash(){
    this.summary = {} as SummaryForAdd;
    this.summaryLine = {} as SummaryTable;
    for (let index = 0; index < this.cashRegistryDetailsForComp.length; index++) {
      if(this.summaryForm.get("cashRegisterNo")?.value == this.cashRegistryDetailsForComp[index].cashRegisterNo) {
        this.summary.zReportNo = 0;
        this.summary.zTotalValue = 0;
        break;
      }
      else{
        this.summary.zReportNo = this.summaryForm.get("zNo")?.value || 0;
        this.summary.zTotalValue = this.zTotalValue;
      }
    }
    /*this.cashRegistryDetailsForComp.forEach((_ch)=>{
      if(this.summaryForm.get("cashRegisterNo").value == "MY1160000001"|| this.summaryForm.get("cashRegisterNo").value == "MY1330000001"
      || this.summaryForm.get("cashRegisterNo").value == "MY1340000001" || this.summaryForm.get("cashRegisterNo").value == "MY1580000001"
      || this.summaryForm.get("cashRegisterNo").value == "MY1630000001" || this.summaryForm.get("cashRegisterNo").value == "MY1150000001"
      || this.summaryForm.get("cashRegisterNo").value == "MY1190000001" || this.summaryForm.get("cashRegisterNo").value == "MY1510000001"
      || this.summaryForm.get("cashRegisterNo").value == "MY1290000001") {
        this.summary.zReportNo = 0;
        this.summary.zTotalValue = 0;
      }
      if(this.summaryForm.get("cashRegisterNo").value == _ch.cashRegisterNo) {
        this.summary.zReportNo = 0;
        this.summary.zTotalValue = 0;
        break;
      }
      else{
        this.summary.zReportNo = this.summaryForm.get("zNo").value;
        this.summary.zTotalValue = this.zTotalValue;
      }
    });*/
    
    this.summary.banknoteMovements = this.banknoteMovements.filter(x=>x.quantity != 0);
    this.summary.paymentTypes = this.paymentBanks.filter(x=>x.slipNumber != 0 );
    this.summary.paymentTypes = this.summary.paymentTypes.concat(this.paymentFoodChecks.filter(x=>x.slipNumber != 0 ));
    this.summary.paymentTypes = this.summary.paymentTypes.concat(this.expenseCompass.filter(x=>x.slipNumber != 0));
    this.summary.paymentTypes = this.summary.paymentTypes.concat(this.onlineSalesTypes.filter(x=>x.slipNumber != 0));

    this.summary.total = (this.banknoteTotal==undefined ? 0 : this.banknoteTotal)
    + (this.creditCardsTotal==undefined ? 0 : this.creditCardsTotal)
    + (this.foodChecksTotal==undefined ? 0 : this.foodChecksTotal)
    + (this.storeExpensesTotal==undefined ? 0 : this.storeExpensesTotal)
    + (this.giftCheckTotal==undefined ? 0 : this.giftCheckTotal)
    + (this.onlineSalesTotal==undefined ? 0 : this.onlineSalesTotal);

    if(this.summary.total <= 0){
      Swal.fire({
          title:"Hiçbir Tutar Girmediniz.\nKayıt İşleminiz Reddedildi !",
          text:"Lütfen Bilgileri Kontrol Ediniz.",
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

    this.summary.storeExpenses = this.storeExpenses.storeExpenses;
    this.summary.giftCheckMovements = this.giftChecksMovements.filter(x=>x.quantity != 0);;

    this.summary.cashNo = this.summaryForm.get("cashNo")?.value || 0;
    this.summary.cashierNo = this.selectedCashier.cashierCode;
    this.summary.managerNo = this.selectedManager.cashierCode;
    var currentWarehouseNo = 109;
    if(currentWarehouseNo == 1){
      this.selectedDate.setHours(new Date().getHours() + 3);
      this.selectedDate.setMinutes(new Date().getMinutes());
      this.selectedDate.setSeconds(new Date().getSeconds());
      this.summary.summaryDate = this.selectedDate;
      this.summary.warehouseNo = this.summaryForm.get("warehouseNo")?.value || 1;
    }else{
      this.selectedDate.setHours(new Date().getHours() + 3);
      this.selectedDate.setMinutes(new Date().getMinutes());
      this.selectedDate.setSeconds(new Date().getSeconds());
      this.summary.summaryDate = this.selectedDate;
      this.summary.warehouseNo = currentWarehouseNo;
    }
    
    this.summary.giftCheckMovements.forEach((x)=>{
      if(x.giftCheckType==11){
        x.quantity=1;
      }
    });

    this.summariesList.push(this.summary);
    
    this.eskiAngularService.AddSummary(this.summariesList);

    this.ngOnInit();

    this.summaryForm.reset();

    this.summaryForm.patchValue({summaryDate: this.pipe.transform(new Date(),"dd.MM.yyyy")});

    this.toastrService.success(this.summary.cashNo +" Kasa Bilgileri Eklendi.");

    // this.summaryLine.cashNo = this.summary.cashNo;
    // this.summaryLine.zReportNo = this.summary.zReportNo;
    // this.summaryLine.total = 
    // (this.banknoteTotal==undefined ? 0 : this.banknoteTotal)
    // + (this.creditCardsTotal==undefined ? 0 : this.creditCardsTotal)
    // + (this.foodChecksTotal==undefined ? 0 : this.foodChecksTotal)
    // + (this.storeExpensesTotal==undefined ? 0 : this.storeExpensesTotal)
    // + (this.giftCheckTotal==undefined ? 0 : this.giftCheckTotal);
    // // - (this.expenseCompassTotal==undefined ? 0 : this.expenseCompassTotal);
    // this.sum.push(this.summaryLine);

    this.ClearValues();
  
  }
  ClearValues(){
    this.zTotalValue=0;
    this.banknoteTotal=0;
    this.banknoteQuantity=0;
    this.creditCardsTotal=0;
    this.creditCardsQuantity=0;
    this.foodChecksTotal=0;
    this.foodChecksQuantity=0;
    this.storeExpensesTotal=0;
    this.storeExpensesQuantity=0;
    this.expenseCompassTotal=0;
    this.expenseCompassQuantity=0;
    this.giftCheckTotal=0;
    this.giftCheckQuantity=0;
  }
  AddSummary() {
    this.eskiAngularService.AddSummary(this.summariesList);
  }

  cashiersByFilter!:Cashier[];
  managersByFilter!:Cashier[];
  selectedCashier!: Cashier;
  selectedManager!: Cashier;
  GetCashiersByFilter() {
    this.eskiAngularService 
      .GetCashier(this.summaryForm.get("cashier")?.value || '')
      .subscribe(cashiers => {
        this.cashiersByFilter = cashiers;
      });
  }
  GetManagersByFilter() {
    this.eskiAngularService
      .GetCashier(this.summaryForm.get("manager")?.value || '')
      .subscribe(managers => {
        this.managersByFilter = managers;
      });
  }
  visibility!:boolean;
  onWriterChange(){
    const cashNo = this.summaryForm.get("cashNo")?.value || 0;
    const zNoControl = this.summaryForm.get("zNo");
    if(cashNo >= 800){
      this.visibility = false;
      zNoControl?.setValidators(null);
      zNoControl?.updateValueAndValidity();
    }
    else{
      this.visibility = true;
      zNoControl?.setValidators([Validators.required]);
      zNoControl?.updateValueAndValidity();
    }
    this.eskiAngularService.GetCashRegisterDetail(cashNo).subscribe(detail=>{
      this.cashRegisterDetail=detail;
      this.summaryForm.get("cashRegisterNo")?.setValue(this.cashRegisterDetail.cashRegisterNo);
      this.eskiAngularService.GetPaymentTypesByBanks(this.summaryForm.get("cashRegisterNo")?.value || '').subscribe(banks => {
        this.paymentBanks = banks;
      });
    });
  }
  onChangeWarehouse(){
    var warehouseNo = this.summaryForm.get("warehouseNo")?.value || 1;
    this.getCashRegistryDetailsByWarehouse(warehouseNo);
  }
  onChangeCashRegisterNo(){
    this.summaryForm.get("cashRegisterNo")?.setValue(this.cashRegisterDetail.cashRegisterNo);
    this.eskiAngularService.GetCashRegisterDetail(this.summaryForm.get("cashRegisterNo")?.value || '').subscribe(detail=>{
      
      this.cashRegisterDetail=detail;
    });
  }
  displayFnCashier(cashier: Cashier): string {
    if (cashier) {
      return cashier.cashierCode + " " + cashier.cashierName;
    }
    return '';
  }
  displayFnManager(manager: Cashier): string {
    if (manager) {
      return manager.cashierCode + " " + manager.cashierName;
    }
    return '';
  }

  GetCashRegistryDetails(){
    this.eskiAngularService.GetCashRegistryDetails().subscribe({
      next:(res)=>{
         this.cashRegistryDetailsForComp= res;
      },
      error:(err)=>{
        console.log(err.body);
      }
    });
  }
}
