import { Component, Inject } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MalKabulIrsaliyeleriAyrintiDto } from '../../../../../models/ayrinti-dtolari.model';

@Component({
  selector: 'app-company-inbound-shipments-detail',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl:'./detail.html',
  styleUrls: ['./detail.css']
})
export class CompanyInboundShipmentsDetailComponent {
 
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CompanyInboundShipmentsDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MalKabulIrsaliyeleriAyrintiDto,
  ) {}

  ngOnInit() {
  
  }

  kapat() {
    this.dialogRef.close();
  }
}