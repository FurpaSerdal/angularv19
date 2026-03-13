import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtiketPrint } from './etiket-print';

describe('EtiketPrint', () => {
  let component: EtiketPrint;
  let fixture: ComponentFixture<EtiketPrint>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtiketPrint]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtiketPrint);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

