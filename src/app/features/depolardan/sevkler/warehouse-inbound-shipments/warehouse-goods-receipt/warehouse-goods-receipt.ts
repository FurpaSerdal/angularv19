import { CommonModule } from '@angular/common';
import { Component, effect, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { WarehouseService } from '../../../../../services/warehouse.service';
import { depoMalKabulModel } from '../../../../../models/depoMalKabulModel';
import { MeService } from '../../../../../services/meservice.service';
import { Kalem, NoksanFazlaIadesi, StokAraCT } from '../../../../../models/genelModel';

import { ShipmentNotesService } from '../../../../../services/shipments/shipment-notes.service';
import { GoodsReceiptNotesService } from '../../../../../services/receipts/goods-receipt-notes.service';
import { SalesOrdersService } from '../../../../../services/orders/sales-orders.service';
import { RefundConfirmDialogComponent } from '../../../../../modal/refund-confirm-dialog/refund-confirm-dialog';
import { SubeSiparisiAlDto } from '../../../../../models/depoSipAlModel';
import { ExcessConfirmDialogComponent } from '../../../../../modal/ExcessConfirmDialogComponent';
import { ConfirmDialogComponent } from '../../../../../modal/ConfirmDialogComponent';


@Component({
  selector: 'app-warehouse-goods-receipt',
  imports: [CommonModule, MatTableModule, FormsModule, MatIconModule],
  templateUrl: './warehouse-goods-receipt.html',
  styleUrl: './warehouse-goods-receipt.css',
})
export class WarehouseGoodsReceipt {

  evrakdetay = signal<any>(null);
  muhatapDepoNo = signal<number>(0);
  barkodGirdisi = signal<string>('');
  altmenu = signal(0);
  aramaGirdisi = signal<string>('');
  gonderiliyor = signal<boolean>(false);



  postorder: depoMalKabulModel = {
    evrakNoSeri: '',
    evrakNoSira: 0,
    kalemler: []
  };
  urunListesi = signal<any[]>([]);
  bulunanUrunler = signal<StokAraCT[]>([]);
  secilenUrun = signal<StokAraCT | null>(null);
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['UrunAdi', 'UrunKodu', 'MalKabulMiktari', 'aksiyon'];

  constructor(
    private meservice: MeService,
    private goodsReceiptNotesService: GoodsReceiptNotesService,
    private salesOrdersService: SalesOrdersService,
    private shipmentnoteservice: ShipmentNotesService,
    private dialog: MatDialog,

    private warehouseservice: WarehouseService,
    public dialogRef: MatDialogRef<WarehouseGoodsReceipt>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
  ) {
    effect(() => {
      this.altmenu.set(this.meservice.selectedAltMenu()?.id ?? 0);
    });


  }

  ngOnInit(): void {
    if (this.data && this.data.shipment) {
      this.evrakdetay.set(this.data.shipment);
      this.muhatapDepoNo.set(this.data.shipment.muhatapDepo.no);
      this.tabloMap(this.evrakdetay());

    }

  }



  tabloMap(data: any) {

    const veri = data?.kalemler?.map((urun: Kalem) => {
      const sevkMiktari = urun.sevkMiktari ?? 0;
      const malKabulMiktari = 0;

      return {
        UrunAdi: urun.stok.stokIsim,
        UrunKodu: urun.stok.stokKod,
        verilenSiparisMiktari: urun.siparisMiktari,
        sevkmiktari: sevkMiktari,
        MalKabulMiktari: malKabulMiktari,
        barkodu: urun.stok?.barkodlar?.[0]?.barKodu ?? '',
        fiyat: urun.stok.fiyat?.fiyati ?? 0,
        birimkatsayisi: urun.stok.barkodlar?.[0]?.birimKatSayisi ?? 1,
        sto_birim_ad: urun.stok.birimAd,
        aciklama: '',
        stok: urun.stok,

        sipId: urun.siparisGuid,

        fark: malKabulMiktari - sevkMiktari
      };
    }) ?? [];
    this.urunListesi.set(veri);
    this.dataSource.data = veri
  }


  barkodOku(barkod: string) {
    const aranacakKelime = barkod.toLocaleLowerCase();
    this.goodsReceiptNotesService.detailsBranchReceipt(this.altmenu(), barkod, 5)
      .subscribe({
        next: value => {
          this.evrakdetay.set(value);
          this.muhatapDepoNo.set(value.muhatapDepoNo);
          this.tabloMap(this.evrakdetay());

          this.barkodGirdisi.set('');
        },
        error: err => {
          this.toastr.error('Barkod ile sevk bulunamadı', 'Hata');
          console.error('BarkodOku hatası:', err);
        }
      });
  }

  urunAra(aranacak: string) {
    const aranacakKelime = aranacak.toLocaleLowerCase();


    this.warehouseservice
      .searchStock(aranacakKelime)
      .subscribe({
        next: value => this.bulunanUrunler.set(value),
        error: err => console.error('StokAra hatası:', err)
      });
  }


  urunSec(urun: StokAraCT) {
    this.secilenUrun.set(urun);
    this.urunEkle();
    this.bulunanUrunler.set([]);
  }

  urunEkle() {
    const secilenUrun = this.secilenUrun();
    if (!secilenUrun) return;

    const eklenecekUrun: any = {
      UrunAdi: secilenUrun.stokIsim,
      UrunKodu: secilenUrun.stokKod,
      barkodu: secilenUrun.barKodu,
      fiyat: secilenUrun.fiyati,
      birimkatsayisi: secilenUrun.birimKatsayisi,
      sto_birim_ad: secilenUrun.birimAd,
      onerilenMiktar: null,
      verilenSiparisMiktari: null,
      malKabulIrsaliyesiMiktari: null,
      MalKabulMiktari: 1,
      tedarikciStokKod: '',
      aciklama: '',
      fark: '',
      sipId: ''
    };

    const existingIndex = this.urunListesi().findIndex(
      u => u.UrunKodu === eklenecekUrun.UrunKodu
    );

    if (existingIndex !== -1) {
      const updatedList = this.urunListesi().map((item, index) =>
        index === existingIndex
          ? { ...item, MalKabulMiktari: (item.MalKabulMiktari ?? 0) + 1 }
          : item
      );
      this.urunListesi.set(updatedList);
    } else {
      this.urunListesi.set([...this.urunListesi(), eklenecekUrun]);
    }

    this.dataSource.data = this.urunListesi();
  }

  urunSil(index: number) {
    const newList = [...this.urunListesi()];
    newList.splice(index, 1);
    this.urunListesi.set(newList);
    this.dataSource.data = this.urunListesi();
  }

  kaydet() {
    this.gonderiliyor.set(true);

    /* ============================
     * 1️⃣ Kalemleri oluştur
     * ============================ */
    const kalemler: Kalem[] = this.urunListesi().map(urun => ({
      id: crypto.randomUUID(),
      stok: {
        stokKod: urun.UrunKodu,
        stokIsim: urun.UrunAdi,
        birimAd: urun.sto_birim_ad
      },
      siparisGuid: urun.siparisGuid,
      sevkGuid: urun.sevkGuid,
      siparisMiktari: urun.siparisMiktari ?? 0,
      sevkMiktari: urun.sevkMiktari ?? 0,
      malKabulMiktari: urun.MalKabulMiktari ?? 0,
      sevkMalKabulFarkMiktari: urun.fark ?? 0,
      aciklama: ''
    }));

    /* ============================
     * 2️⃣ Fark analizleri
     * ============================ */
    const malkabulFarkiPozitifler = kalemler.filter(
      k => (k.sevkMalKabulFarkMiktari ?? 0) > 0
    );

    const malkabulFarkiNegatifler = kalemler.filter(
      k => (k.sevkMalKabulFarkMiktari ?? 0) < 0
    );

    if (malkabulFarkiPozitifler.length > 0) {
      this.toastr.warning(
        'Mal kabul miktarı sevk miktarından fazla olan kalemler var',
        'Uyarı'
      );
    }

    /* ============================
     * 3️⃣ Evrak bilgileri
     * ============================ */
    this.postorder = {
      ...this.postorder,
      evrakNoSeri: this.evrakdetay()?.evrakNoSeri || '',
      evrakNoSira: this.evrakdetay()?.evrakNoSira || 0,
      kalemler
    };

    /* ============================
     * 4️⃣ Gönderiliyor toast
     * ============================ */
    const toastRef = this.toastr.show('Gönderiliyor...', '', {
      disableTimeOut: true,
      progressBar: true,
      tapToDismiss: false,
      closeButton: false,
      toastClass: 'ngx-toastr info-toast'
    });

    /* ============================
     * 5️⃣ Mal kabul kaydet
     * ============================ */
    this.goodsReceiptNotesService
      .createBranchReceipt(this.altmenu(), this.postorder)
      .subscribe({
        next: () => {
          this.toastr.clear(toastRef.toastId);
          this.toastr.success('Mal kabul başarıyla kaydedildi', 'Başarılı');
          this.gonderiliyor.set(false);

          const proceedWithPositives = () => {
            if (malkabulFarkiPozitifler.length > 0) {
              this.handlePositiveDifferences(malkabulFarkiPozitifler);
            } else {
              this.kapat();
            }
          };

          if (malkabulFarkiNegatifler.length > 0) {
            this.handleNegativeDifferences(malkabulFarkiNegatifler, proceedWithPositives);
          } else {
            proceedWithPositives();
          }
        },

        error: err => {
          this.toastr.clear(toastRef.toastId);
          this.toastr.error('Mal kabul kaydedilirken hata oluştu', 'Hata');
          console.error(err);
          this.gonderiliyor.set(false);
        }
      });
  }

  private handleNegativeDifferences(
    malkabulFarkiNegatifler: Kalem[],
    onComplete: () => void
  ) {
    this.toastr.info(
      'Mal kabul miktarı sevk miktarından az olan kalemler düzeltme gerekiyor',
      'Bilgi'
    );

    this.dialog
      .open(RefundConfirmDialogComponent, {
        width: '50vw',
        height: '70vh',
        data: {
          kalemler: malkabulFarkiNegatifler.map(k => ({
            ...k,
            stok: { ...k.stok }
          }))
        }
      })
      .afterClosed()
      .subscribe(confirm => {
        if (confirm !== true) {
          onComplete();
          return;
        }

        const sipKalemler: Kalem[] = malkabulFarkiNegatifler.map(k => ({
          id: k.id,
          stok: { ...k.stok },
          siparisGuid: k.siparisGuid,
          sevkGuid: k.sevkGuid,
            siparisMiktari: Math.abs(k.sevkMalKabulFarkMiktari ?? 0),
          sevkMiktari: k.sevkMiktari,
          malKabulMiktari: k.malKabulMiktari,
          sevkMalKabulFarkMiktari: k.sevkMalKabulFarkMiktari,
          iadeyeKonuIrsaliyeGuidi:  this.evrakdetay().id,
          aciklama: 'Noksan mal iade siparişi'
        }));

        const newData: SubeSiparisiAlDto = {
          noksanFazlaIadesi: 0,
          muhatapDepoNo: this.muhatapDepoNo(),
          kalemler: sipKalemler
        };

        this.salesOrdersService
          .createBranchOrder(this.data.iadeGorevId, newData)
          .subscribe({
            next: () => {
              this.toastr.success(
                'Noksan mal iade siparişi başarıyla oluşturuldu',
                'Başarılı'
              );
              onComplete();
            },
            error: err => {
              this.toastr.error(
                'Noksan mal iade siparişi oluşturulurken hata oluştu',
                'Hata'
              );
              console.error(err);
              onComplete();
            }
          });
      });
  }

  private handlePositiveDifferences(malkabulFarkiPozitifler: Kalem[]) {
    this.toastr.info(
      'Mal kabul miktarı sevk miktarından fazla olan kalemler için işlem seçiniz',
      'Bilgi'
    );

    this.dialog
      .open(ExcessConfirmDialogComponent, {
        width: '450px'
      })
      .afterClosed()
      .subscribe((decision: 'return' | 'correction' | null) => {
        if (decision === 'return') {


          this.salesOrdersService
            .createBranchOrder(this.data.iadeGorevId, {
              noksanFazlaIadesi: 1,
              muhatapDepoNo: this.muhatapDepoNo(),
              kalemler: malkabulFarkiPozitifler.map(k => ({
                id: k.id,
                stok: { ...k.stok },
                siparisGuid: k.siparisGuid,
                siparisMiktari: Math.abs(k.sevkMalKabulFarkMiktari ?? 0),
                sevkMiktari: k.sevkMiktari,
                malKabulMiktari: k.malKabulMiktari,
                sevkMalKabulFarkMiktari: k.sevkMalKabulFarkMiktari,
                iadeyeKonuIrsaliyeGuidi: this.evrakdetay().id,
                aciklama: 'Fazla mal iade sevkiyatı'
              }))
       
            })
            .subscribe({
              next: () =>
             {
                this.toastr.success(
                  'Fazla mal iade sevkiyatı başarıyla oluşturuldu',
                  'Başarılı'
                );
              },
              error: err => {
                this.toastr.error(
                  'Fazla mal iade sevkiyatı oluşturulurken hata oluştu',
                  'Hata'
                );
                console.error(err);
              },
              complete: () => this.kapat()
            });
          return;
        }

        if (decision === 'correction') {
          this.dialog
            .open(ConfirmDialogComponent, { width: '400px' })
            .afterClosed()
            .subscribe(confirmed => {
              confirmed
                ? this.toastr.success(
                    'Fazla mal kabul düzeltmesi onaylandı bısey yapmanıza gerek yok',
                    'Başarılı'
                  )
                : this.salesOrdersService
            .createBranchOrder(this.data.iadeGorevId, {
              noksanFazlaIadesi: 1,
              muhatapDepoNo: this.muhatapDepoNo(),
              kalemler: malkabulFarkiPozitifler.map(k => ({
                id: k.id,
                stok: { ...k.stok },
                siparisGuid: k.siparisGuid,
                siparisMiktari: Math.abs(k.sevkMalKabulFarkMiktari ?? 0),
                sevkMiktari: k.sevkMiktari,
                malKabulMiktari: k.malKabulMiktari,
                sevkMalKabulFarkMiktari: k.sevkMalKabulFarkMiktari,
                iadeyeKonuIrsaliyeGuidi: this.evrakdetay().id,
                aciklama: 'Fazla mal iade sevkiyatı'
              }))
            })
            .subscribe({
              next: () =>
                this.toastr.success(
                  'Fazla mal iade sevkiyatı başarıyla oluşturuldu',
                  'Başarılı'
                ),
              error: err => {
                this.toastr.error(
                  'Fazla mal iade sevkiyatı oluşturulurken hata oluştu',
                  'Hata'
                );
                console.error(err);
              },
              complete: () => this.kapat()
            });
      


              this.kapat();
            });
          return;
        }

        this.kapat();
      });
  }



  onMalKabulChange(element: any) {
    const sevk = element.sevkmiktari ?? 0;
    const kabul = element.MalKabulMiktari ?? 0;
    element.fark = kabul - sevk;
  }
  temizle() {
    this.urunListesi.set([]);
    this.dataSource.data = [];
    this.bulunanUrunler.set([]);
    this.postorder = {
      evrakNoSeri: '',
      evrakNoSira: 0,
      kalemler: []
    };
    this.toastr.info('Form temizlendi', '', { timeOut: 2000 });
  }

  kapat() {
    this.dialogRef.close();
  }

  get formValid(): boolean {
    return this.dataSource.data.length > 0 &&
      this.dataSource.data.every(item => (item.MalKabulMiktari ?? 0) > 0);
  }
}
