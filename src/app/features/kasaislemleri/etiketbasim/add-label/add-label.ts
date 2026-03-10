import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../../../models/eskiAngular';
import { EtiketService } from '../../../../services/etiket.service';
import { MeService } from '../../../../services/meservice.service';

@Component({
  selector: 'app-add-label',
  imports: [CommonModule,FormsModule],
  templateUrl: './add-label.html',
  styleUrls: ['./add-label.css'],
})
export class AddLabel {
searchText: string = '';
findProducts: Product[] = [];
constructor(
  private dialogref: MatDialogRef<AddLabel>,
  private etiketService: EtiketService,
  private meService: MeService
) { }

 ngOnInit(): void {

 }
   taskid = computed(() => this.meService.selectedGorev()?.id || 0);
  depoNo = computed(() => this.meService.getUserSignal()()?.subeNo || 0);



onSearchChange(): void {
    if (!this.searchText){
      this.findProducts = [];
      return;
    }
    if (this.searchText.length < 3){
      return;
    }

    this.searchText = this.searchText.trim();


    this.etiketService.getByFilterForLabel(this.searchText, this.taskid()).subscribe((products) => {
    this.findProducts = products;
  });

}


selectProduct(product: Product) {
  this.dialogref.close(product);

}
closeDialog() {
  this.dialogref.close();
}
}

