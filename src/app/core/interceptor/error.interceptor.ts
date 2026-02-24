import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { Toast, ToastrService } from 'ngx-toastr';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {

  const toastr = inject(ToastrService);

  return next(req).pipe(
     // ✅ SUCCESS LOG
    tap(event => {
      if (event instanceof HttpResponse) {

        console.log(
          `%c[HTTP SUCCESS] ${event.url} `,
          'color: green; font-weight: bold;',
          {
            status: event.status,
            body: event.body
          }
        );
      }
    }),
        // 🔴 ERROR LOG & TOAST
    catchError(error => {

      console.error('[HTTP ERROR]', {
        url: error.url,
        status: error.status,
        message: error.message
      });

      switch (error.status) {

        case 0:
          toastr.error('Sunucuya ulaşılamıyor.');
          break;

        case 400:
          toastr.error('Geçersiz istek.');
          break;

        case 403:
          toastr.error('Bu işlem için yetkiniz yok.');
          break;

        case 404:
          toastr.error('Kayıt bulunamadı.');
          break;

        case 500:
          toastr.error('Sunucu hatası oluştu.');
          break;
      }

      return throwError(() => error);
    })
  );
};
