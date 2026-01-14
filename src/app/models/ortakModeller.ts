export interface Kalem {
  id: string;

  stok: StokVin;
  siparisGuid?: string | null;
  sevkGuid?: string | null;
  faturaGuid?: string;
  eIrsaliyeEttn?: string;
  eFaturaEttn?: string;
  iadeyeKonuIrsaliyeGuidi?: string;

  siparisMiktari?: number;
  onerilenSiparisMiktari?: number;
  sevkMiktari?: number;
  malKabulMiktari?: number;
  sevkMalKabulFarkMiktari?: number;

  aciklama?: string;
  sonKullanimTarihi?: string | Date;

  evrakId?: string;
  evrak?: Evrak;
}

export interface StokVin {
  stokKod: string;
  stokIsim: string;
  birimAd: string;
  barkodlar?: BarkodVin[];
  fiyat?: DepoStokFiyatiVin;
}

export interface BarkodVin {
  barKodu: string;
  stokKod: string;
  birimAd: string;
  birimKatSayisi?: number;
}

export interface DepoStokFiyatiVin {
  depoNo: number;
  fiyati?: number;
  satisDursun?: number;
  sipDursun?: number;
  malKabulDursun?: number;
}

export interface Firma {
  no: string;
  isim: string;
  adresi?: string;
}

export interface Depo {
  no?: number;
  isim?: string;
}



export interface Evrak {
  id: string;

  goreve?: number;

  kareKod?: string;
  kareKodIrsaliyenindir?: boolean;

  iadedir?: boolean;

  evrakNoSeri?: string;
  evrakNoSira?: number;
  evrakTarihi?: string | Date;

  siparisSevkOlundu?: boolean;
  sevkTeslimAlindi?: boolean;
  sevkFaturalandirildi?: boolean;

  belgeNo: string;
  onaylandi?: boolean;
  onaylayan?: string;

  teslimTarihi?: string | Date;
  teslimEden?: string;
  teslimAlan?: string;

  ettn?: string;
  firmaVknTckn?: string;
  furpaVknTckn?: string;

  muhatabiFirmadir?: boolean;
  sfdsEvrakidir?: boolean;

  depo?: Depo;
  muhatapDepo?: Depo;
  muhatapFirma?: Firma;

  fazlaGorevKimlik?: number;
  iadeGorevKimlik?: number;
  malKabulFazlasiVar?: boolean;
  malKabulNoksaniVar?: boolean;

  aciklama?: string;
  kalemler?: Kalem[];
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

export enum NoksanFazlaIadesi {
  NoksanDuzeltmeIadesi = 0,
  FazlaIadesi = 1,
  FazlaDuzeltmeSevki = 2
}
