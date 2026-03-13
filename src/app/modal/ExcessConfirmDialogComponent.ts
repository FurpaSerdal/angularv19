import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

export type ExcessDecision = 'return' | 'correction' | null;

@Component({
  selector: 'app-excess-confirm-dialog',
  standalone: true,
  template: `
    <div class="p-3">

      <!-- Header -->
      <div class="d-flex align-items-center mb-3 text-warning">
        <i class="bi bi-exclamation-triangle-fill fs-4 me-2"></i>
        <h5 class="mb-0 fw-semibold">Fazla Mal Tespiti</h5>
      </div>

      <!-- Content -->
      <div class="alert alert-warning mb-4">
        <p class="mb-1">
          Sevk edilen miktara göre <strong>fazla mal kabulü</strong> tespit edildi.
        </p>
        <small class="text-muted">
          Lütfen nasıl devam etmek istediğinizi seçiniz.
        </small>
      </div>

      <!-- Actions -->
      <div class="d-flex justify-content-end gap-2">
        <button
          type="button"
          class="btn btn-outline-primary"
          (click)="duzeltme()"
        >
          <i class="bi bi-check2-all me-1"></i>
          Fazla Ürünleri Kabul Et
        </button>

        <button
          type="button"
          class="btn btn-danger"
          (click)="iade()"
        >
          <i class="bi bi-truck me-1"></i>
          Fazla Mal İade Sevkiyatı
        </button>
      </div>

    </div>
  `
})
export class ExcessConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ExcessConfirmDialogComponent>
  ) {}

  duzeltme() {
    this.dialogRef.close('correction');
  }

  iade() {
    this.dialogRef.close('return');
  }
}

