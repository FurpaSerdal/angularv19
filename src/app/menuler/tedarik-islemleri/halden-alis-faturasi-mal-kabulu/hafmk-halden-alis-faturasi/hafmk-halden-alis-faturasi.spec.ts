import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HafmkHaldenAlisFaturasi } from './hafmk-halden-alis-faturasi';

describe('HafmkHaldenAlisFaturasi', () => {
  let component: HafmkHaldenAlisFaturasi;
  let fixture: ComponentFixture<HafmkHaldenAlisFaturasi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HafmkHaldenAlisFaturasi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HafmkHaldenAlisFaturasi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
