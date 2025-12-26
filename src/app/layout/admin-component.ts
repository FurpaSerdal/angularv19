import { Component, HostListener, signal, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar-component/sidebar-component';
import { NavbarComponent } from './navbar-component/navbar-component';
import { UserService } from '../../services/data.service';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule, CommonModule, SidebarComponent, NavbarComponent],
  templateUrl: './admin-component.html'
})
export class AdminComponent implements OnInit {
  // State signals
  showScrollButton = signal(false);
  isSidebarCollapsed = signal(false);
  shownatification = signal(true);
  mobileSidebarOpen = signal(false);
  isMobile = signal(false);

  constructor(
    public userService: UserService // UserService inject
  ) {
    this.checkScreenSize();
  }

  ngOnInit() {
    // Kullanıcı verisini çek - UserService zaten localStorage'dan yüklüyor
    if (!this.userService.userSignal()) {
      this.userService.fetchMe();
    }
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.showScrollButton.set(window.pageYOffset > 300);
  }

  @HostListener('window:resize')
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