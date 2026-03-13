import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarhousePurchaseOrder } from './warhouse-purchase-order';

describe('WarhousePurchaseOrder', () => {
  let component: WarhousePurchaseOrder;
  let fixture: ComponentFixture<WarhousePurchaseOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarhousePurchaseOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarhousePurchaseOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

