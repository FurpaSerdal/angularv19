import { Component, OnInit, signal, computed, ViewChild, inject, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Material imports
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';

// Servisler
import { UserService } from '../../../services/data.service';

// 🎯 TİP TANIMLAMALARI
export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'date' | 'number' | 'status' | 'currency' | 'badge';
  sortable?: boolean;
  width?: string;
  format?: string;
}

export interface TableConfig {
  columns: TableColumn[];
  actions?: {
    view?: boolean;
    edit?: boolean;
    delete?: boolean;
    download?: boolean;
    custom?: { 
      label: string; 
      icon: string; 
      action: string; 
      color?: 'primary' | 'accent' | 'warn' | 'success';
    }[];
  };
  features?: {
    dateFilter?: boolean;
    search?: boolean;
    selection?: boolean;
    pagination?: boolean;
    createButton?: boolean;
    exportButton?: boolean;
  };
  pageSize?: number;
  pageSizeOptions?: number[];
}

export interface TableActionEvent {
  action: string;
  row: any;
  selectedRows?: any[];
}

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    // Material modülleri
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatChipsModule
  ],
  providers: [DatePipe],
  templateUrl: './dynamic-table.html',
  styleUrls: ['./dynamic-table.css']
})
export class DynamicTableComponent implements OnInit, OnDestroy {
  // 🔧 DEPENDENCY INJECTION
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private datePipe = inject(DatePipe);
  private destroy$ = new Subject<void>();

  // 📊 VIEW CHILDREN
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // 🎯 STATE MANAGEMENT - SIGNALS
  taskId = signal<string>('');
  isLoading = signal(false);
  taskTitle = signal('Genel İşlemler');
  dataSource = new MatTableDataSource<any>([]);
  selectedRows = new Set<any>();
  
  // 📅 FILTER FORM
  filterForm = new FormGroup({
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
    searchTerm: new FormControl('')
  });

  // ⚙️ DYNAMIC CONFIGURATION
  tableConfig = signal<TableConfig>(this.getDefaultConfig());
  
  // 🎨 COMPUTED PROPERTIES
  displayedColumns = computed(() => {
    const cols = this.tableConfig().columns.map(col => col.key);
    
    // Checkbox sütunu ekle
    if (this.tableConfig().features?.selection) {
      cols.unshift('select');
    }
    
    // Actions sütunu ekle
    if (this.hasActions()) {
      cols.push('actions');
    }
    
    return cols;
  });

  selectedCount = computed(() => this.selectedRows.size);
  hasSelections = computed(() => this.selectedCount() > 0);
  isEmpty = computed(() => !this.isLoading() && this.dataSource.data.length === 0);

  // 🗂️ TASK CONFIGURATIONS - Merkezi yapılandırma
  private readonly taskConfigurations: Map<string, TableConfig> = new Map([
    ['11', this.createShipmentConfig()],
    ['21', this.createOrderConfig()],
    ['31', this.createMaterialAcceptanceConfig()], // YENİ: Depo Mal Kabul

  ]);

private readonly taskTitles: Map<string, string> = new Map([
  ['11', '📦 Sevk Emri Yönetimi'],
  ['12', '🚚 Sevk Takip İşlemleri'], 
  ['21', '🛒 Sipariş Yönetimi'],
  ['41', '🧾 Fatura İşlemleri'],
  ['31', '🏬 Depo Mal Kabul'], // YENİ: Depo Mal Kabul
]);

