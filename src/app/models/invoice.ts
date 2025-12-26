export interface TopluCevirRequestDto {
  CevirilecekEvraklar: invoice[];
}

export interface invoice {
  evrakTip: number;
  evrakNo: string;
  tarih: string;
  iade: number;
  belgeTarihi: string;
  aciklama: string;
  belgeNo: string;
  araToplam: number;
  tutar: number;
  eBelgeTuru: number;
  musteriAdi: string;
  musteriKodu: string;
  vdNo: string;
  cariHareketCins: number;
  vergiDairesi: string;
  cadde: string;
  sokak: string;
  ilce: string;
  il: string;
  mail: string;
  miktar: number;
  rusum: number;
  postaKodu: string;
  faturaMail: string;
  cariTel: string;
  istisnaKodu: string;
  istisnaAciklama: string;
  ozelMatrahKodu: string;
  ozelMatrahAciklama: string;
  irsaliyeTarihi: string;
  irsaliyeNo: string;
  eFaturaMukellefiMi: boolean;
  fatGuid: string;
  depo: string;
}