// src/app/pipes/number-clean.pipe.ts
import { Pipe,PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberClean',
  standalone: true
})
export class NumberCleanPipe implements PipeTransform {
  transform(value: any): number {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    return Number(String(value).replace(/\s/g, '')) || 0;
  }
}

