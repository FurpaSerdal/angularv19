import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { YeniComponent } from './yeni/yeni.component';
import { StoreExpenseReceiptService } from '../../../services/storeExpenseReceipt/store-expense-receipt.service';

export interface OutageReceipt {
    documentSerie:string;
    documentOrderNo:number;
    documentDate:Date;
    outageTotal:number;
}


@Component({
  selector: 'app-magazagiderfisi',
  imports: [
    MatIconModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    DatePipe
  ],
  standalone: true,
  templateUrl: './magazagiderfisi.component.html',
  styleUrl: './magazagiderfisi.component.css',
  providers: [DatePipe]
})

export class MagazagiderfisiComponent {
  // Tablo verisi
  tableSource = new MatTableDataSource<OutageReceipt>([]);

  // Tablo sütunları
  displayedColumns: string[] = ['documentSerie', 'documentOrderNo', 'documentDate', 'outageTotal', 'operations'];

  // Tarih aralığı form kontrolleri
  dateRangeForm = new FormGroup({
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null)
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private storeExpenseReceiptService: StoreExpenseReceiptService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.tableSource.paginator = this.paginator;
    this.tableSource.sort = this.sort;
  }
  onDateRangeChange(): void {
    const startDateValue = this.dateRangeForm.get('startDate')?.value;
    const endDateValue = this.dateRangeForm.get('endDate')?.value;

    if (!startDateValue || !endDateValue) {
      return;
    }

    const start = this.datePipe.transform(startDateValue, 'yyyy-MM-dd');
    const end = this.datePipe.transform(endDateValue, 'yyyy-MM-dd');

    if (!start || !end) {
      return;
    }

    const zamanlama = `aralik-${start}-${end}`;
    this.storeExpenseReceiptService.listReceipts(17, zamanlama).subscribe((receipts: OutageReceipt[]) => {
      this.tableSource.data = receipts;
    });
  }

  Yeni() {
    this.dialog.open(YeniComponent, {
      width: '70vw',
      height: '90vh',
      data: {}
    });
  }
}