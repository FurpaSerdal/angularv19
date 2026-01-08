import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Evrak } from '../../../../../models/ortakModeller';

@Component({
  selector: 'app-warehouse-sale-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail.html',
  styleUrls: ['./detail.css']
})
export class Detail {
  veri!: any;

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<Detail>,
    @Inject(MAT_DIALOG_DATA) public data: Evrak,
  ) {}

  ngOnInit() {
    this.veri = this.data;
    console.log('Gelen veri:', this.data);
  }

  kapat() {
    this.dialogRef.close();
  }
}