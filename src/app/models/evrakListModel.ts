
// Evrak
export interface Evrak {
  evrakNoSeri: string;
  evrakNoSira: number;
  evrakTarihi: string;   // ISO date string
  teslimTarihi: string;  // ISO date string
  belgeNo: string;
  onaylandi: boolean;
  onaylayan: string;
  depo: DepoModel;
  siparisSevkOlundu: boolean;
  muhatapFirma: DepoModel;
  firmaVknTckn: string;
  iadedir: boolean;
  evrakNo: number;
  tarih: string;
  sayanAdSoyad: string;
  durum: string;
}
// Ana response
export interface EvrakListResponse {
  evraklar: siparisListModel[] 
  siradakiGorev: Gorev;
}
// Sıradaki Görev
export interface Gorev {
  id: number;
  isim: string;
  sebike: string;
}


export interface siparisListModel {
  siparisBilgileri: any | null;
  depo: DepoModel;
  muhatapDepo: DepoModel;
  belgeNo: string;
  seri: string;
  sira: number;
  tarih: Date;
  mesaj: string | null;
}

export interface DepoModel {
  no: number;
  isim: string;
}


export interface SayimListModel {
  sayanAdSoyad: string;
  belgeNo: string;
  seri: string | null;
  sira: number | null;
  tarih: string; // ISO date string
  mesaj: string | null;
}