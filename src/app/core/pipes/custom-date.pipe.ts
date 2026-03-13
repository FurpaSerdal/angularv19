// src/app/pipes/custom-date.pipe.ts
import { DatePipe } from '@angular/common';
import { Pipe,PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true,
  pure: true
})
export class CustomDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(value: any, _format: string = 'yyyy-MM-dd'): number | string {
    if (!value) return 0; // sort için null/undefined => 0
    const date = new Date(value);
    return Number.isFinite(date.getTime()) ? date.getTime() : 0;
  }

  // HTML’de string dönüşümü için ayrı method gerekirse
  formatForView(value: any, format: string = 'dd/MM/yyyy') {
    if (!value) return '-';
    return this.datePipe.transform(value, format) || '-';
  }
}

