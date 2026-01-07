import { Kalem, NoksanFazlaIadesi } from "./genelModel";

export interface SubeSiparisiAlDto {
  noksanFazlaIadesi?: NoksanFazlaIadesi | null;
  muhatapDepoNo: number;
  kalemler: Kalem[];
}
