import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyInboundShipmentsDetailComponent } from './detail';

describe('CompanyInboundShipmentsDetailComponent', () => {
  let component: CompanyInboundShipmentsDetailComponent;
  let fixture: ComponentFixture<CompanyInboundShipmentsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyInboundShipmentsDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyInboundShipmentsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
