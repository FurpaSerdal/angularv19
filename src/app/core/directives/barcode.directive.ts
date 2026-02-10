import { Directive, ElementRef, Input, OnInit, AfterViewInit } from '@angular/core';
import JsBarcode from 'jsbarcode';

@Directive({
  selector: '[appBarcode]',
  standalone: true
})
export class BarcodeDirective implements AfterViewInit {
  @Input() barcodeValue!: string;
  @Input() barcodeFormat: string = 'CODE128';
  @Input() barcodeWidth: number = 1;
  @Input() barcodeHeight: number = 25;
  @Input() barcodeFontSize: number = 13;
  @Input() barcodeDisplayValue: boolean = true;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    if (this.barcodeValue) {
      try {
        // Barcode format belirleme
        let format = this.barcodeFormat;
        if (this.barcodeValue.length === 13) {
          format = 'EAN13';
        } else if (this.barcodeValue.length === 8) {
          format = 'EAN8';
        }

        JsBarcode(this.el.nativeElement, this.barcodeValue, {
          format: format,
          width: this.barcodeWidth,
          height: this.barcodeHeight,
          fontSize: this.barcodeFontSize,
          displayValue: this.barcodeDisplayValue,
          margin: 0
        });
      } catch (error) {
        console.error('Barcode oluşturulamadı:', error);
      }
    }
  }
}
