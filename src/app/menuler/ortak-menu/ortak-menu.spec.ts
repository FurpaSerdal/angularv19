import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrtakMenu } from './ortak-menu';

describe('OrtakMenu', () => {
  let component: OrtakMenu;
  let fixture: ComponentFixture<OrtakMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrtakMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrtakMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
