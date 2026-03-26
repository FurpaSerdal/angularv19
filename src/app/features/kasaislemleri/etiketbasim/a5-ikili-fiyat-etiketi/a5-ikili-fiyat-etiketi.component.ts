import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-a5-ikili-fiyat-etiketi',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './a5-ikili-fiyat-etiketi.component.html',
  styleUrls: ['./a5-ikili-fiyat-etiketi.component.css']
})
export class A5IkiliFiyatEtiketiComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() productsToPrint: any[] = [];
  productPairs: any[][] = [];
  labelPrintDate: string = this.getFormattedPrintDate();

  constructor() {
    console.log(this.productsToPrint);
  }

  ngOnInit(): void {
    this.labelPrintDate = this.getFormattedPrintDate();
    this.productPairs = this.chunkProducts(this.productsToPrint);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productsToPrint']) {
      this.productPairs = this.chunkProducts(this.productsToPrint);
      this.renderBarcodes();
    }
  }

  ngAfterViewInit(): void {
    this.renderBarcodes();
  }

  private getFormattedPrintDate(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}.${month}.${year}`;
  }

  private renderBarcodes(): void {
    setTimeout(() => {
      this.productPairs.forEach((pair, i) => {
        const leftProduct = pair[0];
        const rightProduct = pair[1];

        if (leftProduct) {
          this.renderBarcode(`barcode-left-${i}`, leftProduct.barcode);
        }

        if (rightProduct) {
          this.renderBarcode(`barcode-right-${i}`, rightProduct.barcode);
        }
      });
    }, 0);
  }

  private chunkProducts(products: any[]): any[][] {
    const pairs: any[][] = [];

    for (let i = 0; i < products.length; i += 2) {
      pairs.push(products.slice(i, i + 2));
    }

    return pairs;
  }

  private renderBarcode(targetId: string, value: any): void {
    const barcodeValue = (value ?? '').toString();
    if (!barcodeValue) {
      return;
    }

    const barcodeLength = barcodeValue.length;
    let format: 'EAN13' | 'EAN8' | 'CODE128' = 'CODE128';

    if (barcodeLength === 13) {
      format = 'EAN13';
    } else if (barcodeLength === 8) {
      format = 'EAN8';
    }

    try {
      JsBarcode(`#${targetId}`, barcodeValue, {
        format,
        width: 1,
        height: 35,
        fontSize: 13,
        displayValue: true,
        margin: 0
      });
    } catch (error) {
      console.error('Barcode oluşturulamadı:', error);
    }
  }
}
