import { Routes } from '@angular/router';
import { AdminComponent } from './layout/admin-component';
import { LoginComponent } from './login/login';
import { HomePage } from './sayfalar/home-page/home-page';
import { TsirsAlinanSiparis } from './menuler/sevk-islemleri/toptan-satis-irsaliyeli-sevk/tsirs-alinan-siparis/tsirs-alinan-siparis';
import { TsirsToptanSatisIrsaliyeliSevk } from './menuler/sevk-islemleri/toptan-satis-irsaliyeli-sevk/tsirs-toptan-satis-irsaliyeli-sevk/tsirs-toptan-satis-irsaliyeli-sevk';
import { TsirsSatisFaturasi } from './menuler/sevk-islemleri/toptan-satis-irsaliyeli-sevk/tsirs-satis-faturasi/tsirs-satis-faturasi';
import { TsfsAlisFaturasi } from './menuler/sevk-islemleri/toptan-satis-faturali-sevk/tsfs-alis-faturasi/tsfs-alis-faturasi';
import { TsfsToptanSatisFaturaliSevk } from './menuler/sevk-islemleri/toptan-satis-faturali-sevk/tsfs-toptan-satis-faturali-sevk/tsfs-toptan-satis-faturali-sevk';
import { TsfsSatisFaturasi } from './menuler/sevk-islemleri/toptan-satis-faturali-sevk/tsfs-satis-faturasi/tsfs-satis-faturasi';
import { PsirsAlisFaturasi } from './menuler/sevk-islemleri/prerakende-satis-irsaliyeli-sevk/psirs-alis-faturasi/psirs-alis-faturasi';
import { PsirsPrerakendeSatisIrsaliyeliSevk } from './menuler/sevk-islemleri/prerakende-satis-irsaliyeli-sevk/psirs-prerakende-satis-irsaliyeli-sevk/psirs-prerakende-satis-irsaliyeli-sevk';
import { PsirsSatisFaturasi } from './menuler/sevk-islemleri/prerakende-satis-irsaliyeli-sevk/psirs-satis-faturasi/psirs-satis-faturasi';
import { PsfsHaldenAlisFaturasi } from './menuler/sevk-islemleri/prerakende-satis-faturali-sevk/psfs-halden-alis-faturasi/psfs-halden-alis-faturasi';
import { PsfsPrerakendeSatisFaturaliSevk } from './menuler/sevk-islemleri/prerakende-satis-faturali-sevk/psfs-prerakende-satis-faturali-sevk/psfs-prerakende-satis-faturali-sevk';
import { PsfsSatisFaturasi } from './menuler/sevk-islemleri/prerakende-satis-faturali-sevk/psfs-satis-faturasi/psfs-satis-faturasi';
import { DfcfDegerFarkiCikisFaturasi } from './menuler/sevk-islemleri/deger-farki-cikis-faturasi/dfcf-deger-farki-cikis-faturasi/dfcf-deger-farki-cikis-faturasi';
import { DfcfSatisFaturasi } from './menuler/sevk-islemleri/deger-farki-cikis-faturasi/dfcf-satis-faturasi/dfcf-satis-faturasi';
import { DasfAlinanSiparis } from './menuler/sevk-islemleri/depolar-arasi-sevk-fisi/dasf-alinan-siparis/dasf-alinan-siparis';
import { DasfDepolarArasiSevkFisi } from './menuler/sevk-islemleri/depolar-arasi-sevk-fisi/dasf-depolar-arasi-sevk-fisi/dasf-depolar-arasi-sevk-fisi';
import { DasnVerilenSiparis } from './menuler/sevk-islemleri/depolar-arasi-sevk-nakliye-fisi/dasn-verilen-siparis/dasn-verilen-siparis';
import { DasnDepolarArasiSevkNakliyeFisi } from './menuler/sevk-islemleri/depolar-arasi-sevk-nakliye-fisi/dasn-depolar-arasi-sevk-nakliye-fisi/dasn-depolar-arasi-sevk-nakliye-fisi';
import { TafmkVerilenSiparis } from './menuler/tedarik-islemleri/toptan-alis-faturasi-mal-kabulu/tafmk-verilen-siparis/tafmk-verilen-siparis';
import { TafmkAlisFaturasi } from './menuler/tedarik-islemleri/toptan-alis-faturasi-mal-kabulu/tafmk-alis-faturasi/tafmk-alis-faturasi';
import { TaimkAlinanSiparis } from './menuler/tedarik-islemleri/toptan-alis-irsaliyesi-mal-kabulu/taimk-alinan-siparis/taimk-alinan-siparis';
import { TaimkAlisFaturasi } from './menuler/tedarik-islemleri/toptan-alis-irsaliyesi-mal-kabulu/taimk-alis-faturasi/taimk-alis-faturasi';
import { HafmkAlinanSiparis } from './menuler/tedarik-islemleri/halden-alis-faturasi-mal-kabulu/hafmk-alinan-siparis/hafmk-alinan-siparis';
import { HafmkHaldenAlisFaturasi } from './menuler/tedarik-islemleri/halden-alis-faturasi-mal-kabulu/hafmk-halden-alis-faturasi/hafmk-halden-alis-faturasi';
import { DamksfVerilenSiparis } from './menuler/tedarik-islemleri/depolar-arasi-mal-kabulu-sevk-fisi/damksf-verilen-siparis/damksf-verilen-siparis';
import { DamksfDepolarArasiMalKabuluSevkFisi } from './menuler/tedarik-islemleri/depolar-arasi-mal-kabulu-sevk-fisi/damksf-depolar-arasi-mal-kabulu-sevk-fisi/damksf-depolar-arasi-mal-kabulu-sevk-fisi';
import { DamknfVerilenSiparis } from './menuler/tedarik-islemleri/depolar-arasi-mal-kabulu-nakliye-fisi/damknf-verilen-siparis/damknf-verilen-siparis';
import { DamknfDepolarArasiMalKabuluNakliyeFisi } from './menuler/tedarik-islemleri/depolar-arasi-mal-kabulu-nakliye-fisi/damknf-depolar-arasi-mal-kabulu-nakliye-fisi/damknf-depolar-arasi-mal-kabulu-nakliye-fisi';
import { UretimGirisFisi } from './menuler/diger-giris-islemleri/uretim-giris-fisi/uretim-giris-fisi';
import { SayimGirisFisi } from './menuler/diger-giris-islemleri/sayim-giris-fisi/sayim-giris-fisi';
import { StokDevirGirisFisi } from './menuler/diger-giris-islemleri/stok-devir-giris-fisi/stok-devir-giris-fisi';
import { GiderPusulasiGirisFisi } from './menuler/diger-giris-islemleri/gider-pusulasi-giris-fisi/gider-pusulasi-giris-fisi';
import { FireCikisFisi } from './menuler/diger-cikis-islemleri/fire-cikis-fisi/fire-cikis-fisi';
import { SarfCikisFisi } from './menuler/diger-cikis-islemleri/sarf-cikis-fisi/sarf-cikis-fisi';
import { UretimCikisFisi } from './menuler/diger-cikis-islemleri/uretim-cikis-fisi/uretim-cikis-fisi';
import { SayimCikisFisi } from './menuler/diger-cikis-islemleri/sayim-cikis-fisi/sayim-cikis-fisi';
import { StokDevirCikisFisi } from './menuler/diger-cikis-islemleri/stok-devir-cikis-fisi/stok-devir-cikis-fisi';
import { MagazaIslemleri } from './menuler/magaza-islemleri/magaza-islemleri/magaza-islemleri';
import { StokVirmanFisiGiris } from './menuler/virman-ve-devir-islemleri/stok-virman-fisi-giris/stok-virman-fisi-giris';
import { StokVirmanFisiCikis } from './menuler/virman-ve-devir-islemleri/stok-virman-fisi-cikis/stok-virman-fisi-cikis';
import { Stoklar } from './menuler/stoklar/stoklar/stoklar';
import { Depolar } from './menuler/depolar/depolar/depolar';
import { Firmalar } from './menuler/firmalar/firmalar/firmalar';
import { O } from '@angular/cdk/keycodes';
import { OrtakMenu } from './menuler/ortak-menu/ortak-menu';
import { FirmaFaturaComponent } from './sayfalar/firma-fatura/firma-fatura.component';
import { CompanyOrder } from './modal/company-order/company-order';
import { WarehouseOrder } from './modal/warehouse-order/warehouse-order';
import { RecommendWarehouseOrder } from './modal/recommend-warehouse-order/recommend-warehouse-order';
import { RecommendCompanyOrder } from './modal/recommend-company-order/recommend-company-order';
import { FirmaMalKabulModelComponent } from './modal/firma-mal-kabul-model/firma-mal-kabul-model.component';
import { WarheosueReceipt } from './modal/warheosue-receipt/warheosue-receipt';
import { WarehouseSend } from './modal/warehouse-send/warehouse-send';
import { CompanyRefund } from './modal/company-refund/company-refund';
import { DocumentSave } from './modal/document-save/document-save';



