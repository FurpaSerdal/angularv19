import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TsirsToptanSatisIrsaliyeliSevk } from './tsirs-toptan-satis-irsaliyeli-sevk';

describe('TsirsToptanSatisIrsaliyeliSevk', () => {
  let component: TsirsToptanSatisIrsaliyeliSevk;
  let fixture: ComponentFixture<TsirsToptanSatisIrsaliyeliSevk>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TsirsToptanSatisIrsaliyeliSevk]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TsirsToptanSatisIrsaliyeliSevk);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
