import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Gorev } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class RouterHelperService {

  constructor(private router: Router) {}

  /**
   * Gorev.id'e göre route yönlendirme
   */
  navigateByGorev(gorev: Gorev): void {
    if (!gorev) return;

    // Kimlik tabanlı route eşleşmesi
    const routesMap: { [id: number]: string } = {
      // Firma siparişler
      26: 'task/company/orders/sales',    // alınan siparişler
      32: 'task/company/orders/purchase',  // verilen siparişler

      // Firma sevkler
      27: 'task/company/shipments/outbound',    // giden sevkler
      33: 'task/company/shipments/inbound',     // gelen sevkler

      // Depo siparişler
      39: 'task/warehouse/orders/sales',    // alınan depo siparişler
      41: 'task/warehouse/orders/purchase', // verilen depo siparişler

      // Depo sevkler
      40: 'task/warehouse/shipments/outbound',   // giden sevkler
      42: 'task/warehouse/shipments/inbound',    // gelen sevkler

      // Stok sayım sonuçları
      46: 'task/inventory-count-results',
      19: 'task/inventory/stock-out',  // stok çıkış işlemleri

      // virman çıkıs (ambalaj açma) işlemleri
      15: 'task/transfer/exits',

      // satıs faturaları
      2: 'task/invoices/sales',
      // alış faturaları
      34: 'task/invoices/purchase', 
      8: 'task/invoices/purchase',
      10: 'task/invoices/purchase',
      12: 'task/invoices/purchase',

      // kasa işlemleri
      101: 'task/cash-operations/file-upload',
      103: 'task/cash-operations/label-print',
      105: 'task/cash-operations/summary-report',
      106: 'task/cash-operations/summary-add',
      108: 'task/cash-operations/kunye-label-print',
      110: 'task/cash-operations/store-expense-receipt',

    };

    const route = routesMap[gorev.id];

    if (route) {
      // '/admin' prefix ile navigate ediyoruz
      this.router.navigate(['/admin', ...route.split('/')]);
    } else {
      this.router.navigate(['/admin']);
      console.warn('Route bulunamadı:', gorev);
    }
  }
}
