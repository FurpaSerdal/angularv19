import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyGoodsReceipt } from './company-goods-receipt';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MeService } from '../../../../../services/meservice.service';
import { GoodsReceiptNotesService } from '../../../../../services/receipts/goods-receipt-notes.service';
import { SalesOrdersService } from '../../../../../services/orders/sales-orders.service';
import { ShipmentNotesService } from '../../../../../services/shipments/shipment-notes.service';
import { WarehouseService } from '../../../../../services/warehouse.service';
import { CompanyService } from '../../../../../services/company.service';
import { of, throwError } from 'rxjs';
import { signal, provideZoneChangeDetection } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StokAraCT, CariHesapAraCT } from '../../../../../models/ortakModeller';

describe('CompanyGoodsReceipt', () => {
  let component: CompanyGoodsReceipt;
  let fixture: ComponentFixture<CompanyGoodsReceipt>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<CompanyGoodsReceipt>>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockToastr: jasmine.SpyObj<ToastrService>;
  let mockMeService: jasmine.SpyObj<MeService>;
  let mockGoodsReceiptService: jasmine.SpyObj<GoodsReceiptNotesService>;
  let mockSalesOrdersService: jasmine.SpyObj<SalesOrdersService>;
  let mockShipmentService: jasmine.SpyObj<ShipmentNotesService>;
  let mockWarehouseService: jasmine.SpyObj<WarehouseService>;
  let mockCompanyService: jasmine.SpyObj<CompanyService>;

  const mockData = {
    shipment: {
      siparis: {
        id: 'test-id-123',
        muhatapFirma: { no: '12345' },
        kalemler: [
          {
            siparisGuid: 'item-1',
            siparisMiktari: 10,
            sevkMiktari: 8,
            stok: {
              stokKod: 'PROD001',
              stokIsim: 'Test Ürün 1',
              birimAd: 'Adet',
              barkodlar: [{ barKodu: '1234567890', birimKatSayisi: 1 }],
              fiyat: { fiyati: 100 }
            }
          }
        ]
      }
    },
    iadeGorevId: 5
  };

  beforeEach(async () => {
    // Create spies
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'error', 'warning', 'info', 'show', 'clear']);
    mockMeService = jasmine.createSpyObj('MeService', [], {
      selectedAltMenu: signal({ id: 1, ad: 'Test Menu' })
    });
    mockGoodsReceiptService = jasmine.createSpyObj('GoodsReceiptNotesService', [
      'detailsBranchReceipt',
      'createCompanyReceipt'
    ]);
    mockSalesOrdersService = jasmine.createSpyObj('SalesOrdersService', ['createBranchOrder']);
    mockShipmentService = jasmine.createSpyObj('ShipmentNotesService', ['createCompanyShipment']);
    mockWarehouseService = jasmine.createSpyObj('WarehouseService', ['searchStock']);
    mockCompanyService = jasmine.createSpyObj('CompanyService', [
      'searchStockByCustomerCode',
      'searchCustomerAccount'
    ]);

    // Setup default return values
    mockToastr.show.and.returnValue({ toastId: 1 } as any);
    mockDialog.open.and.returnValue({ afterClosed: () => of(true) } as any);

    await TestBed.configureTestingModule({
      imports: [CompanyGoodsReceipt, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: ToastrService, useValue: mockToastr },
        { provide: MeService, useValue: mockMeService },
        { provide: GoodsReceiptNotesService, useValue: mockGoodsReceiptService },
        { provide: SalesOrdersService, useValue: mockSalesOrdersService },
        { provide: ShipmentNotesService, useValue: mockShipmentService },
        { provide: WarehouseService, useValue: mockWarehouseService },
        { provide: CompanyService, useValue: mockCompanyService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyGoodsReceipt);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct default signal values', () => {
      expect(component.gonderiliyor()).toBeFalse();
      expect(component.qrOkunuyor()).toBeFalse();
      expect(component.qrParsed()).toBeFalse();
      expect(component.bulunancariler()).toEqual([]);
      expect(component.bulunanUrunler()).toEqual([]);
      expect(component.urunListesi()).toEqual([]);
    });

    it('should set altmenu from MeService on initialization', () => {
      fixture.detectChanges();
      expect(component.altmenu()).toBe(1);
    });

    it('should process shipment data on ngOnInit', () => {
      fixture.detectChanges();
      expect(component.evrakdetay()).toBeTruthy();
      expect(component.urunListesi().length).toBeGreaterThan(0);
    });
  });

  describe('Data Mapping', () => {
    it('should map shipment data correctly in tabloMapForReturn', () => {
      
      const result = component.urunListesi();
      expect(result.length).toBe(1);
      expect(result[0].UrunKodu).toBe('PROD001');
      expect(result[0].UrunAdi).toBe('Test Ürün 1');
      expect(result[0].sevkmiktari).toBe(8);
      expect(result[0].fark).toBe(-8); // MalKabul(0) - sevk(8)
    });

    it('should handle null data gracefully in tabloMapForReturn', () => {
      component.tabloMapForReturn(null);
      expect(component.urunListesi()).toEqual([]);
    });

    it('should update dataSource when urunListesi changes', () => {
      expect(component.dataSource.data.length).toBe(1);
    });
  });

  describe('Barcode Operations', () => {
    it('should fetch shipment by barcode successfully', () => {
      const mockResponse = {
        firmaNo: 123,
        malKabulIrsaliyesi: {
          malKabul: {
            kalemler: []
          }
        }
      };
      mockGoodsReceiptService.detailsBranchReceipt.and.returnValue(of(mockResponse));

      component.barkodOku('1234567890');

      expect(mockGoodsReceiptService.detailsBranchReceipt).toHaveBeenCalledWith(
        component.altmenu(),
        '1234567890',
        5
      );
      expect(component.firmaNo()).toBe(123);
    });

    it('should show error when barcode search fails', () => {
      mockGoodsReceiptService.detailsBranchReceipt.and.returnValue(
        throwError(() => new Error('Barcode not found'))
      );

      component.barkodOku('invalid-barcode');

      expect(mockToastr.error).toHaveBeenCalledWith(
        'Barkod ile sevk bulunamadı',
        'Hata'
      );
    });
  });

 

  describe('Product Management', () => {
    beforeEach(() => {
      component.secilenUrun.set({
        stokKod: 'PROD003',
        stokIsim: 'New Product',
        barKodu: '111222333',
        fiyati: 200,
        birimKatsayisi: 2,
        birimAd: 'Kutu'
      } as any);
    });

    it('should add new product to list', () => {
      const initialLength = component.urunListesi().length;
      component.urunEkle();
      
      expect(component.urunListesi().length).toBe(initialLength + 1);
      const addedProduct = component.urunListesi()[initialLength];
      expect(addedProduct.UrunKodu).toBe('PROD003');
      expect(addedProduct.MalKabulMiktari).toBe(1);
    });

    it('should increment quantity if product already exists', () => {
      component.urunListesi.set([{
        UrunKodu: 'PROD003',
        UrunAdi: 'New Product',
        MalKabulMiktari: 5
      }]);

      component.urunEkle();

      const updatedProduct = component.urunListesi().find(p => p.UrunKodu === 'PROD003');
      expect(updatedProduct.MalKabulMiktari).toBe(6);
    });

    it('should not add product if none selected', () => {
      component.secilenUrun.set(null);
      const initialLength = component.urunListesi().length;
      
      component.urunEkle();
      
      expect(component.urunListesi().length).toBe(initialLength);
    });

    it('should remove product from list', () => {
      component.urunListesi.set([
        { UrunKodu: 'PROD001', MalKabulMiktari: 1 },
        { UrunKodu: 'PROD002', MalKabulMiktari: 2 }
      ]);

      component.urunSil(0);

      expect(component.urunListesi().length).toBe(1);
      expect(component.urunListesi()[0].UrunKodu).toBe('PROD002');
    });
  });

  describe('Save Operation', () => {
    beforeEach(() => {
      component.urunListesi.set([
        {
          UrunKodu: 'PROD001',
          UrunAdi: 'Test Product',
          MalKabulMiktari: 10,
          sevkmiktari: 8,
          fark: 2,
          siparisMiktari: 10,
          sto_birim_ad: 'Adet'
        }
      ]);
    });

    it('should save receipt successfully', () => {
      mockGoodsReceiptService.createCompanyReceipt.and.returnValue(of({}));
      
      component.kaydet();

      expect(mockToastr.show).toHaveBeenCalledWith(
        'Gönderiliyor...',
        '',
        jasmine.any(Object)
      );
      expect(mockGoodsReceiptService.createCompanyReceipt).toHaveBeenCalled();
    });

    it('should handle save error', () => {
      mockGoodsReceiptService.createCompanyReceipt.and.returnValue(
        throwError(() => new Error('Save failed'))
      );

      component.kaydet();

      expect(mockToastr.error).toHaveBeenCalledWith(
        'Mal kabul kaydedilirken hata oluştu',
        'Hata'
      );
    });

    it('should set loading state during save', () => {
      mockGoodsReceiptService.createCompanyReceipt.and.returnValue(of({}));
      
      expect(component.gonderiliyor()).toBeFalse();
      component.kaydet();
      expect(component.gonderiliyor()).toBeTrue();
    });
  });

  describe('Difference Analysis', () => {
    it('should identify positive differences', () => {
      const kalemler = [
        { sevkMalKabulFarkMiktari: 5 },
        { sevkMalKabulFarkMiktari: -2 },
        { sevkMalKabulFarkMiktari: 3 }
      ] as any;

      const result = (component as any).analyzeDifferences(kalemler);

      expect(result.pozitifler.length).toBe(2);
      expect(result.negatifler.length).toBe(1);
    });

    it('should warn for positive differences', () => {
      const pozitifler = [{ sevkMalKabulFarkMiktari: 5 }] as any;
      
      (component as any).warnIfPositiveDifference(pozitifler);

      expect(mockToastr.warning).toHaveBeenCalledWith(
        'Mal kabul miktarı sevk miktarından fazla olan kalemler var',
        'Uyarı'
      );
    });

    it('should not warn if no positive differences', () => {
      (component as any).warnIfPositiveDifference([]);
      expect(mockToastr.warning).not.toHaveBeenCalled();
    });
  });

  describe('QR Code Operations', () => {
    it('should start QR reading mode', () => {
      component.qrOkumayaBasla();

      expect(component.qrOkunuyor()).toBeTrue();
      expect(mockToastr.info).toHaveBeenCalledWith(
        'QR kodu okutmak için hazır',
        'QR Okuma',
        { timeOut: 2000 }
      );
    });

    it('should stop QR reading mode', () => {
      component.qrOkunuyor.set(true);
      component.qrOkumayiDurdur();

      expect(component.qrOkunuyor()).toBeFalse();
    });

    it('should parse QR data with standard format', () => {
      const result = (component as any).parseIrsaliyeNo('ABC123456');

      expect(result.success).toBeTrue();
      expect(result.seri).toBe('ABC');
      expect(result.sira).toBe('123456');
    });

    it('should handle numeric-only irsaliye number', () => {
      const result = (component as any).parseIrsaliyeNo('123456');

      expect(result.success).toBeTrue();
      expect(result.seri).toBeNull();
      expect(result.sira).toBe('123456');
    });
  });

  describe('Form Operations', () => {
    it('should clear form data', () => {
      component.urunListesi.set([{ UrunKodu: 'PROD001' }]);
      component.bulunanUrunler.set([{ stokKod: 'PROD002' } as any]);

      component.temizle();

      expect(component.urunListesi()).toEqual([]);
      expect(component.bulunanUrunler()).toEqual([]);
      expect(component.dataSource.data.length).toBe(0);
      expect(mockToastr.info).toHaveBeenCalled();
    });

    it('should update difference when quantity changes', () => {
      const element = {
        sevkmiktari: 10,
        MalKabulMiktari: 8,
        fark: 0
      };

      component.onMalKabulChange(element);

      expect(element.fark).toBe(-2);
    });
  });

  describe('Company Search', () => {
    it('should search for company by code', () => {
      const mockCompanies: CariHesapAraCT[] = [
        { cariKod: '12345', cariUnvan: 'Test Company', vergiKimlikNo: '1234567890' }
      ];
      mockCompanyService.searchCustomerAccount.and.returnValue(of(mockCompanies));

      component.firmaAra();

      expect(mockCompanyService.searchCustomerAccount).toHaveBeenCalledWith('12345');
      expect(component.bulunancariler()).toEqual(mockCompanies);
    });

    it('should select company', () => {
      const firma: any = { id: 1, cariKod: '12345' };
      
      component.firmaSec(firma);

      expect(component.secilencari()).toBe(1);
      expect(component.firmaNo()).toBe(1);
      expect(component.bulunancariler()).toEqual([]);
    });
  });

  describe('Dialog Close', () => {
    it('should close dialog', () => {
      component.kapat();
      expect(mockDialogRef.close).toHaveBeenCalled();
    });
  });
});
