import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamknfDepolarArasiMalKabuluNakliyeFisi } from './damknf-depolar-arasi-mal-kabulu-nakliye-fisi';

describe('DamknfDepolarArasiMalKabuluNakliyeFisi', () => {
  let component: DamknfDepolarArasiMalKabuluNakliyeFisi;
  let fixture: ComponentFixture<DamknfDepolarArasiMalKabuluNakliyeFisi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DamknfDepolarArasiMalKabuluNakliyeFisi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DamknfDepolarArasiMalKabuluNakliyeFisi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
