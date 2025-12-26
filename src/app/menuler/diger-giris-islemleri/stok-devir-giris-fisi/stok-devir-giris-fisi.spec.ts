import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StokDevirGirisFisi } from './stok-devir-giris-fisi';

describe('StokDevirGirisFisi', () => {
  let component: StokDevirGirisFisi;
  let fixture: ComponentFixture<StokDevirGirisFisi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StokDevirGirisFisi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StokDevirGirisFisi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
