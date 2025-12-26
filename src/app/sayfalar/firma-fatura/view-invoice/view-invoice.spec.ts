import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInvoice } from './view-invoice';

describe('ViewInvoice', () => {
  let component: ViewInvoice;
  let fixture: ComponentFixture<ViewInvoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewInvoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewInvoice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
