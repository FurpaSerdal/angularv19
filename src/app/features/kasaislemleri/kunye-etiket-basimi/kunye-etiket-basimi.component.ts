import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { EtiketPrint } from './etiket-print/etiket-print';
import { EtiketService } from '../../../services/etiket.service';
import { NgxPrintModule } from 'ngx-print';
import { Tag } from '../../../models/eskiAngular';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-kunye-etiket-basimi',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatTableModule,
    EtiketPrint,
    NgxPrintModule
  ],
  templateUrl: './kunye-etiket-basimi.component.html',
  styleUrls: ['./kunye-etiket-basimi.component.css']
})
export class KunyeEtiketBasimiComponent implements OnInit, AfterViewInit {
  @ViewChild('dateInput', { static: false }) dateInput!: ElementRef;

  tableSource = new MatTableDataSource<Tag>();
  tableColumns: string[] = ['selector', 'takenTag', 'productName'];
  selection = new SelectionModel<Tag>(true, []);
  selectedDate: Date = new Date();

  constructor(private etiketService: EtiketService , private toast: ToastrService

  ) {}

  ngOnInit(): void {
    this.getTagsWithDate();
  }

  ngAfterViewInit(): void {
    if (this.dateInput) {
      const today = new Date();
      this.dateInput.nativeElement.value = today.toISOString().split('T')[0];
    }
  }

  getTagsWithDate(): void {
    if (!this.selectedDate) {
       this.toast.error('Lütfen geçerli bir tarih seçiniz.', 'Hata');
      return;
    }

    const formattedDate = this.formatDate(this.selectedDate);

    this.etiketService.getTags(formattedDate).subscribe({
      next: (tags: Tag[]) => {
        if (!tags || tags.length === 0) {
          this.toast.info('Seçilen tarihe ait etiket bulunamadı.', 'Bilgi');
        }
        this.tableSource.data = tags;
        this.selection.clear();
      },
      error: (error) => {
        console.error('Veri alınırken hata oluştu:', error);
        this.toast.error('Veri alınırken bir hata oluştu.', 'Hata');
      }
    });
  }

  onDateChange(event: any): void {
    this.selectedDate = event.value;
    this.getTagsWithDate();
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.tableSource.data.forEach(row => this.selection.select(row));
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableSource.data.length;
    return numSelected === numRows && numRows > 0;
  }

  toggleRow(tag: Tag): void {
    this.selection.toggle(tag);
  }

  hasData(): boolean {
    return this.tableSource.data.length > 0;
  }


}