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
  depo: DepoDto ;
  muhatapDepo: DepoDto ;
  muhatapFirma: FirmaDto  ;
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
  fiyati: number ;
  satisDursun: number ;
  sipDursun: number ;
  malKabulDursun: number ;
}



export interface StokAraCT {
  depoNo: number;
  barKodu: string;
  stokKod: string;
  stokIsim: string;
  fiyati: number;           // decimal -> number
  birimAd: string;
  birimKatsayisi: number;
  satisDursun: number;
  sipDursun: number;
  malKabulDursun: number;
  urunSorumlusu?: string | null;
}

// Cari arama
export interface CariHesapAraCT {
  cariKod: string;
  cariUnvan: string;
  vergiKimlikNo: string;
}


// Cari kodu ile stok arama POST request DTO
export interface StokBulDto {
  CariKod: string | null;
  Bul: string;
}