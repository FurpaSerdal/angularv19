import { Kalem } from "./ortakModeller";


export interface depoMalKabulModel {
  evrakNoSeri?: string,
  evrakNoSira?: number,
  kalemler?: Kalem[] 
}

export enum ReceiveMode {
  Select = 'select',
  Scan = 'scan'
}
