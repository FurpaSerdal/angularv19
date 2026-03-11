import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { MeService } from '../../services/meservice.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {
  @Input() mobileSidebarOpen = false;
  @Input() shownatification = true;
  @Output() sidebarToggle = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    public userService: MeService
  ) {}

  ngOnInit() {}

  onMobileToggle() {
    this.sidebarToggle.emit();
  }

  getMobileMenuIcon(): string {
    return this.mobileSidebarOpen ? 'bi-x' : 'bi-list';
  }

  getUserDisplayName(): string {
    return this.userService.userSignal()?.adSoyad || 'Kullanici';
  }

  getBranchDisplay(): string {
    const user = this.userService.userSignal();

    if (!user) {
      return 'Sube bilgisi bekleniyor';
    }

    return `${user.sube} / ${user.subeNo}`;
  }

  getUserInitials(): string {
    return this.getUserDisplayName()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }

  logout(): void {
    this.authService.clearTokens();
  }
}
