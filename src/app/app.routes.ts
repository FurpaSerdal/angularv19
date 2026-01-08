import { Routes } from '@angular/router';
import { AdminComponent } from './layout/admin-component';
import { LoginComponent } from './login/login';

import { CompanyInboundShipments } from './features/firmalardan/sevkler/company-inbound-shipments/company-inbound-shipments';
import { CompanyOutboundShipments } from './features/firmalardan/sevkler/company-outbound-shipments/company-outbound-shipments';
import { CompanySaleOrder } from './features/firmalardan/siparisler/company-sale-order/company-sale-order';
import { HomePage } from './features/home-page/home-page';
import { FirmaFaturaComponent } from './features/firmalardan/firma-fatura/firma-fatura.component';
import { InventoryCountResults } from './features/sayımlar/inventory-count-results/inventory-count-results';
import { WarehouseSaleOrder } from './features/depolardan/siparisler/warehouse-sale-order/list/warehouse-sale-order';
import { WarhousePurchaseOrder } from './features/depolardan/siparisler/warhouse-purchase-order/list/warhouse-purchase-order';
import { WarehouseOutboundShipments } from './features/depolardan/sevkler/warehouse-outbound-shipments/list/warehouse-outbound-shipments';
import { WarehouseInboundShipments } from './features/depolardan/sevkler/warehouse-inbound-shipments/list/warehouse-inbound-shipments';
import { CompanyPurchaseOrder } from './features/firmalardan/siparisler/company-purchase-order/list/company-purchase-order';





export const routes: Routes = [
  { path: 'login', component: LoginComponent },


  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', component: HomePage },
      
      // ===== FİRMA → SEVKLER =====
      { path: 'task/company/shipments/outbound', component: CompanyOutboundShipments }, // firma sevkler giden
      { path: 'task/company/shipments/inbound', component: CompanyInboundShipments },  // firma sevkler gelen 

      // ===== DEPO → SEVKLER =====
      { path: 'task/warehouse/shipments/outbound', component: WarehouseOutboundShipments },   // depo sevkler giden
      { path: 'task/warehouse/shipments/inbound', component: WarehouseInboundShipments },  // depo sevkler gelen

      // ===== FİRMA → SİPARİŞLER =====
      { path: 'task/company/orders/sales', component: CompanySaleOrder },           // firma siparişler satış için   alınan siparis
      { path: 'task/company/orders/purchase', component: CompanyPurchaseOrder },    // firma siparişler satınalma verilen siparis

      // ===== DEPO → SİPARİŞLER =====
      { path: 'task/warehouse/orders/sales', component: WarehouseSaleOrder },       // depo siparişler satış  çıkış fişleri   alınan depo siparişleri
      { path: 'task/warehouse/orders/purchase', component: WarhousePurchaseOrder },   // depo siparişler satınalma  giriş fişleri  verilen depo siparişleri

      // ===== FATURA =====
      { path: 'task/company/invoices', component: FirmaFaturaComponent },         // firma faturalar  satış faturaları  alış faturaları


      // ===== SAYIM SONUÇLARI =====
      { path: 'task/inventory-count-results', component: InventoryCountResults },  // stok sayım sonuçları
 
       //{ path: 'task/:id', component: OrtakMenu }, // Ortak Menü Yönlendirmesi


    

    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
