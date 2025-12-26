import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsfsHaldenAlisFaturasi } from './psfs-halden-alis-faturasi';

describe('PsfsHaldenAlisFaturasi', () => {
  let component: PsfsHaldenAlisFaturasi;
  let fixture: ComponentFixture<PsfsHaldenAlisFaturasi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PsfsHaldenAlisFaturasi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsfsHaldenAlisFaturasi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
