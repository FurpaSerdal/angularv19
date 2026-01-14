import { Component, Input, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SendOutboxShippingDespatch } from '../../../../../models/e-IrsaliyeGonderModel';
import { Evrak } from '../../../../../models/ortakModeller';

@Component({
  selector: 'app-convert-to-ewaybill-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './convert-to-ewaybill-component.html',
  styleUrl: './convert-to-ewaybill-component.css',
})
export class ConvertToEWaybillComponent implements OnInit {
  @Input() detailData?: Evrak;
  
  shipmentData!: SendOutboxShippingDespatch;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  showConfirmDialog = false;

  constructor(
    public dialogRef: MatDialogRef<ConvertToEWaybillComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Evrak,
  ) {
    this.shipmentData = this.initializeForm();
  }

  ngOnInit(): void {
    this.loadShipmentData();
  }

  private loadShipmentData(): void {
    const receivedData = this.detailData || this.data;
    
    if (receivedData) {
      // Detail component'ten gelen veriyi SendOutboxShippingDespatch'e mapla
      this.shipmentData = {
        documentSerie: receivedData.evrakNoSeri || '',
        documentOrderNo: receivedData.evrakNoSira || 0,
        documentNo: receivedData.belgeNo || '',
        targetWarehouseNo: receivedData.muhatapDepo?.no || 0,
        sourceWarehouseNo: receivedData.depo?.no || 0,
        driverNameSurname: receivedData.teslimEden || '',
        driverTCKN: receivedData.furpaVknTckn || '',
        plaque: '',
        cart: {
          cartLines: receivedData.kalemler?.map(k => ({
            product: {
              bulkSaleTaxRate: 0,
              productCode: k.stok?.stokKod || '',
              productName: k.stok?.stokIsim || '',
              barcode: k.stok?.barkodlar?.[0]?.barKodu || '',
              price: k.stok?.fiyat?.fiyati || 0,
              productPriceDocNumber: '',
              oldPrice: 0,
              promotionPrice: 0,
              priceChangeDate: '',
              supplierCode: '',
              isClosedToSale: 0,
              isClosedToOrder: 0,
              isClosedToReceiving: 0,
              isPassive: false,
              unitName: k.stok?.birimAd || '',
              unitName2: '',
              typeCode: '',
              origin: '',
              isDomestic: 1,
              unitPriceFactor: 1,
              alternativeUnitName: '',
              pluNo: 0,
              packageFactor: '',
              quantity: k.sevkMiktari || 0,
              expirationDate: '',
              barcodeContent: '',
              categoryCode: '',
              productImage: '',
            },
            quantity: k.sevkMiktari || 0,
            total: (k.stok?.fiyat?.fiyati || 0) * (k.sevkMiktari || 0),
            deliveredQuantity: 0,
            recommendedQuantity: k.onerilenSiparisMiktari || 0,
          })) || [],
          creator: receivedData.onaylayan || '',
          acceptor: receivedData.teslimAlan || '',
        },
      };
    }
  }

  private initializeForm(): SendOutboxShippingDespatch {
    return {
      documentSerie: '',
      documentOrderNo: 0,
      documentNo: '',
      targetWarehouseNo: 0,
      sourceWarehouseNo: 0,
      driverNameSurname: '',
      driverTCKN: '',
      plaque: '',
      cart: {
        cartLines: [],
        creator: '',
        acceptor: '',
      },
    };
  }

  openConfirmDialog(): void {
    if (this.validateForm()) {
      this.showConfirmDialog = true;
    }
  }

  closeConfirmDialog(): void {
    this.showConfirmDialog = false;
  }

  convertToEWaybill(): void {
    if (!this.validateForm()) {
      this.errorMessage = 'Lütfen tüm gerekli alanları doldurunuz.';
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    try {
      // Sevkiye e-İrsaliye'ye dönüştür
      this.successMessage = 'Sevkiye başarıyla e-İrsaliye\'ye dönüştürüldü.';
      this.showConfirmDialog = false;
      this.resetForm();
    } catch (error) {
      this.errorMessage = 'E-İrsaliye dönüştürme işlemi başarısız oldu.';
      console.error('Error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private validateForm(): boolean {
    if (!this.shipmentData.documentNo || !this.shipmentData.driverNameSurname) {
      return false;
    }
    if (!this.shipmentData.cart.cartLines || this.shipmentData.cart.cartLines.length === 0) {
      return false;
    }
    return true;
  }

  public resetForm(): void {
    this.shipmentData = this.initializeForm();
  }

  cancelConversion(): void {
    this.closeConfirmDialog();
  }
}