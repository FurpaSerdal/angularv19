import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseOrder } from './warehouse-order';

describe('WarehouseOrder', () => {
  let component: WarehouseOrder;
  let fixture: ComponentFixture<WarehouseOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
