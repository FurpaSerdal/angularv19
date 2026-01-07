import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyOutboundShipments } from './company-outbound-shipments';


describe('CompanyOutboundShipments', () => {
  let component: CompanyOutboundShipments;
  let fixture: ComponentFixture<CompanyOutboundShipments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyOutboundShipments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyOutboundShipments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
