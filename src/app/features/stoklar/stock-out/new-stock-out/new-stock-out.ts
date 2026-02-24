import { Component, Inject, signal, OnInit } from '@angular/core';
import { SharedImports } from '../../../../core/pipes/shared-imports';
import { FormsModule } from '@angular/forms';
import { StokAraCT } from '../../../../models/ortakModeller';
import { WarehouseService } from '../../../../services/warehouse.service';
import { StockOutService } from '../../../../services/inventory/stock-out.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { share, finalize } from 'rxjs';
import { CikisFisleriEkleDto } from '../../../../models/ekle-dtolari.model';
import { KalemDto } from '../../../../models/ayrinti-dtolari.model';

@Component({
  selector: 'app-new-stock-out',
  imports: [SharedImports, FormsModule],
  templateUrl: './new-stock-out.html',
  styleUrl: './new-stock-out.css',
})
export class NewStockOut implements OnInit {
  searchText = signal('');
  quantity = signal(0);
  foundProducts = signal<StokAraCT[]>([]);
  selectedProduct = signal<StokAraCT | null>(null);
  listOfData = signal<any[]>([]);
  sending = signal(false);

  postData: CikisFisleriEkleDto = {
    olusturanAdSoyad: '',
    onaylayanAdSoyad: '',
    kalemler: []
  };

  constructor(
    private stockOutService: StockOutService,
    private warehouseService: WarehouseService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {

  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchText.set(value);
    this.searchProduct();
  }

  searchProduct(): void {
    const searchTerm = this.searchText().trim(); // trim eklendi
    if (searchTerm.length < 3) {
      this.foundProducts.set([]);
      return;
    }

    this.warehouseService.searchStock(searchTerm)
      .pipe(share())
      .subscribe({
        next: (products) => {
          this.foundProducts.set(products);
        },
        error: (err) => {
          console.error('Ürün arama hatası:', err);
          this.foundProducts.set([]);
        }
      });
  }

  selectProduct(product: StokAraCT): void {
    this.searchText.set(product.stokKod);
    this.selectedProduct.set(product);
    this.foundProducts.set([]);
    
    // Opsiyonel: Miktar input'una focus
    setTimeout(() => {
      const quantityInput = document.querySelector('input[type="number"]') as HTMLInputElement;
      quantityInput?.focus();
    });
  }

  addProduct(): void {
    const selected = this.selectedProduct();
    const miktar = this.quantity();
    
    if (!selected || !miktar || miktar <= 0) { // Sıfır ve negatif kontrolü
      return;
    }

    const exists = this.listOfData().some(item => item.stokkodu === selected.stokKod);

    if (exists) {
      this.listOfData.update(list =>
        list.map(item =>
          item.stokkodu === selected.stokKod
            ? { ...item, miktar: item.miktar + miktar }
            : item
        )
      );
    } else {
      const newProduct = {
        stokkodu: selected.stokKod,
        stokadi: selected.stokIsim,
        miktar: miktar
      };
      this.listOfData.update(list => [...list, newProduct]);
    }

    // Formu temizle
    this.selectedProduct.set(null);
    this.quantity.set(0);
    this.searchText.set('');
  }

  removeProduct(index: number): void {
    this.listOfData.update(list => list.filter((_, i) => i !== index));
  }

  private mapToDto(): KalemDto[] {
    return this.listOfData().map(item => ({
      stokKodu: item.stokkodu,
      stokAdi: item.stokadi,
      sevkMiktari: item.miktar
    }));
  }

  save(): void {
    if (!this.listOfData().length) {
      return;
    }

    this.postData.kalemler = this.mapToDto();
    console.log('Gönderilecek DTO:', this.postData);

    this.sending.set(true);
    this.stockOutService.createReceipt(this.data.id, this.postData)
      .pipe(finalize(() => this.sending.set(false)))
      .subscribe({
        next: (response) => {
          console.log('Stok çıkışı kaydedildi:', response);
          this.dialog.closeAll();
        },
        error: (error) => {
          console.error('Stok çıkışı kaydedilirken hata oluştu:', error);
          // TODO: Kullanıcıya hata mesajı göster
        }
      });
  }

  trackByStokKod(index: number, item: any): string {
    return item?.stokKod || index; // Güvenli erişim
  }

  close(): void {
    if (this.listOfData().length > 0 && !this.sending()) {
      // TODO: Kullanıcıya kaydedilmemiş değişiklikler var mı diye sor
      if (confirm('Kaydedilmemiş değişiklikler var. Çıkmak istediğinize emin misiniz?')) {
        this.dialog.closeAll();
      }
    } else {
      this.dialog.closeAll();
    }
  }
}