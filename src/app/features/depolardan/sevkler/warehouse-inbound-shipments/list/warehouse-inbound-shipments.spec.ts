import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseInboundShipments } from './warehouse-inbound-shipments';

describe('WarehouseInboundShipments', () => {
  let component: WarehouseInboundShipments;
  let fixture: ComponentFixture<WarehouseInboundShipments>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseInboundShipments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseInboundShipments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
