import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmaFaturaComponent } from './firma-fatura.component';

describe('FirmaFaturaComponent', () => {
  let component: FirmaFaturaComponent;
  let fixture: ComponentFixture<FirmaFaturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirmaFaturaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirmaFaturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
