import { Injectable } from '@angular/core';
import { CanActivate,Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {  }
 
  async canActivate(): Promise<boolean> {
    const hasSession = await this.auth.ensureAuthState();

    if (!hasSession) {
      this.auth.clearTokens(false);
      this.router.navigate(['/login']);
      return false;
    }

    if (this.auth.isAuthenticated()) {
      return true;
    }

    this.auth.clearTokens(false);
    this.router.navigate(['/login']);
    return false;
  }
}

