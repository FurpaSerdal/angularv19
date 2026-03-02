import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal, WritableSignal, computed, inject, effect } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environment';
import { AltMenu, Gorev, User } from '../models/user';
import { SetMenuHelperService } from './helper/setMenu-helper.service';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class MeService {
  private router = inject(Router);

  private apiUrl = environment.apiurl;

  public selectedMenu = signal<string>("")
  public selectedAltMenu = signal<AltMenu | null>(null);
  public selectedGorev = signal<Gorev | null>(null)
  public selectedrota = signal<string>("")
  


  // Kullanıcı bilgisini saklamak için bir signal tanımlıyoruz
  userSignal: WritableSignal<User | null> = signal<User | null>(null);

  // Yükleniyor state'i ekleyelim
  isLoading = signal<boolean>(false);


  constructor(private http: HttpClient, private setMenuHelper: SetMenuHelperService,) {

    this.rehydrate() // LocalStorage'dan state'i geri yükle
      effect(() => {
    const gorev = this.selectedGorev();
    const currentUrl = this.router.url;

    if (!gorev && currentUrl.includes('/admin/task')) {
      this.router.navigate(['/admin']);
    }
  });
  }

  // API çağrısını yapıp sonucu userSignal'e set eden metod
 fetchMe(): void {
  this.isLoading.set(true);

  this.http.get<User>(`${this.apiUrl}/kullanici/Benim`).subscribe({
    next: (data) => {
    this.setUser(data);
     //const updatedUser = this.setMenuHelper.getNewMenu(); // Menüleri güncelle
    // this.setUser(updatedUser[0]); // Güncellenmiş kullanıcıyı set et

      this.isLoading.set(false);

    },
    error: (error) => {
      console.error('Kullanıcı bilgisi alınırken hata oluştu:', error);
      this.isLoading.set(false);
    }
  });
}

  getUserSignal(): Signal<User | null> {
    return this.userSignal;
  }
  clearUserSignal(): void {
    this.userSignal.set(null);
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
    localStorage.setItem('menu', JSON.stringify(menu));  }

  setaltmenu(data:AltMenu){
  this.selectedAltMenu.set(data)
   this.selectedGorev.set(null)
   localStorage.setItem('altmenu', JSON.stringify(data));     

  }
  
  setgorev(data:Gorev){
  this.selectedGorev.set(data)
    localStorage.setItem('gorev', JSON.stringify(data));

  
  }
  setrota(data:string){
    this.selectedrota.set(data)
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



  
}