import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StokVirmanFisiCikis } from './stok-virman-fisi-cikis';

describe('StokVirmanFisiCikis', () => {
  let component: StokVirmanFisiCikis;
  let fixture: ComponentFixture<StokVirmanFisiCikis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StokVirmanFisiCikis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StokVirmanFisiCikis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
