import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AltMenu, Gorev } from '../../models/user';

@Injectable({ providedIn: 'root' })
export class RouterHelperService {
  constructor(private router: Router) {}

  private readonly routesMap: Record<number, string[]> = {
    // Sevk isleri -> Alinan siparisler
    1: ['task', 'company', 'orders', 'sales'],
    3: ['task', 'company', 'orders', 'sales'],
    5: ['task', 'company', 'orders', 'sales'],
    26: ['task', 'company', 'orders', 'sales'],
    29: ['task', 'company', 'orders', 'sales'],

    // Sevk isleri -> Sevk irsaliyeleri
    27: ['task', 'company', 'shipments', 'outbound'],
    30: ['task', 'company', 'shipments', 'outbound'],
    36: ['task', 'warehouse', 'shipments', 'outbound'],
    40: ['task', 'warehouse', 'shipments', 'outbound'],

    // Mal kabul ve depo -> Siparisler
    7: ['task', 'company', 'orders', 'purchase'],
    9: ['task', 'company', 'orders', 'purchase'],
    11: ['task', 'company', 'orders', 'purchase'],
    32: ['task', 'company', 'orders', 'purchase'],
    13: ['task', 'company', 'orders', 'purchase'],
    37: ['task', 'warehouse', 'orders', 'purchase'],
    41: ['task', 'warehouse', 'orders', 'purchase'],
    35: ['task', 'warehouse', 'orders', 'sales'],
    39: ['task', 'warehouse', 'orders', 'sales'],

    

    // Faturalar
    2: ['task', 'invoices', 'sales'],
    4: ['task', 'invoices', 'sales'],
    6: ['task', 'invoices', 'sales'],
    28: ['task', 'invoices', 'sales'],
    31: ['task', 'invoices', 'sales'],
    55: ['task', 'invoices', 'sales'],
    8: ['task', 'invoices', 'purchase'],
    10: ['task', 'invoices', 'purchase'],
    12: ['task', 'invoices', 'purchase'],
    14: ['task', 'invoices', 'purchase'],
    34: ['task', 'invoices', 'purchase'],

    // Diger operasyonlar
    33: ['task', 'company', 'shipments', 'inbound'],
    42: ['task', 'warehouse', 'shipments', 'inbound'],
    38: ['task', 'warehouse', 'shipments', 'inbound'],
    23: ['task', 'inventory-count-results'],
    16: ['task', 'inventory', 'stock-out'],
    15: ['task', 'transfer', 'exits'],


    // Kasa
    45: ['task', 'cash-operations', 'file-upload'],
    43: ['task', 'cash-operations', 'label-print'],
    50: ['task', 'cash-operations', 'summary-report'],
    51: ['task', 'cash-operations', 'summary-add'],
    44: ['task', 'cash-operations', 'kunye-label-print'],
    46: ['task', 'cash-operations', 'store-expense-receipt'],
    48: ['task', 'cash-operations', 'union-card']
  };

  getRouteSegmentsByGorevId(gorevId: number): string[] | null {
    return this.routesMap[gorevId] ?? null;
  }

  navigateByGorev(gorev: Gorev): void {
    if (!gorev) {
      return;
    }


    const routeSegments = this.getRouteSegmentsByGorevId(gorev.id);

    if (!routeSegments) {
      console.warn('Route bulunamadi:', gorev);
      this.router.navigate(['/admin']);
      return;
    }

    this.router.navigate(['/admin', ...routeSegments]);
  }

  navigateToAltMenu(altMenu: AltMenu): void {
    if (altMenu.gorevler && altMenu.gorevler.length > 0) {
      this.navigateByGorev(altMenu.gorevler[0]);
      return;
    }

    console.warn('Alt menu altinda gorev bulunamadi:', altMenu);
    this.router.navigate(['/admin']);
  }
}

