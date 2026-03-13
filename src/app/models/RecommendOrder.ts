export interface DepoOSDto {
  KarsiDepo: number;
  StokKodu: string |null;
}

export interface OnerilenDepoSiparisleriCT {
  seriNo: string;
  barkod: string;
  stokAdi: string;
  stokKodu: string;
  depoAdi: string;
  modelKodu: string;
  sonStok: number;
  satisMiktar: number;
  gunlukOrtalamaSatis: number;
  siparisMiktari: number;
  birim2Katsayi: number;
  minStokGun: number | null;
  siparisStokGun: number | null;
  maxStokGun: number | null;
  eximKodu: string;
  sube: string;
}

export interface FirmaOSDto {
  CariKod: string;
  StokKodu: string; // boş string verirsen bütün önerilen ürünler gelir 
}

export interface OnerilenFirmaSiparisCT {
  SeriNo: string;
  bar_kodu: string;
  sto_isim: string;
  sto_kod: string;
  dep_adi: string;
  sto_model_kodu: string;
  son_stok: number;
  satis_miktar: number;
  gunluk_ortalama_satis: number;
  siparis_miktari: number;
  sto_birim2_katsayi: number;
  sto_min_stok_belirleme_gun: number;
  sto_sip_stok_belirleme_gun: number;
  sto_max_stok_belirleme_gun: number;
  sth_exim_kodu: string;
  cha_kod: string;
  dep_no: number;
}

