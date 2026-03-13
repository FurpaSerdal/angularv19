import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagazagiderfisiComponent } from './magazagiderfisi.component';

describe('MagazagiderfisiComponent', () => {
  let component: MagazagiderfisiComponent;
  let fixture: ComponentFixture<MagazagiderfisiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MagazagiderfisiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MagazagiderfisiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

