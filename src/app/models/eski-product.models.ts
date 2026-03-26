// Ürün detayları
export interface Product {
    package: string | null;
    packageFactor: number | null;
    lastUpdateDate: string; // ISO string
    barcodeContent: string | null;
    bulkSaleTaxRate: number;
    retailSaleTaxRate: number;
    productCode: string;
    productName: string;
    barcode: string | null;
    oldPrice: number;
    price: number;
    priceChangeDate: string | null;
    supplierCode: string | null;
    isClosedToSale: number;
    isClosedToOrder: number;
    isClosedToReceiving: number;
    isPassive: boolean;
    unitName: string;
    unitName2: string | null;
    typeCode: string | null;
    isDomestic: number;
    origin: string | null;
    unitPriceFactor: number;
    alternativeUnitName: string | null;
    pluNo: number;
    sectorCode: string | null;
    shelfLife: number;
    allShelfLife: number;
    type: string | null;
    orderGuid: string | null;
    canBeCalled: boolean;
    quantity: number;
    deliveredQuantity: number;
    documentOrderNo: number;
    categoryCode: string | null;
}

// Sepet satırı
export interface CartLine {
    product: Product;
    quantity: number;
    recommendedQuantity: number;
    deliveredQuantity: number;
}

// Sepet
export interface Cart {
    cartLines: CartLine[];
}