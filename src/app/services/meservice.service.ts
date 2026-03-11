import { HttpClient } from '@angular/common/http';
import { computed,effect,inject,Injectable,Signal,signal,WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environment';
import { AltMenu,Gorev,User } from '../models/user';
import { SetMenuHelperService } from './helper/setMenu-helper.service';



@Injectable({
  providedIn: 'root'
})
export class MeService {
  private router = inject(Router);

  private apiUrl = environment.apiurl;

  private readonly USER_KEY = 'user';
  private readonly MENU_KEY = 'menu';
  private readonly ALTMENU_KEY = 'altmenu';
  private readonly GOREV_KEY = 'gorev';

  private get storage(): Storage {
    return sessionStorage;
  }

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

  clearSessionState(): void {
    this.userSignal.set(null);
    this.selectedMenu.set('');
    this.selectedAltMenu.set(null);
    this.selectedGorev.set(null);
    this.selectedrota.set('');

    this.storage.removeItem(this.USER_KEY);
    this.storage.removeItem(this.MENU_KEY);
    this.storage.removeItem(this.ALTMENU_KEY);
    this.storage.removeItem(this.GOREV_KEY);
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
    this.storage.setItem(this.USER_KEY, JSON.stringify(user));
    this.userSignal.set(user);
  }

  restoreUserSnapshot(user: User | null): void {
    if (!user) {
      this.userSignal.set(null);
      this.storage.removeItem(this.USER_KEY);
      return;
    }

    this.storage.setItem(this.USER_KEY, JSON.stringify(user));
    this.userSignal.set(user);
  }

  getUserSnapshot(): User | null {
    if (this.userSignal()) {
      return this.userSignal();
    }

    const user = this.storage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) as User : null;
  }


  setMenu(menu: string) {
    this.selectedMenu.set(menu); 
    this.selectedAltMenu.set(null)
    this.selectedGorev.set(null)
    this.storage.setItem(this.MENU_KEY, JSON.stringify(menu));
  }

  setaltmenu(data:AltMenu){
  this.selectedAltMenu.set(data)
   this.selectedGorev.set(null)
   this.storage.setItem(this.ALTMENU_KEY, JSON.stringify(data));     

  }
  
  setgorev(data:Gorev){
  this.selectedGorev.set(data)
    this.storage.setItem(this.GOREV_KEY, JSON.stringify(data));

  
  }
  setrota(data:string){
    this.selectedrota.set(data)
  }
  private rehydrate() {
    const user = this.storage.getItem(this.USER_KEY);
    const menu = this.storage.getItem(this.MENU_KEY);
    const altmenu = this.storage.getItem(this.ALTMENU_KEY);
    const gorev = this.storage.getItem(this.GOREV_KEY);

    if (user) this.userSignal.set(JSON.parse(user));
    if (menu) this.selectedMenu.set(JSON.parse(menu));
    if (altmenu) this.selectedAltMenu.set(JSON.parse(altmenu));
    if (gorev) this.selectedGorev.set(JSON.parse(gorev));
  }



  
}
