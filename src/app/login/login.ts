import { CommonModule } from '@angular/common';
import { ChangeDetectorRef,Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { timeout,TimeoutError } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})


export class LoginComponent {
  email = '';
  password = '';
  errorMessage: string = '';
  isFormSubmitted: boolean = false;
  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin']);
    }
  }
  login(): void {
    if (this.isLoading) {
      return;
    }

    this.isFormSubmitted = true;
    this.errorMessage = '';

    const email = this.email.trim();

    if (email && this.password) {
      this.isLoading = true;

      this.authService.login({ email, password: this.password })
        .pipe(timeout(10000))
        .subscribe({
          next: () => {
            this.isLoading = false;
            
            // Basari animasyonu icin kisa bekleme
            setTimeout(() => {
              this.router.navigate(['/admin']).then(() => {
                // window.location.reload();
              });
            }, 1000);
          },
          error: (err) => {
            console.error('Giris basarisiz:', err);
            this.isLoading = false;
            this.cdr.detectChanges();

            if (err instanceof TimeoutError) {
              this.errorMessage = 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.';
            } else if (err.status === 0) {
              this.errorMessage = 'Sunucuya baglanilamiyor. Lutfen internet baglantinizi kontrol edin.';
            } else if (err.status === 500) {
              this.errorMessage = 'Sunucu hatasi. Lutfen tekrar deneyin.';
            } else if (err.status === 401) {
              this.errorMessage = 'E-posta veya sifre hatali. Lutfen bilgilerinizi kontrol edin.';
            } else {
              this.errorMessage = err.error?.message || 'Bir hata olustu. Lutfen tekrar deneyin.';
            }
          }
        });
    } else {
      this.errorMessage = 'Lutfen tum alanlari doldurun.';
      this.isLoading = false;
    }
  }


  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Input alanlarına focus olunca hata mesajını temizle
  clearError(): void {
    this.errorMessage = '';
  }
}