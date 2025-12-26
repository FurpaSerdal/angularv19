import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentSave } from './document-save';

describe('DocumentSave', () => {
  let component: DocumentSave;
  let fixture: ComponentFixture<DocumentSave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentSave]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentSave);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
