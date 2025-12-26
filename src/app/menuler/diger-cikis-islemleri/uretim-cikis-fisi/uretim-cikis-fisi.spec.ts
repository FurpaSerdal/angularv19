import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UretimCikisFisi } from './uretim-cikis-fisi';

describe('UretimCikisFisi', () => {
  let component: UretimCikisFisi;
  let fixture: ComponentFixture<UretimCikisFisi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UretimCikisFisi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UretimCikisFisi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
