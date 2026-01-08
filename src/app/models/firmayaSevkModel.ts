import { Kalem } from "./ortakModeller";


export interface FirmayaSevketDto {

  iadedir: boolean ;
  muhattapfirmaNo: string;
  kalemler?: Kalem[] 
}