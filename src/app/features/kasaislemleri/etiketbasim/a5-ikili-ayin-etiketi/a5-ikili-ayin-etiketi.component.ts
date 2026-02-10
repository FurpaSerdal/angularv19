import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import JsBarcode from "jsbarcode";

@Component({
  selector: 'app-a5-ikili-ayin-etiketi',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './a5-ikili-ayin-etiketi.component.html',
  styleUrl: './a5-ikili-ayin-etiketi.component.css'
})
export class A5IkiliAyinEtiketiComponent {
  @Input() productsToPrint: any[] = [];
  etiketCikarmaTarihi: string = new Date().toISOString().slice(0, 16);
  productsToPrintChunks: any[][] = [];

  constructor() {
    // Verinin doğru şekilde alındığını kontrol et
    console.log(this.productsToPrint);
  }

  ngOnInit(): void {
    this.chunkProducts(this.productsToPrint);
  }

  // Ürünleri 2'li gruplara ayırma fonksiyonu
  chunkProducts(products: any[]) {
    for (let i = 0; i < products.length; i += 2) {
      this.productsToPrintChunks.push(products.slice(i, i + 2));
    }
  }

  // JsBarcode'ı sayfa yüklendikten sonra çalıştır
  ngAfterViewInit(): void {
    // barcode id'si her ürün için dinamik olarak oluşturulacak
    this.productsToPrint.forEach((product, index) => {
      setTimeout(() => { // setTimeout ile küçük bir gecikme ekliyoruz
        JsBarcode(`#barcode-${index}`, product.barcode, {
          format: 'EAN13',
          width: 2,
          height: 50,
          displayValue: true
        });
      }, 0); // küçük bir gecikme ile işlem yapılması sağlanır
    });
  }
}
