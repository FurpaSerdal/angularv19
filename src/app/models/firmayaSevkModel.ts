import { Kalem } from "./ortakModeller";


export interface FirmayaSevketDto {

  muhatapFirmaCariKod: string;
  kalemler: Kalem[];
  teslimTarihi: Date;
  siparisEden: string;
  siparisAlan: string;
  iadedir?: boolean;
  
}