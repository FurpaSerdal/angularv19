import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Firmalar } from './firmalar';

describe('Firmalar', () => {
  let component: Firmalar;
  let fixture: ComponentFixture<Firmalar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Firmalar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Firmalar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
