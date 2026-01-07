import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Evrak } from '../../models/evrakDetay';
import { EvrakEkleDto, Kalem } from '../../models/evrakKaydet';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-detail',
  imports: [CommonModule,FormsModule],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class Detail {
  veri!: any;
  postorder!: EvrakEkleDto 

  constructor(
    private toastr: ToastrService,
     
    public dialogRef: MatDialogRef<Detail>,
    @Inject(MAT_DIALOG_DATA) public data: Evrak,
  ) {}

  ngOnInit() {
    this.veri = this.data;
    console.log('Gelen veri:', this.data);
    console.log('Atanan veri:', this.veri);
  }

 
  kapat(){
    this.dialogRef.close()
  }

  // Toplam hesaplama fonksiyonları
  // getToplamSiparisMiktari(): number {
  //   if (!this.veri.kalemler) return 0;
  //   return this.veri.kalemler.reduce((total, kalem) => total + (kalem.siparisMiktari || 0), 0);
  // }

  // getToplamSevkMiktari(): number {
  //   if (!this.veri.kalemler) return 0;
  //   return this.veri.kalemler.reduce((total, kalem) => total + (kalem.sevkMiktari || 0), 0);
  // }

  // getToplamMalKabulMiktari(): number {
  //   if (!this.veri.kalemler) return 0;
  //   return this.veri.kalemler.reduce((total, kalem) => total + (kalem.malKabulMiktari || 0), 0);
  // }

  // getToplamFarkMiktari(): number {
  //   if (!this.veri.kalemler) return 0;
  //   return this.veri.kalemler.reduce((total, kalem) => total + (kalem.sevkMalKabulFarkMiktari || 0), 0);
  // }

// alinanSipOlustur() {
//   this.toastr.info('Alınan sipariş oluşturuluyor');

//   const kalemler: Kalem[] = this.veri.kalemler
//     .filter(k => k.sevkMiktari - (k.malKabulMiktari ?? 0) < 0)
//     .map(x => ({
//       aciklama: x.aciklama,
//       evrak: x.evrak,
//       evrakId: x.evrakId,

//       faturaGuid: x.faturaGuid,
//       sevkGuid: x.sevkGuid,
//       siparisGuid: x.siparisGuid,
//       iadeyeKonuIrsaliyeGuidi: x.sevkGuid,

//       miktar: Math.abs(x.sevkMiktari - (x.malKabulMiktari ?? 0)),

//       sonKullanimTarihi: x.sonKullanimTarihi,
//       eFaturaEttn: x.eFaturaEttn,
//       eIrsaliyeEttn: x.eIrsaliyeEttn,

//       stok: {
//         ...x.stok,
//         fiyat: {
//           depoNo: 0,
//           fiyati: x.stok.fiyat.fiyati ?? 0,
//           satisDursun: x.stok.fiyat.satisDursun ?? 0,
//           sipDursun: x.stok.fiyat.sipDursun ?? 0,
//           malKabulDursun: x.stok.fiyat.malKabulDursun ?? 0
//         }
//       }
//     }));
//     console.log('Oluşturulacak kalemler:', kalemler);

  // const postorder: EvrakEkleDto = {
  //   kareKod: null,
  //   kareKodIrsaliyenindir: null,
  //   evrakNoSeri: this.veri.evrakNoSeri,
  //   evrakNoSira: this.veri.evrakNoSira,
  //   teslimTarihi: this.veri.teslimTarihi,
  //   belgeNo: this.veri.belgeNo,
  //   iadedir: this.veri.iadedir,
  //   teslimAlan: this.veri.teslimAlan,
  //   teslimEden: this.veri.teslimEden,
  //   muhatabiFirmadir: this.veri.muhatabiFirmadir,
  //   sfdsEvrakidir: true,

  //   depo: this.veri.depo,
  //   muhatapDepo: this.veri.muhatapDepo,

  //   muhatapFirma: {
  //     no: '',
  //     isim: '',
  //     adresi: ''
  //   },

  //   aciklama: this.veri.aciklama,
  //   kalemler: kalemler
  // };
  // console.log('Oluşturulacak postorder:', postorder);

  // this.crudService
  //   .documentSave(
  //     this.veri.farkGorevKimlik ?? 0,
  //     this.veri.farkEvrakKimlik ?? 0,
  //     postorder
  //   )
  //   .subscribe({
  //     next: (value) => {
  //       console.log(value);
  //       this.toastr.success('Alınan sipariş başarıyla oluşturuldu');
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.toastr.error('Sipariş oluşturulamadı');
  //     }
  //   });
    
}

