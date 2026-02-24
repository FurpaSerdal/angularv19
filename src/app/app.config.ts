import { 
  ApplicationConfig, 
  provideBrowserGlobalErrorListeners, 
  provideZoneChangeDetection 
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
import 'zone.js'; // Angular 19 normal zone’lu yapı için gerekli

import { routes } from './app.routes';
import { TokenInterceptor } from './core/interceptor/token.interceptor';
import { ErrorInterceptor } from './core/interceptor/error.interceptor';


// Türkçe yerel ayar kaydı
registerLocaleData(localeTr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimations(), // ✅ animasyonlar aktif
   // provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([TokenInterceptor, ErrorInterceptor])),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'tr-TR' },

    // Toastr ayarları
    provideToastr({
      timeOut: 5000,
      positionClass: 'toast-center-center', // ✅ tam ortada
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
      tapToDismiss: false,
      newestOnTop: true,
      maxOpened: 5
    }),
  ]
};
