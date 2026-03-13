import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseSaleOrder } from './warehouse-sale-order';

describe('WarehouseSaleOrder', () => {
  let component: WarehouseSaleOrder;
  let fixture: ComponentFixture<WarehouseSaleOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseSaleOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseSaleOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

