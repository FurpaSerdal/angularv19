import { Component, effect, signal } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedImports } from '../../../core/pipes/shared-imports';
import { StockCountService } from '../../../services/inventory/stock-count.service';
import { NewInventoryCount } from '../new-inventory-count/new-inventory-count';

import { MatDialog } from '@angular/material/dialog';
import { MeService } from '../../../services/meservice.service';
import { User } from '../../../models/user';



@Component({
  selector: 'app-inventory-count-results',
  imports: [SharedImports, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './inventory-count-results.html',
  styleUrl: './inventory-count-results.css',
  providers: [DatePipe]
})
export class InventoryCountResults {

  // -------------------- SIGNAL STATE --------------------
  anaekran = '';
  yanekran = '';
  private lastKey = '';
  user = signal<User | null>(null);
  gorevid = signal(0);
  gorevadi = signal('');
  altmenuid = signal(0);
  detailData = signal<any>(null);
  showDetailModal = signal(false);

  // -------------------- DATE FILTER STATE --------------------
  dateRange: FormGroup;
  dateFilterType = signal<'bugun' | 'dun' | 'bu-hafta' | 'bu-ay' | 'aralik'>('bugun');

  // -------------------- UI STATE --------------------


  listOfData: any[] = [];
sortColumn: string = '';
sortDirection: 'none' | 'asc' | 'desc' = 'none';
  constructor(
    private stockcountService: StockCountService,
    private dialog: MatDialog,
    private meservice: MeService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.dateRange = this.formBuilder.group({
      start: [this.getToday()],
      end: [this.getToday()]
    });
     /* EFFECT #1 → USER SYNC */
    effect(() => {
      this.user.set(this.meservice.userSignal());
    });

    /* EFFECT #2 → MENU / GÖREV BASED LOAD */
    effect(() => {
      const menu = this.meservice.selectedMenu();
      const altmenu = this.meservice.selectedAltMenu();
      const gorev = this.meservice.selectedGorev();


      if (!menu || !altmenu || !gorev) {
        this.lastKey = '';
        return;
      }

      const key = `${menu}-${altmenu.id}-${gorev.kimlik}`;
      if (key === this.lastKey) return;

      this.lastKey = key;
      console.log('InventoryCountResults - Loading for key:', key);

   

      this.anaekran = key;
      this.yanekran = `${altmenu.isim} -*- ${gorev.isim}`;

      this.altmenuid.set(altmenu.id);
      this.gorevid.set(gorev.kimlik);
      this.gorevadi.set(gorev.isim);

    });
  }
  
  private getToday(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    this.getInventoryCounts();
  }

  onDateRangeChange() {
    this.getInventoryCounts();
  }

  onFilterTypeChange() {
    this.getInventoryCounts();
  }

  getInventoryCounts() {
    const filterType = this.dateFilterType();
    let zamanlama: string;
    
    if (filterType === 'aralik') {
      // Tarih aralığı seçiliyse
      const start = this.datePipe.transform(this.dateRange.get('start')?.value, 'yyyy-MM-dd');
      const end = this.datePipe.transform(this.dateRange.get('end')?.value, 'yyyy-MM-dd');
      zamanlama = `aralik-${start}-${end}`;
    } else {
      // Diğer filter türleri için
      zamanlama = filterType;
    }

    this.stockcountService.getResults(12, zamanlama).subscribe((data) => {
      this.listOfData = data;
    });
  }

  newInventoryCount() {
    this.dialog.open(NewInventoryCount, {
      width: '600px',
      disableClose: true

    }).afterClosed().subscribe((result: any) => {
      if (result === 'success') {
        this.getInventoryCounts();
      }
    }); 
  }

  showDetail(item: any) {
    const taskId = this.altmenuid();
    const schedule = item.sym_tarihi; 
  
    const sym_evrakno = item.sym_evrakno;

    this.stockcountService.detailsResult(taskId, sym_evrakno, schedule).subscribe({
      next: (data) => {
        this.detailData.set(data);
        this.showDetailModal.set(true);
      },
      error: (error) => {
        console.error('Detay yüklenirken hata:', error);
      }
    });
  }

  closeDetailModal() {
    this.showDetailModal.set(false);
    this.detailData.set(null);
  }

sortBy(column: string) {

  if (this.sortColumn !== column) {
    // Yeni kolona geçince: artan başla
    this.sortColumn = column;
    this.sortDirection = 'asc';
  } else {
    // Aynı kolona tıklayınca sırayla değiştir: none → asc → desc → none
    if (this.sortDirection === 'none') this.sortDirection = 'asc';
    else if (this.sortDirection === 'asc') this.sortDirection = 'desc';
    else if (this.sortDirection === 'desc') this.sortDirection = 'none';
  }

  // Listeyi sıralıyoruz
  if (this.sortDirection === 'none') return; // Hiçbir şey yapma

  this.listOfData = [...this.listOfData].sort((a, b) => {
    let valueA = a[column];
    let valueB = b[column];

    if (column === 'sym_tarihi') {
      valueA = new Date(valueA).getTime();
      valueB = new Date(valueB).getTime();
    }

    if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
}




}
