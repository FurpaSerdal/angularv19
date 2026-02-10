import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WarehouseSalesOrderToShipment } from './warehouse-sales-order-to-shipment';

describe('WarehouseSalesOrderToShipment', () => {
  let component: WarehouseSalesOrderToShipment;
  let fixture: ComponentFixture<WarehouseSalesOrderToShipment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseSalesOrderToShipment]
    }).compileComponents();

    fixture = TestBed.createComponent(WarehouseSalesOrderToShipment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
