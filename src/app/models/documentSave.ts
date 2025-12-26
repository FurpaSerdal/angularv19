export interface EvrakKaydetDto {
  //siparisEvrakNoSeri?: string | null;
 // siparisEvrakNoSira?: number | null;
  EvrakTarihi?:Date|null;
  evrakNoSeri?: string | null;
  evrakNoSira?: number | null;
  depo: DepoRequestDto;
  muhatapDepo?: DepoRequestDto | null;   // gönderen/alan depo
  muhatapFirma: FirmaRequestDto;         // gönderen/alan firma
  kalemler: EvrakaKalemEkleDto[];
  aciklama?: string | null;
}


export interface EvrakaKalemEkleDto {
  stok: StokAraCT;
  siparisGuid?: string | null;  
  sevkGuid?: string | null;  
  iadeyeKonuIrsaliyeGuid?: string | null;                          // Guid? -> string | null
  siparisMiktari?: number | null;
  sevkMiktari?: number | null;
  malKabulMiktari?: number | null;
  sevkMalKabulFarkMiktari?: number | null;
  aciklama?: string | null;
  SonKullanimTarihi?:Date | null
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


export interface SoforDto {
  adi: string | null;
  soyAdi?: string | null;
  aracPlakasi?: string | null;
  tcknVkn?: string | null;
}

export interface FirmaRequestDto {
  cariKodu?: string | null;
  tcknVkn?: string | null;
  yetkiliadisoyadi?:string|null;
    sofor?: SoforDto | null;

}

export interface DepoRequestDto {
  depoNo: number;
  depoIsmi?: string | null;
  yetkiliadisoyadi?:string|null;
  sofor?: SoforDto | null;


}

// ======================
// ==== INTERFACES ======
// ======================

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

// Kaydet Response DTO
export interface KaydetResponseDto {
  Eklendi: boolean;
  EvraknoSeri: string;
  EvranoSeri: number;
}

export interface UrunListesi {
  UrunAdi: string;
  UrunKodu: string;
  tedarikciStokKod?: string;
  onerilenMiktar: number | null;
  verilenSiparisMiktari: number | null;
  malKabulIrsaliyesiMiktari: number | null;
  MalKabulMiktari: number | null;
  barkodu: string;
  fiyat: number;
  birimkatsayisi: number;
  sto_birim_ad: string;
  aciklama?: string;
  sipId?: string;
  fark?: string;
}

