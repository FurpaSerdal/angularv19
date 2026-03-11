import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { DataTransferService } from '../../../services/dataTransfer/dataTransfer.service';
import { MeService } from '../../../services/meservice.service';

@Component({
  selector: 'app-dosya-gonderimi',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './dosya-gonderimi.component.html',
  styleUrls: ['./dosya-gonderimi.component.css']  // styleUrl -> styleUrls
})
export class DosyaGonderimiComponent {
  yukleniyor = signal(false);
  constructor(private dataTransferService: DataTransferService, private meService: MeService) { }
  gorevid = computed(() => this.meService.selectedGorev()?.id ?? 0);

  sendScaleFile() {
    this.sendFile(this.dataTransferService.scaleFile(this.gorevid()));
  }

  sendProductFile() {
    this.sendFile(this.dataTransferService.productFile(this.gorevid()));
  }

  sendCashierFile() {
    this.sendFile(this.dataTransferService.cashierFile(this.gorevid()));
  }

  sendPromotionFile() {
    this.sendFile(this.dataTransferService.promotionFile(this.gorevid()));
  }

  sendCustomerFile() {
    this.sendFile(this.dataTransferService.customerFile(this.gorevid()));
  }

  private sendFile(request$: Observable<unknown>) {
    this.yukleniyor.set(true);
    this.showLoadingMessage();

    request$.subscribe({
      next: () => {
        this.yukleniyor.set(false);
        this.closeLoadingMessage();
        this.showmessage();
      },
      error: (err) => {
        console.error(err);
        this.yukleniyor.set(false);
        this.closeLoadingMessage();
        this.ermessage();
      }
    });
  }

  private showLoadingMessage() {
    Swal.fire({
      title: 'Yükleniyor',
      text: 'Dosya gönderimi devam ediyor, lütfen bekleyiniz...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  private closeLoadingMessage() {
    if (Swal.isVisible()) {
      Swal.close();
    }
  }

  showmessage() {
    Swal.fire({
      title: 'İşlem Kuyrukta',
      text: 'Dosya gönderimi tamamlandı, arka planda işleniyor.',
      icon: 'success',
      confirmButtonText: 'Tamam'
    });
  }

  ermessage() {
    Swal.fire({
      title: 'Hata',
      text: 'Dosya gönderme sırasında bir hata oluştu. Lütfen tekrar deneyiniz.',
      icon: 'error',
      confirmButtonText: 'Tamam'
    });
  }
}
