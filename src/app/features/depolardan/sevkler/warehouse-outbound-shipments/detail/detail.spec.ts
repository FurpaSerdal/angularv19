import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseOutboundShipmentsDetailComponent } from './detail';

describe('WarehouseOutboundShipmentsDetailComponent', () => {
  let component: WarehouseOutboundShipmentsDetailComponent;
  let fixture: ComponentFixture<WarehouseOutboundShipmentsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseOutboundShipmentsDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseOutboundShipmentsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
