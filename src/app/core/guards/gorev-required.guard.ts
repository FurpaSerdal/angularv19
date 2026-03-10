import { inject } from '@angular/core';
import { CanActivateFn,Router } from '@angular/router';
import { MeService } from '../../services/meservice.service';

export const gorevRequiredGuard: CanActivateFn = () => {
  const userService = inject(MeService);
  const router = inject(Router);

  const gorev = userService.selectedGorev();
  console.log('GorevRequiredGuard çalıştı, seçili görev:', gorev);
  if (!gorev) {
    console.warn('GorevRequiredGuard: Seçili görev bulunamadı, yönlendiriliyor...');
    return router.createUrlTree(['/admin']);
  }

  return true;
};
