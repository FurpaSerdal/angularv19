import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendCompanyOrder } from './recommend-company-order';

describe('RecommendCompanyOrder', () => {
  let component: RecommendCompanyOrder;
  let fixture: ComponentFixture<RecommendCompanyOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendCompanyOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendCompanyOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
