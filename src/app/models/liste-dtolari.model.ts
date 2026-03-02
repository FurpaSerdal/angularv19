// models/liste-dtolari.model.ts

// --------------------
// Alınan Depo Siparişleri
// --------------------
export interface AlinanDepoSiparisleriListeDto {
  seri: string;
  sira: number;
  muhatap: string;
  muhatapDepo: string;
  tarih: Date;
  durumu: string;
}

// --------------------
// Alınan Siparişler
// --------------------
export interface AlinanSiparislerListeDto {
  seri: string;
  sira: number;
  muhatap: string;
  tarih: Date;
  durumu: string;
}

// --------------------
// Alış Faturaları
// --------------------
export interface AlisFaturalariListeDto {
  seri: string;
  sira: number;
  muhatap: string;
  tarih: Date;
  durumu: string;
  belgeNo: string;
}

// --------------------
// Çıkış Fişleri
// --------------------
export interface CikisFisleriListeDto {
  seri: string;
  sira: number;

  tarih: Date;

}

// --------------------
// Depolara Sevk İrsaliyeleri
// --------------------
export interface DepolaraSevkIrsaliyeleriListeDto {
  seri: string;
  sira: number;
  muhatap: string;
  muhatapDepo: string;
  tarih: Date;
  durumu: string;
  belgeNo: string;
}

// --------------------
// Depolardan Mal Kabul İrsaliyeleri
// --------------------
export interface DepolardanMalKabulIrsaliyeleriListeDto {
  seri: string;
  sira: number;
  muhatap: string;
  muhatapDepo: string;
  tarih: Date;
  durumu: string;
  belgeNo: string;
}

// --------------------
// Giriş Fişleri
// --------------------
export interface GirisFisleriListeDto {
  seri: string;
  sira: number;
  muhatap: string;
  tarih: Date;
  durumu: string;
}

// --------------------
// Mal Kabul İrsaliyeleri
// --------------------
export interface MalKabulIrsaliyeleriListeDto {
  seri: string;
  sira: number;
  muhatap: string;
  tarih: Date;
  durumu: string;
  belgeNo: string;
}

// --------------------
// Satış Faturaları
// --------------------
export interface SatisFaturalariListeDto {
  seri: string;
  sira: number;
  muhatap: string;
  tarih: Date;
  durumu: string;
  belgeNo: string;
}

// --------------------
// Sayım Sonuçları
// --------------------
export interface SayimSonuclariListeDto {
  evrakNo: number;
  sayanAdSoyad: string;
  tarih: Date;
}

// --------------------
// Sevk İrsaliyeleri
// --------------------
export interface SevkIrsaliyeleriListeDto {
  seri: string;
  sira: number;
  muhatap: string;
  ettn: string;
  tarih: Date;
  durumu: string;
  belgeNo: string;
}

// --------------------
// Verilen Depo Siparişleri
// --------------------
export interface VerilenDepoSiparisleriListeDto {
  seri: string;
  sira: number;
  muhatap: string;
  muhatapDepo: string;
  tarih: Date;
  durumu: string;
}

// --------------------
// Verilen Siparişler
// --------------------
export interface VerilenSiparislerListeDto {
  seri: string;
  sira: number;
  muhatap: string;
  tarih: Date;
  durumu: string;
  onaylayanAdSoyad: string;
}

// --------------------
// Virman
// --------------------
export interface VirmanListeDto {
  seri: string;
  sira: number;
  tarih: Date;
  durumu: string;
}
