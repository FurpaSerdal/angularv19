// src/app/directives/highlight-selected.directive.ts
import { Directive,ElementRef,Input,OnChanges } from '@angular/core';

@Directive({
  selector: '[highlightSelected]',
  standalone: true
})
export class HighlightSelectedDirective implements OnChanges {
  @Input() highlightSelected: boolean = false;

  constructor(private el: ElementRef) {}

  ngOnChanges() {
    this.el.nativeElement.style.backgroundColor = this.highlightSelected ? '#d1ffd6' : 'transparent';
  }
}
