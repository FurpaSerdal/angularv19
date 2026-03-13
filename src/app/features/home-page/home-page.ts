import { Component, computed, inject, signal } from '@angular/core';

import { AltMenu, Gorev, Menu } from '../../models/user';
import { RouterHelperService } from '../../services/helper/router-helper.service';
import { MeService } from '../../services/meservice.service';

interface MenuTaskLink {
  menu: Menu;
  altMenu: AltMenu;
  gorev: Gorev;
}

interface ShortcutDefinition {
  title: string;
  description: string;
  gorevIds: number[];
}

interface HomeShortcut {
  title: string;
  description: string;
  task: MenuTaskLink | null;
}

interface FeedbackTaskGroup {
  suggestion: MenuTaskLink | null;
  complaint: MenuTaskLink | null;
}

type FeedbackType = 'oneri' | 'sikayet';

interface FeedbackStatus {
  kind: 'success' | 'error';
  message: string;
}

interface StoredFeedbackEntry {
  type: FeedbackType;
  message: string;
  createdAt: string;
  user: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css'],
})
export class HomePage {
  private readonly meService = inject(MeService);
  private readonly routerHelper = inject(RouterHelperService);
  private readonly feedbackStorageKey = 'home_page_feedback_entries_v1';

  readonly user = this.meService.getUserSignal();
  readonly selectedGorev = this.meService.selectedGorev;
  readonly selectedAltMenu = this.meService.selectedAltMenu;
  readonly selectedMenu = this.meService.selectedMenu;
  readonly feedbackType = signal<FeedbackType>('oneri');
  readonly feedbackMessage = signal('');
  readonly feedbackStatus = signal<FeedbackStatus | null>(null);

  private readonly suggestionKeywords = ['oneri', 'geri bildirim', 'feedback', 'talep'];
  private readonly complaintKeywords = ['sikayet', 'problem', 'hata', 'destek'];

  private readonly shortcutDefinitions: ShortcutDefinition[] = [
    { title: 'Firma sevkler giden', description: 'Firma outbound sevk ekranini ac', gorevIds: [27] },
    { title: 'Firma sevkler gelen', description: 'Firma inbound sevk ekranini ac', gorevIds: [33] },
    { title: 'Depo sevkler giden', description: 'Depo outbound sevk ekranini ac', gorevIds: [ 40] },
    { title: 'Depo sevkler gelen', description: 'Depo inbound sevk ekranini ac', gorevIds: [42] },
    { title: 'Firma siparisler Alınan (satış)', description: 'Alinan siparis ekranini ac', gorevIds: [26,] },
    { title: 'Firma siparisler verilen (satin alma)', description: 'Verilen siparis ekranini ac', gorevIds: [32] },
    { title: 'Depo siparisler Alınan (satış)', description: 'Alinan depo siparislerini ac', gorevIds: [ 39] },
    { title: 'Depo siparisler verilen (satin alma)', description: 'Verilen depo siparislerini ac', gorevIds: [41] },
    { title: 'Firma faturalar', description: 'Firma fatura ekranini ac', gorevIds: [55] },
    { title: 'Sayim sonuclari', description: 'Stok sayim sonuclarini ac', gorevIds: [23] },
    { title: 'Stok cikis', description: 'Stok cikis islemlerini ac', gorevIds: [16] },
    { title: 'Virman cikis', description: 'Virman cikis ekranini ac', gorevIds: [15] },
    { title: 'Satis faturalari', description: 'Satis faturalari ekranini ac', gorevIds: [ 55] },
    { title: 'Alis faturalari', description: 'Alis faturalari ekranini ac', gorevIds: [34] },
  ];

  readonly greeting = computed(() => {
    const user = this.user();
    return user ? `${user.adSoyad} / ${user.sube}` : 'Operasyon merkezi';
  });

  readonly taskLinks = computed<MenuTaskLink[]>(() => {
    const user = this.user();

    if (!user?.menuler?.length) {
      return [];
    }

    return user.menuler.flatMap((menu) =>
      (menu.altMenuler ?? []).flatMap((altMenu) =>
        (altMenu.gorevler ?? [])
          .filter((gorev) => this.routerHelper.getRouteSegmentsByGorevId(gorev.id))
          .map((gorev) => ({ menu, altMenu, gorev }))
      )
    );
  });

