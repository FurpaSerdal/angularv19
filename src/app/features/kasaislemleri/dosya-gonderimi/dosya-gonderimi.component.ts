import { Component,computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
  /**
   *
   */
  constructor(private dataTransferService: DataTransferService, private meService: MeService ) { }
  gorevid = computed(() => this.meService.selectedGorev()?.id ?? 0);


  sendScaleFile() {
    this.dataTransferService.scaleFile(this.gorevid()).subscribe(
      response => {
        this.showmessage();
            },
      error => {
        this.ermessage();
      }
    );

  }

  sendProductFile() {
    this.dataTransferService.productFile(this.gorevid()).subscribe(
      response => {
  this.showmessage();
      },
      error => {
        this.ermessage();
      }
    );
  }
  sendCashierFile() {
    this.dataTransferService.cashierFile(this.gorevid()).subscribe(
      response => {
  this.showmessage();
      },
      error => {
        this.ermessage();
      }
    );
  }
  sendPromotionFile() {
    this.dataTransferService.promotionFile(this.gorevid()).subscribe(
      response => {
        this.showmessage();
      },
      error => {
        this.ermessage();
      }
    );
  }
  sendCustomerFile() {
    this.dataTransferService.customerFile(this.gorevid()).subscribe(
      response => {
        this.showmessage();
      },
      error => {
        this.ermessage();
      }
    );
  }

  showmessage() {
Swal.fire({
  title: 'İşlem Kuyrukta',
  text: 'Dosyalar gönderiliyor, lütfen 30 saniye bekleyiniz...',
  icon: 'info',
  allowOutsideClick: false,
  allowEscapeKey: false,
  didOpen: () => {
    Swal.showLoading();
  },
  timer: 30000,
  timerProgressBar: true,
  footer: 'Tüm dosyalar arka planda işleniyor'
})

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
