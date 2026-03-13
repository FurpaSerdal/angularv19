import { Component,computed,Inject } from '@angular/core';

import { CommonModule,} from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxPrintModule } from 'ngx-print';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { BanknoteMovementsCT,Cashier,CashRegisterDetails,GiftCheckMovementsCT,SummariesCT,SummariesDetailsCT } from '../../../../models/eskiAngular';
import { EskiAngularService } from '../../../../services/eskiAngular.service';
import { MeService } from '../../../../services/meservice.service';
import { SummaryPrintComponent } from '../summary-print/summary-print.component';
import { SummaryService } from '../../../../services/summary/summary.service';

@Component({
  selector: 'app-icmal-detay',
  imports: [SummaryPrintComponent,NgxPrintModule, CommonModule],
  templateUrl: './icmal-detay.html',
  styleUrls: ['./icmal-detay.css'],
})
export class IcmalDetay {

cashierName: string = '';
managerName: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public summary: SummariesCT,
    private summaryService: SummaryService,
    private meservice: MeService,
    private toastrService:ToastrService,
  ) { }
  
  ngOnInit() {
      this.GetBanknoteMovements(this.summary);
      this.GetSummariesDetails(this.summary);
      this.GetGiftCheckMovements(this.summary);
      this.GetCashierAndManager(this.summary);
      this.GetZTotalValue(this.summary);
      this.GetCashRegisterNo(this.summary.cashNo);
  }

  readonly  warehouseNo = computed(() => this.meservice.userSignal()?.subeNo ?? 0);
  readonly warehouseName = computed(() => this.meservice.userSignal()?.sube ?? '');
  taskid = computed(() => this.meservice.selectedGorev()?.id ?? 0);
  cashRegisterDetail!:CashRegisterDetails ;


cashierAndManagerList!: Cashier[];


GetCashierAndManager(summary: SummariesCT) {
  this.summaryService
    .GetCashierAndManager(this.taskid(), summary.cashierNo, summary.managerNo)
    .subscribe(list => {

      this.cashierAndManagerList = list ?? [];

      const cashier = this.cashierAndManagerList.find(
        x => Number(x.kasiyerKodu) === summary.cashierNo
      );

      const manager = this.cashierAndManagerList.find(
        x => Number(x.kasiyerKodu) === summary.managerNo
      );

      this.cashierName = cashier
        ? `${summary.cashierNo} ${cashier.kasiyerAdi} ${cashier.kasiyerSoyadi}`.trim()
        : `${summary.cashierNo} - Bulunamadı`;

      this.managerName = manager
        ? `${summary.managerNo} ${manager.kasiyerAdi} ${manager.kasiyerSoyadi}`.trim()
        : `${summary.managerNo} - Bulunamadı`;


    });
}

  summariesDetails!:SummariesDetailsCT[];
  creditCards!:SummariesDetailsCT[];
  foodChecks!:SummariesDetailsCT[];
  expenseCompass!:SummariesDetailsCT[];
  storeExpenses!:SummariesDetailsCT[];
  onlineSales!:SummariesDetailsCT[];
  GetSummariesDetails(summary:SummariesCT){
    this.summaryService.GetSummariesDetails(this.taskid(), summary.documentSerie, summary.documentOrderNo)
    .subscribe(summariesDetails=>{
      this.summariesDetails = summariesDetails;
      
      this.creditCards = this.summariesDetails.filter(x => x.paymentTypeID >= 0 && x.paymentTypeID < 50);
      this.foodChecks = this.summariesDetails.filter(x => x.paymentTypeID >= 50 && x.paymentTypeID < 100);
      this.expenseCompass = this.summariesDetails.filter(x => x.paymentTypeID == 100);
      this.storeExpenses = this.summariesDetails.filter(x => x.paymentTypeID >= 110 && x.paymentTypeID < 600);
      this.onlineSales = this.summariesDetails.filter(x => x.paymentTypeID >= 600);
      this.CreditCardsValues();
      this.FoodChecksValues();
      this.ExpenseCompassValues();
      this.StoreExpensesValues();
      this.OnlineSalesValues();
    });
  }

  banknoteMovements!:BanknoteMovementsCT[];
  GetBanknoteMovements(summary:SummariesCT){
    this.summaryService.GetBanknoteMovementDetails(this.taskid(), summary.documentSerie, summary.documentOrderNo)
    .subscribe(banknoteMovements => {
      this.banknoteMovements = banknoteMovements.filter(x=>x.quantity!=0);
      this.BanknoteMovementsValues();
    });
  }

  giftCheckMovements!:GiftCheckMovementsCT[];
  GetGiftCheckMovements(summary:SummariesCT){
    this.summaryService.GetGiftCheckMovemntDetails(this.taskid(), summary.documentSerie, summary.documentOrderNo)
    .subscribe(giftCheckMovements => {
      this.giftCheckMovements = giftCheckMovements.filter(x=>x.quantity!=0);
      this.GiftCheckMovementsValues();
    });
  }

  giftCheckTotal = 0;
  giftCheckQuantity = 0;
  GiftCheckMovementsValues(){
    this.giftCheckMovements.forEach(x =>
    {
      this.giftCheckTotal += x.total;
      this.giftCheckQuantity += x.quantity;
    });
  }

  banknoteTotal = 0;
  banknoteQuantity = 0;
  BanknoteMovementsValues(){
    this.banknoteMovements.forEach(x =>
    {
      this.banknoteTotal += x.total;
      this.banknoteQuantity += x.quantity;
    });
  }

  creditCardsTotal = 0;
  creditCardsQuantity = 0;
  CreditCardsValues(){
    this.creditCards.forEach(x =>
    {
      this.creditCardsTotal += x.amount;
      this.creditCardsQuantity += x.slipNumber;
    });
  }

  foodChecksTotal = 0;
  foodChecksQuantity = 0;
  FoodChecksValues(){
    this.foodChecks.forEach(x =>
    {
      this.foodChecksTotal += x.amount;
      this.foodChecksQuantity += x.slipNumber;
    });
  }

  onlineSalesTotal = 0;
  onlineSalesQuantity = 0;
  OnlineSalesValues(){
    this.onlineSales.forEach(x =>
    {
      this.onlineSalesTotal += x.amount;
      this.onlineSalesQuantity += x.slipNumber;
    });
  }

  expenseCompassTotal = 0;
  expenseCompassQuantity = 0;
  ExpenseCompassValues(){
    this.expenseCompass.forEach(x =>
    {
      this.expenseCompassTotal += x.amount;
      this.expenseCompassQuantity += x.slipNumber;
    });
  }
  storeExpensesTotal = 0;
  StoreExpensesValues(){
    this.storeExpenses.forEach(x => 
    {
      this.storeExpensesTotal += x.amount;
    });
  }

  zTotalValue=0;
  GetZTotalValue(summary:SummariesCT){
    this.summaryService.GetZReportTotalValue(this.taskid(), summary.documentSerie, 1, summary.zReportNo, summary.cashNo)
    .subscribe(response => {
      if(!response){
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
        this.zTotalValue = response ?? 0;
        this.toastrService.success("Z Toplamı Başarıyla Getirildi.");
      }
    });
  }

 GetCashRegisterNo(cashNo:number){
  this.summaryService.GetCashRegisteryDetails(this.taskid(), cashNo).subscribe(detail=>{
    this.cashRegisterDetail=detail;
  });
 }
  
}

