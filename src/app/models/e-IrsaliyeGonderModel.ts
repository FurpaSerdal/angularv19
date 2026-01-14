

export  interface SendOutboxShippingDespatch {
    documentSerie: string;
    documentOrderNo: number;
    documentNo: string;
    targetWarehouseNo: number;
    sourceWarehouseNo: number;
    driverNameSurname:string;
    driverTCKN:string;
    plaque:string;
    cart: Cart;
    
}


export  interface Cart{
   

    cartLines:CartLine[];
    creator:string;
    acceptor:string;
}

export  interface CartLine{
    product:Product;
    quantity:number;
    total:number;
    deliveredQuantity:number;
    recommendedQuantity:number;
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