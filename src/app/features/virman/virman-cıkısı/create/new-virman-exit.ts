import { Component,Inject,signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';
import { share } from 'rxjs';
import { SharedImports } from '../../../../core/pipes/shared-imports';
import { VirmanEkleDto,VirmanKalemiDto } from '../../../../models/ekle-dtolari.model';
import { StokAraCT } from '../../../../models/ortakModeller';
import { VirmansTransaction } from '../../../../services/virmans/virmans-transaction';
import { WarehouseService } from '../../../../services/warehouse.service';

@Component({
  selector: 'app-new-virman-exit',
  imports: [SharedImports, FormsModule],
  templateUrl: './new-virman-exit.html',
  styleUrls: ['./new-virman-exit.css'],
})
export class NewVirmanExit {


  searchText = signal('');
  quantity = signal(0);
  foundProducts = signal<StokAraCT[]>([]);
  selectedProduct = signal<StokAraCT | null>(null);

  searchText2 = signal('');
  quantity2 = signal(0);
  foundProducts2 = signal<StokAraCT[]>([]);
  selectedProduct2 = signal<StokAraCT | null>(null);

  listOfData = signal<any[]>([]);
  sending = signal(false);


  postData: VirmanEkleDto = {
    virmanYapanAdSoyad: '',
    kalemler  : []


  };

  constructor(
    private virmansTransaction: VirmansTransaction,
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

  searchProduct2(): void {
    const searchTerm = this.searchText2();
    if (!searchTerm.trim()) {
      this.foundProducts2.set([]);
      return;
    }
    if (searchTerm.length < 3) {
      this.foundProducts2.set([]);
      return;
    }

    this.warehouseService.searchStock(searchTerm)
      .pipe(share())
      .subscribe((products) => {
        this.foundProducts2.set(products);
      });
  }

  selectProduct(product: StokAraCT): void {
    this.searchText.set(product.stokKod);
    this.selectedProduct.set(product);
    this.foundProducts.set([]);
  }

  selectProduct2(product: StokAraCT): void {
    this.searchText2.set(product.stokKod);
    this.selectedProduct2.set(product);
    this.foundProducts2.set([]);
  }

  addProduct(): void {
    const product1 :any ={
stokKod : this.selectedProduct()?.stokKod,
stokIsim : this.selectedProduct()?.stokIsim,
virmancikisi : true,
sevkMiktari : this.quantity() || 0,
    };

    const product2 :any = {
stokKod : this.selectedProduct2()?.stokKod,
stokIsim : this.selectedProduct2()?.stokIsim,
virmancikisi : false,
sevkMiktari : this.quantity2() || 0,
    };
    const qty1 = this.quantity();
    const qty2 = this.quantity2();

    if (!product1 || !product2 || !qty1 || !qty2) {
      return;
    }


    // İlk ürünü ekle
    this.addProductToList(product1, qty1);
    
    // İkinci ürünü ekle
    this.addProductToList(product2, qty2);


    // Formu sıfırla
    this.selectedProduct.set(null);
    this.selectedProduct2.set(null);
    this.quantity.set(0);
    this.quantity2.set(0);
    this.searchText.set('');
    this.searchText2.set('');
  }

  private addProductToList(product: any, qty: number): void {
    const exists = this.listOfData().some(item => item.stokKod === product.stokKod);

    if (exists) {
      this.listOfData.update(list =>
        list.map(item =>
          item.stokKod === product.stokKod
            ? { ...item, miktar: item.miktar + qty }
            : item
        )
      );
    } else {
      const newProduct = {
        stokKod: product.stokKod,
        stokIsim: product.stokIsim,
        miktar: qty,
        virmancikisi: product.virmancikisi
      };
      this.listOfData.update(list => [...list, newProduct]);
    }
  }
  removeProduct(index: number): void {
    this.listOfData.update(list => list.filter((_, i) => i !== index));
  }


  private mapToDto(): VirmanKalemiDto[] {
    return this.listOfData().map(item => ({
      parcalanacakStokKodu: item.stokKod,
      parcalanacakMiktar: item.virmancikisi ? item.miktar : 0,
      virmaniYapilacakStokKodu: item.stokKod,
      virmanMiktari: item.virmancikisi ? 0 : item.miktar

    }));
  }

  save(): void {
    this.postData.kalemler = this.mapToDto();

    this.sending.set(true);
    this.virmansTransaction.createVirmans(this.data.id, this.postData).subscribe( 
      (response) => {
        this.sending.set(false);
        //this.dialog.closeAll();
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
