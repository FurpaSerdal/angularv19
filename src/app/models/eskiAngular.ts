export interface SummariesCT{
     warehouse:string;
     documentSerie:string;
     documentOrderNo:number;
     cashNo:number;
     zReportNo:number;
     cashierNo:number;
     managerNo:number;
     summaryDate:Date;
     total:number;
}
export interface BanknoteTrack {
    banknoteTrackDate:string;
    totalAmount:number;
    deliveryTotalAmount:number;
    deliverer:string;
    receiver:string;
}

export interface BanknoteTrackCT {
    warehouse:string;
    banknoteTrackDate:string;
    totalAmount:number;
    deliveryTotalAmount:number;
    differenceAmount:number;
    deliverer:string;
    receiver:string;
    createDate:string;
}
export interface SummariesReportCT{
    warehouseNo:number;
    warehouseName:string;
    cashAmount:number;
    cashAmountQuantity:number;
    akbank:number;
    akbankQuantity:number;
    halkbank:number;
    halkbankQuantity:number;
    isBankasi:number;
    isBankasiQuantity:number;
    teb:number;
    tebQuantity:number;
    yapiKredi:number;
    yapiKrediQuantity:number;
    ziraatBankasi:number;
    ziraatBankasiQuantity:number;
    metropol:number;
    metropolQuantity:number;
    multinet:number;
    multinetQuantity:number;
    setcard:number;
    setcardQuantity:number;
    sodexoKupon:number;
    sodexoKuponQuantity:number;
    sodexoPos:number;
    sodexoPosQuantity:number;
    ticketKupon:number;
    ticketKuponQuantity:number;
    ticketPos:number;
    ticketPosQuantity:number;
    expenseCompass:number;
    expenseCompassQuantity:number;
    storeExpense:number;
    storeExpenseQuantity:number;
}export interface CashRegisterDetails {
    cashRegisterNo:string;
    bank:string;
    terminalId:string;
    merchantNo:string;
    cashNo:number;
    cashType:number;
}
export interface CashRegistryDetail {
    detailId:number;
    branchNo:number;
    cashRegisterNo:number;
    cashRegisterType:number;
    cashFinanceNumber:string;
    // cashRegisterState:number;
}

export interface Warehouse {
    warehouseNo:number;
    warehouseName:string;
}
export interface BanknoteMovements {
    banknoteType:number;
    quantity:number;
    total:number;
    value:number;
}
export interface GiftCheckMovements {
    giftCheckType:number;
    quantity:number;
    total:number;
    value:number;
}
export interface SummaryTable{
    cashNo:number;
    zReportNo:number;
    total:number;
}


export interface AddStoreExpenses {

     storeExpenses:StoreExpenses[];
}

export interface StoreExpenses{
    storeExpensesType:string;
    description:string;
    amountValue:number;
}

export interface PaymentTypes{
    paymentName:string;
    paymentTypeNo:number;
    accountCode:string;
    slipNumber:number;
    amountValue:number;
    merchantNo:string;
    terminalId:string;
}

export interface SummaryForAdd{

     banknoteMovements:BanknoteMovements[];
     giftCheckMovements:GiftCheckMovements[];
     paymentTypes:PaymentTypes[];
     storeExpenses:StoreExpenses[];

     cashNo:number;
     zReportNo:number;
     cashierNo:number;
     managerNo:number;

     zTotalValue:number;
     total:number;

     summaryDate:Date;
     warehouseNo:number;
}

export interface SummaryTable{
    cashNo:number;
    zReportNo:number;
    total:number;
}
export interface CashRegisterDetails {
    cashRegisterNo:string;
    bank:string;
    terminalId:string;
    merchantNo:string;
    cashNo:number;
    cashType:number;
}

export interface Cashier {
    cashierCode:number;
    cashierName:string;
    cashierPassword:string;
    cashierAuthorization:string;
    cashierState:boolean;
}

export interface SummariesDetailsCT{
    typeName:string;
    paymentTypeID:number;
    accountCode:string;
    slipNumber:number;
    amount:number;
    terminalId:string;
    description:string;
}
export interface BanknoteMovementsCT {
    value:number;
    banknoteTypeID:number;
    quantity:number;
    total:number;
}
export interface GiftCheckMovementsCT {
    value:number;
    giftCheckTypeID:number;
    quantity:number;
    total:number;
}
export interface Product{
    bulkSaleTaxRate:number;
    productCode:string;
    productName:string;
    barcode:string;
    price:number;
    productPriceDocNumber:string;
    oldPrice:number;
    promotionPrice:number;
    priceChangeDate:string;
    supplierCode:string;
    isClosedToSale:number;
    isClosedToOrder:number;
    isClosedToReceiving:number;
    isPassive:boolean;
    unitName:string;
    unitName2:string;
    typeCode:string;
    origin:string;
    isDomestic:number;
    unitPriceFactor:number;
    alternativeUnitName:string;
    pluNo:number;
    packageFactor:string;
    quantity:number;
    expirationDate:string;
    barcodeContent:string;
    categoryCode:string;
    productImage:string;
}
export interface Tag {
    branchNo:number;
    branchName:string;
    productionCity:string;
    productionDistrict:string;
    productName:string;
    goodsType:string;
    goodsGenus:string;
    quantity:number;
    takenTag:string;
    buyer:string;
    productionDate:Date;
    buyingPrice:number;
    shippingDate:Date;
    manufacturer:string;
}
