import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiderPusulasiGirisFisi } from './gider-pusulasi-giris-fisi';

describe('GiderPusulasiGirisFisi', () => {
  let component: GiderPusulasiGirisFisi;
  let fixture: ComponentFixture<GiderPusulasiGirisFisi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiderPusulasiGirisFisi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiderPusulasiGirisFisi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
