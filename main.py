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
    """MGM sitesinden doğru tablo verilerini çeker ve veriler.json dosyasına kaydeder."""

    print("MGM sitesine bağlanılıyor...")
    try:
        response = requests.get(URL, headers=HEADERS)
        response.raise_for_status()
        html_content = response.text
        print("Sayfa içeriği başarıyla indirildi.")
    except requests.exceptions.RequestException as e:
        print(f"HATA: Siteye bağlanırken bir sorun oluştu: {e}")
        return

    soup = BeautifulSoup(html_content, 'html.parser')
    scripts = soup.find_all('script')

    data_string = None
    header_string = None

    # Tüm script bloklarını gez
    for script in scripts:
        if not script.string:
            continue

        # AKILLI YÖNTEM: Sadece ana tabloyu dolduran veri bloğunu hedefle.
        # 'var arr = [...]' tanımını ve hemen ardından gelen 'mygrid.parse(arr,...)' kullanımını
        # aynı anda arayan bir Regex deseni kullanıyoruz.
        match = re.search(r'var arr = (\[\[.*?\]\]);\s*mygrid\.parse\(arr,"jsarray"\);', script.string, re.DOTALL)

        if match:
            # Doğru veri bloğunu bulduk.
            data_string = match.group(1)

            # Aynı script bloğu içindeki başlıkları da bulalım.
            header_match = re.search(r'mygrid\.setHeader\("(.*?)"', script.string)
            if header_match:
                header_string = header_match.group(1)

            # Doğru veriyi bulduğumuz için döngüden hemen çıkabiliriz.
            break

    # Veri ve başlık bulunduktan sonra JSON dosyasına yaz
    if data_string and header_string:
        print("Doğru tablo verileri bulundu, işleniyor...")
        try:
            headers_list = [h.strip() for h in header_string.split(',')]
            # JSON'un doğru işlemesi için tek tırnakları çift tırnakla değiştiriyoruz
            json_compatible_data_string = data_string.replace("'", '"')
            table_data = json.loads(json_compatible_data_string)

            formatted_data = []
            for row in table_data:
                record = {}
                for i, header in enumerate(headers_list):
                    if i < len(row):
                        record[header] = row[i]
                    else:
                        record[header] = ""
                formatted_data.append(record)

            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(formatted_data, f, ensure_ascii=False, indent=4)

            print(f"✅ Başarıyla tamamlandı! En güncel ve DOĞRU veriler '{json_path}' dosyasına kaydedildi.")
        except json.JSONDecodeError as e:
            print(f"HATA: Ayıklanan veri JSON formatına çevrilirken hata oluştu: {e}")
    else:
        print("HATA: Sitenin kod yapısı içinde beklenen ana tablo verisi bulunamadı.")


# --- Script'i Çalıştır ---
if __name__ == "__main__":
    fetch_and_save_data()
