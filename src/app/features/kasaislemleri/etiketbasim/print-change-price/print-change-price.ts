import { CommonModule } from '@angular/common';
import { Component,Input } from '@angular/core';
import { Product } from '../../../../models/eskiAngular';

@Component({
  selector: 'app-print-change-price',
  imports: [CommonModule],
  templateUrl: './print-change-price.html',
  styleUrls: ['./print-change-price.css'],
  standalone: true
})
export class PrintChangePrice {
@Input() productsToPrint: Product[] = [];
today: Date = new Date();
}
