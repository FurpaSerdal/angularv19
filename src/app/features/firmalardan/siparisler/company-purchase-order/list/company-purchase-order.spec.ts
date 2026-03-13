import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPurchaseOrder } from './company-purchase-order';

describe('CompanyPurchaseOrder', () => {
  let component: CompanyPurchaseOrder;
  let fixture: ComponentFixture<CompanyPurchaseOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyPurchaseOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyPurchaseOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

