import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaimkAlisFaturasi } from './taimk-alis-faturasi';

describe('TaimkAlisFaturasi', () => {
  let component: TaimkAlisFaturasi;
  let fixture: ComponentFixture<TaimkAlisFaturasi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaimkAlisFaturasi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaimkAlisFaturasi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
