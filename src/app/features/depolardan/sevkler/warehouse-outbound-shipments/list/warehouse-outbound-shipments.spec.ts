import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseOutboundShipments } from './warehouse-outbound-shipments';

describe('WarehouseOutboundShipments', () => {
  let component: WarehouseOutboundShipments;
  let fixture: ComponentFixture<WarehouseOutboundShipments>;    
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseOutboundShipments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseOutboundShipments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
