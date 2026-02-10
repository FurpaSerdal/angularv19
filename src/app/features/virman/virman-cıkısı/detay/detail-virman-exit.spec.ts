import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailVirmanExit } from './detail-virman-exit';

describe('DetailVirmanExit', () => {
  let component: DetailVirmanExit;
  let fixture: ComponentFixture<DetailVirmanExit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailVirmanExit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailVirmanExit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
