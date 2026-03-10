import { Component,Inject,signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';
import { share } from 'rxjs';
import { SharedImports } from '../../../core/pipes/shared-imports';
import { SayimSonuclariEkleDto,SayimSonucuKalemiDto } from '../../../models/ekle-dtolari.model';
import { StokAraCT } from '../../../models/ortakModeller';
import { StockCountService } from '../../../services/inventory/stock-count.service';
import { WarehouseService } from '../../../services/warehouse.service';

@Component({
  selector: 'app-new-inventory-count',
  imports: [SharedImports, FormsModule],
  templateUrl: './new-inventory-count.html',
  styleUrls: ['./new-inventory-count.css'],
})
export class NewInventoryCount {
  searchText = signal('');
  quantity = signal(0);
  foundProducts = signal<StokAraCT[]>([]);
  selectedProduct = signal<StokAraCT | null>(null);
  listOfData = signal<any[]>([]);
  sending = signal(false);


  postData: SayimSonuclariEkleDto = {
    sayanAdSoyad  : '',
    kalemler  : []

  };

  constructor(
    private stockCountService: StockCountService,
    private warehouseService: WarehouseService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchText.set(value);
    this.searchProduct();
  }

  searchProduct(): void {
    const searchTerm = this.searchText();
    if (!searchTerm.trim()) {
      this.foundProducts.set([]);
      return;
    }
    if (searchTerm.length < 3) {
      this.foundProducts.set([]);
      return;
    }

    this.warehouseService.searchStock(searchTerm)
      .pipe(share())
      .subscribe((products) => {
        this.foundProducts.set(products);
      });
  }

  selectProduct(product: StokAraCT): void {
    this.searchText.set(product.stokKod);
    this.selectedProduct.set(product);
    this.foundProducts.set([]);
  }

  addProduct(): void {
    if (!this.selectedProduct() || !this.quantity()) {
      return;
    }

    const selected = this.selectedProduct()!;
    const exists = this.listOfData().some(item => item.stokkodu === selected.stokKod);

    if (exists) {
      this.listOfData.update(list =>
        list.map(item =>
          item.stokkodu === selected.stokKod
            ? { ...item, miktar: item.miktar + this.quantity() }
            : item
        )
      );
    } else {
      const newProduct = {
        stokkodu: selected.stokKod,
        stokadi: selected.stokIsim,
        brimMusiri: selected.fiyatTipKodu,
        miktar: this.quantity()
      };
      this.listOfData.update(list => [...list, newProduct]);
    }

    this.selectedProduct.set(null);
    this.quantity.set(0);
    this.searchText.set('');
  }
  removeProduct(index: number): void {
    this.listOfData.update(list => list.filter((_, i) => i !== index));
  }


  private mapToDto(): SayimSonucuKalemiDto[] {
    return this.listOfData().map(item => ({
      parcalanacakMiktar: item.miktar,
      parcalanacakStokKodu: item.stokkodu,
      virmanMiktari: item.miktar,
      virmaniYapilacakStokKodu: item.stokkodu

    }));
  }

  save(): void {
    this.postData.kalemler = this.mapToDto();

    this.sending.set(true);
    this.stockCountService.createResult(this.data.id, this.postData).subscribe( 
      (response) => {
        console.log('Stok sayımı kaydedildi:', response);
        this.dialog.closeAll();
      },
      (error) => {
        console.error('Stok sayımı kaydedilirken hata oluştu:', error);
      }
    );
  }
trackByStokKod(_: number, item: any) {
  return item.stokKod;
}
  close(): void {
    this.dialog.closeAll();
  }
}
