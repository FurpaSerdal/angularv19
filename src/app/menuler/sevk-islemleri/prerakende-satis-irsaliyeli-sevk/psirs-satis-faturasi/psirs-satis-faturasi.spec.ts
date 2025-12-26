import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsirsSatisFaturasi } from './psirs-satis-faturasi';

describe('PsirsSatisFaturasi', () => {
  let component: PsirsSatisFaturasi;
  let fixture: ComponentFixture<PsirsSatisFaturasi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PsirsSatisFaturasi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsirsSatisFaturasi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
