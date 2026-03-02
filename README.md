# AngularV20 - Operasyon ve Evrak Yönetim Uygulaması

Bu proje, Angular 20 ile geliştirilmiş, depo/firma operasyonlarını tek panelden yönetmek için hazırlanmış bir iş uygulamasıdır.  
Uygulama; sipariş, sevk, fatura, stok, sayım, virman ve kasa operasyonları gibi süreçleri görev bazlı menü yapısıyla yönetir.

## Öne Çıkan Özellikler

- Angular 20 standalone component mimarisi
- JWT tabanlı kimlik doğrulama ve otomatik token yenileme
- Merkezi HTTP interceptor yapısı (`token` + `error`)
- Rol/görev odaklı ekran geçişleri
- Angular Material + Bootstrap hibrit UI
- Signal tabanlı state yönetimi (`MeService`)
- Çoklu operasyon modülleri:
  - Firma/Depo siparişleri
  - Firma/Depo sevkleri
  - Gelen/Giden faturalar
  - Stok çıkış ve sayım sonuçları
  - Kasa operasyonları ve etiket basım

## Teknoloji Yığını

- `@angular/core` `^20.2.x`
- `@angular/material` `^20.2.x`
- `bootstrap` `^5.3.x`
- `bootstrap-icons` `^1.13.x`
- `ngx-toastr`, `sweetalert2`, `ngx-print`, `jsbarcode`
- TypeScript strict mode

## Proje Yapısı (Özet)

```text
src/
  app/
    core/
      guards/            -> auth ve görev korumaları
      interceptor/       -> token ve hata interceptor'ları
      directives/        -> ortak direktifler
      pipes/             -> ortak pipe'lar + SharedImports
    layout/              -> admin shell, navbar, sidebar
    services/            -> API ve uygulama servisleri
    features/
      depolardan/        -> depo akışları (sipariş/sevk)
      firmalardan/       -> firma akışları (sipariş/sevk/fatura)
      faturalar/         -> gelen/giden fatura ekranları
      stoklar/           -> stok çıkış ekranları
      sayımlar/          -> sayım ekranları
      kasaislemleri/     -> kasa ve etiket süreçleri
      virman/            -> virman süreçleri
```

## Route Yapısı (Ana Ekranlar)

Giriş:

- `/login`

Uygulama kabuğu:

- `/admin` (AuthGuard ile korunur)

Önemli görev route’ları:

- `/admin/task/company/shipments/outbound`
- `/admin/task/company/shipments/inbound`
- `/admin/task/warehouse/shipments/outbound`
- `/admin/task/warehouse/shipments/inbound`
- `/admin/task/company/orders/sales`
- `/admin/task/company/orders/purchase`
- `/admin/task/warehouse/orders/sales`
- `/admin/task/warehouse/orders/purchase`
- `/admin/task/invoices/sales`
- `/admin/task/invoices/purchase`
- `/admin/task/cash-operations/*`

## Kurulum

Gereksinimler:

- Node.js 20+ (önerilir)
- npm 10+ (önerilir)
- Angular CLI 20 (global kurulum zorunlu değil, `npx` kullanılabilir)

Adımlar:

```bash
npm install
```

## Çalıştırma

Geliştirme:

```bash
npm start
```

Alternatif lokal ağ geliştirme scripti:

```bash
npm run dev
```

Üretim build:

```bash
npm run build
```

Test:

```bash
npm test
```

## Ortam ve API Yapılandırması

API adresleri `src/environment.ts` dosyasında tutuluyor.  
Uygulama servislerinin büyük kısmı `environment.apiurl` üzerinden çağrı yapıyor.

Kontrol etmeniz gereken dosyalar:

- `src/environment.ts`
- `src/app/services/shared/base-api.service.ts`
- `src/app/services/auth.service.ts`

Not:

- Projede hem `https://192.168.x.x` hem `http://10.0.0.x` endpoint tanımları mevcut.
- Lokal ortamda backend erişiminize göre endpoint’i güncellemeniz gerekir.

## Kimlik Doğrulama Akışı

- Login: `kullanici/login`
- Refresh: `kullanici/refresh`
- Kullanıcı bilgisi: `kullanici/Benim`
- Access token, refresh token ve expiry bilgisi `localStorage` üzerinde tutulur.
- `TokenInterceptor` yalnızca `/v18/` içeren isteklerde `Authorization` ve `X-Branch` header ekler.

## UI ve Stil Notları

- Global stiller: `src/styles.css`
- Angular Material tema: `indigo-pink`
- Bootstrap ve Bootstrap Icons global olarak `angular.json` içinde tanımlı.
- Toastr konfigürasyonu `app.config.ts` içinde merkezi olarak yönetiliyor.

## Geliştirme Standartları

- TypeScript strict mode aktif.
- Standalone component yaklaşımı kullanılıyor.
- Ortak Angular/Material importları `SharedImports` dosyasında toplanmış.
- Menü/ekran state’i `MeService` ile signal tabanlı yönetiliyor.

## Faydalı Komutlar

```bash
npm start          # lokal geliştirme
npm run dev        # belirli host/port ile açar
npm run build      # production build
npm run watch      # development watch build
npm test           # unit test
```

## Depodaki Ek Dokümanlar

- `SIGNALS_STANDARDIZATION_GUIDE.md`
- `WAREHOUSE_ORDER_UPDATE.md`
- `GIT_KOMUTLARI_REHBERI.txt`

## Katkı ve Notlar

- Yeni özellik geliştirirken önce ilgili feature klasöründe mevcut pattern’i takip edin.
- Route eklerken `app.routes.ts` ve görev yönlendirmeleri için `RouterHelperService` uyumunu kontrol edin.
- Ortam değişkenleri ve API path’lerini hardcode bırakmayın; test/prod ayrımını netleştirin.
