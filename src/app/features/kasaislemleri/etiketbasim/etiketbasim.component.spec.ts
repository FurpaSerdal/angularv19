import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EtiketbasimComponent } from './etiketbasim.component';

describe('EtiketbasimComponent', () => {
  let component: EtiketbasimComponent;
  let fixture: ComponentFixture<EtiketbasimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtiketbasimComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtiketbasimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