export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', component: HomePage },

      //       { path: 'task/:82', component: CompanyRefund }, // fırma iade 

      // { path: 'task/:81', component: WarehouseSend }, //  depo sevk 


      // { path: 'task/:80', component: WarheosueReceipt }, //  depo mal kabul 

      // { path: 'task/:79', component: FirmaMalKabulModelComponent }, // fırma mal kabul 

      // { path: 'task/:77', component: WarehouseOrder }, // depo siparis 

      // { path: 'task/:78', component: RecommendCompanyOrder }, // onerıeln fırma sıparıs 


      // { path: 'task/:76', component: RecommendWarehouseOrder }, // onerılen depo sıparıs 

      // { path: 'task/:75', component: CompanyOrder }, // fırma sıparıs 
       // { path: 'task/:90', component: DocumentSave }, // fırma sıparıs 


       { path: 'task/:id', component: OrtakMenu }, // Ortak Menü Yönlendirmesi

      { path: 'task/:21', component: FirmaFaturaComponent }, // fatura 

      // Sevk İşlemleri
      { path: 'task/31', component: TsirsAlinanSiparis },
      { path: 'task/9', component: TsirsToptanSatisIrsaliyeliSevk },
      { path: 'task/39', component: TsirsSatisFaturasi },

      { path: 'task/32', component: TsfsAlisFaturasi },
      { path: 'task/10', component: TsfsToptanSatisFaturaliSevk },
      { path: 'task/40', component: TsfsSatisFaturasi },

      { path: 'task/33', component: PsirsAlisFaturasi },
      { path: 'task/11', component: PsirsPrerakendeSatisIrsaliyeliSevk },
      { path: 'task/41', component: PsirsSatisFaturasi },

      { path: 'task/34', component: PsfsHaldenAlisFaturasi },
      { path: 'task/12', component: PsfsPrerakendeSatisFaturaliSevk },
      { path: 'task/42', component: PsfsSatisFaturasi },

      { path: 'task/35', component: DfcfDegerFarkiCikisFaturasi },
      { path: 'task/43', component: DfcfSatisFaturasi },

      { path: 'task/24', component: DasfAlinanSiparis },
      { path: 'task/20', component: DasfDepolarArasiSevkFisi },

      { path: 'task/26', component: DasnVerilenSiparis },
      { path: 'task/22', component: DasnDepolarArasiSevkNakliyeFisi },

      // Tedarik İşlemleri
      { path: 'task/28', component: TafmkVerilenSiparis },
      { path: 'task/1', component: TafmkAlisFaturasi },

      { path: 'task/29', component: TaimkAlinanSiparis },
      { path: 'task/2', component: TaimkAlisFaturasi },

      { path: 'task/30', component: HafmkAlinanSiparis },
      { path: 'task/7', component: HafmkHaldenAlisFaturasi },

      { path: 'task/25', component: DamksfVerilenSiparis },
      { path: 'task/21', component: DamksfDepolarArasiMalKabuluSevkFisi },

      { path: 'task/27', component: DamknfVerilenSiparis },
      { path: 'task/23', component: DamknfDepolarArasiMalKabuluNakliyeFisi },

      // Diğer Giriş İşlemleri
      { path: 'task/4', component: UretimGirisFisi },
      { path: 'task/5', component: SayimGirisFisi },
      { path: 'task/6', component: StokDevirGirisFisi },
      { path: 'task/8', component: GiderPusulasiGirisFisi },

      // Diğer Çıkış İşlemleri
      { path: 'task/14', component: FireCikisFisi },
      { path: 'task/15', component: SarfCikisFisi },
      { path: 'task/16', component: UretimCikisFisi },
      { path: 'task/18', component: SayimCikisFisi },
      { path: 'task/19', component: StokDevirCikisFisi },

      // Diğer menüler
      { path: 'task/5', component: MagazaIslemleri },
      { path: 'task/3', component: StokVirmanFisiGiris },
      { path: 'task/13', component: StokVirmanFisiCikis },
      { path: 'task/7', component: Stoklar },
      { path: 'task/8', component: Depolar },
      { path: 'task/9', component: Firmalar },

    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
