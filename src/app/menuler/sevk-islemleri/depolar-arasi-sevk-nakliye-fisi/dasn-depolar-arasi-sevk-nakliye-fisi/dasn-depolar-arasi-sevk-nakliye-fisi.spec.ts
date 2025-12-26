import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DasnDepolarArasiSevkNakliyeFisi } from './dasn-depolar-arasi-sevk-nakliye-fisi';

describe('DasnDepolarArasiSevkNakliyeFisi', () => {
  let component: DasnDepolarArasiSevkNakliyeFisi;
  let fixture: ComponentFixture<DasnDepolarArasiSevkNakliyeFisi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DasnDepolarArasiSevkNakliyeFisi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DasnDepolarArasiSevkNakliyeFisi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
