import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UretimGirisFisi } from './uretim-giris-fisi';

describe('UretimGirisFisi', () => {
  let component: UretimGirisFisi;
  let fixture: ComponentFixture<UretimGirisFisi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UretimGirisFisi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UretimGirisFisi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
