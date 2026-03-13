import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseInboundShipmentsDetailComponent } from './detail';

describe('WarehouseInboundShipmentsDetailComponent', () => {
  let component: WarehouseInboundShipmentsDetailComponent;
  let fixture: ComponentFixture<WarehouseInboundShipmentsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseInboundShipmentsDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseInboundShipmentsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

