import { Kalem } from "./genelModel";


export interface depoMalKabulModel {
  evrakNoSeri?: string,
  evrakNoSira?: number,
  kalemler?: Kalem[] 
}

export enum ReceiveMode {
  Select = 'select',
  Scan = 'scan'
}
