import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal, WritableSignal, computed } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiurl;
  public selectedMenu: string = '';
  public depno: number = 0;
  
  // Kullanıcı bilgisini saklamak için bir signal tanımlıyoruz
  userSignal: WritableSignal<User | null> = signal<User | null>(null);
  
  // Yükleniyor state'i ekleyelim
  isLoading = signal<boolean>(false);

  constructor(private http: HttpClient) {
    // LocalStorage'dan kullanıcı bilgisini yükle
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.userSignal.set(user);
    }
  }

  // API çağrısını yapıp sonucu userSignal'e set eden metod
  fetchMe(): void {
    this.isLoading.set(true); // Yükleniyor başladı
    this.http.get<User>(`${this.apiUrl}/kullanici/Benim`).subscribe(
      (data) => {
        this.depno = Number(data.depoNo); 
        localStorage.setItem('depoNo', this.depno.toString());
        this.userSignal.set(data);
        this.setUser(data);
        this.isLoading.set(false); // Yükleniyor bitti
      },
      (error) => {
        console.error('Kullanıcı bilgisi alınırken hata oluştu:', error);
        this.isLoading.set(false); // Hata durumunda da yükleniyor bitti
      }
    );
  }

  getUserSignal(): Signal<User | null> {
    return this.userSignal;
  }

  // User menülerini almak için computed property
  userTasks = computed(() => {
    return this.userSignal()?.menuler || [];
  });

  // Kullanıcı verisi yüklendi mi kontrolü
  isUserDataLoaded = computed(() => {
    return this.userSignal() !== null && !this.isLoading();
  });

  // Seçili görev yönetimi
  private SeçiliGörev = new BehaviorSubject<number>(this.loadSelectedTask() || 0);
  SeçiliGörevid$ = this.SeçiliGörev.asObservable();

  seçiligörev(gorevId: number): void {
    this.SeçiliGörev.next(gorevId);
    localStorage.setItem('seçiliGörevid', gorevId.toString());
  }

  private loadSelectedTask(): number | null {
    const savedTaskId = localStorage.getItem('seçiliGörevid');
    return savedTaskId ? parseInt(savedTaskId, 10) : null;
  }

  private seçiliGörevadi = new BehaviorSubject<string>("");
  selectedGörevadi$ = this.seçiliGörevadi.asObservable();

  seçiliGörevAyarla(gorevadi: string): void {
    if (gorevadi === '') {
      localStorage.removeItem('seçiliGörevadi');
    } else {
      this.seçiliGörevadi.next(gorevadi);
      localStorage.setItem('seçiliGörevadi', gorevadi);
    }
  }

  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSignal.set(user);
  }

  clearUser() {
    localStorage.removeItem('user');
    this.userSignal.set(null);
  }

  setMenu(menu: string) {
    this.selectedMenu = menu;
    console.log('Seçili menü:', this.selectedMenu);
    localStorage.setItem('selectedMenu', this.selectedMenu);
  }
}