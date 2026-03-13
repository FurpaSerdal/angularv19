import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySaleOrder } from './company-sale-order';

describe('CompanySaleOrder', () => {
  let component: CompanySaleOrder;
  let fixture: ComponentFixture<CompanySaleOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanySaleOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanySaleOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

