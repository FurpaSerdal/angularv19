import { CommonModule } from '@angular/common';
import { Component, computed, effect, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { WarehouseService } from '../../../../../services/warehouse.service';
import { ShipmentNotesService } from '../../../../../services/shipments/shipment-notes.service';
import { MeService } from '../../../../../services/meservice.service';
import Swal from 'sweetalert2';
import {  StokAraCT } from '../../../../../models/ortakModeller';

import { DepolaraSevkIrsaliyeleriEkleDto } from '../../../../../models/ekle-dtolari.model';
import { AlinanDepoSiparisleriAyrintiDto } from '../../../../../models/ayrinti-dtolari.model';

export interface Kalem {
  stokKodu: string;
  stokIsim: string;
  sevkGuid: string | null;
  siparisGuid: string | null;
  siparisMiktari: number | null;
  malKabulMiktari: number | null;
  sevkMiktari: number | null;
  durum?: string | null;
}

@Component({
  selector: 'app-warehouse-sales-order-to-shipment',
  imports: [CommonModule, MatTableModule, FormsModule, MatIconModule],
  templateUrl: './warehouse-sales-order-to-shipment.html',
  styleUrl: './warehouse-sales-order-to-shipment.css',
})
export class WarehouseSalesOrderToShipment {
  // Form ve arama
  urunAraMetni = '';
  
  // Signals
  karsiDepo = signal<number | null>(null);
  detay = signal<AlinanDepoSiparisleriAyrintiDto | null>(null);
  nextgorevid = signal<number>(0);
  gonderiliyor = signal<boolean>(false);
  urunler = signal<Kalem[]>([]);
  
  // Data ve form
  postorder: DepolaraSevkIrsaliyeleriEkleDto = this.initializeForm();
  dataSource = new MatTableDataSource<Kalem>([]);
  displayedColumns: string[] = ['UrunAdi', 'UrunKodu', 'MalKabulMiktari', 'aksiyon'];

  constructor(
    private meservice: MeService,
    private shipmentnoteservice: ShipmentNotesService,
    private warehouseService: WarehouseService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<WarehouseSalesOrderToShipment>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // Computed properties
  readonly seciliGorevid = computed(() =>
    this.meservice.selectedGorev()?.id ?? 0
  );
  readonly toplamSevkMiktari = computed(() =>
    this.urunler().reduce((total, item) => total + (item.sevkMiktari || 0), 0)
  );



  private initializeForm(): DepolaraSevkIrsaliyeleriEkleDto {
    return {
        iadedir: false,
        muhatapDepoNo: this.karsiDepo() ?? 0,
        sevkedenAdSoyad: '',
        kalemler: []
   
    };
  }

ngOnInit(): void {
  this.detay.set(this.data.detay);

  const initialData = this.detay()?.kalemler ?? [];

  const kalem: Kalem[] = initialData.map(k => ({
    stokKodu: k.stokKodu ?? '',
    stokIsim: k.stokIsmi ?? '',

    sevkGuid: k.sevkGuid ?? null,
    siparisGuid: k.siparisGuid ?? null,

    siparisMiktari: k.siparisMiktari ?? null,
    malKabulMiktari: k.malKabulMiktari ?? null,
    sevkMiktari: k.sevkMiktari ?? null,

    durum: null
  }));

  this.dataSource.data = kalem;
  this.urunler.set(kalem);

 this.postorder.muhatapDepoNo =this.detay()?.muhatapDepoNo ?? 0;
 this.karsiDepo.set(this.detay()?.muhatapDepoNo ?? null);
  this.nextgorevid.set(this.data.nextgorevid);
}
  urunEkle(): void {
    const aranacak = this.urunAraMetni.trim();
    
    if (!aranacak) {
      this.toastr.warning('Lütfen bir ürün kodu veya adı girin.', '', { timeOut: 2000 });
      return;
    }

    this.warehouseService.searchStock(aranacak).subscribe({
      next: (stoklar: StokAraCT[]) => {
        if (stoklar.length === 0) {
          this.toastr.info('Aranan kriterlere uygun ürün bulunamadı.', '', { timeOut: 2000 });
          return;
        }

        const secilenStok = stoklar[0];
        const mevcutUrun = this.urunler().find(item => item.stokKodu === secilenStok.stokKod);
        
        if (mevcutUrun) {
          const updatedData = this.urunler().map(item => {
            if (item.stokKodu === secilenStok.stokKod) {
              return {
                ...item,
                sevkMiktari: (item.sevkMiktari || 0) + (secilenStok.birimKatsayisi || 1)
              };
            }
            return item;
          });
          this.dataSource.data = updatedData;
          this.urunler.set(updatedData);
          this.toastr.info('Ürün zaten listede mevcut, miktarı güncellendi.', '', { timeOut: 2000 });
          return;
        }

        const yeniUrun: Kalem = {
          siparisGuid: null,
          sevkGuid: null,
          stokKodu: secilenStok.stokKod,
          stokIsim: secilenStok.stokIsim,
          siparisMiktari: null,
          malKabulMiktari: null,
          sevkMiktari: 1,
          durum: null
        };
        
        const newData = [...this.urunler(), yeniUrun];
        this.dataSource.data = newData;
        this.urunler.set(newData);
        this.toastr.success('Ürün başarıyla eklendi.', '', { timeOut: 2000 });
      },
      error: (err) => {
        this.toastr.error('Ürün aranırken bir hata oluştu.', '', { timeOut: 2000 });
        console.error(err);
      }
    });
    
    this.urunAraMetni = '';
  }

  trackByStokKodu(index: number, item: Kalem): string {
    return item.stokKodu;
  }

  guncelleSignal(): void {
    const currentData = [...this.urunler()];
    this.dataSource.data = currentData;
    this.urunler.set(currentData);
  }

  urunCikar(urun: any): void {
    Swal.fire({
      title: 'Emin misiniz?',
      text: 'Bu ürünü listeden çıkarmak üzeresiniz',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, sil',
      cancelButtonText: 'Vazgeç',
      confirmButtonColor: '#198754',
      cancelButtonColor: '#dc3545',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.isConfirmed) {
        const filteredData = this.urunler().filter(
          item => item.stokKodu !== urun.stokKodu
        );
        this.dataSource.data = filteredData;
        this.urunler.set(filteredData);

        Swal.fire({
          icon: 'success',
          title: 'Silindi',
          text: 'Ürün listeden çıkarıldı',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }

  kaydet(): void {
    this.gonderiliyor.set(true);
    
  
this.postorder.kalemler = this.urunler().map(x => ({
  ...x,
  siparisGuid: x.siparisGuid ?? undefined,
  sevkGuid: x.sevkGuid ?? undefined,
  siparisMiktari: x.siparisMiktari ?? undefined,
  malKabulMiktari: x.malKabulMiktari ?? undefined,
  sevkMiktari: x.sevkMiktari ?? undefined,
  durum: x.durum ?? undefined
}));

    const toastRef = this.toastr.show('Gönderiliyor...', '', {
      disableTimeOut: true,
      progressBar: true,
      tapToDismiss: false,
      closeButton: false,
      toastClass: 'ngx-toastr info-toast'
    });

    this.shipmentnoteservice.createBranchShipment(this.nextgorevid(), this.postorder)
      .subscribe({
        next: () => {
          this.toastr.clear(toastRef.toastId);
          this.toastr.success('Başarıyla kaydedildi!');
          this.gonderiliyor.set(false);
          this.temizle();
        },
        error: (err) => {
          this.toastr.clear(toastRef.toastId);
          this.toastr.error('Kaydedilirken hata oluştu!');
          console.error(err);
          this.gonderiliyor.set(false);
        }
      });
  }

  temizle(): void {
    this.dataSource.data = [];
    this.urunler.set([]);
    this.postorder = this.initializeForm();
    this.toastr.info('Form temizlendi', '', { timeOut: 2000 });
  }

  kapat(): void {
    this.dialogRef.close();
  }
}
