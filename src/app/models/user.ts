export interface User {
  isim: string;
  soyIsim: string;
  depoNo: number;
  depoIsmi: string;
  menuler: Menu[];
}

export interface Menu {
  id: number;
  isim: string;
  altMenuler?: AltMenu[];  // Alt menüler burada
  // evraklar: Gorevler kaldırılmalı çünkü görevler alt menülerde olacak
}

export interface AltMenu {
  id: number;
  isim: string;
  evraklar?: Gorevler;  // Görevler alt menü içinde olmalı
}

export interface Gorevler {
  birinciAdimEvraki?: Gorev;
  ikinciAdimEvraki?: Gorev;
  ucuncuAdimEvraki?: Gorev | null;
}

export interface Gorev {
  id: number;
  isim: string;
}

export interface LoginResponse {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}