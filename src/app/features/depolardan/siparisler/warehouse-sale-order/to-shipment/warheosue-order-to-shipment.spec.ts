import { ComponentFixture, TestBed } from '@angular/core/testing';

import { warehouseSalesOrderToShipment} from './warehouse-sales-order-to-shipment';

describe('WarheosueReceipt', () => {
  let component: warehouseSalesOrderToShipment;
  let fixture: ComponentFixture<warehouseSalesOrderToShipment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [warehouseSalesOrderToShipment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(warehouseSalesOrderToShipment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
