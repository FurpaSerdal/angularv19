import { ComponentFixture, TestBed } from '@angular/core/testing';
import { companyPurchaseOrderToShipment } from './company-purchase-order-to-shipment';



describe('WarheosueReceipt', () => {
  let component: companyPurchaseOrderToShipment;
  let fixture: ComponentFixture<companyPurchaseOrderToShipment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [companyPurchaseOrderToShipment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(companyPurchaseOrderToShipment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