  // 🏁 LIFECYCLE METHODS
  ngOnInit() {
    this.initializeComponent();
    this.setupFilterListeners();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // 🔧 PRIVATE METHODS
  private initializeComponent(): void {
    // Route parametrelerini dinle
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const taskId = params.get('id');
        if (taskId) {
          this.taskId.set(taskId);
          this.configureTask();
          this.loadData();
        }
      });
  }

  private setupFilterListeners(): void {
    // Arama filtresi
    this.filterForm.get('searchTerm')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(term => {
        this.applySearchFilter(term || '');
      });

    // Tarih filtresi
    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.applyDateFilter();
      });
  }

  private configureTask(): void {
    const taskId = this.taskId();
    const config = this.taskConfigurations.get(taskId) || this.getDefaultConfig();
    const title = this.taskTitles.get(taskId) || '📊 Genel İşlemler';
    
    this.tableConfig.set(config);
    this.taskTitle.set(title);
  }

  private loadData(): void {
    this.isLoading.set(true);
    
    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      const mockData = this.generateMockData();
      this.dataSource.data = mockData;
      this.setupTableFeatures();
      this.isLoading.set(false);
    }, 1500);
  }

  private setupTableFeatures(): void {
    // Paginator ve sort özelliklerini ayarla
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Özel filtreleme fonksiyonu
    this.dataSource.filterPredicate = this.createFilterPredicate();
  }

  private createFilterPredicate(): (data: any, filter: string) => boolean {
    return (data: any, filter: string): boolean => {
      const searchStr = filter.toLowerCase();
      return this.tableConfig().columns.some(column => 
        String(data[column.key]).toLowerCase().includes(searchStr)
      );
    };
  }

  // 🎨 CONFIGURATION FACTORY METHODS
  private createShipmentConfig(): TableConfig {
    return {
      columns: [
        { key: 'documentSeries', label: 'Evrak Seri', type: 'text', sortable: true, width: '120px' },
        { key: 'sequence', label: 'Sıra No', type: 'number', sortable: true, width: '100px' },
        { key: 'documentNo', label: 'Belge No', type: 'text', sortable: true, width: '150px' },
        { key: 'shipmentDate', label: 'Sevk Tarihi', type: 'date', sortable: true, width: '120px' },
        { key: 'sourceWarehouse', label: 'Kaynak Depo', type: 'text', sortable: true, width: '150px' },
        { key: 'targetWarehouse', label: 'Hedef Depo', type: 'text', sortable: true, width: '150px' },
        { key: 'status', label: 'Sevk Durumu', type: 'status', sortable: true, width: '130px' }
      ],
      actions: {
        view: true,
        edit: true,
        download: true
      },
      features: {
        dateFilter: true,
        search: true,
        selection: true,
        pagination: true,
        createButton: true,
        exportButton: true
      },
      pageSize: 10,
      pageSizeOptions: [5, 10, 25, 50]
    };
  }

  private createOrderConfig(): TableConfig {
    return {
      columns: [
        { key: 'orderNo', label: 'Sipariş No', type: 'text', sortable: true, width: '130px' },
        { key: 'supplier', label: 'Tedarikçi', type: 'text', sortable: true, width: '160px' },
        { key: 'orderDate', label: 'Sipariş Tarihi', type: 'date', sortable: true, width: '120px' },
        { key: 'deliveryDate', label: 'Teslim Tarihi', type: 'date', sortable: true, width: '120px' },
        { key: 'totalAmount', label: 'Toplam Tutar', type: 'currency', sortable: true, width: '130px' },
        { key: 'status', label: 'Sipariş Durumu', type: 'status', sortable: true, width: '130px' }
      ],
      actions: {
        view: true,
        edit: true,
        delete: true,
        custom: [
          { label: 'Onayla', icon: 'check_circle', action: 'approve', color: 'success' },
          { label: 'İptal Et', icon: 'cancel', action: 'cancel', color: 'warn' }
        ]
      },
      features: {
        dateFilter: true,
        search: true,
        selection: true,
        pagination: true,
        createButton: true
      }
    };
  }
