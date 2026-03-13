import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  Inject,
  OnInit,
  PLATFORM_ID,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { fromEvent } from 'rxjs';
import { auditTime } from 'rxjs/operators';

import { MeService } from '../services/meservice.service';
import { NavbarComponent } from './navbar-component/navbar-component';
import { SidebarComponent } from './sidebar-component/sidebar-component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule, CommonModule, SidebarComponent, NavbarComponent],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent implements OnInit {
  showScrollButton = signal(false);
  isSidebarCollapsed = signal(false);
  shownatification = signal(true);
  mobileSidebarOpen = signal(false);
  isMobile = signal(false);
  private readonly isBrowser: boolean;

  constructor(
    public userService: MeService,
    private destroyRef: DestroyRef,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (!this.isBrowser) {
      return;
    }

    this.checkScreenSize();
    this.initEventStreams();
    this.initBodyScrollLock();
  }

  ngOnInit() {
    if (!this.userService.userSignal()) {
      this.userService.fetchMe();
    }
  }

  checkScreenSize() {
    if (!this.isBrowser) {
      return;
    }

    const mobile = window.innerWidth < 992;
    this.isMobile.set(mobile);

    if (mobile && !this.mobileSidebarOpen()) {
      this.mobileSidebarOpen.set(false);
    }

    if (mobile) {
      this.shownatification.set(true);
    }

    if (!mobile && this.isSidebarCollapsed()) {
      this.isSidebarCollapsed.set(false);
    }
  }

  private initEventStreams() {
    if (!this.isBrowser) {
      return;
    }

    fromEvent(window, 'scroll')
      .pipe(auditTime(100), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.showScrollButton.set(window.pageYOffset > 300));

    fromEvent(window, 'resize')
      .pipe(auditTime(150), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.checkScreenSize());
  }

  private initBodyScrollLock() {
    effect(() => {
      const shouldLock = this.isMobile() && this.mobileSidebarOpen();
      document.body.style.overflow = shouldLock ? 'hidden' : '';
      document.body.style.touchAction = shouldLock ? 'none' : '';
    });
  }

  scrollToTop() {
    if (!this.isBrowser) {
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleSidebar() {
    if (!this.isMobile()) {
      this.isSidebarCollapsed.set(!this.isSidebarCollapsed());
    }
  }

  toggleMobileSidebar() {
    if (this.isMobile()) {
      this.mobileSidebarOpen.set(!this.mobileSidebarOpen());
    }
  }

  onSidebarToggle() {
    this.toggleSidebar();
  }

  onMobileSidebarToggle() {
    this.toggleMobileSidebar();
  }

  closeMobileSidebar() {
    if (this.isMobile()) {
      this.mobileSidebarOpen.set(false);
    }
  }
}

