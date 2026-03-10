import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-session-dialog',
  template: `
    <div class="modal-content border-0">
      <!-- Header -->
      <div class="modal-header bg-warning text-dark py-3">
        <div class="d-flex align-items-center">
          <div class="spinner-grow spinner-grow-sm text-dark me-2" role="status">
            <span class="visually-hidden">Yükleniyor...</span>
          </div>
          <h5 class="modal-title fs-5 fw-semibold mb-0">
            <i class="bi bi-clock-history me-2"></i>
            Oturum Süreniz Dolmak Üzere
          </h5>
        </div>
      </div>

      <!-- Body -->
      <div class="modal-body p-4 text-center">
        <!-- Progress Circle -->
        <div class="position-relative d-inline-block mb-4">
          <div class="progress-circle" [style.--percentage]="(countdown / 120) * 100">
            <svg viewBox="0 0 100 100" class="position-relative" style="width: 120px; height: 120px;">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e9ecef" stroke-width="6"/>
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#ffc107" 
                stroke-width="6"
                stroke-linecap="round"
                [attr.stroke-dasharray]="2 * Math.PI * 45"
                [attr.stroke-dashoffset]="2 * Math.PI * 45 * (1 - countdown / 120)"
                transform="rotate(-90 50 50)"/>
            </svg>
          </div>
          <div class="position-absolute top-50 start-50 translate-middle">
            <span class="display-5 fw-bold text-warning">{{countdown}}</span>
            <span class="d-block text-muted small">saniye</span>
          </div>
        </div>

        <!-- Warning Message -->
        <div class="alert alert-warning bg-soft-warning border-0 text-start" role="alert">
          <div class="d-flex">
            <div class="me-3">
              <i class="bi bi-exclamation-triangle-fill fs-4 text-warning"></i>
            </div>
            <div>
              <h6 class="alert-heading fw-semibold mb-1">Oturum Süresi Uyarısı</h6>
              <p class="mb-0 small text-muted">
                Güvenliğiniz için oturumunuz {{countdown}} saniye sonra sonlandırılacaktır. 
                Devam etmek için "Oturumu Uzat" butonuna tıklayın.
              </p>
            </div>
          </div>
        </div>

        <!-- Progress Bar (Alternatif gösterim) -->
        <div class="mt-3">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span class="small text-muted">Kalan süre</span>
            <span class="small fw-semibold text-warning">{{countdown}} / 120 sn</span>
          </div>
          <div class="progress" style="height: 8px;">
            <div 
              class="progress-bar bg-warning" 
              [style.width.%]="(countdown / 120) * 100"
              role="progressbar" 
              [attr.aria-valuenow]="countdown" 
              aria-valuemin="0" 
              aria-valuemax="120">
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer bg-light py-3">
        <button 
          type="button" 
          class="btn btn-warning btn-lg w-100" 
          (click)="extend()"
          [disabled]="countdown <= 0">
          <i class="bi bi-arrow-clockwise me-2"></i>
          <span class="fw-semibold">Oturumu Uzat</span>
          <span class="badge bg-dark ms-2">{{countdown}}s</span>
        </button>
        
        <!-- Küçük bilgi notu -->
        <div class="text-center w-100 mt-2">
          <small class="text-muted">
            <i class="bi bi-shield-lock me-1"></i>
            Oturum uzatılmazsa otomatik çıkış yapılacaktır
          </small>
        </div>
      </div>
    </div>
  `,
  imports: [CommonModule],
  styles: [`
    .modal-content {
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    }
    
    .modal-header {
      border-bottom: none;
    }
    
    .modal-footer {
      border-top: 1px solid rgba(0,0,0,0.05);
    }
    
    .bg-soft-warning {
      background-color: rgba(255, 193, 7, 0.1);
    }
    
    .btn-warning {
      background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
      border: none;
      color: #212529;
      font-weight: 500;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .btn-warning:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(255, 193, 7, 0.4);
      background: linear-gradient(135deg, #ffb300 0%, #ffa000 100%);
    }
    
    .btn-warning:active:not(:disabled) {
      transform: translateY(0);
    }
    
    .btn-warning:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .btn-warning .badge {
      position: relative;
      top: -1px;
    }
    
    .progress {
      background-color: #e9ecef;
      border-radius: 10px;
      overflow: hidden;
    }
    
    .progress-bar {
      transition: width 1s linear;
    }
    
    svg circle:last-child {
      transition: stroke-dashoffset 1s linear;
    }
    
    /* Countdown uyarı renkleri */
    :host {
      display: block;
    }
    
    .text-warning {
      transition: color 0.3s ease;
    }
    
    /* Animasyon */
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    .display-5 {
      animation: pulse 2s infinite ease-in-out;
    }
    
    /* Responsive düzenlemeler */
    @media (max-width: 576px) {
      .modal-body {
        padding: 1.5rem !important;
      }
      
      .display-5 {
        font-size: 2.5rem;
      }
    }
    
    /* Spinner animasyonu */
    .spinner-grow {
      animation-duration: 1.5s;
    }
    
    /* Buton loading efekti */
    .btn-warning:active::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 100%);
      transform: translate(-50%, -50%) scale(0);
      animation: ripple 0.6s ease-out;
    }
    
    @keyframes ripple {
      to { transform: translate(-50%, -50%) scale(4); opacity: 0; }
    }
  `]
})
export class SessionDialogComponent {
  countdown = 120;
  interval: any;
  protected Math = Math; // Math nesnesini template'de kullanmak için

  constructor(private dialogRef: MatDialogRef<SessionDialogComponent>) {}

  ngOnInit() {
    // Countdown sıfıra ulaştığında otomatik kapanma
  }

  startCountdown(seconds: number) {
    this.countdown = seconds;

    this.interval = setInterval(() => {
      this.countdown--;

      // Countdown kritik seviyeye düştüğünde (10 saniye) stil değişikliği
      if (this.countdown === 10) {
        document.querySelector('.modal-header')?.classList.add('bg-danger');
      }

      if (this.countdown <= 0) {
        clearInterval(this.interval);
        this.dialogRef.close();
      }
    }, 1000);
  }

  extend() {
    clearInterval(this.interval);
    this.dialogRef.close('extend');
  }
}