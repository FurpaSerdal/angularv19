# Signals Standardization Guide - Angular 20

## ✅ Best Practices Applied to CompanyGoodsReceipt

### Problem Identified
- **15+ individual signals** for simple form inputs
- No `computed()` for derived state
- Minimal `effect()` usage
- Weak typing (`signal<any>()`)
- No `FormGroup` for related inputs

### Solution Implemented

#### 1. **Group Related Signals**
```typescript
// ❌ BEFORE (Granular)
seriNoGirdisi = signal<string>('');
siraNoGirdisi = signal<number>(0);
barkodGirdisi = signal<string>('');

// ✅ AFTER (Grouped)
searchForm: FormGroup; // Replaces all above
```

#### 2. **Use Reactive Forms for Input Management**
```typescript
this.searchForm = this.fb.group({
  seriNo: ['', Validators.required],
  siraNo: ['', Validators.required],
  cariKod: ['']
});
```

#### 3. **Signal Organization Layers**

**Layer 1: UI State**
```typescript
gonderiliyor = signal<boolean>(false);
qrOkunuyor = signal<boolean>(false);
qrParsed = signal<boolean>(false);
```

**Layer 2: Search & Display Data**
```typescript
bulunancariler = signal<any[]>([]);
bulunanUrunler = signal<StokAraCT[]>([]);
urunListesi = signal<any[]>([]);
```

**Layer 3: Selected Data**
```typescript
secilencari = signal<number | null>(null);
secilenUrun = signal<StokAraCT | null>(null);
evrakdetay = signal<any>(null);
```

**Layer 4: Related State Object**
```typescript
qrData = signal({
  irsaliyeNo: '',
  gorunurVeri: '',
});
```

#### 4. **Add Computed Properties**
```typescript
isFormValid = computed(() => {
  const form = this.searchForm;
  return form.get('seriNo')?.value && form.get('siraNo')?.value;
});

urunListesiLength = computed(() => this.urunListesi().length);

isLoading = computed(() => this.gonderiliyor());
```

#### 5. **Strategic Use of Effects**
```typescript
// EFFECT #1: Sync with Service
effect(() => {
  const altMenu = this.meservice.selectedAltMenu();
  this.altmenu.set(altMenu?.id ?? 0);
});

// EFFECT #2: Auto-update post order when products change
effect(() => {
  const urunler = this.urunListesi();
  this.postorder.kalemler = urunler as any;
});
```

---

## 📋 Conversion Checklist

- [ ] Import `FormBuilder`, `FormGroup`, `Validators` from `@angular/forms`
- [ ] Import `computed` from `@angular/core`
- [ ] Reduce individual input signals → Use FormGroup
- [ ] Group related signals into objects
- [ ] Add computed() for derived state
- [ ] Use effect() for reactive flows
- [ ] Add proper TypeScript types (avoid `any`)
- [ ] Update templates to use `form.get()` instead of `signal()`
- [ ] Test all functionality

---

## 🔄 Template Updates Required

```html
<!-- BEFORE -->
<input [(ngModel)]="seriNoGirdisi" />
<button (click)="seriNoIleAra()" [disabled]="gonderiliyor()">Ara</button>

<!-- AFTER -->
<form [formGroup]="searchForm">
  <input formControlName="seriNo" />
  <button (click)="seriNoIleAra()" [disabled]="isLoading()">Ara</button>
</form>
```

---

## 📊 Signal Count Reduction

| Category | Before | After | Reduction |
|----------|--------|-------|-----------|
| Form Inputs | 3 individual signals | 1 FormGroup | 66% ↓ |
| QR Data | 4 individual signals | 1 object signal | 75% ↓ |
| Total Signals | 15+ | ~10 | 33% ↓ |

---

## ✨ Benefits

1. **Better Maintainability** - Related state grouped together
2. **Cleaner Code** - Less signal boilerplate
3. **Type Safety** - FormBuilder handles validation
4. **Performance** - Fewer signal subscriptions
5. **Scalability** - Easy to add new related properties

---

## 🚀 Next Steps

1. Apply this pattern to similar components:
   - `WarehouseInboundShipmentsDetailComponent`
   - `WarehouseOutboundShipmentsDetailComponent`
   - `WarehouseSaleOrderDetailComponent`
   - Other components with 10+ signals

2. Create a shared pattern/base class for form-heavy components

3. Document signal naming conventions:
   - `*Loading` for boolean loading states
   - `*Data` for grouped related data
   - `selected*` for selection states
