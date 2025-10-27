import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';



export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  // AuthService'i inject ile alın
  const authService = inject(AuthService);
  const token = authService.getToken();


   // Eğer istek özel başlık içeriyorsa, interceptor'ı atla
   if (req.headers.has('bypassInterceptor')) {
    const clonedRequest = req.clone({
      headers: req.headers.delete('bypassInterceptor')  // Başlığı kaldırıyoruz
    });
    return next(clonedRequest);  // next fonksiyonunu kullanıyoruz
  }

  // Token varsa, Authorization başlığını ekleyin
  if (token) {


    
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(clonedRequest);
  }

  // Token yoksa isteği olduğu gibi iletin
  return next(req);
};
