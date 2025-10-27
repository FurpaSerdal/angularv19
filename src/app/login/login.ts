import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
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
    private meService: UserService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin']);
    }
  }

  login(): void {
    this.isFormSubmitted = true;
    this.errorMessage = '';

    if (this.email && this.password) {
      this.isLoading = true;
      
      this.authService.login({ email: this.email, password: this.password }).subscribe({
        next: (response: any) => {
          console.log('Giriş başarılı:', response);
          
          this.authService.saveToken(response.accessToken);
          this.meService.fetchMe(); // Kullanıcı bilgilerini çek
          
          // Başarı animasyonu için kısa bekleme
          setTimeout(() => {
            this.isLoading = false;
            this.router.navigate(['/admin']);
          }, 1000);
        },
        error: (err) => {
          console.error('Giriş başarısız:', err);
          this.isLoading = false;

          if (err.status === 0) {
            this.errorMessage = 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.';
          } else if (err.status === 500) {
            this.errorMessage = 'Sunucu hatası. Lütfen tekrar deneyin.';
          } else if (err.status === 401) {
            this.errorMessage = 'E-posta veya şifre hatalı. Lütfen bilgilerinizi kontrol edin.';
          } else {
            this.errorMessage = err.error?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.';
          }
        }
      });
    } else {
      this.errorMessage = 'Lütfen tüm alanları doldurun.';
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