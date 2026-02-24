import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  inject,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { AltMenu, Gorev, Menu } from '../../models/user';
import { MeService } from '../../services/meservice.service';
import { RouterHelperService } from '../../services/helper/router-helper.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {

  public userService = inject(MeService);
  private routerHelper = inject(RouterHelperService);
  private breakpoint = inject(BreakpointObserver);

  // INPUTS
  @Input() isCollapsed = false;
  @Input() mobileOpen = false;

  // OUTPUTS
  @Output() sidebarToggle = new EventEmitter<void>();
  @Output() mobileSidebarToggle = new EventEmitter<void>();
  @Output() closeMobile = new EventEmitter<void>();

  // LOCAL SIGNAL STATE
  activeTaskId = signal<number | null>(null);
  activeAltMenuId = signal<number | null>(null);
  selectedSubTaskId = signal<number | null>(null);

  // MOBILE SIGNAL
  isMobile = signal<boolean>(false);

  constructor() {
    this.initResponsive();

  }

  // --------------------------
  // RESPONSIVE (CDK VERSION)
  // --------------------------

  private initResponsive() {
    this.breakpoint.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile.set(result.matches);
      });
  }

  // --------------------------
  // TASK CLICK
  // --------------------------

  onTaskClick(task: Menu): void {
    const isOpening = this.activeTaskId() !== task.id;

    this.activeTaskId.set(isOpening ? task.id : null);
    this.activeAltMenuId.set(null);
    this.selectedSubTaskId.set(null);

    if (isOpening) {
      this.userService.setMenu(task.isim);
    }
  }

  // --------------------------
  // ALT MENU CLICK
  // --------------------------

  seciliAltMenu(altMenu: AltMenu): void {

    if (altMenu.gorevler?.length) {
      const isOpening = this.activeAltMenuId() !== altMenu.id;

      this.userService.setaltmenu(altMenu);
      this.activeAltMenuId.set(isOpening ? altMenu.id : null);
      this.selectedSubTaskId.set(null);

      return;
    }

    // Terminal node
    this.activeAltMenuId.set(null);
    this.selectedSubTaskId.set(altMenu.id);
    this.routerHelper.navigateByGorev(altMenu);


    this.closeMobileSidebar();
  }

  // --------------------------
  // GOREV CLICK
  // --------------------------

  seciligorev(gorev: Gorev): void {

    this.selectedSubTaskId.set(gorev.id);

    this.userService.setgorev(gorev);

    this.routerHelper.navigateByGorev(gorev);

    this.closeMobileSidebar();
  }

  // --------------------------
  // HELPERS
  // --------------------------

  isActiveTask = (taskId: number) =>
    computed(() => this.activeTaskId() === taskId);

  isActiveSubTask = (subId: number) =>
    computed(() => this.selectedSubTaskId() === subId);



  getTaskIcon(task: Menu): string {
    return  'bi-question-circle';
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
}
