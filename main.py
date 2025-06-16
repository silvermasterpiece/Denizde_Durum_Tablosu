import requests
from bs4 import BeautifulSoup
import re
import json
import os

# --- Proje Ayarları ---
URL = "https://dts.mgm.gov.tr/dts/v1/nokta.php?xx=343&yy=1302&lt=41.428&ln=36.384&marina=False"
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

# --- Dosya Yolu Ayarları (Otomasyon ile uyumlu) ---
script_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(script_dir, 'veriler.json')


# --- ANA FONKSİYON ---
def fetch_and_save_data():
    """MGM sitesinden verileri çeker ve veriler.json dosyasına kaydeder."""

    print("MGM sitesine bağlanılıyor...")
    try:
        response = requests.get(URL, headers=HEADERS)
        response.raise_for_status()  # HTTP hatalarını kontrol et
        html_content = response.text
        print("Sayfa içeriği başarıyla indirildi.")
    except requests.exceptions.RequestException as e:
        print(f"HATA: Siteye bağlanırken bir sorun oluştu: {e}")
        return

    # BeautifulSoup ile HTML içeriğini analiz et
    soup = BeautifulSoup(html_content, 'html.parser')
    scripts = soup.find_all('script')

    data_string = None
    header_string = None

    # Tüm script bloklarını gezerek veri ve başlıkları ara
    for script in scripts:
        if not script.string:
            continue

        # 1. Veri dizisini bul (mygrid.parse içindeki)
        # Bu regex, mygrid.parse(...) satırını bulur ve içindeki [[...]] kısmını yakalar.
        data_match = re.search(r'mygrid\.parse\((.+?),"jsarray"\);', script.string, re.DOTALL)
        if data_match:
            # Yakalanan grup genellikle 'arr' değişken adıdır. Biz doğrudan diziye odaklanacağız.
            # Bazen doğrudan dizi verilir, bazen 'arr' değişkeni. Her iki durumu da ele alalım.
            potential_data = data_match.group(1).strip()
            if potential_data.startswith('[['):
                data_string = potential_data
            elif potential_data == 'arr':
                # Eğer 'arr' ise, aynı script içinde 'var arr = [...]' tanımını bul
                arr_match = re.search(r'var arr = (\[\[.*?\]\]);', script.string, re.DOTALL)
                if arr_match:
                    data_string = arr_match.group(1)

        # 2. Başlıkları bul (mygrid.setHeader içindeki)
        header_match = re.search(r'mygrid\.setHeader\("(.*?)"', script.string)
        if header_match:
            header_string = header_match.group(1)

    # Veri ve başlık bulunduktan sonra JSON dosyasına yaz
    if data_string and header_string:
        print("Veri ve başlıklar bulundu, işleniyor...")
        try:
            headers_list = [h.strip() for h in header_string.split(',')]
            table_data = json.loads(data_string)

            formatted_data = []
            for row in table_data:
                record = {}
                # Her satırdaki veriyi başlıkla eşleştir
                # Bazen satırda eksik veri olabilir, bunu kontrol ediyoruz
                for i, header in enumerate(headers_list):
                    if i < len(row):
                        record[header] = row[i]
                    else:
                        record[header] = ""  # Eksik veri için boş değer ata
                formatted_data.append(record)

            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(formatted_data, f, ensure_ascii=False, indent=4)

            print(f"✅ Başarıyla tamamlandı! En güncel veriler '{json_path}' dosyasına kaydedildi.")
        except json.JSONDecodeError as e:
            print(f"HATA: Ayıklanan veri JSON formatına çevrilirken hata oluştu: {e}")
    else:
        print("HATA: Sitenin kod yapısı içinde beklenen veri veya başlıklar bulunamadı.")


# --- Script'i Çalıştır ---
if __name__ == "__main__":
    fetch_and_save_data()
