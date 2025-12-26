import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stoklar } from './stoklar';

describe('Stoklar', () => {
  let component: Stoklar;
  let fixture: ComponentFixture<Stoklar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stoklar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Stoklar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
