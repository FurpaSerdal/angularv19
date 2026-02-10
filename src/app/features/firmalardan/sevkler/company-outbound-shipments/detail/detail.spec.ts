import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyOutboundShipmentsDetailComponent } from './detail';

describe('CompanyOutboundShipmentsDetailComponent', () => {
  let component: CompanyOutboundShipmentsDetailComponent;
  let fixture: ComponentFixture<CompanyOutboundShipmentsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyOutboundShipmentsDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyOutboundShipmentsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
