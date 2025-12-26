import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TsfsAlisFaturasi } from './tsfs-alis-faturasi';

describe('TsfsAlisFaturasi', () => {
  let component: TsfsAlisFaturasi;
  let fixture: ComponentFixture<TsfsAlisFaturasi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TsfsAlisFaturasi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TsfsAlisFaturasi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
