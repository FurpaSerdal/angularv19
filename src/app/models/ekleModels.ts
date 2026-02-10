export interface BaseEkleDto {
    muhatapSube:MuhatapSubeDto | null;
    muhatapFirma:MuhatapFirmaDto | null;
  kalemler: KalemDto[] ;

}




// kalem.dto.ts
export interface KalemDto {
  siparisGuid?: string | null;
  sevkGuid?: string | null;
  faturaGuid?: string | null;
  eIrsaliyeEttn?: string | null;
  eFaturaEttn?: string | null;
  iadeyeKonuIrsaliyeGuidi?: string | null;
  siparisMiktari?: number | null;
  onerilenSiparisMiktari?: number | null;
  sevkMiktari?: number | null;
  malKabulMiktari?: number | null;
  sevkMalKabulFarkMiktari?: number | null;
  aciklama?: string | null;
  brimMusiri?: number | null;
  stokKodu?: string | null;
  duzeltmedir?: boolean | null;
  virmancikisi?: boolean | null;
}


// ekle-dtos.ts

export interface AlinanSiparislerEkleDto extends BaseEkleDto {}
export interface AlinanDepoSiparisleriEkleDto extends BaseEkleDto {}
export interface VerilenSiparislerEkleDto extends BaseEkleDto {}
export interface VerilenDepoSiparisleriEkleDto extends BaseEkleDto {}
export interface MalKabulIrsaliyeleriEkleDto extends BaseEkleDto {
  evrakNoSeri?: string | null;
  evrakNoSira?: number | null;
  belgeNo?: string | null;
  qrCode?: string | null;
    iadedir?: boolean | null;
}
export interface DepolardanMalKabulIrsaliyeleriEkleDto extends BaseEkleDto {
    iadedir?: boolean | null;
        evrakNoSeri?: string | null;
  evrakNoSira?: number | null;
  belgeNo?: string | null;
  qrCode?: string | null;
}
export interface DepolaraSevkIrsaliyeleriEkleDto extends BaseEkleDto {
 sevkTarihi?: Date | null;
  nakliyeDeposu:nakliyeDeposuDto | null;

    iadedir?: boolean | null;
}
export interface SevkIrsaliyeleriEkleDto extends BaseEkleDto {
  sevkTarihi?: Date | null;
  nakliyeDeposu:nakliyeDeposuDto | null;
    iadedir?: boolean | null;
}
export interface AlisFaturalariEkleDto extends BaseEkleDto {}
export interface SatisFaturalariEkleDto extends BaseEkleDto {}
export interface GirisFisleriEkleDto extends BaseEkleDto {}
export interface CikisFisleriEkleDto extends BaseEkleDto {}
export interface VirmanEkleDto extends BaseEkleDto {}
export interface SayimSonuclariEkleDto extends BaseEkleDto {}

// ekle-response.dto.ts
export interface EkleResponseDto {
  mesaj: string;
  seri?: string | null;
  sira?: number | null;
}
export interface nakliyeDeposuDto {
soforAdSoyad?: string | null;
depoNo: number;
plaka?: string | null;
}



// muhatap-firma.dto.ts
export interface MuhatapFirmaDto {
  yetkiliAdSoyad?: string | null;
  cariKod: string;
  unvan?: string | null;
  vknTckn?: string | null;
  vergiDairesi?: string | null;
  temsilciAdSoyad?: string | null;
  adres?: string | null;
  ilce?: string | null;
  il?: string | null;
}
export interface MuhatapSubeDto {
  yetkiliAdSoyad?: string | null;
  depoNo: number;
  cariKod: string;
  isim?: string | null;
  unvan?: string | null;
  vknTckn?: string | null;
  vergiDairesi?: string | null;
  temsilciAdSoyad?: string | null;
  adres?: string | null;
  ilce?: string | null;
  il?: string | null;
}

export enum ReceiveMode {
  Select = 'select',
  Scan = 'scan',
  Differentials = 'fark'
}
