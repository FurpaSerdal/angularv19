import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyInboundShipments } from './company-inbound-shipments';

describe('CompanyInboundShipments', () => {
  let component: CompanyInboundShipments;
  let fixture: ComponentFixture<CompanyInboundShipments>; 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyInboundShipments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyInboundShipments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
