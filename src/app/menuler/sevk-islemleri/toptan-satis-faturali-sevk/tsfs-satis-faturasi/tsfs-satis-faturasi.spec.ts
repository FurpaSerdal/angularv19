import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TsfsSatisFaturasi } from './tsfs-satis-faturasi';

describe('TsfsSatisFaturasi', () => {
  let component: TsfsSatisFaturasi;
  let fixture: ComponentFixture<TsfsSatisFaturasi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TsfsSatisFaturasi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TsfsSatisFaturasi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
