# ETO

Gemi Elektrik-Elektronik Zabitleri (Electro-Technical Officer) için forum.
Önce web prototipi, ardından mobil uygulama.

## Web prototipi (`web/`)

React + TypeScript + Vite + Firebase Authentication.

### Akış
1. **Splash:** Ekranda yalnızca "ETO" yazısı varken internet bağlantısı ve cihazın sistem dili (TR/EN) kontrol edilir.
2. **İnternet yoksa:** "Bağlantı yok" ekranı ve "Tekrar dene" butonu gösterilir.
3. **İnternet varsa:** Google ile giriş ekranı açılır.
4. **Giriş sonrası:** Ana sayfa açılır. Her sayfada şunlar vardır:
   - Üstte banner: solda hamburger menü, ortada ETO yazısı
   - Altta bottom bar: ortada Home, sağda Bölümler butonu
   - Bölümler butonu alttan yükselen bir panel açar: Bridge, Deck, Accommodation, Engine Room

### Çalıştırma
```bash
cd web
npm install
cp .env.example .env   # Firebase web uygulaması anahtarlarını girin
npm run dev
```

Firebase anahtarları girilmezse giriş ekranında **"Demo olarak devam et"** butonu çıkar. Bu buton, Google girişi olmadan arayüzü denemek içindir.

### Firebase kurulumu
1. Firebase Console'da bir proje oluşturun ve bir **Web app** ekleyin.
2. **Authentication > Sign-in method** altında **Google** sağlayıcısını açın.
3. **Authentication > Settings > Authorized domains** listesine prototipi yayınlayacağınız alan adını ekleyin.
4. Web app ayarlarındaki değerleri `web/.env` dosyasına yazın.

### Proje yapısı
```
web/src/
  App.tsx            açılış kontrolleri + yönlendirme
  connectivity.ts    internet kontrolü
  i18n.tsx           sistem dili tespiti + TR/EN metinler
  firebase.ts        Firebase başlatma
  auth.tsx           Google girişi (AuthContext)
  sections.ts        forum bölümleri listesi
  components/Layout.tsx   banner, bottom bar, hamburger menü, alt panel
  screens/           Splash, Offline, Login, Home, Section
```
