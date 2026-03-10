import { CommonModule } from '@angular/common';
import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SevkIrsaliyeleriAyrintiDto } from '../../../../../models/ayrinti-dtolari.model';

@Component({
  selector: 'app-company-outbound-shipments-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail.html',
  styleUrls: ['./detail.css']
})
export class CompanyOutboundShipmentsDetailComponent {
  

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CompanyOutboundShipmentsDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SevkIrsaliyeleriAyrintiDto,
  ) {}

  ngOnInit() {
   
  }

  kapat() {
    this.dialogRef.close();
  }
}