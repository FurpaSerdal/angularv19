import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { User } from '../../models/user';
import { RouterHelperService } from '../../services/helper/router-helper.service';
import { MeService } from '../../services/meservice.service';
import { HomePage } from './home-page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  const userSignal = signal<User | null>({
    adSoyad: 'Serdal Ozsoy',
    sube: 'CAMLlCA',
    subeNo: 109,
    menuler: [
      {
        id: 1,
        isim: 'Sevk Islemleri',
        altMenuler: [
          {
            id: 19,
            isim: 'Toptan Sevkler',
            gorevler: [
              {
                id: 26,
                isim: 'Alinan Siparisler',
                siradakiGorev: { id: 27, isim: 'Sevk Irsaliyeleri' },
              },
              {
                id: 27,
                isim: 'Sevk Irsaliyeleri',
                siradakiGorev: { id: 28, isim: 'Satis Faturalari' },
              },
            ],
          },
        ],
      },
    ],
  });

  const meServiceStub = {
    getUserSignal: () => userSignal,
    selectedGorev: signal<any>(null),
    selectedAltMenu: signal<any>(null),
    selectedMenu: signal(''),
    setMenu: jasmine.createSpy('setMenu'),
    setaltmenu: jasmine.createSpy('setaltmenu'),
    setgorev: jasmine.createSpy('setgorev'),
  };

  const routerHelperStub = {
    getRouteSegmentsByGorevId: (gorevId: number) => {
      const routeMap: Record<number, string[]> = {
        26: ['task', 'company', 'orders', 'sales'],
        27: ['task', 'company', 'shipments', 'outbound'],
        28: ['task', 'invoices', 'sales'],
      };

      return routeMap[gorevId] ?? null;
    },
    navigateByGorev: jasmine.createSpy('navigateByGorev'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        { provide: MeService, useValue: meServiceStub },
        { provide: RouterHelperService, useValue: routerHelperStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build shortcuts from available routes', () => {
    expect(component.shortcuts().length).toBeGreaterThan(0);
    expect(component.shortcuts()[0].title).toBe('Alinan Siparisler');
  });
});
