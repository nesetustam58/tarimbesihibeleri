import json
import requests
from parser import GrantParser

def fetch_and_parse_grants():
    """
    Tarım, besi ve hayvancılık hibe kaynaklarına gerçek HTTP isteği 
    göndererek verileri toplayan ana fonksiyon.
    """
    # Örnek hedef kaynak (Tarım ve Orman Bakanlığı veya TKDK alt yapı simülasyonu)
    target_url = "https://www.tarimorman.gov.tr"
    
    # Bot engeline takılmamak için tarayıcı kimliği (User-Agent) ekliyoruz
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    print(f"Bağlantı kuruluyor: {target_url}")
    
    try:
        # 10 saniye zaman aşımı (timeout) ile istek atıyoruz
        response = requests.get(target_url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            print("Sayfa içeriği başarıyla indirildi. Parser modülüne aktarılıyor...")
            
            # İndirilen ham HTML'i parser.py içerisindeki sınıfımıza gönderiyoruz
            parsed_result = GrantParser.parse_html_content(response.text)
            
            output = {
                "source_url": target_url,
                "status_code": response.status_code,
                "extraction_result": parsed_result,
                "pipeline_status": "Başarılı"
            }
            return output
        else:
            return {
                "source_url": target_url,
                "status_code": response.status_code,
                "pipeline_status": "Hata: Sunucu olumlu yanıt dönmedi."
            }
            
    except requests.exceptions.RequestException as e:
        return {
            "source_url": target_url,
            "pipeline_status": f"Bağlantı Hatası: {str(e)}"
        }

if __name__ == "__main__":
    result = fetch_and_parse_grants()
    print("Scraper Çalışma Raporu:\n", json.dumps(result, ensure_ascii=False, indent=2))