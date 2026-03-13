import { CommonModule } from '@angular/common';
import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { AlinanDepoSiparisleriAyrintiDto } from '../../../../../models/ayrinti-dtolari.model';

@Component({
  selector: 'app-warehouse-sale-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail.html',
  styleUrls: ['./detail.css']
})
export class WarehouseSaleOrderDetailComponent {
  

  constructor(
    public dialogRef: MatDialogRef<WarehouseSaleOrderDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlinanDepoSiparisleriAyrintiDto,
  ) {}

  ngOnInit() {
  }

  yazdir() {
    const printSection = document.getElementById('print-section');
    if (!printSection) {
      return;
    }

    const printWindow = window.open('', '_blank', 'width=900,height=1200');
    if (!printWindow) {
      return;
    }

    const printStyles = `
      @page { size: A4 portrait; margin: 12mm; }
      html, body { margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; color: #000; font-size: 12px; line-height: 1.4; }
      #print-section { width: 100%; max-width: 186mm; margin: 0 auto; }
      .print-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 12mm; padding-bottom: 5mm; border-bottom: 1px solid #000; }
      .print-header h2 { margin: 0 0 3mm; font-size: 18px; font-weight: 700; }
      .print-header p { margin: 1.2mm 0; }
      .print-header .left, .print-header .right { flex: 1; }
      .print-header .right { text-align: right; }
      .print-table { width: 100%; border-collapse: collapse; table-layout: fixed; margin-bottom: 10mm; }
      .print-table thead { display: table-header-group; }
      .print-table th, .print-table td { border: 1px solid #000; padding: 2.5mm 2mm; font-size: 11px; word-break: break-word; }
      .print-table th { font-weight: 700; text-align: left; }
      .text-end { text-align: right; }
      .print-footer { margin-top: 14mm; display: flex; justify-content: space-between; gap: 12mm; page-break-inside: avoid; }
      .signature { flex: 1; text-align: center; }
      .signature p { margin: 0 0 18mm; font-size: 12px; font-weight: 600; }
      .signature .line { border-top: 1px solid #000; padding-top: 2mm; font-size: 10px; }
      .print-header, .print-footer, .print-table tr { page-break-inside: avoid; }
    `;

    printWindow.document.open();
    printWindow.document.write(`
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Depo Siparis Beyani</title>
        <style>${printStyles}</style>
      </head>
      <body>
        <div id="print-section">${printSection.innerHTML}</div>
      </body>
      </html>
    `);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  }

    getStatusText(e: AlinanDepoSiparisleriAyrintiDto): string {
      if (e.durumu=== '1') {
        return 'siparişi verildi/alındı';
      }
      else if (e.durumu === '2') {
        return 'Sevk Hazır / irsaliye bekleniyor';}
      else if (e.durumu === '3') {
        return 'Yolda';}
      else if (e.durumu === '4') {
        return 'Mal Kabulu Yapıldı';
      }
      else {
        return 'Bilinmeyen Durum';
      }
    }
  

  kapat() {
    this.dialogRef.close();
  }
}