import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { fromEvent } from 'rxjs';
import { auditTime } from 'rxjs/operators';

import { AltMenu, Gorev, Menu } from '../../models/user';
import { MeService } from '../../services/meservice.service';
import { RouterHelperService } from '../../services/helper/router-helper.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
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
    public userService: MeService, // MeService inject
    private routerHelperService: RouterHelperService,
    private router: Router,
    private destroyRef: DestroyRef
  ) {
    this.checkMobile();
    this.initResizeWatcher();
  }

  ngOnInit() {
    // Data is automatically handled by the service
  }

  private checkMobile() {
    this.isMobile = window.innerWidth < 992;
  }

  private initResizeWatcher() {
    fromEvent(window, 'resize')
      .pipe(auditTime(150), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.checkMobile());
  }

  onTaskClick(task: Menu): void {

    this.activeTaskId = this.activeTaskId === task.id ? 0 : task.id;
    
    if (this.activeTaskId === task.id && task.id) {
      this.userService.setMenu(task.isim);
       localStorage.setItem('menu', JSON.stringify(task.isim));
    }
  }
  
seciliAltMenu(altMenu: AltMenu): void {
  // Eğer alt menünün görevleri varsa, sadece aç/kapa yap
if (altMenu.evrakMenuleri && 
    altMenu.evrakMenuleri.length > 0) {
      
     this.userService.setaltmenu(altMenu)
      localStorage.setItem('altmenu', JSON.stringify(altMenu));     
      this.activeAltMenuId =  this.activeAltMenuId === altMenu.id ? null : altMenu.id;

}
else {
    // Eğer alt menünün görevleri yoksa, doğrudan navigasyon yap
    this.activeAltMenuId = null;
    this.selectedSubTaskId = altMenu.id;
    // this.userService.seçiligörev(altMenu.id);
    // this.userService.seçiliGörevAyarla(altMenu.isim);

    this.router.navigate(['/admin', 'task', altMenu.id]);
    this.closeMobileSidebar();
  }
}
seciligorev(gorev: Gorev): void {
  this.selectedSubTaskId = gorev.kimlik;

  this.userService.setgorev(gorev);
  localStorage.setItem('gorev', JSON.stringify(gorev));

  // RouterHelper üzerinden yönlendirme
const altMenu = this.userService.selectedAltMenu();
if (altMenu) {
  this.routerHelperService.navigateByGorev( gorev);
}
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