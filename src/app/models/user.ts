
export interface User {
  adSoyad: string;
  sube: string;
  subeNo: number;
  eskiApiLogin? : string;
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

  gorevler?: Gorev[];  // Görevler alt menü içinde olmalı
}

export interface Gorev {
  id: number;
  isim: string;
  sebike?: string;
  iadeGorevi?: IadeGorevi;
  siradakiGorev?: NextGorev; // Sıradaki görev id'si
}
export interface IadeGorevi {
  id: number;
  isim: string;
  sebike?: string;
}

export interface NextGorev {
  id: number;
  isim: string;
  sebike?: string;
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