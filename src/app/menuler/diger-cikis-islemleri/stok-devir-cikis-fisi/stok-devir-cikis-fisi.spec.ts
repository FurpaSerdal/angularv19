import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StokDevirCikisFisi } from './stok-devir-cikis-fisi';

describe('StokDevirCikisFisi', () => {
  let component: StokDevirCikisFisi;
  let fixture: ComponentFixture<StokDevirCikisFisi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StokDevirCikisFisi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StokDevirCikisFisi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
