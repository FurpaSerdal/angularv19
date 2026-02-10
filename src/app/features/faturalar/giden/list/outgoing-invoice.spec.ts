import { ComponentFixture, TestBed } from '@angular/core/testing';

import { outgoingInvoice } from './outgoing-invoice';

describe('outgoingInvoice', () => {
  let component: outgoingInvoice;
  let fixture: ComponentFixture<outgoingInvoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [outgoingInvoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(outgoingInvoice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
