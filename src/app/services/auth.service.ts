import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable,Subscription,tap,timer } from 'rxjs';
import { environment } from '../../environment';
import { LoginRequest,LoginResponse } from '../models/user';
import { MeService } from './meservice.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly ACCESS_TOKEN = 'accessToken';
  private readonly REFRESH_TOKEN = 'refreshToken';
  private readonly TOKEN_EXP = 'token_exp';

  private readonly REFRESH_BEFORE_SECONDS = 30;

  private refreshTimer?: Subscription;

  private apiUrl = environment.apiurl;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private meService: MeService
  ) {}

  // ================= LOGIN =================
  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/kullanici/login`, data)
      .pipe(
        tap(res => {
          this.saveTokens(res.accessToken, res.refreshToken, res.expiresIn);
        })
      );
  }

  // ================= TOKEN STORAGE =================
  saveTokens(access: string, refresh: string, expiresIn: number): void {
    localStorage.setItem(this.ACCESS_TOKEN, access);
    localStorage.setItem(this.REFRESH_TOKEN, refresh);

    const now = Math.floor(Date.now() / 1000);
    const expirationTime = now + expiresIn;

    localStorage.setItem(this.TOKEN_EXP, expirationTime.toString());

    this.startRefreshTimer(expirationTime);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  // ================= AUTH CHECK =================
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    if (this.isTokenExpired()) {
      this.clearTokens();
      return false;
    }

    return true;
  }

  isTokenExpired(): boolean {
    const exp = localStorage.getItem(this.TOKEN_EXP);
    if (!exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return now >= Number(exp);
  }

  // ================= AUTO REFRESH =================
  private startRefreshTimer(expirationTime: number) {

    if (this.refreshTimer) {
      this.refreshTimer.unsubscribe();
    }

    const now = Math.floor(Date.now() / 1000);
    const refreshAt = expirationTime - this.REFRESH_BEFORE_SECONDS;

    const delay = (refreshAt - now) * 1000;

    if (delay <= 0) {
      this.triggerRefresh();
      return;
    }

    this.refreshTimer = timer(delay).subscribe(() => {
      this.triggerRefresh();
    });
  }

  private triggerRefresh() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearTokens();
      return;
    }

    this.refreshToken().subscribe({
      next: () => {
        console.log('🔄 Token auto refreshed');
      },
      error: () => {
        this.clearTokens();
      }
    });
  }

  // ================= REFRESH =================
  refreshToken(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/kullanici/refresh`,
      { refreshToken: this.getRefreshToken() }
    ).pipe(
      tap(res => {
        this.saveTokens(res.accessToken, res.refreshToken, res.expiresIn);
      })
    );
  }

  // ================= INIT (App Reload İçin) =================
  initializeAuthTimer(): void {
    const exp = localStorage.getItem(this.TOKEN_EXP);
    if (!exp) return;

    this.startRefreshTimer(Number(exp));
  }

  // ================= LOGOUT =================
  clearTokens(): void {

    if (this.refreshTimer) {
      this.refreshTimer.unsubscribe();
    }

    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    localStorage.removeItem(this.TOKEN_EXP);
    localStorage.clear();
    

    this.meService.clearUserSignal();
    this.dialog.closeAll();

    this.router.navigate(['/login']);
  }
}