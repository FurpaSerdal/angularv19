import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AltMenu,Gorev } from "../../models/user";

@Injectable({ providedIn: 'root' })
export class RouterHelperService {

  constructor(private router: Router) {}

  private readonly routesMap: Record<number, string[]> = {

    // Firma siparişler
    26: ['task', 'company', 'orders', 'sales'],
    32: ['task', 'company', 'orders', 'purchase'],

    // Firma sevkler
    27: ['task', 'company', 'shipments', 'outbound'],
    33: ['task', 'company', 'shipments', 'inbound'],

    // Depo siparişler
    39: ['task', 'warehouse', 'orders', 'sales'],
    41: ['task', 'warehouse', 'orders', 'purchase'],

    // Depo sevkler
    40: ['task', 'warehouse', 'shipments', 'outbound'],
    42: ['task', 'warehouse', 'shipments', 'inbound'],

    // Sayım
    23: ['task', 'inventory-count-results'],
    16: ['task', 'inventory', 'stock-out'],
    // Transfer
    15: ['task', 'transfer', 'exits'],

    // Faturalar
    55: ['task', 'invoices', 'sales'],
    34: ['task', 'invoices', 'purchase'],
    8: ['task', 'invoices', 'purchase'],
    10: ['task', 'invoices', 'purchase'],
    12: ['task', 'invoices', 'purchase'],

    // Kasa
    45 : ['task', 'cash-operations', 'file-upload'],
    43 : ['task', 'cash-operations', 'label-print'],
    50: ['task', 'cash-operations', 'summary-report'],
    51 : ['task', 'cash-operations', 'summary-add'],
    44: ['task', 'cash-operations', 'kunye-label-print'],
    46 : ['task', 'cash-operations', 'store-expense-receipt'],
  };

  navigateByGorev(gorev: Gorev): void {
    if (!gorev) return;

    const routeSegments = this.routesMap[gorev.id];
    console.log('Navigating to route for Gorev ID:', gorev.id, 'Route Segments:', routeSegments);

    if (!routeSegments) {
      console.warn('Route bulunamadı:', gorev);
      this.router.navigate(['/admin']);
      return;
    }

    this.router.navigate(['/admin', ...routeSegments]);
  }

  navigateToAltMenu(altMenu: AltMenu): void {
    // Eğer alt menünün altında görevler varsa, ilk göreve yönlendir
    if (altMenu.gorevler && altMenu.gorevler.length > 0) {
      this.navigateByGorev(altMenu.gorevler[0]);
      return;
    }
    console.warn('AltMenu altında görev bulunamadı:', altMenu);
    this.router.navigate(['/admin']);
  }

}
