import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyToEwaybill } from './company-to-ewaybill';

describe('CompanyToEwaybill', () => {
  let component: CompanyToEwaybill;
  let fixture: ComponentFixture<CompanyToEwaybill>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyToEwaybill]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyToEwaybill);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

