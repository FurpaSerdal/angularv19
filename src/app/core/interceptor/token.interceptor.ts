import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {
catchError,
finalize,
map,
Observable,
shareReplay,
switchMap,
throwError
} from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { MeService } from '../../services/meservice.service';

let refreshToken$: Observable<string> | null = null;

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {

  const auth = inject(AuthService);
  const meService = inject(MeService);

  const BranchNo = meService.getUserSignal()()?.subeNo
  const accessToken = auth.getAccessToken();
  const isV18Api = req.url.includes('/v18/');

  const authReq = accessToken && isV18Api
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}`, 'X-Branch': `${BranchNo}` }
      })
    : req;

  return next(authReq).pipe(
    catchError(error => {

      // 🔐 SADECE 401 + V18 API
      if (error.status !== 401 || !isV18Api) {
        return throwError(() => error);
      }

      // Refresh token yoksa logout
      if (!auth.getRefreshToken()) {
        auth.clearTokens();
        return throwError(() => error);
      }

      // Tek refresh sistemi
      if (!refreshToken$) {
        refreshToken$ = auth.refreshToken().pipe(
          map(res => {
            auth.saveTokens(res.accessToken, res.refreshToken, res.expiresIn);
            return res.accessToken;
          }),
          shareReplay(1),

          catchError(refreshError => {
            auth.clearTokens();
            return throwError(() => refreshError);
          }),

          finalize(() => {
            refreshToken$ = null;
          })
        );
      }

      return refreshToken$!.pipe(
        switchMap(token =>
          next(
            req.clone({
              setHeaders: { Authorization: `Bearer ${token}`, 'X-Branch': `${BranchNo}` }
            })
          )
        )
      );
    })
  );
};
