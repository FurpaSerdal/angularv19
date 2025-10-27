import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/data.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-component.html'
})
export class NavbarComponent implements OnInit {
  @Input() mobileSidebarOpen: boolean = false;
  @Output() sidebarToggle = new EventEmitter<void>();

  constructor(
    public userService: UserService, // UserService inject
    private router: Router
  ) {}

  ngOnInit() {
    // Data is automatically handled by the service
  }

  onMobileToggle() {
    this.sidebarToggle.emit();
  }

  getMobileMenuIcon(): string {
    return this.mobileSidebarOpen ? 'bi-x' : 'bi-list';
  }

  logout(): void {
    console.log('Logging out...');
    // UserService'teki clearUser metodunu kullan
    this.userService.clearUser();
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}