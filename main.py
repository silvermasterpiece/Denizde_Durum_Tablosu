import requests
from bs4 import BeautifulSoup
import re
import json
import os

URL = "https://dts.mgm.gov.tr/dts/v1/nokta.php?xx=343&yy=1302&lt=41.428&ln=36.384&marina=False"
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}
script_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(script_dir, 'veriler.json')


def fetch_and_save_data():
    print("MGM sitesine bağlanılıyor...")
    try:
        response = requests.get(URL, headers=HEADERS)
        response.raise_for_status()
        response.encoding = 'utf-8'  # Türkçe karakter düzeltmesi
        html_content = response.text
        print("Sayfa içeriği başarıyla indirildi.")
    except Exception as e:
        print(f"HATA: Siteye bağlanırken bir sorun oluştu: {e}")
        return

    soup = BeautifulSoup(html_content, 'html.parser')
    scripts = soup.find_all('script')
    data_string = None
    header_string = None

    for script in scripts:
        if script.string:
            match = re.search(r'var arr = (\[\[.*?\]\]);\s*mygrid\.parse\(arr,"jsarray"\);', script.string, re.DOTALL)
            if match:
                data_string = match.group(1)
                header_match = re.search(r'mygrid\.setHeader\("(.*?)"', script.string)
                if header_match:
                    header_string = header_match.group(1)
                break

    if data_string and header_string:
        print("Doğru tablo verileri bulundu, işleniyor...")
        try:
            headers_list = [h.strip() for h in header_string.split(',')]
            json_compatible_data_string = data_string.replace("'", '"')
            table_data = json.loads(json_compatible_data_string)

            formatted_data = [
                {"Tarih/Saat": row[0], "Ruzgar Yonu": row[1], "Hizi (knot)": row[2], "Hizi (bofor)": row[3],
                 "Dalga Yonu": row[4], "Yuksekligi (m)": row[5], "Peryod (sn)": row[6], "Hava Durumu": row[7],
                 "Sicaklik (C)": row[8], "Basinc (mb)": row[9]} for row in table_data]

            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(formatted_data, f, ensure_ascii=False, indent=4)

            print(f"✅ Başarıyla tamamlandı! En güncel ve DOĞRU veriler '{json_path}' dosyasına kaydedildi.")
        except Exception as e:
            print(f"HATA: Veri işlenirken bir sorun oluştu: {e}")
    else:
        print("HATA: Sitenin kod yapısı içinde beklenen ana tablo verisi bulunamadı.")


if __name__ == "__main__":
    fetch_and_save_data()
