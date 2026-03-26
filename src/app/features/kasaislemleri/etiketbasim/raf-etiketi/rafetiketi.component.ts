
import { CommonModule } from '@angular/common';
import { AfterViewInit,Component,Input,OnChanges,SimpleChanges } from '@angular/core';
import JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-rafetiketi',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rafetiketi.component.html',
  styleUrls: ['./rafetiketi.component.css']
})
export class RafetiketiComponent implements AfterViewInit, OnChanges {
 
  
    @Input() productsToPrint: any[] = [];
    halfPages: any[][] = [];
    etiketCikarmaTarihi: Date = new Date();
  
    private beforePrintHandler = () => this.renderBarcodesSafe();
  
    ngOnInit(): void {
      this.halfPages = this.chunk(this.productsToPrint, 1);
      window.addEventListener('beforeprint', this.beforePrintHandler);
    }
  
    ngAfterViewInit(): void {
      this.renderBarcodesSafe();
    }
  
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['productsToPrint']) {
        this.halfPages = this.chunk(this.productsToPrint, 1);
        this.renderBarcodesSafe();
      }
    }
  
    ngOnDestroy(): void {
      window.removeEventListener('beforeprint', this.beforePrintHandler);
    }
  
    private chunk(arr: any[], size: number) {
      const res: any[][] = [];
      for (let i = 0; i < (arr?.length ?? 0); i += size) {
        res.push(arr.slice(i, i + size));
      }
      return res;
    }
  
    private renderBarcodesSafe() {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => this.renderBarcodes());
      });
    }
  
    private renderBarcodes() {
      const svgs = Array.from(document.querySelectorAll<SVGSVGElement>('svg.barcode-svg'));
  
      svgs.forEach(svg => {
        const code = (svg.getAttribute('data-code') ?? '').toString().trim();
        svg.innerHTML = '';
        if (!code) return;
  
        const format =
          code.length === 8 ? 'EAN8' :
          code.length === 13 ? 'EAN13' : 'CODE128';
  
        JsBarcode(svg, code, {
          format,
          displayValue: true,
          margin: 0,
          height: 24,
          width: 1.1,
          fontSize: 10,
          textMargin: 0
        });
      });
    }
}

