import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseGoodsReceipt } from './warehouse-goods-receipt';

describe('WarehouseGoodsReceipt', () => {
  let component: WarehouseGoodsReceipt;
  let fixture: ComponentFixture<WarehouseGoodsReceipt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseGoodsReceipt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseGoodsReceipt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
