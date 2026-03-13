import { Component, computed } from '@angular/core';
import { MeService } from '../../../services/meservice.service';
import { UnionCardService } from '../../../services/unionCard/unionCard';
import { SharedImports } from '../../../core/pipes/shared-imports';
import { UnionCard } from '../../../models/union-card.model';

@Component({
  selector: 'app-birlik-kart-sorgulama',
  imports: [SharedImports],
  templateUrl: './birlik-kart-sorgulama.html',
})
export class BirlikKartSorgulama {
yukleniyor: boolean = false;
cekNo: string = "";
cek: UnionCard | null = null;

constructor(private meService : MeService,private unionCardService : UnionCardService) {}

taskId = computed(() => this.meService.selectedGorev()?.id);

ngOnInit(): void {

}
sorgula() {
if (!this.cekNo?.length) {
  return;
}
this.yukleniyor = true;
this.unionCardService.getUnionCard(this.taskId() ?? 0, this.cekNo).subscribe({
  next: (res) => this.cek = res,
  error: (err) => console.error(err),
  complete: () => this.yukleniyor = false
});

}
uzat(cek: UnionCard | null) {
  this.yukleniyor=true;
  if(this.cek){
    this.unionCardService.tarihUzat(this.taskId() ?? 0, this.cek.checkNo).subscribe({
      next: () => {
        this.yukleniyor = false;
      },
      error: (err) => console.error(err),
      complete: () => this.yukleniyor = false
    });
    

  }
}

}

