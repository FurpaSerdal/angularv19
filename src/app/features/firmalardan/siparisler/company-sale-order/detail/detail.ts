import { CommonModule } from '@angular/common';
import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AlinanSiparislerAyrintiDto } from '../../../../../models/ayrinti-dtolari.model';

@Component({
  selector: 'app-company-sale-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail.html',
  styleUrls: ['./detail.css']
})
export class CompanySaleOrderDetailComponent {
 

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CompanySaleOrderDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlinanSiparislerAyrintiDto,
  ) {}

  ngOnInit() {
   
  }

  kapat() {
    this.dialogRef.close();
  }
}