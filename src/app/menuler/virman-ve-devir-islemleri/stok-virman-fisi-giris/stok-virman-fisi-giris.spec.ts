import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StokVirmanFisiGiris } from './stok-virman-fisi-giris';

describe('StokVirmanFisiGiris', () => {
  let component: StokVirmanFisiGiris;
  let fixture: ComponentFixture<StokVirmanFisiGiris>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StokVirmanFisiGiris]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StokVirmanFisiGiris);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
