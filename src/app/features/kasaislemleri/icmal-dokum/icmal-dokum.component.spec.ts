import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcmalDokumComponent } from './icmal-dokum.component';

describe('IcmalDokumComponent', () => {
  let component: IcmalDokumComponent;
  let fixture: ComponentFixture<IcmalDokumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IcmalDokumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IcmalDokumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
