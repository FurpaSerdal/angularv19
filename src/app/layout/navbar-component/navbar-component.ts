import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MeService } from '../../services/meservice.service';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {
  @Input() mobileSidebarOpen: boolean = false;
  @Input() shownatification: boolean = true;
  @Output() sidebarToggle = new EventEmitter<void>();

  constructor(
    private authService: AuthService, public userService: MeService
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
    this.authService.clearTokens();

  }
}