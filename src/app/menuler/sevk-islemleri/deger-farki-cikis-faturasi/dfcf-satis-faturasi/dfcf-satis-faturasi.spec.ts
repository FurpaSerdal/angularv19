import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DfcfSatisFaturasi } from './dfcf-satis-faturasi';

describe('DfcfSatisFaturasi', () => {
  let component: DfcfSatisFaturasi;
  let fixture: ComponentFixture<DfcfSatisFaturasi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DfcfSatisFaturasi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DfcfSatisFaturasi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
