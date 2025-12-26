import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TsfsToptanSatisFaturaliSevk } from './tsfs-toptan-satis-faturali-sevk';

describe('TsfsToptanSatisFaturaliSevk', () => {
  let component: TsfsToptanSatisFaturaliSevk;
  let fixture: ComponentFixture<TsfsToptanSatisFaturaliSevk>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TsfsToptanSatisFaturaliSevk]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TsfsToptanSatisFaturaliSevk);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
