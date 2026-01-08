import { Kalem } from "./ortakModeller";


export interface FirmaMalKabulModel {
  evrakNoSeri?: string;
  evrakNoSira: number | null;
  qrstring?: string;
  kalemler?: Kalem[];
}

