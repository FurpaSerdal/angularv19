import { Kalem, NoksanFazlaIadesi } from "./genelModel";

export interface SubeyeSevketDto {

  iadedir: boolean ;
  muhatapDepoNo: number;
  kalemler?: Kalem[] 
}