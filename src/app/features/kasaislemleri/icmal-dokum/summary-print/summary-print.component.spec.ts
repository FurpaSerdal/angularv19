import {ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryPrintComponent } from './summary-print.component';

describe('SummaryPrintComponent', () => {
  let component: SummaryPrintComponent;
  let fixture: ComponentFixture<SummaryPrintComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
