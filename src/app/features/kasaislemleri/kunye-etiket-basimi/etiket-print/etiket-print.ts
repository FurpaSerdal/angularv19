import { CommonModule,DatePipe } from '@angular/common';
import {
AfterViewChecked,
Component,
Input,
OnChanges,
SimpleChanges
} from '@angular/core';
import JsBarcode from 'jsbarcode';
import { Tag } from '../../../../models/eskiAngular';

@Component({
  selector: 'app-etiket-print',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl:'./etiket-print.html',
  styleUrls: ['./etiket-print.css'],
})
export class EtiketPrint implements OnChanges, AfterViewChecked {

  @Input() tags: Tag[] = [];

  tagsPaged: { items: Tag[]; startIndex: number }[] = [];

  private barcodeRendered = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tags']) {
      this.buildPages();
      this.barcodeRendered = false;
    }
  }

  ngAfterViewChecked(): void {
    if (!this.barcodeRendered && this.tags.length) {
      this.barcodeRendered = true;
      setTimeout(() => this.renderBarcodes(), 50);
    }
  }

  private buildPages() {
    this.tagsPaged = [];

    for (let i = 0; i < this.tags.length; i += 4) {
      this.tagsPaged.push({
        items: this.tags.slice(i, i + 4),
        startIndex: i
      });
    }
  }

  private renderBarcodes() {
    this.tags.forEach((tag, index) => {
      const value = (tag.takenTag ?? '').toString().trim();
      if (!value) return;

      const el = document.querySelector(`#barcode-${index}`) as SVGElement | null;
      if (!el) return;

      const format =
        value.length === 8 ? 'EAN8' :
        value.length === 13 ? 'EAN13' :
        'CODE128';

      JsBarcode(el, value, {
        format,
        displayValue: true,
        height: 70,
        width: 1.2,
        margin: 0,
        textMargin: 2,
        fontSize: 10,
      });
    });
  }
}