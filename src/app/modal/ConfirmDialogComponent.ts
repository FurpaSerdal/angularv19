import { ChangeDetectionStrategy,Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

export type ExcessDecision = 'confirm' | 'back' | null;

@Component({
  selector: 'app-is-connect-to-warehouse',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-3">

      <!-- Header -->
      <div class="d-flex align-items-center mb-3 text-primary">
        <i class="bi bi-arrow-left-right fs-4 me-2"></i>
        <h5 class="mb-0 fw-semibold">Karşı Depo Onayı</h5>
      </div>

      <!-- Content -->
      <div class="alert alert-info mb-4">
        <p class="mb-1">
          Fazla mal durumu için <strong>karşı depo ile bağlantı kurulması</strong>
          gerekmektedir.
        </p>
        <small class="text-muted">
          Devam etmek istiyor musunuz?
        </small>
      </div>

      <!-- Actions -->
      <div class="d-flex justify-content-end gap-2">
        <button
          type="button"
          class="btn btn-outline-primary"
          (click)="onayla()"
        >
          <i class="bi bi-check-circle me-1"></i>
          Onayla
        </button>

        <button
          type="button"
          class="btn btn-secondary"
          (click)="geriDon()"
        >
          <i class="bi bi-arrow-left me-1"></i>
          Geri Dön
        </button>
      </div>

    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) {}

  onayla() {
    this.dialogRef.close('confirm');
  }

  geriDon() {
    this.dialogRef.close('back');
  }
}
