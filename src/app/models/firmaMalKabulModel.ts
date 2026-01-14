import { Kalem } from "./ortakModeller";


export interface FirmaMalKabulModel {
  evrakNoSeri?: string;
  evrakNoSira?: number | null;
  kalemler: Kalem[];
  qrData?: string;
  belgeTarihi?: Date; 
  cariKod?: string;
  teslimEdenAdSoyad ?: string;
}

