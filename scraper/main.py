import json
from bs4 import BeautifulSoup

def parse_grants_data():
    """
    Tarım ve besi hibeleri için örnek veri işleme motoru.
    İlerleyen aşamada gerçek web sitelerinden BeautifulSoup ile veri çekecektir.
    """
    sample_grant = {
        "title": "Kırsal Kalkınma Yatırım Destekleri",
        "category": "Besi ve Hayvancılık",
        "rate": "%60 - %75",
        "deadline": "2026-11-20",
        "location": "81 İl (Tüm Türkiye)"
    }
    
    print("Scraper başarıyla çalıştı:", json.dumps(sample_grant, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    parse_grants_data()