import { HttpInterceptorFn,HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError,tap,throwError } from 'rxjs';

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

        case 401:
          toastr.error('E-posta veya şifre hatalı.');
          break;

        case 400:

        case 403:
          toastr.error('Bu işlem için yetkiniz yok.');
          break;

        case 404:
          toastr.error('Rota bulunamadı.');
          break;

        case 500:
          toastr.error('Sunucu hatası oluştu.');
          break;
      }

      return throwError(() => error);
    })
  );
};

