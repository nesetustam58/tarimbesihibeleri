# AgroGrant - Data Sources & Scraper Pipeline

## 1. Primary Data Sources
- **Tarım ve Orman Bakanlığı (TKDK / KKYDP):** Hibe ve destek duyuruları.
- **Hayvancılık Genel Müdürlüğü (HAYGEM):** Besi, buzağı ve kovan destekleri.
- **Resmî Gazete:** Yeni yayımlanan kararname ve mevzuat güncellemeleri.

## 2. Scraper Technical Stack
- **Engine:** Python 3.11+
- **HTTP Client:** `httpx` / `requests`
- **Parser:** `BeautifulSoup4` / `lxml`
- **Data Validation:** Pydantic Schemas