import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Gorev } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class RouterHelperService {

  constructor(private router: Router) {}

  /**
   * Gorev.kimlik'e göre route yönlendirme
   */
  navigateByGorev(gorev: Gorev): void {
    if (!gorev) return;

    // Kimlik tabanlı route eşleşmesi
    const routesMap: { [id: number]: string } = {
      // Firma siparişler
      64: 'task/company/orders/sales',    // alınan siparişler
      70: 'task/company/orders/purchase',  // verilen siparişler

      // Firma sevkler
      65: 'task/company/shipments/outbound',    // giden sevkler
      71: 'task/company/shipments/inbound',     // gelen sevkler

      // Depo siparişler
      77: 'task/warehouse/orders/sales',    // alınan depo siparişler
      79: 'task/warehouse/orders/purchase', // verilen depo siparişler

      // Depo sevkler
      78: 'task/warehouse/shipments/outbound',   // giden sevkler
      80: 'task/warehouse/shipments/inbound',    // gelen sevkler

      // Stok sayım sonuçları
      55: 'task/inventory-count-results',
    };

    const route = routesMap[gorev.kimlik];

    if (route) {
      // '/admin' prefix ile navigate ediyoruz
      this.router.navigate(['/admin', ...route.split('/')]);
    } else {
      console.warn('Route bulunamadı:', gorev);
    }
  }
}
