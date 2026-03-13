// --------------------
// KALEM DTO
// --------------------
export interface KalemDto {
  siparisGuid?: string | null;
  sevkGuid?: string;
  faturaGuid?: string;
  eIrsaliyeEttn?: string;
  eFaturaEttn?: string;
  iadeyeKonuIrsaliyeGuidi?: string;

  siparisMiktari?: number;
  skt?: Date;
  onerilenSiparisMiktari?: number;
  sevkMiktari?: number;
  malKabulMiktari?: number;
  sevkMalKabulFarkMiktari?: number;

  aciklama?: string;
  stokKodu?: string;
  stokIsmi?: string;
  barkodu?: string;
  birim?: string;

  birimKatsayisi?: number;
  duzeltmedir?: boolean;
  virmanCikisi?: boolean;
  birimMusiri?: number;
}// --------------------
export interface AlinanDepoSiparisleriAyrintiDto {
  seri: string;
  sira: number;
  muhatap: string;
  muhatapDepoNo: number;
  tarih: Date;
  durumu: string;
  kalemler: KalemDto[];
}

// --------------------
export interface AlinanSiparislerAyrintiDto {
  seri: string;
  sira: number;
  muhatap: string;
  tarih: Date;
  durumu: string;
  kalemler: KalemDto[];
}

// --------------------
export interface AlisFaturalariAyrintiDto {
  seri: string;
  sira: number;
  muhatap: string;
  tarih: Date;
  durumu: string;
  belgeNo: string;
  kalemler: KalemDto[];
}

// --------------------
export interface CikisFisleriAyrintiDto {
  seri: string;
  sira: number;
  muhatap: string;
  tarih: Date;
  durumu: string;
  kalemler: KalemDto[];
}

// --------------------
export interface DepolaraSevkIrsaliyeleriAyrintiDto {
  seri: string;
  sira: number;
  muhatap: string;
  muhatapDepoNo: number;
  tarih: Date;
  durumu: string;
  belgeNo: string;
  kalemler: KalemDto[];
}

// --------------------
export interface DepolardanMalKabulIrsaliyeleriAyrintiDto {
  seri: string;
  sira: number;
  muhatap: string;
  muhatapDepoNo: number;
  tarih: Date;
  durumu: string;
  belgeNo: string;
  kalemler: KalemDto[];
}

// --------------------
export interface GirisFisleriAyrintiDto {
  seri: string;
  sira: number;
  muhatap: string;
  tarih: Date;
  durumu: string;
  kalemler: KalemDto[];
}

// --------------------
export interface MalKabulIrsaliyeleriAyrintiDto {
  seri: string;
  sira: number;
  muhatap: string;
  tarih: Date;
  durumu: string;
  belgeNo: string;
  kalemler: KalemDto[];
}

// --------------------
export interface SatisFaturalariAyrintiDto {
  seri: string;
  sira: number;
  muhatap: string;
  tarih: Date;
  durumu: string;
  belgeNo: string;
  kalemler: KalemDto[];
}

// --------------------
export interface SayimSonuclariAyrintiDto {
  evrakNo: number;
  sayanAdSoyad: string;
  tarih: Date;
  kalemler: KalemDto[];
}

// --------------------
export interface SevkIrsaliyeleriAyrintiDto {
  seri: string;
  sira: number;
  muhatap: string;
  cariKod: string;
  ettn: string;
  tarih: Date;
  durumu: string;
  belgeNo: string;
  kalemler: KalemDto[];
}

// --------------------
export interface VerilenDepoSiparisleriAyrintiDto {
  seri: string;
  sira: number;
  muhatap: string;
  tarih: Date;
  durumu: string;
  kalemler: KalemDto[];
}

// --------------------
export interface VerilenSiparislerAyrintiDto {
  seri: string;
  sira: number;
  muhatap: string;
  cariKod: string;
  tarih: Date;
  durumu: string;
  onaylayanAdSoyad: string;
  kalemler: KalemDto[];
}

// --------------------
export interface VirmanAyrintiDto {
  seri: string;
  sira: number;
  tarih: Date;
  durumu: string;
  kalemler: KalemDto[];
}

