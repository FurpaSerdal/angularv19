export interface Evrak {
  id: string;
  goreve: number;
  kareKod: string;
  kareKodIrsaliyenindir: boolean;
  iadedir: boolean;
  evrakNoSeri: string;
  evrakNoSira: number;
  evrakTarihi: string; // ISO Date
  siparisSevkOlundu: boolean;
  sevkTeslimAlindi: boolean | null;
  sevkFaturalandirildi: boolean | null;
  belgeNo: string;
  onaylandi: boolean | null;
  onaylayan: string | null;
  teslimTarihi: Date | null;
  teslimEden: string | null;
  teslimAlan: string | null;
  ettn: string | null;
  firmaVknTckn: string | null;
  furpaVknTckn: string | null;
  muhatabiFirmadir: boolean;
  depo: Depo;
  muhatapDepo: Depo;
  muhatapFirma: Firma | null;
  aciklama: string | null;
  kalemler: Kalem[];
  isFatura: boolean;
  isIrsaliye: boolean;
  farkEvrakKimlik:number | null;
  farkGorevKimlik:number | null;
  iadeEvrakKimlik:number | null;
  iadeGorevKimlik:number | null;
  sfdsEvrakidir : boolean | null;

  malKabulFazlasiVar : boolean | null;


}
 export interface Depo {
  no: number;
  isim: string;
}

export interface Firma {
  id?: string;
  unvan?: string;
  vknTckn?: string;
}
export interface Kalem {
  id: string;
  stok: Stok;
  siparisGuid: string;
  sevkGuid: string | null;
  faturaGuid: string | null;
  eIrsaliyeEttn: string | null;
  eFaturaEttn: string | null;
  iadeyeKonuIrsaliyeGuidi: string | null;
  siparisMiktari: number;
  onerilenSiparisMiktari: number | null;
  sevkMiktari: number;
  malKabulMiktari: number | null;
  sevkMalKabulFarkMiktari: number | null;
  aciklama: string | null;
  sonKullanimTarihi: string | null;
  evrakId: string | null;
  evrak: any | null;
}



export interface UrunList {
  id: string;
  stok: Stok;
  siparisGuid: string;
  sevkGuid: string | null;
  faturaGuid: string | null;
  eIrsaliyeEttn: string | null;
  eFaturaEttn: string | null;
  iadeyeKonuIrsaliyeGuidi: string | null;
  siparisMiktari: number | null;
  onerilenSiparisMiktari: number | null;
  sevkMiktari: number | null;
  malKabulMiktari: number | null;
  sevkMalKabulFarkMiktari: number | null;
     miktar: number | null;

  aciklama: string | null;
  sonKullanimTarihi: string | null;
  evrakId: string | null;
  evrak: any | null;
}
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



