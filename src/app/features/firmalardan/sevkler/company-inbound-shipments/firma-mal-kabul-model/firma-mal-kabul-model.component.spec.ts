import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmaMalKabulModelComponent } from './firma-mal-kabul-model.component';

describe('FirmaMalKabulComponent', () => {
  let component: FirmaMalKabulModelComponent;
  let fixture: ComponentFixture<FirmaMalKabulModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirmaMalKabulModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirmaMalKabulModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
