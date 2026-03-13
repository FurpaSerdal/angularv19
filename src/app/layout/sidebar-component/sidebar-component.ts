import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  computed,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import { AltMenu, Gorev, Menu } from '../../models/user';
import { RouterHelperService } from '../../services/helper/router-helper.service';
import { MeService } from '../../services/meservice.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  public userService = inject(MeService);
  private routerHelper = inject(RouterHelperService);
  private breakpoint = inject(BreakpointObserver);
  private destroyRef = inject(DestroyRef);
  private hostRef = inject(ElementRef<HTMLElement>);

  @Input() isCollapsed = false;
  @Input() mobileOpen = false;

  @Output() sidebarToggle = new EventEmitter<void>();
  @Output() mobileSidebarToggle = new EventEmitter<void>();
  @Output() closeMobile = new EventEmitter<void>();

  activeTaskId = signal<number | null>(null);
  activeAltMenuId = signal<number | null>(null);
  selectedSubTaskId = signal<number | null>(null);
  isMobile = signal<boolean>(false);

  constructor() {
    this.initResponsive();
  }

  private initResponsive() {
    this.breakpoint
      .observe([Breakpoints.Handset])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.isMobile.set(result.matches);
      });
  }

  onTaskClick(task: Menu): void {
    const isOpening = this.activeTaskId() !== task.id;

    this.activeTaskId.set(isOpening ? task.id : null);
    this.activeAltMenuId.set(null);
    this.selectedSubTaskId.set(null);

    if (isOpening) {
      this.userService.setMenu(task.isim);

      if (task.altMenuler?.length) {
        this.focusAndReveal(`[data-altmenu-id="${task.altMenuler[0].id}"]`);
      } else {
        this.focusAndReveal(`[data-task-id="${task.id}"]`);
      }

      return;
    }

    this.focusAndReveal(`[data-task-id="${task.id}"]`);
  }

  seciliAltMenu(altMenu: AltMenu): void {
    if (altMenu.gorevler?.length) {
      const isOpening = this.activeAltMenuId() !== altMenu.id;

      this.userService.setaltmenu(altMenu);
      this.activeAltMenuId.set(isOpening ? altMenu.id : null);
      this.selectedSubTaskId.set(null);

      if (isOpening && altMenu.gorevler.length) {
        this.focusAndReveal(`[data-gorev-id="${altMenu.gorevler[0].id}"]`);
      } else {
        this.focusAndReveal(`[data-altmenu-id="${altMenu.id}"]`);
      }

      return;
    }

    this.activeAltMenuId.set(null);
    this.selectedSubTaskId.set(altMenu.id);
    this.focusAndReveal(`[data-altmenu-id="${altMenu.id}"]`);
    this.routerHelper.navigateByGorev(altMenu);
    this.closeMobileSidebar();
  }

  seciligorev(gorev: Gorev): void {
    this.selectedSubTaskId.set(gorev.id);
    this.userService.setgorev(gorev);
    this.focusAndReveal(`[data-gorev-id="${gorev.id}"]`);
    this.routerHelper.navigateByGorev(gorev);
    this.closeMobileSidebar();
  }

  isActiveTask = (taskId: number) => computed(() => this.activeTaskId() === taskId);
  isActiveSubTask = (subId: number) => computed(() => this.selectedSubTaskId() === subId);

  getTaskIcon(task: Menu): string {
    const iconMap: Record<number, string> = {
      1: 'bi bi-truck',
      2: 'bi bi-box-seam',
      3: 'bi bi-arrow-left-right',
      4: 'bi bi-clipboard-check',
      5: 'bi bi-arrow-repeat',
      6: 'bi bi-cash-stack',
      7: 'bi bi-pie-chart'
    };

    return iconMap[task.id] ?? 'bi bi-grid-3x3-gap';
  }

  getTaskMeta(task: Menu): string {
    const altMenuCount = task.altMenuler?.length ?? 0;

    if (!altMenuCount) {
      return 'Dogrudan erisim';
    }

    return `${altMenuCount} modul`;
  }

  getUserInitials(): string {
    return (this.userService.userSignal()?.adSoyad ?? 'Kullanici')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }

  closeMobileSidebar(): void {
    if (this.isMobile()) {
      this.closeMobile.emit();
    }
  }

  onSidebarToggle() {
    this.sidebarToggle.emit();
  }

  onMobileClose() {
    this.mobileSidebarToggle.emit();
  }

  private focusAndReveal(selector: string): void {
    queueMicrotask(() => {
      requestAnimationFrame(() => {
        const target = this.hostRef.nativeElement.querySelector(selector) as HTMLElement | null;

        if (!target) {
          return;
        }

        target.focus({ preventScroll: true });
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      });
    });
  }
}

