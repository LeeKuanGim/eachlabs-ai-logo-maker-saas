# 🎨 LogoLoco

> **AI destekli logo oluşturma platformu** - Girişimciler ve geliştiriciler için saniyeler içinde profesyonel logolar

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

---

## 📖 İçindekiler

- [Hakkında](#-hakkında)
- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Proje Yapısı](#-proje-yapısı)
- [API Referansı](#-api-referansı)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)

---

## 🎯 Hakkında

**LogoLoco**, uygulama geliştiricileri ve girişimciler için tasarlanmış, yapay zeka destekli bir logo oluşturma platformudur. Tasarım becerisi gerektirmeden, sadece birkaç basit adımda profesyonel kalitede logolar üretmenizi sağlar.

### Neden LogoLoco?

- 🚀 **Hızlı**: 60 saniyeden kısa sürede logo oluşturun
- 🎨 **Profesyonel**: App Store/Google Play kalitesinde sonuçlar
- 💡 **Kolay Kullanım**: Karmaşık prompt mühendisliği gerektirmez
- 🎯 **Odaklı**: Mobil uygulama ikonları ve basit logolar için optimize edilmiş
- ⚡ **Modern Stack**: Next.js 15, React 19 ve TypeScript ile geliştirilmiş

---

## ✨ Özellikler

### 🎨 Logo Oluşturma
- **Basit Form Arayüzü**: Uygulama adı, odak, renk seçimi ile kolay kullanım
- **Çoklu Model Desteği**: 
  - Nano Banana
  - Seedream v4
  - Reve Text
- **Özelleştirilebilir Çıktı**: 1-4 adet logo aynı anda oluşturabilme
- **Renk Önizleme**: Seçtiğiniz renkleri anlık görüntüleme

### 🖼️ Kullanıcı Deneyimi
- **Gerçek Zamanlı Önizleme**: Loading state ile animasyonlu gösterim
- **Skeleton Loading**: Profesyonel yükleme animasyonları
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- **Dark/Light Mode**: Otomatik tema desteği
- **Kolay İndirme**: Tek tıkla logo indirme

### 🛠️ Teknik Özellikler
- **Form Validasyonu**: Zod ile güçlü tip güvenliği
- **API Polling**: Eşzamansız logo oluşturma takibi
- **Modern UI Bileşenleri**: Radix UI primitives ile erişilebilir arayüz
- **Type-Safe**: End-to-end TypeScript desteği

---

## 🛠️ Teknolojiler

### Frontend
- **Framework**: [Next.js 15.5](https://nextjs.org/) (App Router + Turbopack)
- **UI Library**: [React 19.1](https://reactjs.org/)
- **Language**: [TypeScript 5.x](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.x](https://tailwindcss.com/)
- **Form**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

### UI Components
- **Base**: [Radix UI](https://www.radix-ui.com/) - Erişilebilir primitives
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [tw-animate-css](https://www.npmjs.com/package/tw-animate-css)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)

### Backend/API
- **Framework**: [Hono](https://hono.dev/) + Bun runtime (REST-first, edge friendly)

### Developer Tools
- **Package Manager**: [Bun](https://bun.sh/) (ana paket yöneticisi)
- **Linting**: [ESLint 9](https://eslint.org/)
- **Build Tool**: Turbopack (Next.js dahili)
- **Monorepo**: Turborepo + Bun workspaces

---

## 🚀 Kurulum

### Gereksinimler
- Node.js 20.x veya üzeri
- [Bun](https://bun.sh/docs/installation)

### Adım 1: Depoyu Klonlayın
```bash
git clone https://github.com/altudev/eachlabs-ai-logo-maker-saas.git
cd eachlabs-ai-logo-maker-saas
```

### Adım 2: Bağımlılıkları Yükleyin
```bash
bun install
```

### Adım 3: Ortam Değişkenlerini Ayarlayın
`.env.local` dosyası oluşturun ve gerekli değişkenleri ekleyin:
```bash
DATABASE_URL=postgres://user:pass@host:port/db
DATABASE_SSL=true # opsiyonel, prod için önerilir
EACHLABS_API_KEY=your_api_key_here
NEXT_PUBLIC_API_BASE_URL=http://localhost:3002
BETTER_AUTH_SECRET=change-me
BETTER_AUTH_URL=http://localhost:3002
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3002
PGPOOL_MAX=50
PGPOOL_IDLE_MS=30000
PGPOOL_CONN_TIMEOUT_MS=5000
```

### Adım 4: Geliştirme Sunucusunu Başlatın
```bash
bun run dev
```

Bu komut hem Next.js uygulamasını (varsayılan 3000) hem de Hono API'sini (varsayılan 3002, `PORT` ile güncellenebilir) başlatır. İstemci hangi API'ye vuracağını `NEXT_PUBLIC_API_BASE_URL` üzerinden bilir. Yalnızca web veya API'yi ayağa kaldırmak için `bun run dev -- --filter=web` veya `bun run dev -- --filter=api` komutlarını kullanın. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

---

## 💻 Kullanım

### Basit Logo Oluşturma

1. **Uygulama Bilgilerini Girin**
   - Uygulama adı (örn: "FinansTakip")
   - Uygulama odağı (örn: "Uçan roket, Cüzdan")

2. **Renkleri Seçin**
   - Renk 1: Ana marka renginiz
   - Renk 2: Yardımcı renginiz

3. **Model ve Ayarları Belirleyin**
   - AI modeli seçin (Nano Banana, Seedream v4, Reve Text)
   - Çıktı sayısını belirleyin (1-4 adet)

4. **Logo Oluştur**
   - "Logo Oluştur" butonuna tıklayın
   - AI logolarınızı oluştururken bekleyin
   - Sonuçlardan beğendiğinizi indirin

### Komut Satırı Scriptleri

```bash
# Tüm uygulamalar için geliştirme
bun run dev

# Sadece web veya API geliştirme
bun run dev -- --filter=web
bun run dev -- --filter=api

# Build ve lint
bun run build
bun run lint

# Production çalıştırma (web + API)
bun run start
bun run start -- --filter=web
bun run start -- --filter=api

# Veritabanı yardımcı komutları (API servisi için)
bun run db:generate
bun run db:migrate
bun run db:push
bun run db:studio
```

---

## 📁 Proje Yapısı

```
eachlabs-ai-logo-maker-saas/
├── apps/
│   ├── web/                      # Next.js (App Router)
│   │   ├── app/                  # Routes, layouts, styles
│   │   ├── components/           # UI + landing bölümleri
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Yardımcı fonksiyonlar
│   │   ├── public/               # Statik varlıklar
│   │   ├── next.config.ts        # Next.js yapılandırması
│   │   └── package.json          # Web app paket tanımı
│   └── api/                      # Hono + Bun API (DB ve Eachlabs entegrasyonu)
│       ├── src/
│       │   ├── db/               # Drizzle şeması & bağlantı
│       │   ├── routes/           # Hono route'ları (örn. predictions)
│       │   └── index.ts          # Hono entrypoint (port 3002)
│       ├── drizzle/              # Göç çıktıları
│       ├── drizzle.config.ts     # Drizzle CLI yapılandırması
│       └── package.json          # API paket tanımı
│
├── docs/                         # Dokümantasyon
│   ├── prd.md                    # Ürün Gereksinimleri
│   ├── api-registry.md           # API Referansı
│   ├── turborepo/                # Turborepo notları
│   └── ...                       # Diğer dokümanlar
│
├── turbo.json                    # Turborepo yapılandırması
├── tsconfig.base.json            # Paylaşılan TS ayarları
├── .gitignore
├── bun.lock
├── package.json                  # Monorepo kök script'leri
└── README.md
```

---

## 🔌 API Referansı

Yerel baz URL: `http://localhost:3002`

### Logo Oluşturma Endpoint

**POST** `/api/predictions`

**Request Body:**
```typescript
{
  appName: string;      // Uygulama adı
  appFocus: string;     // Uygulama odağı/konsepti
  color1: string;       // Ana renk
  color2: string;       // Yardımcı renk
  model: string;        // AI modeli ("nano-banana" | "seedream-v4" | "reve-text")
  outputCount: string;  // Çıktı sayısı ("1" | "2" | "3" | "4")
}
```

**Response:**
```typescript
{
  predictionID: string;   // Takip için prediction ID
  prediction?: unknown;   // Eachlabs yanıtı (debug için passthrough)
}
```

### Logo Durumu Endpoint

**GET** `/api/predictions/{predictionID}`

**Response:**
```typescript
{
  status: "success" | "failed" | "running" | "queued";
  output?: string[];     // Oluşturulan logo URL'leri (success durumunda)
  [key: string]: unknown; // Eachlabs yanıtı olduğu gibi döner
}
```

Daha fazla bilgi için [`docs/api-registry.md`](docs/api-registry.md) dosyasına bakın.

---

## 🤝 Katkıda Bulunma

Katkılarınızı memnuniyetle karşılıyoruz! Bu açık kaynak projeye katkıda bulunmak için:

### Nasıl Katkıda Bulunulur?

1. **Fork** edin
2. Feature branch oluşturun (`git checkout -b feature/harika-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Harika özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/harika-ozellik`)
5. **Pull Request** açın

### Katkı Yönergeleri

- ✅ TypeScript tip güvenliğini koruyun
- ✅ Mevcut kod stilini takip edin
- ✅ Değişikliklerinizi test edin
- ✅ Anlamlı commit mesajları yazın
- ✅ Büyük değişiklikler için önce issue açın

---

## 📄 Lisans

Bu proje açık kaynak kodludur ve [MIT Lisansı](LICENSE) altında lisanslanmıştır.

---

## 🙏 Teşekkürler

- [Eachlabs](https://eachlabs.ai/) - AI altyapı sağlayıcısı
- [Vercel](https://vercel.com/) - Hosting ve deployment
- [shadcn/ui](https://ui.shadcn.com/) - UI bileşenleri
- Tüm açık kaynak katkıda bulunanlara ❤️

---

## 📞 İletişim ve Destek

- **Dokümantasyon**: [`docs/`](docs/) klasörünü inceleyin
- **Bugs**: [GitHub Issues](https://github.com/altudev/eachlabs-ai-logo-maker-saas/issues) üzerinden bildirin
- **Feature Requests**: Issue açarak önerinizi paylaşın

---

<div align="center">

**⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!**

Yapay Zeka ile Oluşturuldu • [Eachlabs](https://eachlabs.ai/) ile Güçlendirilmiştir

</div>
