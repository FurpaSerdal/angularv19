import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendWarehouseOrder } from './recommend-warehouse-order';

describe('RecommendWarehouseOrder', () => {
  let component: RecommendWarehouseOrder;
  let fixture: ComponentFixture<RecommendWarehouseOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendWarehouseOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendWarehouseOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
