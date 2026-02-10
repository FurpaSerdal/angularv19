import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DosyaGonderimiComponent } from './dosya-gonderimi.component';

describe('DosyaGonderimiComponent', () => {
  let component: DosyaGonderimiComponent;
  let fixture: ComponentFixture<DosyaGonderimiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DosyaGonderimiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DosyaGonderimiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
