import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TsirsSatisFaturasi } from './tsirs-satis-faturasi';

describe('TsirsSatisFaturasi', () => {
  let component: TsirsSatisFaturasi;
  let fixture: ComponentFixture<TsirsSatisFaturasi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TsirsSatisFaturasi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TsirsSatisFaturasi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
