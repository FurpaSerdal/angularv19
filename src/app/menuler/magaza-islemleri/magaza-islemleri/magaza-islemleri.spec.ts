import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagazaIslemleri } from './magaza-islemleri';

describe('MagazaIslemleri', () => {
  let component: MagazaIslemleri;
  let fixture: ComponentFixture<MagazaIslemleri>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MagazaIslemleri]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MagazaIslemleri);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
