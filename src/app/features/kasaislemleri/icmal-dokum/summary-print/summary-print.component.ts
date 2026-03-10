import { CommonModule } from '@angular/common';
import { Component,Input,OnInit } from '@angular/core';
import { BanknoteMovementsCT,GiftCheckMovementsCT,SummariesCT,SummariesDetailsCT } from '../../../../models/eskiAngular';

@Component({
  selector: 'app-summary-print',
  templateUrl: './summary-print.component.html',
  imports: [CommonModule ],
  styleUrls: ['./summary-print.component.css'],

})
export class SummaryPrintComponent implements OnInit {

  constructor() { }

  @Input() banknoteMovements!:BanknoteMovementsCT[];
  @Input() summariesDetails!:SummariesDetailsCT[];
  @Input() giftCheckMovements!:GiftCheckMovementsCT[];

  @Input() creditCards!:SummariesDetailsCT[];
  @Input() foodChecks!:SummariesDetailsCT[];
  @Input() expenseCompass!:SummariesDetailsCT[];
  @Input() storeExpenses!:SummariesDetailsCT[];
  @Input() onlineSales!:SummariesDetailsCT[];

  @Input() summary!:SummariesCT;

  @Input() banknoteTotal!:number;
  @Input() banknoteQuantity!:number;

  @Input() giftCheckTotal!:number;
  @Input() giftCheckQuantity!:number;

  @Input() creditCardsTotal!:number;
  @Input() creditCardsQuantity!:number;

  @Input() foodChecksTotal!:number;
  @Input() foodChecksQuantity!:number;
  
  @Input() onlineSalesTotal!:number;
  @Input() onlineSalesQuantity!:number;

  @Input() expenseCompassTotal!:number;
  @Input() expenseCompassQuantity!:number;

  @Input() storeExpensesTotal!:number;

  @Input() cashierName!:string;
  @Input() managerName!:string;

  @Input() zTotalValue!:number;

  @Input() warehouseNo!:number;
  @Input() warehouseName!:string;
  @Input() cashRegisterNo?:string;

  ngOnInit() {
  }
}
