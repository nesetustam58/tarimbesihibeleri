# AgroGrant Dashboard - Sistem Mimarisi & Tasarım İlkeleri (ARCHITECTURE.md)

Bu doküman, **AgroGrant Dashboard (Tarım & Hayvancılık Destek-Hibe Takip Platformu)** projesinin uçtan uca mimarisini, sıfır maliyet (zero-cost) ve sıfır bağımlılık kilitlenmesi (zero vendor lock-in) felsefesini, veri akışını ve yapay zeka orkestrasyon katmanını detaylandırır.

---

## 1. Mimari Felsefe ve Temel İlkeler

### 1.1 Sıfır Tedarikçi Bağımlılığı (Zero Vendor Lock-In)
* **Yapay Zeka Katmanı:** Sistem hiçbir tescilli AI API'sine sıkı sıkıya bağlı değildir. Standart bir **Adapter / Provider Pattern** uygulanır; tek bir satır UI kodunu değiştirmeden Gemini 2.5 Pro, LiteLLM, Ollama (yerel açık kaynak LLM'ler) veya OpenRouter arasında geçiş yapılabilir.
* **Veri Katmanı:** Geliştirme ve MVP aşamasında sıfır maliyetli yerel SQLite veya DuckDB / JSON depolama kullanılır. Üretim ortamında tek bir environment değişkeniyle Supabase (ücretsiz katman) veya PostgreSQL'e terfi edilebilir.
* **Arayüz:** Ağır SPA çatıları (React/Angular/Vue build tool zincirleri) yerine, hafif, yüksek performanslı, her tarayıcıda doğrudan çalışan modüler mimari ve Google Minimalist UI standardı benimsenmiştir.

### 1.2 Ücretsiz / Açık Kaynak Ekosistem (Zero-Cost Stack)
| Katman | Teknoloji | Neden Seçildi? | Maliyet |
| :--- | :--- | :--- | :--- |
| **Frontend** | Modern Vanilla JS + Tailwind CSS (CDN) + SVG Icons | Build pipeline gerektirmez, anında yüklenir, sıfır bakım | $0 |
| **Tasarım Dili** | Google Material / Minimal Design + Inter/Roboto | Temiz, okunabilir, göz yormayan tarımsal veri gösterimi | $0 |
| **AI Orchestration** | Standardize Adapter Pattern (`ai-adapter.js`) | İstenen LLM sağlayıcısını tak-çıkar yönetir | $0 (Free tiers / Yerel) |
| **Veri Katmanı** | SQLite / DuckDB / JSON Storage | Ek sunucu veya veritabanı lisansı gerektirmez | $0 |
| **Veri Toplama (Scraper)** | Python Playwright / BeautifulSoup / Scrapy | Kamu ve uluslararası portalları asenkron tarar | $0 |

---

## 2. Üst Düzey Sistem Mimarisi Şeması

```text
+-----------------------------------------------------------------------------------+
|                            KULLANICI ARAYÜZÜ (UI)                                 |
|   +-------------------+  +-------------------------+  +-----------------------+   |
|   | Çağrı Filtreleri  |  | Hibe Grid / Tablo Kartı |  | Kaynak Yönetim Paneli |   |
|   +-------------------+  +-------------------------+  +-----------------------+   |
|            |                          |                           |               |
|            +--------------------------+---------------------------+               |
|                                       |                                           |
|                                       v                                           |
|           +-------------------------------------------------------+               |
|           |       AgroGrant Core Controller (js/app.js)           |               |
|           +-------------------------------------------------------+               |
+---------------------------------------|-------------------------------------------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
                 v                                             v
+------------------------------------+    +-----------------------------------------+
|     AI ORCHESTRATION LAYER         |    |           DATA ACCESS LAYER             |
|       (js/ai-adapter.js)           |    |             (js/data.js)                |
|                                    |    +-----------------------------------------+
|  +------------------------------+  |                         |
|  | BaseAIAdapter (Interface)    |  |                         v
|  +------------------------------+  |    +-----------------------------------------+
|                 |                  |    | Local State / SQLite / DuckDB / JSON    |
|   +-------------+-------------+    |    +-----------------------------------------+
|   |             |             |    |                         ^
|   v             v             v    |                         | (Veri Beslemesi)
| [Gemini]   [LiteLLM]      [Ollama] |    +-----------------------------------------+
| [2.5 Pro]  [OpenRouter]   [Local]  |    |     MODÜLER SCRAPER & CRON SERVİSLERİ   |
|                                    |    | (TKDK, KKYDP, Tarım Bak., AB, FAO vb.)  |
+------------------------------------+    +-----------------------------------------+
```

