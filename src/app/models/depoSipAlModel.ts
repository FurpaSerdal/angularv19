import { Kalem, NoksanFazlaIadesi } from "./ortakModeller";

export interface SubeSiparisiAlDto {
  noksanFazlaIadesi?: NoksanFazlaIadesi | null;
  muhatapDepoNo: number;
  kalemler: Kalem[];
}
