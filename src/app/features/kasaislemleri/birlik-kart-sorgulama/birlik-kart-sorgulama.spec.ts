import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirlikKartSorgulama } from './birlik-kart-sorgulama';

describe('BirlikKartSorgulama', () => {
  let component: BirlikKartSorgulama;
  let fixture: ComponentFixture<BirlikKartSorgulama>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BirlikKartSorgulama]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BirlikKartSorgulama);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

