import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TafmkAlisFaturasi } from './tafmk-alis-faturasi';

describe('TafmkAlisFaturasi', () => {
  let component: TafmkAlisFaturasi;
  let fixture: ComponentFixture<TafmkAlisFaturasi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TafmkAlisFaturasi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TafmkAlisFaturasi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
