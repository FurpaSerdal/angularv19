import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehousePurchaseOrderDetailComponent } from './detail';

describe('WarehousePurchaseOrderDetailComponent', () => {
  let component: WarehousePurchaseOrderDetailComponent;
  let fixture: ComponentFixture<WarehousePurchaseOrderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehousePurchaseOrderDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehousePurchaseOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

