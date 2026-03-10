import { CommonModule } from '@angular/common';
import { AfterViewInit,Component,Input,OnChanges,OnDestroy,OnInit,SimpleChanges } from '@angular/core';
import JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-fiyatetiket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fiyatetiket.component.html',
  styleUrls: ['./fiyatetiket.component.css']
})
export class FiyatetiketComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() productsToPrint: any[] = [];

  etiketCikarmaTarihi: string = new Date().toISOString().slice(0, 16);

  private beforePrintHandler = () => this.renderBarcodesSafe();

  ngOnInit(): void {
    window.addEventListener('beforeprint', this.beforePrintHandler);
  }

  ngAfterViewInit(): void {
    this.renderBarcodesSafe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productsToPrint']) {
      this.renderBarcodesSafe();
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeprint', this.beforePrintHandler);
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
        width: 1.2,
        height: 40,
        displayValue: true,
        margin: 0,
        fontSize: 14,
        textMargin: 0
      });
    });
  }
}