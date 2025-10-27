import { Component, Input, Output, EventEmitter, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Menu, AltMenu } from '../../../models/user';
import { UserService } from '../../../services/data.service';

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
    }
  }

  seciligorev(gorev: AltMenu): void {
    if (gorev.gorevler && gorev.gorevler.length > 0) {
      this.activeAltMenuId = this.activeAltMenuId === gorev.id ? null : gorev.id;
      return;
    }

    this.activeAltMenuId = null;
    this.selectedSubTaskId = gorev.id;
    this.userService.seçiligörev(gorev.id);
    this.userService.seçiliGörevAyarla(gorev.isim);
    
    this.router.navigate(['/admin', 'task', gorev.id]);
    this.closeMobileSidebar();
  }

  secilialtgorev(gorev: any): void {
    this.selectedSubTaskId = gorev.id;
    this.userService.seçiligörev(gorev.id);
    this.userService.seçiliGörevAyarla(gorev.gorevIsmi);
    
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