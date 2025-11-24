# 🎨 Eachlabs AI Logo Maker

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

**Eachlabs AI Logo Maker**, uygulama geliştiricileri ve girişimciler için tasarlanmış, yapay zeka destekli bir logo oluşturma platformudur. Tasarım becerisi gerektirmeden, sadece birkaç basit adımda profesyonel kalitede logolar üretmenizi sağlar.

### Neden Eachlabs AI Logo Maker?

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

### Developer Tools
- **Package Manager**: [Bun](https://bun.sh/) (opsiyonel, npm/yarn/pnpm de kullanılabilir)
- **Linting**: [ESLint 9](https://eslint.org/)
- **Build Tool**: Turbopack (Next.js dahili)

---

## 🚀 Kurulum

### Gereksinimler
- Node.js 20.x veya üzeri
- npm, yarn, pnpm veya bun

### Adım 1: Depoyu Klonlayın
```bash
git clone https://github.com/altudev/eachlabs-ai-logo-maker-saas.git
cd eachlabs-ai-logo-maker-saas
```

### Adım 2: Bağımlılıkları Yükleyin
```bash
# npm kullanarak
npm install

# veya yarn
yarn install

# veya pnpm
pnpm install

# veya bun
bun install
```

### Adım 3: Ortam Değişkenlerini Ayarlayın
`.env.local` dosyası oluşturun ve gerekli API anahtarlarını ekleyin:
```bash
# Eachlabs API anahtarınızı buraya ekleyin
EACHLABS_API_KEY=your_api_key_here
```

### Adım 4: Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

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
# Geliştirme sunucusu (Turbopack ile)
npm run dev

# Production build
npm run build

# Production sunucusu
npm run start

# Linting
npm run lint
```

---

## 📁 Proje Yapısı

```
eachlabs-ai-logo-maker-saas/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── predictions/          # Logo oluşturma API
│   ├── globals.css               # Global stiller
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Ana sayfa
│
├── components/                   # React bileşenleri
│   ├── logo-maker.tsx            # Ana logo oluşturucu bileşeni
│   └── ui/                       # Yeniden kullanılabilir UI bileşenleri
│       ├── button.tsx
│       ├── card.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── select.tsx
│       └── ... (54 bileşen)
│
├── docs/                         # Dokümantasyon
│   ├── prd.md                    # Ürün Gereksinimleri Dökümanı
│   ├── api-registry.md           # API Referansı
│   └── index.nextjs.md           # Next.js Kılavuzu
│
├── hooks/                        # Custom React hooks
├── lib/                          # Yardımcı fonksiyonlar
├── public/                       # Statik dosyalar
│
├── .gitignore
├── components.json               # shadcn/ui yapılandırması
├── next.config.ts                # Next.js yapılandırması
├── package.json
├── tsconfig.json                 # TypeScript yapılandırması
└── README.md
```

---

## 🔌 API Referansı

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
  predictionID: string;  // Takip için prediction ID
}
```

### Logo Durumu Endpoint

**GET** `/api/predictions/{predictionID}`

**Response:**
```typescript
{
  status: "pending" | "processing" | "success" | "failed";
  output?: string[];     // Oluşturulan logo URL'leri (success durumunda)
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
