import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KunyeEtiketBasimiComponent } from './kunye-etiket-basimi.component';

describe('KunyeEtiketBasimiComponent', () => {
  let component: KunyeEtiketBasimiComponent;
  let fixture: ComponentFixture<KunyeEtiketBasimiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KunyeEtiketBasimiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KunyeEtiketBasimiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
