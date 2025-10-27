import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { LoginRequest, LoginResponse } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiurl;

  constructor(private http: HttpClient) {}

  login(user: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/kullanici/login`, user);
  }

  saveToken(token: string): void {
    if (!token) {
      console.warn('Token boş, kaydedilemedi');
      return;
    }
    
    localStorage.setItem('authToken', token);
    sessionStorage.setItem('authToken', token);
    
    console.log('Token kaydedildi:', this.getTokenInfo(token));
  }

  getToken(): string | null {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (!token || token === 'null' || token === 'undefined') {
      return null;
    }
    
    return token;
  }

  removeToken(): void {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    console.log('Token temizlendi');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    
    if (!token) {
      console.log('Token bulunamadı');
      return false;
    }

    const isExpired = this.isTokenExpired(token);
    
    if (isExpired) {
      console.warn('Token süresi dolmuş:', this.getTokenInfo(token));
      this.removeToken(); // Otomatik temizle
      return false;
    }
    
    console.log('Token geçerli:', this.getTokenInfo(token));
    return true;
  }

  // Geliştirilmiş Token Süresi Kontrolü
  private isTokenExpired(token: string): boolean {
    try {
      // Token format kontrolü
      if (typeof token !== 'string' || !token.includes('.')) {
        console.error('Geçersiz token formatı');
        return true;
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('JWT formatı hatalı');
        return true;
      }

      // Base64 decode (URL-safe support)
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = atob(payload);
      const parsedPayload = JSON.parse(decodedPayload);

      // Expiry kontrolü
      if (!parsedPayload.exp) {
        console.warn('Token exp bilgisi yok');
        return false; // exp yoksa süresiz kabul et
      }

      const expiry = parsedPayload.exp;
      const now = Math.floor(Date.now() / 1000);
      
      // 5 dakika tolerans ekle (clock skew)
      const withTolerance = now + 300;
      
      return withTolerance >= expiry;

    } catch (error) {
      console.error('Token decode hatası:', error);
      return true; // Hata durumunda expired kabul et
    }
  }

  // Token bilgilerini görüntüleme (debug için)
  getTokenInfo(token?: string): any {
    const currentToken = token || this.getToken();
    
    if (!currentToken) {
      return { error: 'Token yok' };
    }

    try {
      const parts = currentToken.split('.');
      const payload = JSON.parse(atob(parts[1]));
      
      const now = Math.floor(Date.now() / 1000);
      const expiresIn = payload.exp ? payload.exp - now : null;
      
      return {
        issuedTo: payload.sub || payload.email,
        expiresAt: payload.exp ? new Date(payload.exp * 1000).toLocaleString('tr-TR') : 'Süresiz',
        expiresIn: expiresIn ? `${Math.floor(expiresIn / 60)} dakika` : 'Süresiz',
        isExpired: payload.exp ? now >= payload.exp : false,
        issuedAt: payload.iat ? new Date(payload.iat * 1000).toLocaleString('tr-TR') : 'Bilinmiyor'
      };
    } catch (error) {
      return { error: 'Token bilgisi alınamadı' };
    }
  }

  // Token'ı yenileme (opsiyonel)
  refreshToken(): void {
    // Burada token refresh logic ekleyebilirsiniz
    console.log('Token refresh işlemi başlatıldı');
  }
}