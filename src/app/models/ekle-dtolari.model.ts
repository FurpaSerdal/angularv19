/* ============================= */
/* ===== SİPARİŞ DTO'LARI ===== */
/* ============================= */

import { KalemDto } from "./ayrinti-dtolari.model";

export interface AlinanDepoSiparisleriEkleDto {
  muhatapDepoNo: number;
  kalemler: KalemDto[];
  siparisVerenAdSoyad: string;
}

export interface AlinanSiparislerEkleDto {
  cariKodu: string;
  kalemler: KalemDto[];
  siparisVerenAdSoyad: string;
}

export interface VerilenDepoSiparisleriEkleDto {
  siparisAlanAdSoyad: string;
  muhatapDepoNo: number;
  kalemler: KalemDto[];
}

export interface VerilenSiparislerEkleDto {
  cariKod: string;
  siparisAlanAdSoyad: string;
  kalemler: KalemDto[];
}

/* ============================= */
/* ===== FATURA DTO'LARI ====== */
/* ============================= */

export interface AlisFaturalariEkleDto {}

export interface SatisFaturalariEkleDto {}

/* ============================= */
/* ===== FİŞ DTO'LARI ========= */
/* ============================= */

export interface GirisFisleriEkleDto {
  olusturanAdSoyad: string;
  onaylayanAdSoyad: string;
  kalemler: KalemDto[];
}

export interface CikisFisleriEkleDto {
  olusturanAdSoyad: string;
  onaylayanAdSoyad: string;
  kalemler: KalemDto[];
}

/* ============================= */
/* ===== İRSALİYE DTO'LARI ==== */
/* ============================= */

export interface MalKabulIrsaliyeleriEkleDto {
  belgeNo?: string | null;
  qrData?: string | null;
  cariKod: string;
  eIrsaliyeTarihi:  Date ;
  teslimEdenAdSoyad: string;
  aracPlaka: string;
  kalemler: KalemDto[];
}

export interface DepolardanMalKabulIrsaliyeleriEkleDto {
  seri: string;
  sira: number;
  teslimAlanAdSoyad: string;
  kalemler: KalemDto[];
}

export interface DepolaraSevkIrsaliyeleriEkleDto {
  sevkedenAdSoyad: string;
  muhatapDepoNo: number;
  iadedir: boolean;
  kalemler: KalemDto[];
}

export interface SevkIrsaliyeleriEkleDto {
  sevkedenAdSoyad: string;
  cariKod: string;
  iadedir: boolean;
  kalemler: KalemDto[];
}

/* ============================= */
/* ===== SAYIM DTO'LARI ======= */
/* ============================= */

export interface SayimSonuclariEkleDto {
  sayanAdSoyad: string;
  kalemler: SayimSonucuKalemiDto[];
}

export interface SayimSonucuKalemiDto {
  parcalanacakStokKodu: string;
  parcalanacakMiktar: number;
  virmaniYapilacakStokKodu: string;
  virmanMiktari: number;
}

/* ============================= */
/* ===== VİRMAN DTO'LARI ====== */
/* ============================= */

export interface VirmanEkleDto {
  virmanYapanAdSoyad: string;
  kalemler: VirmanKalemiDto[];
}

export interface VirmanKalemiDto {
  parcalanacakStokKodu: string;
  parcalanacakMiktar: number;
  virmaniYapilacakStokKodu: string;
  virmanMiktari: number;
}
