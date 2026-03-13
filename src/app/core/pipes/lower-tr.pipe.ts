// src/app/pipes/lower-tr.pipe.ts
import { Pipe,PipeTransform } from '@angular/core';

@Pipe({
  name: 'lowerTr',
  standalone: true
})
export class LowerTrPipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return '';
    return value.toString().replace(/\u00A0/g, ' ').trim().toLocaleLowerCase('tr');
  }
}

