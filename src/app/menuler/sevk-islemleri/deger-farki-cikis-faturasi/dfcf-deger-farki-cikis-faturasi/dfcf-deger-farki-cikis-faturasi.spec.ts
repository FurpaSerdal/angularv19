import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DfcfDegerFarkiCikisFaturasi } from './dfcf-deger-farki-cikis-faturasi';

describe('DfcfDegerFarkiCikisFaturasi', () => {
  let component: DfcfDegerFarkiCikisFaturasi;
  let fixture: ComponentFixture<DfcfDegerFarkiCikisFaturasi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DfcfDegerFarkiCikisFaturasi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DfcfDegerFarkiCikisFaturasi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
