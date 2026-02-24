import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SendOutboxShippingDespatch } from '../../../../../models/e-IrsaliyeGonderModel';
import { WarehouseService } from '../../../../../services/warehouse.service';
import { DepolaraSevkIrsaliyeleriAyrintiDto } from '../../../../../models/ayrinti-dtolari.model';

@Component({
  selector: 'app-convert-to-ewaybill-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './convert-to-ewaybill-component.html',
  styleUrl: './convert-to-ewaybill-component.css',
})
export class ConvertToEWaybillComponent implements OnInit {
  
  shipmentData!: SendOutboxShippingDespatch;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  showConfirmDialog = false;
  
  // UI için yardımcı değişkenler
  isFormValid = false;

  constructor(
    public dialogRef: MatDialogRef<ConvertToEWaybillComponent>,
    private warehouseService: WarehouseService,
    @Inject(MAT_DIALOG_DATA) public data?: any,
  ) {
    this.shipmentData = this.initializeForm();
  }

  ngOnInit(): void {
    this.loadShipmentData();
  }

  private loadShipmentData(): void {
    const receivedData:DepolaraSevkIrsaliyeleriAyrintiDto = this.data.data;
    
    if (receivedData && receivedData.kalemler) {
      const kalemler: any[] = (receivedData.kalemler || []).map((k: any) => ({
        stok: {
          stokKodu: k.stokKodu || '',
          stokIsmi: k.stokIsmi || '',
          birim: k.birimAd || '',
          barkodu: k.barkod || '',
        },
        miktar: k.sevkMiktari ?? 0,
        onerilenMiktar: k.siparisMiktari ?? k.onerilenSiparisMiktari ?? 0,
        teslimMiktari: k.malKabulMiktari ?? 0,
      }));

      this.shipmentData = {
        seri: receivedData.seri || '',
        sira: receivedData.sira || 0,
        belgeNo: receivedData.belgeNo || '',
        hedefDepoNo: receivedData.muhatapDepoNo || 0,
        kaynakDepoNo: this.data.subeNo || 0,
        aracPlaka: '',
        kalemler,
        soforAdSoyad: '',
        soforTckn: '',
        sevkEdenAdSoyad: '',
        siparisEdenAdSoyad:  '',
      };
      
      this.checkFormValidity();
    }
  }

  private initializeForm(): SendOutboxShippingDespatch {
    return {
      seri: '',
      sira: 0,
      belgeNo: '',
      hedefDepoNo: 0,
      kaynakDepoNo: 0,
      aracPlaka: '',
      kalemler: [],
      soforAdSoyad: '',
      soforTckn: '',
      sevkEdenAdSoyad: '',
      siparisEdenAdSoyad: '',
    };
  }

  // Form değişikliklerini dinle
  onFormChange(): void {
    this.checkFormValidity();
  }

  private checkFormValidity(): void {
    this.isFormValid = this.validateForm();
  }

  openConfirmDialog(): void {
    if (this.isFormValid) {
      this.showConfirmDialog = true;
    } else {
      this.errorMessage = 'Lütfen tüm gerekli alanları doldurunuz.';
    }
  }

  closeConfirmDialog(): void {
    this.showConfirmDialog = false;
  }
  close(){
    this.dialogRef.close();
  }

  convertToEWaybill(): void {
    if (!this.isFormValid) {
      this.errorMessage = 'Lütfen tüm gerekli alanları doldurunuz.';
      return;
    }

    const payload: SendOutboxShippingDespatch = {
      ...this.shipmentData,
      soforAdSoyad: this.shipmentData.soforAdSoyad.trim(),
      soforTckn: this.shipmentData.soforTckn.trim(),
      aracPlaka: this.shipmentData.aracPlaka.trim(),
    };

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.warehouseService.SendOutboxShippingDespatch(payload).subscribe({
      next: (response: any) => {
        this.successMessage = 'Sevkiye başarıyla e-İrsaliye\'ye dönüştürüldü.';
        this.showConfirmDialog = false;
        this.resetForm();
        // 3 saniye sonra dialog'u kapat
        setTimeout(() => {
          this.dialogRef.close({ success: true });
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'E-İrsaliye dönüştürme işlemi başarısız oldu.';
        console.error('Error:', error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private validateForm(): boolean {
    // Zorunlu alan kontrolü
    if (!this.shipmentData.soforAdSoyad?.trim() || 
        !this.shipmentData.soforTckn?.trim() || 
        !this.shipmentData.aracPlaka?.trim()) {
      return false;
    }
    
    // TCKN format kontrolü (11 haneli sayı)
    const tcknRegex = /^[1-9]{1}[0-9]{10}$/;
    if (!tcknRegex.test(this.shipmentData.soforTckn.trim())) {
      return false;
    }
    
    // Kalem kontrolü
    if (!this.shipmentData.kalemler || this.shipmentData.kalemler.length === 0) {
      return false;
    }
    
    // Kalem miktar kontrolleri
    const hasValidItems = this.shipmentData.kalemler.every(item => 
      item.miktar > 0 && item.onerilenMiktar >= 0 && item.teslimMiktari >= 0
    );
    
    if (!hasValidItems) {
      return false;
    }
    
    return true;
  }

  private resetForm(): void {
    this.shipmentData = this.initializeForm();
    this.isFormValid = false;
  }
  // TypeScript dosyasına ekleyin (class içinde)
getTotal(property: 'miktar' | 'onerilenMiktar' | 'teslimMiktari'): number {
  if (!this.shipmentData.kalemler) return 0;
  return this.shipmentData.kalemler.reduce((total, item) => total + (item[property] || 0), 0);
}

  cancelConversion(): void {
    this.closeConfirmDialog();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}