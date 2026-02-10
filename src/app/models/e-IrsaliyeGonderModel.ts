
export interface SendOutboxShippingDespatch {
  seri: string;
  sira: number;
  belgeNo: string;
  hedefDepoNo: number;
  kaynakDepoNo: number;
  aracPlaka: string;
  kalemler: EIrsaliyeGonderKalemDto[];
  soforAdSoyad: string;
  soforTckn: string;
  sevkEdenAdSoyad: string;
  siparisEdenAdSoyad: string;
}

export interface EIrsaliyeGonderKalemDto {
  stok: EBelgeStokDto;
  miktar: number;
  onerilenMiktar: number;
  teslimMiktari: number;
}

export interface EBelgeStokDto {
  stokKodu: string;
  stokIsmi: string;
  birim: string;
  barkodu: string;
}
