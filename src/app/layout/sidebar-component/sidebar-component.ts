import { Component, Input, Output, EventEmitter, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/data.service';
import { AltMenu, Gorev, Menu } from '../../models/user';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-component.html'
})
export class SidebarComponent implements OnInit {
  @Input() isCollapsed: boolean = false;
  @Input() mobileOpen: boolean = false;
  @Output() sidebarToggle = new EventEmitter<void>();
  @Output() mobileSidebarToggle = new EventEmitter<void>();
  @Output() closeMobile = new EventEmitter<void>();

  activeTaskId: number = 0;
  activeAltMenuId: number | null = null;
  selectedSubTaskId: number = 0;
  isMobile = false;

  constructor(
    public userService: UserService, // UserService inject
    private router: Router
  ) {
    this.checkMobile();
  }

  ngOnInit() {
    // Data is automatically handled by the service
  }

  @HostListener('window:resize')
  onResize() {
    this.checkMobile();
  }

  private checkMobile() {
    this.isMobile = window.innerWidth < 992;
  }

  onTaskClick(task: Menu): void {
    const specialNavigations: Record<string, string> = {
      'Sayim Girişi ve Döküm': '/admin/sayim',
      'Fatura Gönderim': '/admin/fatura',
      'E-Fatura': '/admin/e-fatura'
    };

    if (specialNavigations[task.isim]) {
      this.router.navigate([specialNavigations[task.isim]]);
      this.closeMobileSidebar();
      return;
    }

    this.activeTaskId = this.activeTaskId === task.id ? 0 : task.id;
    
    if (this.activeTaskId === task.id && task.id) {
      this.userService.setMenu(task.isim);
       localStorage.setItem('menu', JSON.stringify(task.isim));
    }
  }
  
seciligorev(gorev: AltMenu): void {
  // Eğer alt menünün görevleri varsa, sadece aç/kapa yap
if (gorev.evraklar && 
    (gorev.evraklar.birinciAdimEvraki != null ||
     gorev.evraklar.ikinciAdimEvraki != null ||
     gorev.evraklar.ucuncuAdimEvraki != null)) {
      
     this.userService.setaltmenu(gorev)
      localStorage.setItem('altmenu', JSON.stringify(gorev));

  this.activeAltMenuId =  this.activeAltMenuId === gorev.id ? null : gorev.id;

}else {
    // Eğer alt menünün görevleri yoksa, doğrudan navigasyon yap
    this.activeAltMenuId = null;
    this.selectedSubTaskId = gorev.id;
    // this.userService.seçiligörev(gorev.id);
    // this.userService.seçiliGörevAyarla(gorev.isim);
    
    this.router.navigate(['/admin', 'task', gorev.id]);
    this.closeMobileSidebar();
  }
}
secilialtgorev(gorev: Gorev): void {
    this.selectedSubTaskId = gorev.id;

    // this.userService.seçiligörev(gorev.id);
    // this.userService.seçiliGörevAyarla(gorev.isim); // gorevIsmi -> isim
    this.userService.setgorev(gorev)
     localStorage.setItem('gorev', JSON.stringify(gorev));
    
    this.router.navigate(['/admin', 'task', gorev.id]);
    this.closeMobileSidebar();
}

  isActiveTask(taskId: number): boolean {
    return this.activeTaskId === taskId;
  }

  isActiveSubTask(subTaskId: number): boolean {
    return this.selectedSubTaskId === subTaskId;
  }

  getTaskIcon(task: Menu): string {
    const taskIconMap: Record<string, string> = {
      "Sevk İşlemleri": "bi-truck",
      "Tedarik İşlemleri": "bi-cart",
      "Sayim Girişi ve Döküm": "bi-clipboard-data",
      "Fatura Gönderim": "bi-receipt",
      "E-Fatura": "bi-receipt-cutoff",
      "Diğer Giriş İşlemleri": "bi-box-arrow-in-right",
      "Raporlar": "bi-graph-up",
      "Virman ve Devir İşlemleri": "bi-arrow-left-right"
    };
    return taskIconMap[task.isim] || 'bi-question-circle';
  }

  closeMobileSidebar(): void {
    if (this.isMobile) {
      this.closeMobile.emit();
    }
  }

  onSidebarToggle() {
    this.sidebarToggle.emit();
  }

  onMobileClose() {
    this.mobileSidebarToggle.emit();
  }

}