export interface User {
  ad: string;
  depoNo: string;
  menuler: Menu[];
}

export interface Menu {
  id: number;
  isim: string;
  altMenuler?: AltMenu[];
}

export interface AltMenu {
  id: number;
  isim: string;
  gorevler?: Gorev[];
}

export interface Gorev {
  id: number;
  gorevIsmi: string;
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
