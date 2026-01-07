import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { fromEvent } from 'rxjs';
import { auditTime } from 'rxjs/operators';

import { SidebarComponent } from './sidebar-component/sidebar-component';
import { NavbarComponent } from './navbar-component/navbar-component';
import { MeService } from '../services/meservice.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';



@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule, CommonModule, SidebarComponent, NavbarComponent],
  templateUrl: './admin-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent implements OnInit {
  // State signals
  showScrollButton = signal(false);
  isSidebarCollapsed = signal(false);
  shownatification = signal(true);
  mobileSidebarOpen = signal(false);
  isMobile = signal(false);

  constructor(
    public userService: MeService, // MeService inject
    private destroyRef: DestroyRef
  ) {
    this.checkScreenSize();
    this.initEventStreams();
  }

  ngOnInit() {
    // Kullanıcı verisini çek - MeService zaten localStorage'dan yüklüyor
    if (!this.userService.userSignal()) {
      this.userService.fetchMe();
    }
  }

  checkScreenSize() {
    const mobile = window.innerWidth < 992;
    this.isMobile.set(mobile);

    if (mobile && !this.mobileSidebarOpen()) {
      this.mobileSidebarOpen.set(false);
    }
    // eger ekran mobile değilse shownatification true yap
    if (mobile ) {
     this.shownatification.set(true);
    }
    
    if (!mobile && this.isSidebarCollapsed()) {
      this.isSidebarCollapsed.set(false);
    }
  }

  private initEventStreams() {
    fromEvent(window, 'scroll')
      .pipe(auditTime(100), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.showScrollButton.set(window.pageYOffset > 300));

    fromEvent(window, 'resize')
      .pipe(auditTime(150), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.checkScreenSize());
  }

  scrollToTop() {
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