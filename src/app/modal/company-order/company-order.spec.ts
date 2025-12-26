import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyOrder } from './company-order';

describe('CompanyOrder', () => {
  let component: CompanyOrder;
  let fixture: ComponentFixture<CompanyOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
