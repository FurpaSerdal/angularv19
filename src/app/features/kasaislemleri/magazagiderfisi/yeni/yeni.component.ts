import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-yeni',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './yeni.component.html',
  styleUrls: ['./yeni.component.css']
})
export class YeniComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<YeniComponent>
  ) {}

  ngOnInit(): void {
    // Initialize the form with required fields and a FormArray for the product list
    this.form = this.fb.group({
      olusturan: ['', Validators.required],
      onaylayan: ['', Validators.required],
      urun: [''],
      miktar: [''],
      urunListesi: this.fb.array([])
    });
  }

  // Getter for the FormArray
  get urunListesi(): FormArray {
    return this.form.get('urunListesi') as FormArray;
  }

  // Method to add a new product to the list
  addUrun(): void {
    const urun = this.form.get('urun')?.value;
    const miktar = this.form.get('miktar')?.value;

    // Validate that both fields are filled before adding
    if (urun && miktar) {
      this.urunListesi.push(
        this.fb.group({
          urun: [urun, Validators.required],
          miktar: [miktar, Validators.required]
        })
      );

      // Clear the input fields after adding
      this.form.get('urun')?.reset();
      this.form.get('miktar')?.reset();
    }
  }

  // Method to remove a product from the list by index
  removeUrun(index: number): void {
    this.urunListesi.removeAt(index);
  }

  // Save method
  kaydet(): void {
    console.log('Kaydedildi:', this.form.value);
  }

  // Close the dialog
  kapat(): void {
    this.dialogRef.close(); // Close the dialog
  }
}