private createMaterialAcceptanceConfig(): TableConfig {
  return {
    columns: [
      { 
        key: 'acceptanceNo', 
        label: 'Kabul No', 
        type: 'text', 
        sortable: true, 
        width: '120px' 
      },
      { 
        key: 'documentNo', 
        label: 'Belge No', 
        type: 'text', 
        sortable: true, 
        width: '150px' 
      },
      { 
        key: 'supplier', 
        label: 'Tedarikçi', 
        type: 'text', 
        sortable: true, 
        width: '180px' 
      },
      { 
        key: 'acceptanceDate', 
        label: 'Kabul Tarihi', 
        type: 'date', 
        sortable: true, 
        width: '130px' 
      },
      { 
        key: 'productCount', 
        label: 'Ürün Adedi', 
        type: 'number', 
        sortable: true, 
        width: '120px' 
      },
      { 
        key: 'totalQuantity', 
        label: 'Toplam Miktar', 
        type: 'number', 
        sortable: true, 
        width: '140px' 
      },
      { 
        key: 'inspector', 
        label: 'Kontrolör', 
        type: 'text', 
        sortable: true, 
        width: '130px' 
      },
      { 
        key: 'status', 
        label: 'Kabul Durumu', 
        type: 'status', 
        sortable: true, 
        width: '140px' 
      }
    ],
    actions: {
      view: true,
      edit: true,
      delete: true,
      download: true,
      custom: [
        { 
          label: 'Kabul Et', 
          icon: 'check-circle', 
          action: 'accept', 
          color: 'success' 
        },
        { 
          label: 'Reddet', 
          icon: 'x-circle', 
          action: 'reject', 
          color: 'warn' 
        },
        { 
          label: 'Kontrol Et', 
          icon: 'clipboard-check', 
          action: 'inspect', 
          color: 'primary' 
        }
      ]
    },
    features: {
      dateFilter: true,
      search: true,
      selection: true,
      pagination: true,
      createButton: true,
      exportButton: true
    },
    pageSize: 10,
    pageSizeOptions: [5, 10, 25, 50]
  };
}

  private getDefaultConfig(): TableConfig {
    return {
      columns: [
        { key: 'id', label: 'ID', type: 'text', sortable: true, width: '80px' },
        { key: 'description', label: 'Açıklama', type: 'text', sortable: true, width: '200px' },
        { key: 'date', label: 'Tarih', type: 'date', sortable: true, width: '120px' },
        { key: 'status', label: 'Durum', type: 'status', sortable: true, width: '120px' }
      ],
      features: {
        dateFilter: true,
        search: true,
        pagination: true,
        createButton: true
      }
    };
  }

  // 🎯 PUBLIC METHODS - UI INTERACTIONS
  applySearchFilter(term: string): void {
    this.dataSource.filter = term.trim().toLowerCase();
  }

  applyDateFilter(): void {
    const { startDate, endDate } = this.filterForm.value;
    
    if (startDate && endDate) {
      this.dataSource.data = this.dataSource.data.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }
  }

  // ✅ SELECTION METHODS
  isAllSelected(): boolean {
    return this.selectedRows.size === this.dataSource.filteredData.length;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selectedRows.clear();
    } else {
      this.dataSource.filteredData.forEach(row => this.selectedRows.add(row));
    }
  }

  toggleRow(row: any): void {
    this.selectedRows.has(row) ? this.selectedRows.delete(row) : this.selectedRows.add(row);
  }

  clearSelection(): void {
    this.selectedRows.clear();
  }

  // 🎭 ACTION METHODS
  onAction(action: string, row: any): void {
    const event: TableActionEvent = {
      action,
      row,
      selectedRows: this.hasSelections() ? Array.from(this.selectedRows) : undefined
    };

    switch (action) {
      case 'view':
        this.viewRecord(row);
        break;
      case 'edit':
        this.editRecord(row);
        break;
      case 'delete':
        this.deleteRecord(row);
        break;
      case 'download':
        this.downloadRecord(row);
        break;
      default:
        this.handleCustomAction(action, row);
    }

    // Event emit yapılabilir
    console.log('Action Event:', event);
  }

  private viewRecord(row: any): void {
    this.router.navigate(['/view', row.id]);
  }

  private editRecord(row: any): void {
    this.router.navigate(['/edit', row.id]);
  }

  private deleteRecord(row: any): void {
    if (confirm('Bu kaydı silmek istediğinizden emin misiniz?')) {
      // Delete logic
      console.log('Siliniyor:', row);
    }
  }

  private downloadRecord(row: any): void {
    // Download logic
    console.log('İndiriliyor:', row);
  }

  private handleCustomAction(action: string, row: any): void {
    console.log(`Özel aksiyon: ${action}`, row);
  }

  // 🆕 CREATE NEW DOCUMENT
  createNewDocument(): void {
    this.router.navigate(['/create'], { 
      queryParams: { taskId: this.taskId() } 
    });
  }

  // 📤 EXPORT DATA
  exportData(): void {
    const data = this.hasSelections() 
      ? Array.from(this.selectedRows) 
      : this.dataSource.data;
    
    console.log('Dışa aktarılacak veri:', data);
    // Export logic buraya gelecek
  }

  // 🎨 UI HELPER METHODS
  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Bekliyor': 'status-waiting',
      'İşleniyor': 'status-processing',
      'Tamamlandı': 'status-completed',
      'İptal': 'status-cancelled',
      'Onaylandı': 'status-approved',
      'Reddedildi': 'status-rejected'
    };
    
    return `status-badge ${statusMap[status] || 'status-default'}`;
  }

  formatCellValue(value: any, column: TableColumn): string {
    switch (column.type) {
      case 'date':
        return this.datePipe.transform(value, 'dd.MM.yyyy') || '';
      case 'number':
        return new Intl.NumberFormat('tr-TR').format(value);
      case 'currency':
        return new Intl.NumberFormat('tr-TR', { 
          style: 'currency', 
          currency: 'TRY' 
        }).format(value);
      default:
        return String(value);
    }
  }

  hasActions(): boolean {
    const actions = this.tableConfig().actions;
    return !!(actions?.view || actions?.edit || actions?.delete || 
              actions?.download || actions?.custom?.length);
  }

  // 🔧 MOCK DATA GENERATOR
  private generateMockData(): any[] {
    const statuses = ['Bekliyor', 'İşleniyor', 'Tamamlandı', 'İptal'];
    const data = [];
    
    for (let i = 1; i <= 50; i++) {
      data.push({
        id: i,
        documentSeries: `SR${i.toString().padStart(3, '0')}`,
        sequence: i,
        documentNo: `DOC-${i}-2024`,
        shipmentDate: new Date(2024, 0, i % 30 + 1),
        sourceWarehouse: `Ana Depo ${i % 3 + 1}`,
        targetWarehouse: `Şube ${i % 5 + 1}`,
        status: statuses[i % 4],
        totalAmount: (i * 150.75),
        orderNo: `SIP-${i}`,
        supplier: `Tedarikçi ${i % 10 + 1}`,
        description: `Örnek kayıt ${i} açıklaması`
      });
    }
    
    return data;
  }
}