---

## 3. Modül Ayrımı ve Dizin Yapısı

```
tarimbesihibeleri/
│
├── ARCHITECTURE.md             # Bu doküman (Mimari ve standartlar)
├── README.md                   # Kurulum, hızlı başlangıç ve kullanım kılavuzu
│
├── index.html                  # Ana dashboard (Google Material Minimalist UI)
│
├── css/
│   └── style.css               # Özel animasyonlar, çekmece (drawer) stilleri, badge'ler
│
├── js/
│   ├── app.js                  # UI etkileşimleri, filtreleme ve drawer kontrolörü
│   ├── data.js                 # Örnek hibe veri seti ve kaynak tanımları
│   └── ai-adapter.js           # Decoupled AI Provider/Adapter altyapısı
│
└── backend/                    # (Faz 2: Scraper ve Veri Depolama Altyapısı)
    ├── scrapers/               # TKDK, KKYDP, Bakanlık vb. bağımsız scraper scriptleri
    └── storage/                # SQLite şeması ve yerel JSON veri havuzu
```

---

## 4. Yapay Zeka Katmanı: Adapter Pattern (Decoupled AI Engine)

### 4.1 Neden Adapter Pattern?
AI API sağlayıcıları (Google, OpenAI, Anthropic, yerel Ollama) farklı payload formatları, kimlik doğrulama yöntemleri ve streaming protokolleri kullanır. UI kodunun içinde doğrudan `fetch("https://generativelanguage.googleapis.com/...")` çağırmak sistemi Google'a kilitler.

Bu kilitlenmeyi önlemek için `BaseAIAdapter` soyut sınıfı tanımlanmıştır:

```javascript
class BaseAIAdapter {
  async chat(messages, context, options) { throw new Error("Not implemented"); }
  async generateDSHDReport(grantData, options) { throw new Error("Not implemented"); }
  async simplifyBureaucracy(rawText, options) { throw new Error("Not implemented"); }
}
```

### 4.2 Desteklenen Sağlayıcılar:
1. **GeminiAdapter:** Google Gemini 2.5 Pro / Flash REST API entegrasyonu.
2. **OpenAICompatibleAdapter:** LiteLLM proxy, OpenRouter veya doğrudan OpenAI uç noktaları.
3. **OllamaAdapter:** `localhost:11434` üzerinden çalışan tamamen çevrimdışı, sıfır maliyetli açık kaynak modeller (DeepSeek-R1, Llama 3, Mistral).
4. **MockAIAdapter:** API anahtarı olmadan anında test yapılabilmesi için gerçekçi tarım uzmanı yanıtları üreten simülasyon adaptörü.

---

## 5. DSHD (Değerlendirme ve Süreç Haritası Departmanı) Metodolojisi

DSHD, tarım hibelerindeki en büyük sorun olan **"Başvurdum ama reddedildim / ceza yedim"** riskini minimize etmek üzere kurgulanmış bir denetim motorudur.

Her hibe için 5 eksenli analiz üretilir:
1. **Bürokrasi ve Uygunluk Skoru:** 10 üzerinden puanlama (ör. ÇKS zorunluluğu, tapu durumu, yaş sınırı).
2. **Hukuk & Şartname Riskleri:** Gizli kalmış şartnameler, teminat mektubu koşulları, ayni katkı riskleri.
3. **Ziraat Odaları & Piyasa Uyarıları:** Resmi rayiç bedel ile gerçek piyasa maliyetleri arasındaki farklar.
4. **Adım Adım Süreç Haritası:** Başvurudan hibe ödemesine kadar tahmini zaman çizelgesi (haftalık/aylık).
5. **Doğrulanmış Kaynaklar:** Resmi Gazete, TKDK çağrı rehberi ve mevzuat bağlantıları.

---

## 6. Güvenlik, Performans ve Gizlilik

1. **İstemci Tarafında API Anahtarı Saklama:** API anahtarları asla hardcode edilmez; kullanıcının kendi `localStorage` belleğinde veya sunucu tarafı env değişkenlerinde tutulur.
2. **Hızlı Yükleme (Zero-Bundle Overhead):** Sıfır npm bağımlılığı ile anında yüklenir.
3. **Erişilebilirlik (A11y):** Google Material renk kontrastları, yüksek okunabilirlik ve klavye dostu çekmece (drawer) kontrolleri.
