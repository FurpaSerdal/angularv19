import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Kalem } from '../../models/evrak_ekle';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-refund-confirm-dialog',
  imports:[CommonModule,MatDialogModule],
  template: `
    <h2 mat-dialog-title>İade Onayı</h2>

    <mat-dialog-content>
      <p>Aşağıdaki kalemler için iade oluşturulacak:</p>

      <table class="table table-sm">
        <thead>
          <tr>
            <th>Stok</th>
            <th>Miktar</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let k of data.kalemler">
            <td>{{ k.stok.stokIsim }}</td>
            <td>{{ k.miktar }}</td>
          </tr>
        </tbody>
      </table>

      <p class="text-danger mt-2">
        Devam etmek istiyor musunuz?
      </p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="iptal()">Vazgeç</button>
      <button mat-raised-button color="primary" (click)="onayla()">
        Onayla
      </button>
    </mat-dialog-actions>
  `
})
export class RefundConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RefundConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { kalemler: Kalem[] }
  ) {}

  iptal() {
    this.dialogRef.close(false);
  }

  onayla() {
    this.dialogRef.close(true);
  }
}
