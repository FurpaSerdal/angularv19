import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcmalDetay } from './icmal-detay';

describe('IcmalDetay', () => {
  let component: IcmalDetay;
  let fixture: ComponentFixture<IcmalDetay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IcmalDetay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IcmalDetay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

