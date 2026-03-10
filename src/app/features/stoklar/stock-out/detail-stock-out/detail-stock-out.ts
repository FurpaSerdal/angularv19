import { CommonModule } from '@angular/common';
import { Component,Inject,OnInit,signal } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { SharedImports } from '../../../../core/pipes/shared-imports';
import { CikisFisleriAyrintiDto } from '../../../../models/ayrinti-dtolari.model';
import { StockOutService } from '../../../../services/inventory/stock-out.service';

@Component({
  selector: 'app-detail-stock-out',
  imports: [SharedImports, CommonModule],
  templateUrl: './detail-stock-out.html',
  styleUrl: './detail-stock-out.css',
})
export class DetailStockOut implements OnInit {
  stockOutDetail = signal<CikisFisleriAyrintiDto | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private stockOutService: StockOutService,
    private dialogRef: MatDialogRef<DetailStockOut>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.loadStockOutDetail();
    }
  }

  loadStockOutDetail(): void {
    this.loading.set(true);
    this.error.set(null);

    // If data is already passed (like from a dialog)
    if (this.data && this.data.seri && this.data.sira) {
      this.stockOutDetail.set(this.data);
      this.loading.set(false);
    } else {
      // Otherwise fetch from service if needed
      this.loading.set(false);
    }
  }
  onExit(){
    this.dialogRef.close();


  }

  getStatusClass(status: string): string {
    if (!status) return 'status-pending';
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('tamamlandı') || lowerStatus.includes('confirmed')) return 'status-confirmed';
    if (lowerStatus.includes('iptal') || lowerStatus.includes('cancelled')) return 'status-cancelled';
    return 'status-pending';
  }
  getTotalQuantity(): number {
    const detail = this.stockOutDetail();
    if (!detail || !detail.kalemler) return 0;
    return detail.kalemler.reduce((sum, item) => {
      return sum + (item.sevkMiktari || 0);
    }, 0);
  }
}