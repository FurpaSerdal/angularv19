import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable,Subscription,tap,timer } from 'rxjs';
import { environment } from '../../environment';
import { LoginRequest,LoginResponse,User } from '../models/user';
import { MeService } from './meservice.service';

type AuthChannelMessage =
  | { type: 'request-session'; requesterTabId: string }
  | {
      type: 'session-state';
      targetTabId: string;
      accessToken: string;
      refreshToken: string;
      expirationTime: number;
      user: User | null;
    }
  | {
      type: 'tokens-updated';
      senderTabId: string;
      accessToken: string;
      refreshToken: string;
      expirationTime: number;
      user: User | null;
    }
  | { type: 'logout'; senderTabId: string };

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly ACCESS_TOKEN = 'accessToken';
  private readonly REFRESH_TOKEN = 'refreshToken';
  private readonly TOKEN_EXP = 'token_exp';
  private readonly AUTH_EVENT_NAME = 'app-auth-changed';
  private readonly SESSION_SYNC_CHANNEL = 'app-auth-session-sync';

  private readonly REFRESH_BEFORE_SECONDS = 30;

  private refreshTimer?: Subscription;
  private readonly tabId = this.createTabId();
  private readonly syncChannel = this.createSyncChannel();
  private sessionRestorePromise?: Promise<boolean>;
  private sessionRestoreResolver?: (value: boolean) => void;
  private sessionRestoreTimeoutId?: number;

  private apiUrl = environment.apiurl;

  private get storage(): Storage {
    return sessionStorage;
  }

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private meService: MeService
  ) {
    this.syncChannel?.addEventListener('message', this.handleSyncMessage as EventListener);
  }

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
  saveTokens(access: string, refresh: string, expiresIn: number, broadcast: boolean = true): void {
    const now = Math.floor(Date.now() / 1000);
    const expirationTime = now + expiresIn;

    this.applySessionSnapshot(
      {
        accessToken: access,
        refreshToken: refresh,
        expirationTime,
        user: this.meService.getUserSnapshot()
      },
      broadcast
    );
  }

  getAccessToken(): string | null {
    return this.storage.getItem(this.ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return this.storage.getItem(this.REFRESH_TOKEN);
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
    const exp = this.storage.getItem(this.TOKEN_EXP);
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
    const exp = this.storage.getItem(this.TOKEN_EXP);
    if (!exp) {
      return;
    }

    this.startRefreshTimer(Number(exp));
  }

  ensureAuthState(): Promise<boolean> {
    if (this.isAuthenticated()) {
      return Promise.resolve(true);
    }

    if (!this.syncChannel) {
      return Promise.resolve(false);
    }

    if (this.sessionRestorePromise) {
      return this.sessionRestorePromise;
    }

    this.sessionRestorePromise = new Promise<boolean>(resolve => {
      this.sessionRestoreResolver = resolve;
      this.sessionRestoreTimeoutId = window.setTimeout(() => {
        this.finishSessionRestore(this.isAuthenticated());
      }, 400);

      this.syncChannel?.postMessage({
        type: 'request-session',
        requesterTabId: this.tabId
      } satisfies AuthChannelMessage);
    }).finally(() => {
      this.sessionRestorePromise = undefined;
      this.sessionRestoreResolver = undefined;

      if (this.sessionRestoreTimeoutId) {
        window.clearTimeout(this.sessionRestoreTimeoutId);
        this.sessionRestoreTimeoutId = undefined;
      }
    });

    return this.sessionRestorePromise;
  }

  // ================= LOGOUT =================
  clearTokens(broadcast: boolean = true): void {

    if (this.refreshTimer) {
      this.refreshTimer.unsubscribe();
    }

    this.storage.removeItem(this.ACCESS_TOKEN);
    this.storage.removeItem(this.REFRESH_TOKEN);
    this.storage.removeItem(this.TOKEN_EXP);
    this.meService.clearSessionState();
    this.dialog.closeAll();
    this.emitAuthChange('logout', broadcast);
    this.router.navigate(['/login']);
  }

  private emitAuthChange(type: 'tokens-updated' | 'logout', broadcast: boolean): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.dispatchEvent(new CustomEvent(this.AUTH_EVENT_NAME, { detail: { type } }));

    if (!broadcast) {
      return;
    }

    if (type === 'logout') {
      this.syncChannel?.postMessage({
        type: 'logout',
        senderTabId: this.tabId
      } satisfies AuthChannelMessage);
      return;
    }

    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    const expirationTime = Number(this.storage.getItem(this.TOKEN_EXP));

    if (!accessToken || !refreshToken || !expirationTime) {
      return;
    }

    this.syncChannel?.postMessage({
      type: 'tokens-updated',
      senderTabId: this.tabId,
      accessToken,
      refreshToken,
      expirationTime,
      user: this.meService.getUserSnapshot()
    } satisfies AuthChannelMessage);
  }

  private applySessionSnapshot(
    snapshot: {
      accessToken: string;
      refreshToken: string;
      expirationTime: number;
      user: User | null;
    },
    broadcast: boolean
  ): void {
    this.storage.setItem(this.ACCESS_TOKEN, snapshot.accessToken);
    this.storage.setItem(this.REFRESH_TOKEN, snapshot.refreshToken);
    this.storage.setItem(this.TOKEN_EXP, snapshot.expirationTime.toString());
    this.meService.restoreUserSnapshot(snapshot.user);
    this.startRefreshTimer(snapshot.expirationTime);
    this.emitAuthChange('tokens-updated', broadcast);
  }

  private handleSyncMessage = (event: MessageEvent<AuthChannelMessage>): void => {
    const message = event.data;

    if (!message) {
      return;
    }

    if (message.type === 'request-session') {
      if (!this.isAuthenticated()) {
        return;
      }

      const accessToken = this.getAccessToken();
      const refreshToken = this.getRefreshToken();
      const expirationTime = Number(this.storage.getItem(this.TOKEN_EXP));

      if (!accessToken || !refreshToken || !expirationTime) {
        return;
      }

      this.syncChannel?.postMessage({
        type: 'session-state',
        targetTabId: message.requesterTabId,
        accessToken,
        refreshToken,
        expirationTime,
        user: this.meService.getUserSnapshot()
      } satisfies AuthChannelMessage);
      return;
    }

    if (message.type === 'session-state') {
      if (message.targetTabId !== this.tabId || this.isAuthenticated()) {
        return;
      }

      this.applySessionSnapshot(message, false);
      this.finishSessionRestore(true);
      return;
    }

    if (message.type === 'tokens-updated') {
      if (message.senderTabId === this.tabId) {
        return;
      }

      this.applySessionSnapshot(message, false);
      return;
    }

    if (message.type === 'logout' && message.senderTabId !== this.tabId) {
      this.clearTokens(false);
    }
  };

  private finishSessionRestore(value: boolean): void {
    if (!this.sessionRestoreResolver) {
      return;
    }

    this.sessionRestoreResolver(value);
  }

  private createSyncChannel(): BroadcastChannel | null {
    if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') {
      return null;
    }

    return new BroadcastChannel(this.SESSION_SYNC_CHANNEL);
  }

  private createTabId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

