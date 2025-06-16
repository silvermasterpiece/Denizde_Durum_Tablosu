import requests
import re
import json
from bs4 import BeautifulSoup
import os

# Script'in çalıştığı dizini bul (Otomasyon için önemli)
script_dir = os.path.dirname(os.path.abspath(__file__))
# Kaydedilecek JSON dosyasının tam yolunu oluştur
json_path = os.path.join(script_dir, 'veriler.json')

# Adım 1: Canlı veriyi çekeceğimiz URL
URL = "https://dts.mgm.gov.tr/dts/v1/nokta.php?xx=343&yy=1302&lt=41.428&ln=36.384&marina=False"

# Kendimizi tarayıcı gibi göstermek için headers bilgisi
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

print("Canlı URL'e bağlanılıyor...")
try:
    response = requests.get(URL, headers=headers)
    response.raise_for_status()
    html_content = response.text
    print("Bağlantı başarılı, veri indirildi.")
except requests.exceptions.RequestException as e:
    print(f"Siteye bağlanırken bir hata oluştu: {e}")
    exit()

# Adım 2: İndirilen veriyi işle
soup = BeautifulSoup(html_content, 'html.parser')
scripts = soup.find_all('script')

data_string = None
header_string = None

for script in scripts:
    if script.string:
        if 'var arr = ' in script.string:
            match = re.search(r"var arr = (\[\[.*?\]\]);", script.string, re.DOTALL)
            if match:
                data_string = match.group(1)
        if 'mygrid.setHeader' in script.string:
            match = re.search(r'mygrid.setHeader\("(.*?)"', script.string)
            if match:
                header_string = match.group(1)

# Adım 3: İşlenen veriyi 'veriler.json' dosyasına kaydet
if data_string and header_string:
    headers_list = [h.strip() for h in header_string.split(',')]
    try:
        table_data = json.loads(data_string)
        formatted_data = []
        for row in table_data:
            record = {}
            for i, header in enumerate(headers_list):
                record[header] = row[i]
            formatted_data.append(record)

        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(formatted_data, f, ensure_ascii=False, indent=4)

        print(f"🎉 Başarıyla tamamlandı! En güncel veriler '{json_path}' dosyasına kaydedildi.")
    except json.JSONDecodeError as e:
        print(f"İndirilen veri işlenirken bir hata oluştu: {e}")
else:
    print("HTML içinde gerekli JavaScript değişkenleri bulunamadı.")