// ===============================
// 📦 STOK
// ===============================
export interface EBelgeStokDto {
  stokKodu: string;
  stokIsmi: string;
  birim: string;
  barkodu: string;
}

// ===============================
// 📦 KALEM
// ===============================
export interface EIrsaliyeGonderKalemDto {
  stok: EBelgeStokDto;
  miktar: number;
  onerilenMiktar: number;
  teslimMiktari: number;
}

// ===============================
// 🚚 DEPO → DEPO E-İRSALİYE
// ===============================
export interface DepoEIrsaliyesiGonderDto {
  seri: string;
  sira: number;
  belgeNo: string;
  hedefDepoNo: number;
  kaynakDepoNo: number;
  aracPlaka: string;
  kalemler: EIrsaliyeGonderKalemDto[];
  soforAdSoyad: string;
  soforTckn: string;
  sevkEdenAdSoyad: string;
  siparisEdenAdSoyad: string;
}

// ===============================
// 🏢 CARİ'YE E-İRSALİYE
// ===============================
export interface EIrsaliyeGonderDto {
  seri: string;
  sira: number;
  belgeNo: string;
  cariKod: string;
  aracPlaka: string;
  kalemler: EIrsaliyeGonderKalemDto[];
  soforAdSoyad: string;
  soforTckn: string;
  sevkEdenAdSoyad: string;
  siparisEdenAdSoyad: string;
}