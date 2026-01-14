import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal, WritableSignal, computed, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environment';
import { AltMenu, Gorev, User } from '../models/user';
import { SetMenuHelperService } from './helper/setMenu-helper.service';


@Injectable({
  providedIn: 'root'
})
export class MeService {
  private apiUrl = environment.apiurl;
  public selectedMenu = signal<string>("")
  public selectedAltMenu = signal<AltMenu | null>(null);
  public selectedGorev = signal<Gorev | null>(null)
  public depno: number = 0;


  // Kullanıcı bilgisini saklamak için bir signal tanımlıyoruz
  userSignal: WritableSignal<User | null> = signal<User | null>(null);

  // Yükleniyor state'i ekleyelim
  isLoading = signal<boolean>(false);

  constructor(private http: HttpClient) {
    // LocalStorage'dan kullanıcı bilgisini yükle

    // const storedGörevadi = localStorage.getItem('seçiliGörevadi');
    // if (storedGörevadi) {
    //   this.seçiliGörevadi.next(storedGörevadi); // Eğer varsa, stored değeri kullanıyoruz
    // }

    // const userStr = localStorage.getItem('user');
    // if (userStr) {
    //   const user = JSON.parse(userStr);
    //   this.userSignal.set(user);
    // }
    this.rehydrate() // LocalStorage'dan state'i geri yükle
  }

  // API çağrısını yapıp sonucu userSignal'e set eden metod
  fetchMe(): void {
    this.isLoading.set(true); // Yükleniyor başladı
    this.http.get<User>(`${this.apiUrl}/kullanici/Benim`).subscribe(
      (data) => {


        this.depno = Number(data.depoNo);
      //  localStorage.setItem('depoNo', this.depno.toString());
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

  

  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSignal.set(user);
  }


  setMenu(menu: string) {
    this.selectedMenu.set(menu); 
    this.selectedAltMenu.set(null)
    this.selectedGorev.set(null)
  //  localStorage.setItem('selectedMenu', this.selectedMenu());
  }

  setaltmenu(data:AltMenu){
  this.selectedAltMenu.set(data)
  this.selectedGorev.set(null)
  }
  
  setgorev(data:Gorev){
  this.selectedGorev.set(data)
  
  }
  private rehydrate() {
    const user = localStorage.getItem('user');
    const menu = localStorage.getItem('menu');
    const altmenu = localStorage.getItem('altmenu');
    const gorev = localStorage.getItem('gorev');

    if (user) this.userSignal.set(JSON.parse(user));
    if (menu) this.selectedMenu.set(JSON.parse(menu));
    if (altmenu) this.selectedAltMenu.set(JSON.parse(altmenu));
    if (gorev) this.selectedGorev.set(JSON.parse(gorev));
  }


    clearUser() {
    localStorage.removeItem('user');
    this.userSignal.set(null);
  }

}