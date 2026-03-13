import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyRefund } from './company-refund';

describe('CompanyRefund', () => {
  let component: CompanyRefund;
  let fixture: ComponentFixture<CompanyRefund>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyRefund]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyRefund);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

