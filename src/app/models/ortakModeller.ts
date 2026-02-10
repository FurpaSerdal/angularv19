
export interface StokAraCT {
  fiyatTipKodu: number;
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


export interface DepoCari {
  adres: string;
  cariKod: string;
  depoNo: number;
  il: string;
  ilce: string;
  isim: string;
  temsilciAdSoyad: string;
  unvan: string;
  vergiDairesi: string;
  vknTckn: string;
  yetkiliAdSoyad: string;
}

