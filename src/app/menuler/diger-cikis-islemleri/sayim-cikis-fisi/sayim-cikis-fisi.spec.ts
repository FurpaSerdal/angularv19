import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SayimCikisFisi } from './sayim-cikis-fisi';

describe('SayimCikisFisi', () => {
  let component: SayimCikisFisi;
  let fixture: ComponentFixture<SayimCikisFisi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SayimCikisFisi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SayimCikisFisi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
