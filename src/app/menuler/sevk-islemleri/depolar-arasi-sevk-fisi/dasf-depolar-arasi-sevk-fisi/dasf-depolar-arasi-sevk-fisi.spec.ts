import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DasfDepolarArasiSevkFisi } from './dasf-depolar-arasi-sevk-fisi';

describe('DasfDepolarArasiSevkFisi', () => {
  let component: DasfDepolarArasiSevkFisi;
  let fixture: ComponentFixture<DasfDepolarArasiSevkFisi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DasfDepolarArasiSevkFisi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DasfDepolarArasiSevkFisi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
