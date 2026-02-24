import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { SessionDialogComponent } from '../../modal/SessionDialogComponent';

@Injectable({ providedIn: 'root' })
export class IdleService implements OnDestroy {

  /**
   * Kullanıcının hiçbir işlem yapmazsa
   * sistemden atılacağı toplam süre.
   * (örn: 15 dakika)
   */
  private readonly IDLE_TIME = 15 * 60 * 1000;

  /**
   * Logout'tan önce gösterilecek uyarı süresi.
   * Örn: son 2 dakika kala dialog açılır.
   */
  private readonly WARNING_TIME = 2 * 60 * 1000;

  /**
   * Sekmeler arası kullanıcı aktivitesini
   * senkron etmek için kullanılan localStorage key.
   */
  private readonly STORAGE_KEY = 'app_last_activity';

  /** Logout zamanlayıcısı referansı */
  private timeoutId: any;

  /** Warning zamanlayıcısı referansı */
  private warningTimeoutId: any;

  /** Kalan süreyi console'a yazmak için interval referansı */
  private countdownLogInterval: any;
  /** Idle süresi başladığı zaman */
  private idleStartTime: number = 0;

  /**
   * Kullanıcı hareket eventleri.
   * Bu eventlerden biri tetiklenirse idle süresi sıfırlanır.
   */
  private events: (keyof WindowEventMap)[] = [
    'mousemove',
    'mousedown',
    'keydown',
    'scroll',
    'touchstart'
  ];

  constructor(
    private zone: NgZone,
    private dialog: MatDialog,
    private auth: AuthService
  ) {
    // console.log('[IdleService] Servis başlatıldı');
    this.initialize();
  }

  /**
   * Servis başlatılırken:
   * - Kullanıcı hareketleri dinlenir
   * - Multi-tab storage listener eklenir
   * - İlk timer başlatılır
   */
  private initialize(): void {

    // Angular change detection tetiklenmemesi için
    // event listener'ları Angular zone dışında dinliyoruz
    this.zone.runOutsideAngular(() => {

      // Kullanıcı hareketlerini dinle
      this.events.forEach(event =>
        window.addEventListener(event, this.handleUserActivity, true)
      );

      // Başka sekmede activity olursa tetiklenecek listener
      window.addEventListener('storage', this.handleStorageEvent);
    });

    // İlk timer başlatılır
    this.resetTimer();
  }

  /**
   * Kullanıcı herhangi bir işlem yaptığında çalışır.
   * - Idle süresi sıfırlanır
   * - Aktivite zamanı localStorage'a yazılır
   *   (diğer sekmeler de haberdar olur)
   */
  private handleUserActivity = (): void => {

    if (!this.auth.isAuthenticated()) {
      // console.log('[IdleService] Kullanıcı auth değil');
      return;
    }

    // Aktivite timestamp'ini kaydet
    // Bu değişiklik diğer sekmelerde storage event tetikler
    localStorage.setItem(this.STORAGE_KEY, Date.now().toString());

    // console.log('[IdleService] Aktivite algılandı → Timer reset');
    this.resetTimer();
  };

  /**
   * Başka sekmede localStorage değiştiğinde tetiklenir.
   * Eğer değişen key bizim activity key ise
   * bu sekmede de timer reset edilir.
   */
  private handleStorageEvent = (event: StorageEvent): void => {

    if (event.key === this.STORAGE_KEY) {

      if (!this.auth.isAuthenticated()) return;

      // console.log('[IdleService] Başka sekmede aktivite var → Timer reset');
      this.resetTimer();
    }
  };

