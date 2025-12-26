import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Depolar } from './depolar';

describe('Depolar', () => {
  let component: Depolar;
  let fixture: ComponentFixture<Depolar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Depolar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Depolar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
