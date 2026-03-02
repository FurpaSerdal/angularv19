# Production Deployment Rehberi

## ✅ Yapılan Hazırlıklar

### 1. Environment Dosyaları
- ✅ `src/environment.ts` - Development (production: false)
- ✅ `src/environment.prod.ts` - Production (production: true)

### 2. Build Scriptleri
- ✅ `npm run build:prod` - Production build komutu eklendi

### 3. Optimizasyonlar (angular.json)
- ✅ **Optimization**: Aktif (minification, tree-shaking)
- ✅ **Source Maps**: Kapalı (güvenlik)
- ✅ **Named Chunks**: Kapalı
- ✅ **Extract Licenses**: Aktif
- ✅ **Vendor Chunk**: Kapalı (daha iyi caching)
- ✅ **Build Optimizer**: Aktif
- ✅ **Output Hashing**: Aktif (cache busting)

### 4. Güvenlik
- ✅ Console.log'lar production'da devre dışı (main.ts)
- ⚠️ Production API URL'lerini güncelleyin (environment.prod.ts)

## 🚀 Production Build Adımları

### 1. Environment Ayarları
`src/environment.prod.ts` dosyasındaki API URL'lerini production sunucu adreslerinizle değiştirin:

```typescript
export const environment = {
  production: true,
  apiurl1: "https://SUNUCU-ADRESI/api/v18",  // ⚠️ Değiştir
  apiurl2: "https://SUNUCU-ADRESI/api/v1",   // ⚠️ Değiştir
  // ... diğer URL'ler
};
```

### 2. Production Build Oluşturma

```powershell
# Bağımlılıkları kontrol et
npm install

# Production build oluştur
npm run build:prod

# Build çıktısı: dist/gunceltemplate/browser/
```

### 3. Build Sonucu
Build başarılı olduğunda `dist/gunceltemplate/browser/` klasöründe optimize edilmiş dosyalar oluşur:
- Minified JavaScript dosyaları
- Optimized CSS
- Hashed dosya isimleri (cache busting için)

## 📦 Web Server Deployment

### IIS (Windows Server)
1. IIS Manager'ı aç
2. Yeni site oluştur veya mevcut siteyi kullan
3. `dist/gunceltemplate/browser/` içeriğini site klasörüne kopyala
4. URL Rewrite modülünü kur
5. web.config ekle:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Angular Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <mimeMap fileExtension=".json" mimeType="application/json" />
    </staticContent>
  </system.webServer>
</configuration>
```

### Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist/gunceltemplate/browser;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Apache
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

## 🔍 Build Sonrası Kontroller

- [ ] Build hatasız tamamlandı mı?
- [ ] API URL'leri doğru mu? (environment.prod.ts)
- [ ] HTTPS kullanılıyor mu?
- [ ] Console'da hata var mı? (tarayıcı F12 > Console)
- [ ] Tüm sayfalar yükleniyor mu?
- [ ] API çağrıları çalışıyor mu?
- [ ] Authentication sistemi çalışıyor mu?

## 📊 Bundle Size Limitleri
- **Initial Bundle**: Max 4MB (Warning: 3MB)
- **Component Styles**: Max 20KB (Warning: 10KB)

Limitler aşılırsa:
1. Lazy loading kullan
2. Unused dependencies kaldır
3. Image optimization yap

## 🔄 Güncelleme Süreci

```powershell
# 1. Kodu güncelle
git pull

# 2. Yeni build oluştur
npm run build:prod

# 3. Dosyaları sunucuya kopyala
# dist/gunceltemplate/browser/* → Server folder
```

## 💡 İpuçları

1. **Test Önce**: Production build'i local'de test edin
2. **Backup**: Mevcut production dosyalarını yedekleyin
3. **Rollback Planı**: Sorun çıkarsa eski versiyona dönüş planı yapın
4. **Monitor**: İlk deployment sonrası error log'larını izleyin

## 🆘 Sorun Giderme

### Build Hataları
```powershell
# Cache temizle
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Routing Sorunları
- Web server rewrite kurallarını kontrol et
- 404 hatası alıyorsan rewrite düzgün çalışmıyor

### API Bağlantı Sorunları
- CORS ayarlarını kontrol et
- HTTPS/HTTP karışımı olmasın
- Network tab'da request detaylarını incele

---

**NOT**: İlk production deployment öncesi mutlaka test ortamında deneme yapın!
