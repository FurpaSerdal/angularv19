import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamksfDepolarArasiMalKabuluSevkFisi } from './damksf-depolar-arasi-mal-kabulu-sevk-fisi';

describe('DamksfDepolarArasiMalKabuluSevkFisi', () => {
  let component: DamksfDepolarArasiMalKabuluSevkFisi;
  let fixture: ComponentFixture<DamksfDepolarArasiMalKabuluSevkFisi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DamksfDepolarArasiMalKabuluSevkFisi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DamksfDepolarArasiMalKabuluSevkFisi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
