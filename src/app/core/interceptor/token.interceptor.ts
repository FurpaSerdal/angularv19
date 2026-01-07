import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {
  catchError,
  switchMap,
  throwError,
  shareReplay,
  finalize,
  map,
  tap
} from 'rxjs';
import { Observable } from 'rxjs';

// Tek bir refresh isteğini paylaşmak için hafızada tutulan observable
let refreshToken$: Observable<string> | null = null;

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {

  const auth = inject(AuthService);
  const router = inject(Router);

  const accessToken = auth.getAccessToken();

  const authReq = accessToken
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` }
      })
    : req;

  return next(authReq).pipe(
    catchError(error => {

      if (error.status !== 401) {
        return throwError(() => error);
      }

      // Refresh token yoksa doğrudan login'e at
      if (!auth.getRefreshToken()) {
        auth.clearTokens();
        router.navigate(['/login']);
        return throwError(() => error);
      }

      // Tek bir refresh isteğini paylaş
      if (!refreshToken$) {
        refreshToken$ = auth.refreshToken().pipe(
          tap(res => auth.saveTokens(res.accessToken, res.refreshToken)),
          map(res => res.accessToken),
          shareReplay(1),
          finalize(() => {
            refreshToken$ = null;
          })
        );
      }

      const refresh$ = refreshToken$;

      return refresh$!.pipe(
        switchMap(token =>
          next(
            req.clone({
              setHeaders: { Authorization: `Bearer ${token}` }
            })
          )
        ),
        catchError(err => {
          auth.clearTokens();
          router.navigate(['/login']);
          return throwError(() => err);
        })
      );
    })
  );
};
