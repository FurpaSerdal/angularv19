import { DatePipe } from '@angular/common';
import { Component,ViewChild } from '@angular/core';
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
import { MatTableDataSource,MatTableModule } from '@angular/material/table';
import { YeniComponent } from './yeni/yeni.component';

export interface OutageReceipt {
    documentSerie:string;
    documentOrderNo:number;
    documentDate:Date;
    outageTotal:number;
}


@Component({
  selector: 'app-magazagiderfisi',
  imports: [ MatIconModule,
      MatNativeDateModule,
      MatCheckboxModule,
      MatTableModule,
      MatButtonModule,
      MatInputModule,
      MatDatepickerModule,
       MatFormFieldModule,
        DatePipe],
      standalone: true,
   
  templateUrl: './magazagiderfisi.component.html',
  styleUrl: './magazagiderfisi.component.css'
})

export class MagazagiderfisiComponent {
  // Tablo verisi
  tableSource = new MatTableDataSource<OutageReceipt>([
    { documentSerie: 'A', documentOrderNo: 1001, documentDate: new Date('2024-01-15'), outageTotal: 2500 },
    { documentSerie: 'B', documentOrderNo: 1002, documentDate: new Date('2024-02-20'), outageTotal: 1500 },
    { documentSerie: 'C', documentOrderNo: 1003, documentDate: new Date('2024-03-10'), outageTotal: 3000 },
    { documentSerie: 'D', documentOrderNo: 1004, documentDate: new Date('2024-04-05'), outageTotal: 4000 },
    { documentSerie: 'E', documentOrderNo: 1005, documentDate: new Date('2024-05-12'), outageTotal: 3500 },
 
  ]);

  // Tablo sütunları
  displayedColumns: string[] = ['documentSerie', 'documentOrderNo', 'documentDate', 'outageTotal', 'operations'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.tableSource.paginator = this.paginator;
    this.tableSource.sort = this.sort;
  }
  TarihSec(event: any): void {
    const selectedDate = event.value;  // event.value ile seçilen tarihi alabilirsiniz
  }
  
  Yeni(){
this.dialog.open(YeniComponent, {
      width: '70vw',
      height: '90vh',
      data: {},
    });
}
}