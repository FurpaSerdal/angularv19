import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { KalemDto } from '../../models/ayrinti-dtolari.model';

@Component({
  selector: 'app-refund-confirm-dialog',
  imports:[CommonModule,MatDialogModule],
  template: `
    <div class="modal-content border-0">
      <!-- Header -->
      <div class="modal-header bg-primary text-white py-3">
        <h5 class="modal-title fs-5 fw-semibold">
          <i class="bi bi-arrow-return-left me-2"></i>
          İade Onayı
        </h5>
        <button type="button" class="btn-close btn-close-white" (click)="iptal()" aria-label="Close"></button>
      </div>

      <!-- Body -->
      <div class="modal-body p-4">
        <div class="alert alert-info d-flex align-items-center mb-4" role="alert">
          <i class="bi bi-info-circle-fill me-2 fs-5"></i>
          <span>Aşağıdaki kalemler için iade oluşturulacak:</span>
        </div>

        <div class="table-responsive">
          <table class="table table-hover table-bordered align-middle">
            <thead class="table-light">
              <tr>
                <th class="fw-semibold">
                  <i class="bi bi-box me-2"></i>
                  Stok
                </th>
                <th class="fw-semibold text-end">
                  <i class="bi bi-sort-numeric-up me-2"></i>
                  Miktar
                </th>
              </tr>
            </thead>
            <tbody>
              @for (k of data.kalemler; track k) {
                <tr>
                  <td>
                    <span class="fw-medium">{{ k.stokKodu }}</span>
                  </td>
                  <td class="text-end">
                    <span class="badge bg-warning text-dark px-3 py-2">
                      {{ k.sevkMalKabulFarkMiktari | number }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
            <tfoot class="table-light">
              <tr>
                <td class="fw-semibold">Toplam Kalem</td>
                <td class="text-end fw-semibold">
                  <span class="badge bg-secondary text-white px-3 py-2">
                    {{ data.kalemler.length }}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="alert alert-warning d-flex align-items-center mt-3" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
          <span class="fw-medium">Devam etmek istiyor musunuz?</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer bg-light py-3">
        <button type="button" class="btn btn-outline-secondary px-4" (click)="iptal()">
          <i class="bi bi-x-lg me-2"></i>
          Vazgeç
        </button>
        <button type="button" class="btn btn-primary px-4" (click)="onayla()">
          <i class="bi bi-check-lg me-2"></i>
          Onayla
        </button>
      </div>
    </div>
  `,
  styles: [`
    .modal-content {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    
    .modal-header {
      border-bottom: none;
    }
    
    .modal-footer {
      border-top: 1px solid rgba(0,0,0,0.05);
    }
    
    .table {
      margin-bottom: 0;
    }
    
    .table th {
      background-color: #f8f9fa;
      border-bottom-width: 1px;
    }
    
    .badge {
      font-weight: 500;
      letter-spacing: 0.3px;
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    
    .btn-outline-secondary:hover {
      background-color: #e9ecef;
      border-color: #ced4da;
    }
    
    .btn-primary {
      background-color: #0d6efd;
      border-color: #0d6efd;
    }
    
    .btn-primary:hover {
      background-color: #0b5ed7;
      border-color: #0a58ca;
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(13, 110, 253, 0.3);
    }
    
    .alert {
      border: none;
      border-radius: 10px;
    }
    
    .alert-info {
      background-color: #e7f1ff;
      color: #084298;
    }
    
    .alert-warning {
      background-color: #fff3cd;
      color: #856404;
    }
    
    .table tbody tr:hover {
      background-color: #f8f9fa;
    }
  `]
})
export class RefundConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RefundConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { kalemler: KalemDto[] }
  ) {}

  ngOnInit() {
  }

  iptal() {
    this.dialogRef.close(false);
  }

  onayla() {
    this.dialogRef.close(true);
  }
}