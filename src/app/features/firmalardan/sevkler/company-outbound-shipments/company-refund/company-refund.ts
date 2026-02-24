import { CommonModule } from '@angular/common';
import { Component, effect, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from '../../../../../services/company.service';
import {  StokAraCT } from '../../../../../models/ortakModeller';
import { ShipmentNotesService } from '../../../../../services/shipments/shipment-notes.service';
import { MeService } from '../../../../../services/meservice.service';
import { listProducts } from '../../../../../models/listProduct';
import { SevkIrsaliyeleriEkleDto } from '../../../../../models/ekle-dtolari.model';
import { KalemDto } from '../../../../../models/ayrinti-dtolari.model';

@Component({
  selector: 'app-company-refund',
  imports: [CommonModule, MatTableModule, FormsModule, MatIconModule],
  templateUrl: './company-refund.html',
  styleUrls: ['./company-refund.css'],
})
export class CompanyRefund {

  // Sinyaller
  bulunancariler = signal<any[]>([]);
  seciliFirma = signal<any>(null);
  girilenCariKod = signal<string>('');
  kendiDepom = signal<number>(0);
  seciliGorev = signal<number>(0);
  gorevAdi = signal<string>('');
  aramaGirdisi = signal<string>('');
  gonderiliyor = signal<boolean>(false);
  bulunanUrunler = signal<StokAraCT[]>([]);
  urunListesi = signal<listProducts[]>([]);
  formdata = signal<any>({
    duzenleyen: '',
    muhatapTemsilci: '',
    vknTckn: ''
  });
  
  // Form Model
  postorder: SevkIrsaliyeleriEkleDto = this.initializeForm();
  
  // Tablo
  dataSource = new MatTableDataSource<listProducts>([]);
  displayedColumns: string[] = ['UrunAdi', 'Kod', 'Barkod', 'Birim', 'IadeMiktari', 'aksiyon'];

  // Hata/Success Mesajları
  saveError = signal<string>('');
  saveSuccess = signal<string>('');

  constructor(
    private companyservice: CompanyService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private shipmentNotesService: ShipmentNotesService,
    private meservice: MeService,
    public dialogRef: MatDialogRef<CompanyRefund>,
  ) {
    effect(() => {
      this.seciliGorev.set(this.meservice.selectedGorev()?.id ?? 0);
    });
  }
  private initializeForm(): SevkIrsaliyeleriEkleDto {
    return {
      sevkedenAdSoyad: '',
      iadedir: true,
      cariKod: '',
      kalemler: []

    };
  }
  ngOnInit(): void {
    const depom = localStorage.getItem('depoNo');
    const seciliGorevId = localStorage.getItem('seçiliGörevid');
    const gorevAdi = localStorage.getItem('seçiliGörevadi');
    this.seciliGorev.set(Number(seciliGorevId));
    this.kendiDepom.set(Number(depom));
    this.gorevAdi.set(gorevAdi ?? '');
  }

  // Firma İşlemleri
  firmaAra() {
    const query = this.girilenCariKod().trim();
    if (query.length < 2) {
      this.toastr.warning('En az 2 karakter giriniz', 'Uyarı');
      return;
    }

    this.companyservice.searchCustomerAccount(query).subscribe({
      next: (data) => {
        this.bulunancariler.set(data);
        if (data.length === 0) {
          this.toastr.info('Firma bulunamadı', 'Bilgi');
        }
      },
      error: (err) => {
        console.error('Firma arama hatası:', err);
        this.toastr.error('Firma arama sırasında hata oluştu', 'Hata');
      }
    });
  }

  firmaSec(firma: any) {
    this.seciliFirma.set(firma);
    this.postorder.cariKod = firma.cariKod;

    this.girilenCariKod.set(firma.cariKod);
    this.bulunancariler.set([]);
    this.toastr.success(`${firma.cariUnvan || firma.unvan} firması seçildi`, 'Başarılı');
  }

  // Ürün İşlemleri
  urunAra(aranacak: string) {
    if (!this.seciliFirma()) {
      this.toastr.warning('Önce firma seçmelisiniz', 'Uyarı');
      return;
    }

    const aranacakKelime = aranacak.trim();
    if (aranacakKelime.length < 2) {
      this.toastr.warning('En az 2 karakter giriniz', 'Uyarı');
      return;
    }

    const dto = {
      CariKod: this.postorder.cariKod,
      Bul: aranacakKelime.toLocaleLowerCase()
    };

    this.companyservice.searchStockByCustomerCode(dto).subscribe({
      next: (value) => {
        this.bulunanUrunler.set(value);
        if (value.length === 0) {
          this.toastr.info('Ürün bulunamadı', 'Bilgi');
        }
      },
      error: (err) => {
        console.error('StokAra hatası:', err);
        this.toastr.error('Ürün arama sırasında hata oluştu', 'Hata');
      }
    });
  }

  urunSec(urun: StokAraCT) {
    // Ürün zaten ekli mi kontrol et
    const existingIndex = this.urunListesi().findIndex(
      u => u.stokKodu === urun.stokKod
    );

    if (existingIndex !== -1) {
      this.miktarArttir(existingIndex);
      this.toastr.info('Ürün miktarı arttırıldı', 'Bilgi');
    } else {
      const eklenecekUrun: listProducts = {
        stokAdi: urun.stokIsim,
        stokKodu: urun.stokKod,
        barkod: urun.barKodu,
        fiyat: urun.fiyati,
        birimKatSayi: urun.birimKatsayisi,
        birimAd: urun.birimAd,
        miktar: 1,
      };

      this.urunListesi.set([...this.urunListesi(), eklenecekUrun]);
      this.dataSource.data = this.urunListesi();
      this.toastr.success('Ürün eklendi', 'Başarılı');
    }

    this.bulunanUrunler.set([]);
    this.aramaGirdisi.set('');
  }

  miktarArttir(index: number) {
    this.setMiktar(index, (this.urunListesi()[index].miktar || 0) + 1);
  }

  miktarAzalt(index: number) {
    this.setMiktar(index, Math.max(1, (this.urunListesi()[index].miktar || 1) - 1));
  }

  miktarGir(index: number, value: string | number) {
    const numericValue = Number(value);
    const next = Number.isFinite(numericValue) ? Math.max(1, numericValue) : 1;
    this.setMiktar(index, next);
  }

  private setMiktar(index: number, miktar: number) {
    this.urunListesi.update(p => {
      const validatedKalemler = [...p];
      if (!validatedKalemler[index]) return p;

      validatedKalemler[index] = {
        ...validatedKalemler[index],
        miktar: Math.max(1, miktar)
      };

      this.dataSource.data = validatedKalemler;
      return validatedKalemler;
    });
  }

  // Ürün Silme
  urunSil(index: number) {
    const urunAdi = this.urunListesi()[index].stokAdi;
    const newList = [...this.urunListesi()];
    newList.splice(index, 1);
    this.urunListesi.set(newList);
    this.dataSource.data = this.urunListesi();
    this.toastr.warning(`${urunAdi} ürünü silindi`, 'Silindi');
  }

  // Toplamlar
  toplamIadeMiktari(): number {
    return this.urunListesi().reduce((total, urun) => {
      return total + (urun.miktar ?? 0);
    }, 0);
  }

  toplamKalemSayisi(): number {
    return this.urunListesi().length;
  }
  private buildpostorder(): SevkIrsaliyeleriEkleDto {
    const kalemler: KalemDto[] = this.urunListesi().map(urun => ({
      stokKodu: urun.stokKodu,
      aciklama: 'İade işlemi',
      sevkMiktari: urun.miktar,
    }));
    return {
      ...this.postorder,
      iadedir : true,
      cariKod: this.postorder.cariKod,
      sevkedenAdSoyad: this.formdata().duzenleyen,
      kalemler: kalemler

    };
  }

  // Kayıt İşlemi
  kaydet() {
    // Validasyonlar
    if (!this.seciliFirma()) {
      this.toastr.error('Lütfen firma seçiniz', 'Hata');
      return;
    }

    if (this.urunListesi().length === 0) {
      this.toastr.error('En az bir ürün ekleyiniz', 'Hata');
      return;
    }

    this.gonderiliyor.set(true);
    this.saveError.set('');
    this.saveSuccess.set('');


  

    this.shipmentNotesService.createCompanyShipment(this.seciliGorev(), this.buildpostorder()).subscribe({
      next: (response: any) => {
        this.toastr.success('İade sevk notu başarıyla oluşturuldu.', 'Başarılı');
        this.saveSuccess.set('İade evrakı başarıyla kaydedildi.');
        this.gonderiliyor.set(false);
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1500);
      },
      error: (error: any) => {
        console.error('Sevk notu oluşturma hatası:', error);
        const errorMessage = error.error?.message || 'İade sevk notu oluşturulurken bir hata oluştu.';
        this.toastr.error(errorMessage, 'Hata');
        this.saveError.set(errorMessage);
        this.gonderiliyor.set(false);
      }
    });
  }

  // Temizleme
  temizle() {
    if (this.urunListesi().length === 0 && !this.seciliFirma()) {
      this.toastr.info('Zaten temiz', 'Bilgi');
      return;
    }

    this.urunListesi.set([]);
    this.dataSource.data = [];
    this.bulunanUrunler.set([]);
    this.bulunancariler.set([]);
    this.seciliFirma.set(null);
    this.girilenCariKod.set('');
    this.aramaGirdisi.set('');
    this.postorder = this.initializeForm();
    this.formdata.set({
      duzenleyen: '',
      muhatapTemsilci: '',
      vknTckn: ''
    });

    this.saveError.set('');
    this.saveSuccess.set('');
    
    this.toastr.info('Form temizlendi', '', { timeOut: 2000 });
  }

  tumunuTemizle() {
    this.temizle();
  }


  trackByKalem = (_: number, kalem: any) => kalem.urunKodu;
  // Kapatma
  kapat() {
    if (this.urunListesi().length > 0 || this.seciliFirma()) {
      if (confirm('Kaydedilmemiş değişiklikler var. Kapatmak istediğinize emin misiniz?')) {
        this.dialogRef.close();
      }
    } else {
      this.dialogRef.close();
    }
  }
}