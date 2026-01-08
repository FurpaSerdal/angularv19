import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css'],
})
export class HomePage {
  quickStats = {
    dispatchOrders: 15,
    activeOrders: 28,
    invoices: 42,
    companies: 8
  };
}
