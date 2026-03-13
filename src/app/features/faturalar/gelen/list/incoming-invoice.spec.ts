import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingInvoice } from './incoming-invoice';

describe('IncomingInvoice', () => {
  let component: IncomingInvoice;
  let fixture: ComponentFixture<IncomingInvoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingInvoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingInvoice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

