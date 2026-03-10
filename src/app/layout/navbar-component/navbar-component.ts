import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy,Component,EventEmitter,Input,OnInit,Output } from '@angular/core';
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