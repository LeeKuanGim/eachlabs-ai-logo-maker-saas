---

# 🚀 PRD: AI Mobile Icon & Logo Creator (MVP)

**Tarih:** 22 Kasım 2025
**Durum:** Taslak (Draft)
**Odak:** Mobil Uygulama İkonları & Basit Logolar

---

## 1. Ürün Vizyonu (Neden Buradayız?)
Uygulama geliştiren yazılımcılar ve bağımsız girişimciler (Indie Hackers) kod yazmayı sever ama tasarım yapmaktan genellikle nefret eder. Fiverr'da bir tasarımcı beklemek çok yavaş, Canva'da sıfırdan yapmak çok manueldir.

**Vizyonumuz:** Bir kullanıcının aklındaki fikri, **60 saniyeden kısa sürede**, tasarım bilgisine ihtiyaç duymadan, App Store veya Google Play'e koymaya hazır, "premium" hissiyatlı bir ikona dönüştürmesini sağlamak.

---

## 2. Kullanıcı Personaları (Kimin İçin Yapıyoruz?)

### 👤 **Persona 1: Hızlı Yazılımcı Cem (The Indie Hacker)**
* **Kimdir:** Tek başına çalışır. Kod yazmayı çok sever, tasarım yapmayı zaman kaybı olarak görür. Next.js ve Supabase bilir ama renk teorisinden anlamaz.
* **Acısı:** Uygulamasını bitirmek üzeredir ama ikon çizemediği için markete gönderemiyordur. "Geçici" olarak koyduğu ikon çok amatör duruyordur.
* **Beklentisi:** "Bana soru sorma, bana seçenek sun. Hızlıca güzel görünen bir şey ver, indireyim ve koduma döneyim."

### 👤 **Persona 2: Seri Girişimci Elif (The Validator)**
* **Kimdir:** Haftada bir yeni iş fikri dener. Fikri test etmek için hızlıca bir Landing Page kurar.
* **Acısı:** Henüz para kazanmayan bir fikir için tasarımcıya 100$ vermek istemez.
* **Beklentisi:** Markasına uygun, profesyonel görünen, yatırımcıya gösterilebilecek kalitede bir logo.

---

## 3. Hedefler (Goals) ✅

### Kullanıcı Hedefleri
* Kullanıcı, karmaşık "prompt mühendisliği" (prompt engineering) yapmadan, sadece basit kelimelerle (örn: "uçan roket") istediğini anlatabilmeli.
* Kullanıcı, **Maksimum 3 adımda** sonuca ulaşmalı (Ne istiyorsun? -> Hangi tarz? -> Hangi renkler?).
* Sonuçlar, "amatör" değil, Eachlabs altyapısı sayesinde App Store'daki "Featured" uygulamalar kalitesinde olmalı. (Ürün adı: LogoLoco)

### İş (Business) Hedefleri
* **Kullanım Alışkanlığı:** Kullanıcının kredi sistemini anlaması ve harcamaya teşvik edilmesi (1 Logo = 1 Kredi).
* **MVP Başarısı:** Kullanıcının siteye girip, logo üretip, indirme butonuna basma oranının (Conversion Rate) yüksek olması.

---

## 4. Hedef Olmayanlar (Non-Goals) ❌
*Bu aşamada neleri **YAPMAYACAĞIZ**? (Kapsamı korumak için en önemli kısım)*

* **Vektörel Çizim (SVG) Düzenleme:** Kullanıcıya "şu çizginin yerini değiştir" gibi bir editör sunmayacağız. Sadece bitmiş resim (PNG) vereceğiz.
* **Tam Marka Kimliği:** Kartvizit, banner, sosyal medya kapakları bu aşamada yok. Sadece kare ikon/logo.
* **Metin Düzenleme (Typography):** Logoların üzerine yapay zeka ile kusursuz yazı yazdırmaya çalışmayacağız (AI henüz metinde %100 değil, kullanıcıyı hayal kırıklığına uğratmayalım). Sembol odaklıyız.
* **Karmaşık Ödeme Sistemleri:** Şu an abonelik yok, paket satışı yok. Sadece kredi düşme mantığı çalışsın yeter.

---

## 5. Kullanıcı Hikayesi (User Journey)

1.  **Keşif:** Cem, siteye gelir. Karşısında temiz, animasyonlu (bouncy) ve güven veren bir arayüz görür.
2.  **Giriş (Input):**
    * Soru: "Neyin uygulamasını yapıyorsun?" -> Cevap: "Kişisel finans takip uygulaması."
    * Soru: "Tarzın ne?" -> Seçeneklerden "Minimalist & Flat"i seçer.
    * Soru: "Marka renklerin?" -> Mor ve Turkuaz seçer.
3.  **Büyü (Generation):** "Oluştur"a basar. Sistem arka planda çalışırken (loading state), Cem sıkılmaz çünkü animasyonlar onu oyalar.
4.  **Sonuç (Result):** Karşısına 4 tane harika ikon çıkar. Birini çok beğenir.
5.  **Önizleme & İndirme:** İkona tıklar. Telefon ekranında nasıl durduğunu görür (Mockup). "İndir"e basar, kredisinin düştüğünü görür ve mutlu ayrılır.

---

## 6. Başarı Metrikleri (KPIs)
* **Time-to-Value:** Kullanıcının siteye girmesi ile ilk logoyu görüp "Vay canına" demesi arasındaki süre (Hedef: < 2 dakika).
* **Hata Oranı:** AI'nın ürettiği saçma veya bozuk görsellerin oranı (Prompt kalitemizi buna göre ölçeceğiz).

---