  readonly selectedTaskLink = computed<MenuTaskLink | null>(() => {
    const gorev = this.selectedGorev();
    const altMenu = this.selectedAltMenu();
    const menuName = this.selectedMenu();

    if (!gorev || !altMenu || !menuName) {
      return null;
    }

    const menu = this.user()
      ?.menuler
      ?.find((item) => item.isim === menuName && item.altMenuler?.some((sub) => sub.id === altMenu.id));

    return menu ? { menu, altMenu, gorev } : null;
  });

  readonly shortcuts = computed<HomeShortcut[]>(() =>
    this.shortcutDefinitions
      .map((item) => ({
        title: item.title,
        description: item.description,
        task: this.findTaskByIds(item.gorevIds),
      }))
      .filter((item) => item.task)
  );

  readonly feedbackTasks = computed<FeedbackTaskGroup>(() => {
    const tasks = this.taskLinks();

    const suggestion = tasks.find((task) => this.isTaskMatch(task, this.suggestionKeywords)) ?? null;
    const complaint = tasks.find((task) => this.isTaskMatch(task, this.complaintKeywords)) ?? null;

    return { suggestion, complaint };
  });

  readonly hasFeedbackTasks = computed<boolean>(() => {
    const tasks = this.feedbackTasks();
    return !!(tasks.suggestion || tasks.complaint);
  });

  readonly feedbackMessageLength = computed<number>(() => this.feedbackMessage().length);

  openTask(taskLink: MenuTaskLink | null): void {
    if (!taskLink) {
      return;
    }

    this.meService.setMenu(taskLink.menu.isim);
    this.meService.setaltmenu(taskLink.altMenu);
    this.meService.setgorev(taskLink.gorev);
    this.routerHelper.navigateByGorev(taskLink.gorev);
  }

  setFeedbackType(type: FeedbackType): void {
    this.feedbackType.set(type);
    this.feedbackStatus.set(null);
  }

  onFeedbackMessageInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement | null;
    this.feedbackMessage.set(target?.value ?? '');
    this.feedbackStatus.set(null);
  }

  submitFeedback(): void {
    const message = this.feedbackMessage().trim();

    if (message.length < 5) {
      this.feedbackStatus.set({
        kind: 'error',
        message: 'Mesaj en az 5 karakter olmali.',
      });
      return;
    }

    const user = this.user();
    const entry: StoredFeedbackEntry = {
      type: this.feedbackType(),
      message,
      createdAt: new Date().toISOString(),
      user: user?.adSoyad ?? 'Bilinmeyen kullanici',
    };

    const saved = this.readStoredFeedback();
    saved.unshift(entry);
    const capped = saved.slice(0, 50);

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(this.feedbackStorageKey, JSON.stringify(capped));
    }

    this.feedbackMessage.set('');
    this.feedbackStatus.set({
      kind: 'success',
      message: 'Geri bildirimin kaydedildi. (API baglantisi yok, sadece yerel kayit yapildi.)',
    });
  }

  private findTaskByIds(gorevIds: number[]): MenuTaskLink | null {
    for (const gorevId of gorevIds) {
      const match = this.taskLinks().find((task) => task.gorev.id === gorevId);
      if (match) {
        return match;
      }
    }

    return null;
  }

  private isTaskMatch(task: MenuTaskLink, keywords: string[]): boolean {
    const text = this.normalizeText(`${task.menu.isim} ${task.altMenu.isim} ${task.gorev.isim}`);
    return keywords.some((keyword) => text.includes(keyword));
  }

  private normalizeText(value: string): string {
    return value
      .toLocaleLowerCase('tr-TR')
      .replace(/[ç]/g, 'c')
      .replace(/[ğ]/g, 'g')
      .replace(/[ı]/g, 'i')
      .replace(/[ö]/g, 'o')
      .replace(/[ş]/g, 's')
      .replace(/[ü]/g, 'u');
  }

  private readStoredFeedback(): StoredFeedbackEntry[] {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const raw = window.sessionStorage.getItem(this.feedbackStorageKey);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as StoredFeedbackEntry[]) : [];
    } catch {
      return [];
    }
  }
}

