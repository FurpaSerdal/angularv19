import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

export interface Kalem {
  stokKodu: string;
  stokAdi: string;
  miktar: number;
  tutar: number;
  isk1: number;
  isk2: number;
  isk3: number;
  isk4: number;
  isk5: number;
  isk6: number;
  kdvTutari: number;
  kdvCins: number;
  birimCins: string;
}

export interface EvrakBilgi {
  evrakNo: string;
  musteriAdi: string;
  musteriKodu: string;
  tarih: string;
  tutar: number;
  araToplam: number;
  belgeNo: string;
  irsaliyeNo: string;
  depo: string;
  eFaturaMukellefiMi: boolean;
  faturaMail: string;
  fatGuid: string;
  aciklama: string;
  vergiDairesi: string;
  vdNo: string;
  cariTel?: string;
  rusum?: number;
  iade: number;
  cadde: string;
  sokak: string;
  ilce: string;
  il: string;
  postaKodu: string;
  evrakTip: number;
  cariHareketCins: number;
  eBelgeTuru: number;
  irsaliyeTarihi: string;
}

@Component({
  selector: 'app-view-invoice',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule
  ],
  templateUrl: './view-invoice.html',
  styleUrls: ['./view-invoice.css']
})
export class ViewInvoice {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { kalemler: any, evrakbilgi: EvrakBilgi },
    private dialogRef: MatDialogRef<ViewInvoice>
  ) {}

  // Kalemleri döndüren yardımcı fonksiyon
  getKalemler(): Kalem[] {
    return this.data.kalemler?.kalemler || [];
  }

  // KDV oranını döndüren yardımcı fonksiyon
  getKdvRate(kdvCins: number): string {
    const kdvRates: { [key: number]: string } = {
      1: '18',
      2: '8',
      3: '1',
      4: '0',
      5: '10',
      6: '20'
    };
    return kdvRates[kdvCins] || '?';
  }

  // KDV badge class'ını döndür
  getKdvBadgeClass(kdvCins: number): string {
    const classes: { [key: number]: string } = {
      1: 'bg-danger',
      2: 'bg-warning text-dark',
      3: 'bg-success',
      4: 'bg-secondary',
      5: 'bg-info',
      6: 'bg-primary'
    };
    return classes[kdvCins] || 'bg-dark';
  }

  // Evrak tipini döndür
  getEvrakTipi(evrakTip: number): string {
    const tipler: { [key: number]: string } = {
      1: 'Satış Faturası',
      2: 'Alış Faturası',
      3: 'Satış İade Faturası',
      4: 'Alış İade Faturası',
      63: 'Perakende Satış Faturası'
    };
    return tipler[evrakTip] || `Evrak Tip: ${evrakTip}`;
  }

  // Toplam KDV hesaplama
  calculateTotalKdv(): number {
    return this.getKalemler().reduce((total, kalem) => total + kalem.kdvTutari, 0);
  }

  // Birim fiyat hesaplama
  calculateUnitPrice(item: Kalem): number {
    return item.tutar / item.miktar;
  }

  // Tek kalem için toplam indirim
  getTotalDiscount(item: Kalem): number {
    return item.isk1 + item.isk2 + item.isk3 + item.isk4 + item.isk5 + item.isk6;
  }

  // Tüm kalemler için toplam indirim
  getTotalDiscountAll(): number {
    return this.getKalemler().reduce((total, item) => total + this.getTotalDiscount(item), 0);
  }

  // İndirim yüzdesi hesaplama
  getDiscountPercentage(item: Kalem): number {
    const brutToplam = item.tutar + this.getTotalDiscount(item);
    return brutToplam > 0 ? (this.getTotalDiscount(item) / brutToplam) * 100 : 0;
  }

  // Toplam miktar
  getTotalQuantity(): number {
    return this.getKalemler().reduce((total, item) => total + item.miktar, 0);
  }

  // Birden fazla KDV oranı var mı?
  hasMultipleKdvRates(): boolean {
    const rates = new Set(this.getKalemler().map(item => item.kdvCins));
    return rates.size > 1;
  }

  // KDV breakdown hesaplama
  getKdvBreakdown(): { rate: string, total: number }[] {
    const breakdown: { [key: string]: number } = {};
    
    this.getKalemler().forEach(item => {
      const rate = this.getKdvRate(item.kdvCins);
      if (!breakdown[rate]) {
        breakdown[rate] = 0;
      }
      breakdown[rate] += item.kdvTutari;
    });

    return Object.keys(breakdown).map(rate => ({
      rate: rate,
      total: breakdown[rate]
    }));
  }

  // Yazdırma fonksiyonu - DÜZELTİLMİŞ VERSİYON
  printDocument(): void {
    // Dialog içeriğini al
    const dialogContent = document.querySelector('app-view-invoice');
    
    if (!dialogContent) {
      console.error('Yazdırılacak içerik bulunamadı!');
      return;
    }

    // Yazdırma için özel HTML içeriği oluştur
    const printContent = this.generatePrintContent();
    
    // Yeni bir pencere aç
    const printWindow = window.open('', '_blank', 'width=1000,height=800');
    if (!printWindow) {
      console.error('Yazdırma penceresi açılamadı!');
      return;
    }

    // HTML içeriğini yaz
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Yazdırma işlemi
    setTimeout(() => {
      printWindow.print();
      // Yazdırma sonrası pencereyi kapat (isteğe bağlı)
      // printWindow.close();
    }, 500);
  }

  // Yazdırma içeriği oluşturma
  private generatePrintContent(): string {
    const kalemler = this.getKalemler();
    
    // Tablo satırlarını oluştur
    let tableRows = '';
    kalemler.forEach((item, index) => {
      tableRows += `
        <tr>
          <td class="text-center">${index + 1}</td>
          <td>${item.stokKodu}</td>
          <td>${item.stokAdi}</td>
          <td class="text-center">${item.birimCins}</td>
          <td class="text-end">${item.miktar.toLocaleString('tr-TR')}</td>
          <td class="text-end">${this.calculateUnitPrice(item).toFixed(2)} ₺</td>
          <td class="text-end">${this.getTotalDiscount(item) > 0 ? '-' + this.getTotalDiscount(item).toFixed(2) + ' ₺' : '-'}</td>
          <td class="text-center">%${this.getKdvRate(item.kdvCins)}</td>
          <td class="text-end">${item.kdvTutari.toFixed(2)} ₺</td>
          <td class="text-end">${item.tutar.toFixed(2)} ₺</td>
        </tr>
      `;
    });

    return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fatura #${this.data.evrakbilgi.evrakNo}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            font-size: 12px;
        }
        .invoice-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 8px;
        }
        .company-info, .customer-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 11px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f8f9fa;
            font-weight: bold;
        }
        .text-end { text-align: right; }
        .text-center { text-align: center; }
        .text-start { text-align: left; }
        .fw-bold { font-weight: bold; }
        .summary-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin-top: 20px;
        }
        .badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
        }
        .bg-success { background-color: #28a745; color: white; }
        .bg-warning { background-color: #ffc107; color: black; }
        .bg-info { background-color: #17a2b8; color: white; }
        .bg-danger { background-color: #dc3545; color: white; }
        .bg-primary { background-color: #007bff; color: white; }
        .bg-secondary { background-color: #6c757d; color: white; }
        .page-break { page-break-after: always; }
        @media print {
            body { margin: 0; padding: 10px; }
            .no-print { display: none !important; }
            .invoice-header { color: black; background: white !important; }
            .card { border: 1px solid #000 !important; }
            table { page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
        }
    </style>
</head>
<body>
    <div class="invoice-header">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h1 style="margin: 0; font-size: 24px;">FATURA</h1>
                <p style="margin: 5px 0; font-size: 14px;">#${this.data.evrakbilgi.evrakNo}</p>
            </div>
            <div style="text-align: right;">
                <span class="badge bg-success">${this.data.evrakbilgi.eFaturaMukellefiMi ? 'e-Fatura' : ''}</span>
                <span class="badge bg-warning">${this.data.evrakbilgi.iade ? 'İade Faturası' : ''}</span>
                <p style="margin: 5px 0;">Tarih: ${new Date(this.data.evrakbilgi.tarih).toLocaleDateString('tr-TR')}</p>
            </div>
        </div>
    </div>

    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div class="company-info" style="flex: 1; margin-right: 10px;">
            <h3 style="margin-top: 0;">Firma Bilgileri</h3>
            <p><strong>Şirket Adı:</strong> Örnek Şirket A.Ş.</p>
            <p><strong>Adres:</strong> Örnek Mah. Örnek Cad. No:123</p>
            <p><strong>Vergi Dairesi:</strong> Örnek Vergi Dairesi</p>
            <p><strong>Vergi No:</strong> 1234567890</p>
        </div>
        
        <div class="customer-info" style="flex: 1; margin-left: 10px;">
            <h3 style="margin-top: 0;">Müşteri Bilgileri</h3>
            <p><strong>Müşteri:</strong> ${this.data.evrakbilgi.musteriAdi}</p>
            <p><strong>Müşteri Kodu:</strong> ${this.data.evrakbilgi.musteriKodu}</p>
            <p><strong>Vergi Dairesi:</strong> ${this.data.evrakbilgi.vergiDairesi}</p>
            <p><strong>Vergi No:</strong> ${this.data.evrakbilgi.vdNo}</p>
            <p><strong>Adres:</strong> ${this.data.evrakbilgi.cadde} ${this.data.evrakbilgi.sokak}, ${this.data.evrakbilgi.ilce}/${this.data.evrakbilgi.il}</p>
        </div>
    </div>

    <h3>Fatura Kalemleri</h3>
    <table>
        <thead>
            <tr>
                <th width="30" class="text-center">#</th>
                <th width="80">Stok Kodu</th>
                <th>Ürün Adı</th>
                <th width="60" class="text-center">Birim</th>
                <th width="80" class="text-end">Miktar</th>
                <th width="90" class="text-end">Birim Fiyat</th>
                <th width="90" class="text-end">İndirim</th>
                <th width="60" class="text-center">KDV</th>
                <th width="90" class="text-end">KDV Tutarı</th>
                <th width="90" class="text-end">Toplam</th>
            </tr>
        </thead>
        <tbody>
            ${tableRows}
        </tbody>
    </table>

    <div style="display: flex; justify-content: space-between;">
        <div style="flex: 2; margin-right: 20px;">
            <div class="summary-card">
                <h4 style="margin-top: 0;">Ek Bilgiler</h4>
                <p><strong>Evrak Tipi:</strong> ${this.getEvrakTipi(this.data.evrakbilgi.evrakTip)}</p>
                <p><strong>İrsaliye No:</strong> ${this.data.evrakbilgi.irsaliyeNo}</p>
                ${this.data.evrakbilgi.aciklama ? `<p><strong>Açıklama:</strong> ${this.data.evrakbilgi.aciklama}</p>` : ''}
            </div>
        </div>
        
        <div style="flex: 1;">
            <div class="summary-card">
                <h4 style="margin-top: 0;">Finansal Özet</h4>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>Ara Toplam:</span>
                    <span>${this.data.evrakbilgi.araToplam.toFixed(2)} ₺</span>
                </div>
                ${this.getTotalDiscountAll() > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #dc3545;">
                    <span>Toplam İndirim:</span>
                    <span>-${this.getTotalDiscountAll().toFixed(2)} ₺</span>
                </div>
                ` : ''}
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>KDV Toplam:</span>
                    <span>${this.calculateTotalKdv().toFixed(2)} ₺</span>
                </div>
                <hr>
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 16px;">
                    <span>GENEL TOPLAM:</span>
                    <span>${this.data.evrakbilgi.tutar.toFixed(2)} ₺</span>
                </div>
                <div style="text-align: center; margin-top: 10px; color: #666;">
                    <small>${kalemler.length} kalem • ${this.getTotalQuantity()} adet</small>
                </div>
            </div>
        </div>
    </div>

    <div style="margin-top: 30px; text-align: center; color: #666; font-size: 10px;">
        <p>Bu belge elektronik ortamda oluşturulmuştur, imza gerektirmez.</p>
        <p>Oluşturulma Tarihi: ${new Date().toLocaleString('tr-TR')}</p>
    </div>
</body>
</html>`;
  }

  // E-posta gönderme fonksiyonu
  sendEmail(): void {
    console.log('E-posta gönderilecek:', this.data.evrakbilgi.faturaMail);
    // Burada e-posta gönderme işlemini implemente edebilirsiniz
  }

  // PDF export fonksiyonu
  exportPDF(): void {
    console.log('PDF export işlemi');
    // Burada PDF export işlemini implemente edebilirsiniz
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}