  /**
   * Warning ve logout timer'larını başlatır.
   * Mevcut timer'lar önce temizlenir.
   */
  private resetTimer(): void {

    if (!this.auth.isAuthenticated()) {
      return;
    }

    // Önce eski timer'ları temizle
    clearTimeout(this.timeoutId);
    clearTimeout(this.warningTimeoutId);
    clearInterval(this.countdownLogInterval);

    // Timer'lar sıfırlandığında zamanı kaydet (debug için)
    // this.idleStartTime = Date.now();
    // console.log(`⏳ Warning ${this.WARNING_TIME / 1000} sn sonra`);
    // console.log(`⏳ Logout ${this.IDLE_TIME / 1000} sn sonra`);
    // // Her saniye console'a kalan süreyi yaz
    // this.countdownLogInterval = setInterval(() => {
    //   const elapsed = Date.now() - this.idleStartTime;
    //   const remaining = Math.max(0, this.IDLE_TIME - elapsed);
    //   console.log(`🕒 Kalan süre: ${Math.ceil(remaining / 1000)} sn`);
    // }, 1000);
    
    // console.log('[IdleService] Timer yeniden başlatıldı');

    /**
     * WARNING TIMER
     * IDLE_TIME - WARNING_TIME süresi dolunca çalışır.
     * Örn: 13. dakikada dialog açılır (15dk - 2dk).
     */
    this.warningTimeoutId = setTimeout(() => {
      this.zone.run(() => {
        // console.log('[IdleService] Warning dialog açılıyor');
        this.openWarningDialog();
      });
    }, this.IDLE_TIME - this.WARNING_TIME);

    /**
     * LOGOUT TIMER
     * IDLE_TIME süresi dolunca kullanıcı logout edilir.
     */
    this.timeoutId = setTimeout(() => {
      this.zone.run(() => {
        // console.log('[IdleService] Idle süresi doldu → Logout');
        this.logout();
      });
    }, this.IDLE_TIME);
  }

  /**
   * Kullanıcıya oturumun biteceğini bildiren dialog açılır.
   * Aynı anda birden fazla dialog açılmasını engeller.
   */
  private openWarningDialog(): void {

    if (this.dialog.openDialogs.length > 0) {
      // console.log('[IdleService] Dialog zaten açık');
      return;
    }

    const dialogRef = this.dialog.open(SessionDialogComponent, {
      disableClose: true,
      width: '400px'
    });

    // Dialog içindeki countdown başlatılır
    dialogRef.componentInstance.startCountdown(
      this.WARNING_TIME / 1000
    );

    // Dialog kapandığında sonucu dinle
    dialogRef.afterClosed().subscribe(result => {

      // console.log('[IdleService] Dialog sonucu:', result);

      if (result === 'extend') {
        this.extendSession();
      }
    });
  }

  /**
   * Kullanıcı "Oturumu Uzat" dediğinde çalışır.
   * Refresh token ile yeni access token alınır.
   */
  private extendSession(): void {

    // console.log('[IdleService] Session uzatılıyor...');

    this.auth.refreshToken().subscribe({
      next: () => {

        // Tüm sekmelere aktivite bildir
        localStorage.setItem(this.STORAGE_KEY, Date.now().toString());

        // Timer yeniden başlatılır
        this.resetTimer();

        // console.log('[IdleService] Session başarıyla uzatıldı');
      },
      error: () => {
        // Refresh başarısızsa güvenlik için logout edilir
        // console.log('[IdleService] Refresh başarısız → Logout');
        this.logout();
      }
    });
  }

  /**
   * Gerçek logout işlemi.
   * - Timer'lar temizlenir
   * - Token'lar silinir
   */
  private logout(): void {

    clearTimeout(this.timeoutId);
    clearTimeout(this.warningTimeoutId);
    clearInterval(this.countdownLogInterval);

    // console.log('[IdleService] Logout çalıştı');

    this.auth.clearTokens();
  }

  /**
   * Servis destroy edilirse:
   * - Event listener'lar kaldırılır
   * - Timer'lar temizlenir
   */
  ngOnDestroy(): void {

    this.events.forEach(event =>
      window.removeEventListener(event, this.handleUserActivity, true)
    );

    window.removeEventListener('storage', this.handleStorageEvent);

    clearTimeout(this.timeoutId);
    clearTimeout(this.warningTimeoutId);

    // console.log('[IdleService] Servis destroy edildi');
  }
}
