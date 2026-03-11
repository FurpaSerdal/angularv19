import { Routes } from '@angular/router';
import { AdminComponent } from './layout/admin-component';
import { LoginComponent } from './login/login';

import { AuthGuard } from './core/guards/auth.guard';
import { WarehouseInboundShipments } from './features/depolardan/sevkler/warehouse-inbound-shipments/list/warehouse-inbound-shipments';
import { WarehouseOutboundShipments } from './features/depolardan/sevkler/warehouse-outbound-shipments/list/warehouse-outbound-shipments';
import { WarehouseSaleOrder } from './features/depolardan/siparisler/warehouse-sale-order/list/warehouse-sale-order';
import { WarhousePurchaseOrder } from './features/depolardan/siparisler/warhouse-purchase-order/list/warhouse-purchase-order';
import { IncomingInvoice } from './features/faturalar/gelen/list/incoming-invoice';
import { outgoingInvoice } from './features/faturalar/giden/list/outgoing-invoice';
import { FirmaFaturaComponent } from './features/firmalardan/firma-fatura/firma-fatura.component';
import { CompanyInboundShipments } from './features/firmalardan/sevkler/company-inbound-shipments/list/company-inbound-shipments';
import { CompanyOutboundShipments } from './features/firmalardan/sevkler/company-outbound-shipments/list/company-outbound-shipments';
import { CompanyPurchaseOrder } from './features/firmalardan/siparisler/company-purchase-order/list/company-purchase-order';
import { CompanySaleOrder } from './features/firmalardan/siparisler/company-sale-order/list/company-sale-order';
import { HomePage } from './features/home-page/home-page';
import { DosyaGonderimiComponent } from './features/kasaislemleri/dosya-gonderimi/dosya-gonderimi.component';
import { EtiketbasimComponent } from './features/kasaislemleri/etiketbasim/etiketbasim.component';
import { AddSummaryComponent } from './features/kasaislemleri/icmal-dokum/add-summary/add-summary.component';
import { IcmalDokumComponent } from './features/kasaislemleri/icmal-dokum/icmal-dokum.component';
import { KunyeEtiketBasimiComponent } from './features/kasaislemleri/kunye-etiket-basimi/kunye-etiket-basimi.component';
import { MagazagiderfisiComponent } from './features/kasaislemleri/magazagiderfisi/magazagiderfisi.component';
import { InventoryCountResults } from './features/sayımlar/inventory-count-results/inventory-count-results';
import { StockOut } from './features/stoklar/stock-out/list/stock-out';
import { VirmanExit } from './features/virman/virman-cıkısı/list/virman-exit';





export const routes: Routes = [
  { path: 'login', component: LoginComponent },


  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard], // AuthGuard ekleyebilirsiniz
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
      // ===== STOK ÇIKIŞ =====
      { path: 'task/inventory/stock-out', component: StockOut },  // stok çıkış işlemleri

      // ===== VİRMAN ÇIKIŞ =====
      { path: 'task/transfer/exits', component: VirmanExit },  // virman çıkıs (ambalaj açma) işlemleri,



      // satıs faturaları
      { path: 'task/invoices/sales', component: outgoingInvoice },  // satış faturaları
      // alış faturaları
      {path: 'task/invoices/purchase', component: IncomingInvoice },  // alış faturaları


      // ===== KASA İŞLEMLERİ =====
      { path: 'task/cash-operations/file-upload', component: DosyaGonderimiComponent },  // dosya yükle
      { path: 'task/cash-operations/label-print', component: EtiketbasimComponent },  // etiket yazdır
      { path: 'task/cash-operations/summary-report', component: IcmalDokumComponent },  // icmal dökümü
      { path: 'task/cash-operations/summary-add', component: AddSummaryComponent },  // icmal ekle
      { path: 'task/cash-operations/kunye-label-print', component: KunyeEtiketBasimiComponent },  // künye etiket yazdır
      { path: 'task/cash-operations/store-expense-receipt', component: MagazagiderfisiComponent },  // mağaza gider fişi
 
       //{ path: 'task/:id', component: OrtakMenu }, // Ortak Menü Yönlendirmesi


    

    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
