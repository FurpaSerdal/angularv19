import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FireCikisFisi } from './fire-cikis-fisi';

describe('FireCikisFisi', () => {
  let component: FireCikisFisi;
  let fixture: ComponentFixture<FireCikisFisi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FireCikisFisi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FireCikisFisi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
