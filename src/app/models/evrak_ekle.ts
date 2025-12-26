// Evrak & Kalem ekleme DTO'ları
export interface EvrakEkleDto {
  evrakNoSeri: string | null;
  evrakNoSira: number | null;
  kareKod: string | null;
  kareKodIrsaliyenindir: boolean | null;
  belgeNo: string | null;
  teslimEden: string | null;
  teslimTarihi: Date | null;
  teslimAlan: string | null;
  muhatabiFirmadir: boolean | null;
  depo: DepoDto | null;
  muhatapDepo: DepoDto | null;
  muhatapFirma: FirmaDto | null;
  aciklama: string | null;
   iadedir? : boolean | null,
   goreve?:number | null
   sfdsEvrakidir :boolean| null,
  kalemler: Kalem[] ;
}
export interface Kalem {
  aciklama: string | null;

  evrak: any | null;
  evrakId: string | null;

  faturaGuid: string | null;
  sevkGuid: string | null;
  siparisGuid: string | null;

  iadeyeKonuIrsaliyeGuidi: string | null;

   miktar: number | null;

  sonKullanimTarihi: string | null;

  eFaturaEttn: string | null;
  eIrsaliyeEttn: string | null;

  stok: Stok;
}

// Firma / Depo

export interface FirmaDto {
  no: string ;
  isim: string;
  adresi: string | null;
}

export interface DepoDto {
  no: number | null;
  isim: string;
}


// Stok / Barkod / Fiyat
export interface Stok {
  stokKod: string;
  stokIsim: string;

  birimAd: string;
  birimKatSayisi: number;

  fiyat: DepoStokFiyatiDto;

  barkodlar: Barkod[];
}

export interface Barkod  {
  barKodu: string;
  stokKod: string;
  birimAd: string;
  birimKatSayisi: number | null;
}

export interface DepoStokFiyatiDto {
  depoNo: number;
  fiyati: number | null;
  satisDursun: number | null;
  sipDursun: number | null;
  malKabulDursun: number | null;
}
