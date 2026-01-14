
import { Kalem, NoksanFazlaIadesi } from "./ortakModeller";


export interface FirmaSiparisiVerDto {
  gorevKimlik: number;
  cari_kod: string;
  teslimTarihi: string | Date;
  noksanFazlaIadesi: NoksanFazlaIadesi | null;
  kalemler: Kalem[];
  siparisEden: string;
  siparisAlan: string;
}
