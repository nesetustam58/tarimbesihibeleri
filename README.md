# 🌾 AgroGrant Dashboard
> **Tarım ve Hayvancılık Destek-Hibe Takip ve Yapay Zeka Karar Destek Platformu**

AgroGrant Dashboard; ulusal (Tarım ve Orman Bakanlığı, TKDK / IPARD, KKYDP) ve uluslararası (Avrupa Birliği Horizon/Green Deal, FAO, Elçilik Hibe Fonları vb.) tarım ve hayvancılık hibe çağrılarını tek merkezden izleyen, bürokratik şartnameleri sadeleştiren ve çiftçilere/yatırımcılara süreç haritası sunan açık kaynaklı bir sistemdir.

---

## 🚀 Öne Çıkan Özellikler (Faz 1)

1. **Google Material / Minimalist Tasarım Dili:**
   * Hızlı, sade ve göz yormayan arayüz.
   * Yalnızca açık SVG ikonlar ve modern tipografi (Inter / Roboto).
   * Mobil ve masaüstü tam uyumlu (Responsive).

2. **Hibe Yaşam Döngüsü & Filtreleme:**
   * **Durum Etiketleri:** `Aktif`, `Süresi Dolmaya Yaklaşan`, `Açılması Beklenen`, `Sona Ermiş`.
   * **Çoklu Filtreleme:** Kurum (TKDK, KKYDP, Bakanlık, AB vb.), Kategori (Büyükbaş, Küçükbaş, Güneş Enerjisi, Modern Sera vb.), Hibe Oranı ve Serbest Arama.

3. **Yapay Zeka Destekli Hibe Danışmanı (AI Drawer):**
   * Karmaşık resmi şartname metinlerini **"Köy Kahvesi Dili"** ile 5 adımda anlaşılır rehberlere dönüştürür.
   * Başvuru kontrol listesi ve taslak proje önerileri üretir.

4. **DSHD (Değerlendirme ve Süreç Haritası Departmanı) Raporları:**
   * Hibe şartnamelerini çapraz incelemeye tabi tutar:
     * Hukuki riskler & gizli şartlar (Teminat mektubu, ÇKS süresi, ayni katkı).
     * Ziraat odaları ve piyasa fiyat uyuşmazlığı uyarıları.
     * Başvurudan ödemeye kadar tahmini süre çizelgesi (Gantt/Kronoloji).
     * Doğrulanmış Resmî Gazete ve kurum kaynakları.

5. **Sıfır Tedarikçi Bağımlılığı (Zero Vendor Lock-In AI):**
   * UI koduna dokunmadan Google Gemini 2.5 Pro, LiteLLM, OpenRouter veya yerel Ollama (çevrimdışı/sıfır maliyet) arasında geçiş yapabilirsiniz.
   * API anahtarı olmadan anında deneme yapabilmeniz için hazır **Simülasyon (Mock) Modu** mevcuttur.

6. **Dinamik Kaynak Yönetimi ("Kaynaklar" Görünümü):**
   * Taranan kamu kurumları ve uluslararası fonların durumunu izleme, duraklatma veya yeni kaynak ekleme arayüzü.

---

## 📂 Proje Dizin Yapısı

```
tarimbesihibeleri/
│
├── README.md                   # Proje tanıtımı ve kullanım kılavuzu
├── ARCHITECTURE.md             # Detaylı mimari ve tasarım felsefesi dokümanı
│
├── index.html                  # Ana gösterge paneli (Dashboard)
│
├── css/
│   └── style.css               # Özel çekmece animasyonları ve responsive stiller
│
└── js/
    ├── app.js                  # Arayüz motoru, filtreleme ve drawer kontrolleri
    ├── data.js                 # Örnek hibe veri tabanı ve kaynak tanımları
    └── ai-adapter.js           # Sağlayıcıdan bağımsız (Model-Agnostic) AI orkestrasyonu
```

---

## ⚡ Hızlı Başlangıç (1 Dakikada Çalıştırın)

Bu proje sıfır harici derleme aracı (npm, webpack vb.) gerektirir. Doğrudan tarayıcıda çalışır.

### Yöntem 1: Doğrudan Tarayıcıda Açma
Proje dizinindeki `index.html` dosyasına çift tıklayarak herhangi bir modern tarayıcıda (Chrome, Edge, Firefox, Safari) açabilirsiniz.

### Yöntem 2: Hafif Yerel Sunucu (Python veya Node.js)
```bash
# Python 3 ile:
python3 -m http.server 8080

# Tarayıcınızda açın:
# http://localhost:8080
```

---

## 🤖 Yapay Zeka Sağlayıcısını Yapılandırma

Sağ üstteki **"Yapay Zeka Ayarları"** butonuna tıklayarak veya `js/ai-adapter.js` üzerinden aşağıdaki sağlayıcılardan birini seçebilirsiniz:

* **Mock AI Simülatörü (Varsayılan):** Hiçbir API anahtarı gerekmez. Gerçekçi uzman analizleri üretir.
* **Google Gemini 2.5 Pro / Flash:** Google AI Studio'dan aldığınız ücretsiz API anahtarını girerek en güncel akıl yürütme modellerini kullanabilirsiniz.
* **Ollama (Yerel & %100 Ücretsiz):** Bilgisayarınızda `ollama run deepseek-r1` veya `ollama run llama3` çalıştırıp `http://localhost:11434` üzerinden yerel olarak çalıştırabilirsiniz.
* **OpenRouter / LiteLLM:** Tek bir API anahtarıyla yüzlerce açık kaynak modele bağlanabilirsiniz.

---

## 🗺️ Geliştirme Yol Haritası (Roadmap)

- [x] **Faz 1 (Mevcut):** Google Material / Minimal UI, Mock Dataset, DSHD Rapor Çekmecesi, AI Hibe Asistanı, Decoupled AI Adapter.
- [ ] **Faz 2:** Python tabanlı asenkron Scraper modülleri (TKDK, KKYDP, Tarım ve Orman Bakanlığı, AB Fonları için cron job'lar).
- [ ] **Faz 3:** SQLite / DuckDB yerel veri tabanı entegrasyonu ve otomatik değişiklik bildirimleri (Web push / Telegram bot).
- [ ] **Faz 4:** Çiftçi Başvuru Evrak Üreticisi (PDF formatında ön başvuru dosyası hazırlama).

---

## 📄 Lisans

Bu proje **MIT Lisansı** ile sunulan açık kaynaklı bir yazılımdır. Ticari veya bireysel olarak serbestçe kullanılabilir ve geliştirilebilir.
