from bs4 import BeautifulSoup

class GrantParser:
    @staticmethod
    def parse_html_content(html_content: str):
        """
        Web sitesinden gelen ham HTML içeriğini ayrıştırır ve 
        yapılandırılmış hibe verisine dönüştürür.
        """
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Örnek seçiciler (Gerçek site yapılarına göre güncellenecektir)
        title = soup.find('h1')
        title_text = title.get_text(strip=True) if title else "Bilinmeyen Hibe"
        
        return {
            "parsed_title": title_text,
            "status": "Success",
            "message": "HTML içeriği başarıyla parse edildi."
        }

if __name__ == "__main__":
    sample_html = "<h1>Besi ve Hayvancılık Yatırım Destekleri 2026</h1>"
    result = GrantParser.parse_html_content(sample_html)
    print("Parser Test Sonucu:", result)