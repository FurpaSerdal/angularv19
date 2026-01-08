import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyGoodsReceipt } from './company-goods-receipt';

describe('CompanyGoodsReceipt', () => {
  let component: CompanyGoodsReceipt;
  let fixture: ComponentFixture<CompanyGoodsReceipt>; 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyGoodsReceipt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyGoodsReceipt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
