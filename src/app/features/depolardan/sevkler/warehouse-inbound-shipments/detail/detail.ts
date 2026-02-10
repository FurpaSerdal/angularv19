import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DetayResponse } from '../../../../../models/detay';

@Component({
  selector: 'app-warehouse-inbound-shipments-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail.html',
  styleUrls: ['./detail.css']
})
export class WarehouseInboundShipmentsDetailComponent {
  veri: DetayResponse = {
    evrak: {
      kareKod: '',
      kareKodIrsaliyenindir: false,
      evrakNoSeri: '',
      evrakNoSira: 0,
      evrakTarihi: '',
      teslimTarihi: '',
      belgeNo: '',
      onaylandi: false,
      onaylayan: '',
      depo: { no: 0, isim: '' },
      muhatapFirma: { no: '', isim: '', yetkili: null, adresi: null },
    },
    kalemleri: [],
  };

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<WarehouseInboundShipmentsDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DetayResponse,
  ) {}

  ngOnInit() {
    const fallback = this.data ?? ({} as DetayResponse);
    this.veri = {
      ...fallback,
      evrak: {
        ...(fallback.evrak ?? ({} as DetayResponse['evrak'])),
        depo: fallback.evrak?.depo ?? ({} as DetayResponse['evrak']['depo']),
        muhatapFirma: fallback.evrak?.muhatapFirma ?? ({} as DetayResponse['evrak']['muhatapFirma']),
      },
      kalemleri: fallback.kalemleri ?? [],
    } as DetayResponse;
    console.log('Gelen veri:', this.veri);
  }

  kapat() {
    this.dialogRef.close();
  }
}