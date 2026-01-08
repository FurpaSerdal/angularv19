
import { NoksanFazlaIadesi } from "./genelModel";
import { Kalem } from "./ortakModeller";


export interface FirmaSiparisiVerDto {
  gorevKimlik: number;
  cari_kod: string;
  teslimTarihi: string | Date;
  noksanFazlaIadesi: NoksanFazlaIadesi;
  kalemler: Kalem[];
  siparisEden: string;
  siparisAlan: string;
}
