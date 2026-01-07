import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  quickStats = {
    dispatchOrders: 15,
    activeOrders: 28,
    invoices: 42,
    companies: 8
  };
}
