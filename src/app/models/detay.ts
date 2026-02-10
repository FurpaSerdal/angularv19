export interface DetayResponse {
  evrak: Evrak;
  kalemleri: Kalem[];
}
export interface Evrak {
  kareKod: string;
  kareKodIrsaliyenindir: boolean;
  evrakNoSeri: string;
  evrakNoSira: number;
  evrakTarihi: string;      // backend ISO string gönderdiği için string
  teslimTarihi: string;
  belgeNo: string;
  onaylandi: boolean;
  onaylayan: string;
  depo: Depo;
  muhatapFirma: MuhatapFirma;
}
export interface Depo {
  no: number;
  isim: string;
}
export interface MuhatapFirma {
  no: string;
  isim: string;
  yetkili: string | null;
  adresi: string | null;
}
export interface Kalem {
  stokKodu: string;
  stokIsim: string;
  sevkGuid: string | null;
  siparisGuid: string | null;
  siparisMiktari: number | null;
  malKabulMiktari: number | null;
  sevkMiktari: number | null;
  durum: string | null;
}

export interface SiparisDetayResponse {
  siparisBilgileri: any | null;
  kalemleri: SiparisKalemi[];
  depo: Depo;
  muhatapDepo: Depo;
  belgeNo: string;
  seri: string;
  sira: number;
  tarih: string; // ISO string
  mesaj: string | null;
}
export interface SiparisKalemi {
  siparisGuid: string;
  sevkGuid: string | null;
  faturaGuid: string | null;
  eIrsaliyeEttn: string | null;
  eFaturaEttn: string | null;
  iadeyeKonuIrsaliyeGuidi: string | null;

  siparisMiktari: number;
  onerilenSiparisMiktari: number | null;
  sevkMiktari: number | null;
  malKabulMiktari: number | null;
  sevkMalKabulFarkMiktari: number | null;

  aciklama: string | null;

  stokKodu: string;
  barkodu: string;

  birimKatsayisi: number | null;
  duzeltmedir: boolean;
  virmanCikisi: boolean | null;
  birimMusiri: string | null;
}