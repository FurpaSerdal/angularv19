import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { LoginRequest, LoginResponse } from '../models/user';
import { Observable, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MeService } from './meservice.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly ACCESS_TOKEN = 'accessToken';
  private readonly REFRESH_TOKEN = 'refreshToken';
  private apiUrl = environment.apiurl;

  constructor(private http: HttpClient ,private dialog: MatDialog, private router: Router,private meService: MeService) {}

  // ===== LOGIN =====
  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/kullanici/login`, data)
      .pipe(
        tap(res => {
          this.saveTokens(res.accessToken, res.refreshToken);
        })
      );
  }

  // ===== TOKEN STORAGE =====
  saveTokens(access: string, refresh: string): void {
    localStorage.setItem(this.ACCESS_TOKEN, access);
    localStorage.setItem(this.REFRESH_TOKEN, refresh);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  clearTokens(): void {
    this.meService.clearUserSignal(); // MeService'ten kullanıcı bilgisini temizle
    this.dialog.closeAll(); // Tüm açık dialogları kapat
    localStorage.clear();
    sessionStorage.clear();
      this.router.navigate(['/login']);

  }

  // ===== AUTH =====
isAuthenticated(): boolean {
  return !!this.getAccessToken();
}
  // ===== REFRESH =====
  refreshToken(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/kullanici/refresh`,
      { refreshToken: this.getRefreshToken() }
    ).pipe(
      tap(res => {
        this.saveTokens(res.accessToken, res.refreshToken);
      })
    );
  }

  // ===== JWT =====
  isTokenExpired(token: string): boolean {
    try {
      const payload = this.decode(token);
      if (!payload?.exp) return false;
      const now = Math.floor(Date.now() / 1000);
      return now >= payload.exp;
    } catch {
      return true;
    }
  }

  private decode(token: string): any {
    const base64 = token.split('.')[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(4 * Math.ceil(token.split('.')[1].length / 4), '=');

    return JSON.parse(atob(base64));
  }
}
