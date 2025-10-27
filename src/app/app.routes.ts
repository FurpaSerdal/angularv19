import { Routes } from '@angular/router';
import { AdminComponent } from './layout/admin-component';
import { LoginComponent } from './login/login';
import { FirmaFaturaComponent } from './sayfalar/firma-fatura/firma-fatura.component';
import { DynamicTableComponent } from './sayfalar/dynamic-table/dynamic-table';
//import { AuthGuard } from './guards/auth.guard'; // AuthGuard import

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
  },
{ 
  path: 'admin',
  component: AdminComponent,
  children: [
   //   { path: 'task/:21', component: FirmaFaturaComponent },

    { path: 'task/:id', component: DynamicTableComponent },

    // ... diğer route'lar
  ]
},
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: '/login' 
  }
];