import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SayimGirisFisi } from './sayim-giris-fisi';

describe('SayimGirisFisi', () => {
  let component: SayimGirisFisi;
  let fixture: ComponentFixture<SayimGirisFisi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SayimGirisFisi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SayimGirisFisi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
