import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({ providedIn: 'root' })
export class IdleService implements OnDestroy {

  private timeoutId: any;
  private readonly IDLE_TIME = 15 * 60 * 1000; // 15 dk

  private readonly events: (keyof WindowEventMap)[] = [
    'mousemove',
    'mousedown',
    'keydown',
    'scroll',
    'touchstart'
  ];

  constructor(
    private router: Router,
    private zone: NgZone,
    private authservice: AuthService
  ) {
    this.init();
  }

  private init() {
    this.zone.runOutsideAngular(() => {
      this.events.forEach(event =>
        window.addEventListener(event, this.resetTimer, true)
      );
    });

    this.resetTimer();
  }

  private resetTimer = () => {
    clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => {
      this.zone.run(() => this.logout());
    }, this.IDLE_TIME);
  };

  private logout() {
    //this.authservice.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.events.forEach(event =>
      window.removeEventListener(event, this.resetTimer, true)
    );
    clearTimeout(this.timeoutId);
  }
}
