import { CommonModule,DatePipe } from '@angular/common';
import { Component,DestroyRef,ViewChild,effect,signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder,FormGroup,FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SharedImports } from '../../../core/pipes/shared-imports';
import { StockCountService } from '../../../services/inventory/stock-count.service';
import { NewInventoryCount } from '../new-inventory-count/new-inventory-count';

import { MatDialog } from '@angular/material/dialog';
import { SayimSonuclariListeDto } from '../../../models/liste-dtolari.model';
import { User } from '../../../models/user';
import { MeService } from '../../../services/meservice.service';



@Component({
  selector: 'app-inventory-count-results',
  imports: [SharedImports, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './inventory-count-results.html',
  styleUrl: './inventory-count-results.css',
  providers: [DatePipe]
})
export class InventoryCountResults {
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  // -------------------- SIGNAL STATE --------------------
  anaekran = '';
  yanekran = '';
  private lastKey = '';
  user = signal<User | null>(null);
  gorevid = signal(0);
  gorevadi = signal('');
  altmenuid = signal(0);
  detailData = signal<any | null>(null);
  showDetailModal = signal(false);

  // -------------------- DATE FILTER STATE --------------------
  dateRange: FormGroup;
  dateFilterType = signal<'bugun' | 'dun' | 'bu-hafta' | 'bu-ay' | 'aralik'>('bugun');

  // -------------------- UI STATE --------------------


  listOfData: SayimSonuclariListeDto[] = [];
sortColumn: string = '';
sortDirection: 'none' | 'asc' | 'desc' = 'none';
  pageSize = 10;
  pageIndex = 0;

  get pagedData(): SayimSonuclariListeDto[] {
    const start = this.pageIndex * this.pageSize;
    return this.listOfData.slice(start, start + this.pageSize);
  }

  get pageStart(): number {
    if (!this.listOfData.length) {
      return 0;
    }
    return this.pageIndex * this.pageSize + 1;
  }

  get pageEnd(): number {
    return Math.min((this.pageIndex + 1) * this.pageSize, this.listOfData.length);
  }
  constructor(
    private stockcountService: StockCountService,
    private dialog: MatDialog,
    private meservice: MeService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private destroyRef: DestroyRef
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

      const key = `${menu}-${altmenu.id}-${gorev.id}`;
      if (key === this.lastKey) return;

      this.lastKey = key;

   

      this.anaekran = key;
      this.yanekran = `${altmenu.isim} -*- ${gorev.isim}`;

      this.altmenuid.set(altmenu.id);
      this.gorevid.set(gorev.id);
      this.gorevadi.set(gorev.isim);

      this.getInventoryCounts();
 

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
    const currentGorevId = this.gorevid();
    if (!currentGorevId) {
      return;
    }
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

    
    this.stockcountService.getResults(currentGorevId, zamanlama).subscribe((data: SayimSonuclariListeDto[]) => {

      this.listOfData = data;
      this.resetPagination();
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  private resetPagination(): void {
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  newInventoryCount() {
    this.dialog.open(NewInventoryCount, {
      width: '600px',
      disableClose: true,
      data: { id: this.gorevid() , depono  : this.user()?.subeNo }

    }).afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result: any) => {
      if (result === 'success') {
        this.getInventoryCounts();
      }
    }); 
  }
showDetail(item: any) {
  console.log('Detay gösteriliyor için çağrıldı:', item);
  const taskId = this.gorevid();


  const sym_evrakno = item.evrakNo;

  this.stockcountService
    .detailsResult(taskId, item.tarih, sym_evrakno)
    .subscribe({
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
    let valueA = (a as any)[column];
    let valueB = (b as any)[column];

    if (column === 'sym_tarihi') {
      valueA = new Date(valueA).getTime();
      valueB = new Date(valueB).getTime();
    }

    if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  this.resetPagination();
}




}

