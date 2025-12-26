import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SarfCikisFisi } from './sarf-cikis-fisi';

describe('SarfCikisFisi', () => {
  let component: SarfCikisFisi;
  let fixture: ComponentFixture<SarfCikisFisi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SarfCikisFisi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SarfCikisFisi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
