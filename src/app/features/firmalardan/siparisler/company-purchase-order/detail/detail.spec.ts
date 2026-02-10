import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyPurchaseOrderDetailComponent } from './detail';

describe('CompanyPurchaseOrderDetailComponent', () => {
  let component: CompanyPurchaseOrderDetailComponent;
  let fixture: ComponentFixture<CompanyPurchaseOrderDetailComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyPurchaseOrderDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyPurchaseOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
