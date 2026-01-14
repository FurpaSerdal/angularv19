import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailModalComponent } from './detail';

describe('DetailModalComponent', () => {
  let component: DetailModalComponent;
  let fixture: ComponentFixture<DetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


