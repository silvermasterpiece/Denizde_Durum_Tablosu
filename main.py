import requests
import json
import os

# --- Ayarlar ---
URL = "https://dts.mgm.gov.tr/dts/v1/nokta.php?xx=343&yy=1302&lt=41.428&ln=36.384&marina=False"
HEADERS = {
    'User-Agent': 'Mozilla/5.0'
}

# --- Dosya Konumu ---
script_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(script_dir, 'veriler.json')


def fetch_and_save_data():
    try:
        print("⏳ Veri çekiliyor...")
        response = requests.get(URL, headers=HEADERS)
        response.raise_for_status()
        data = response.json()

        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        print(f"✅ Başarılı: veriler '{json_path}' dosyasına kaydedildi.")
    except Exception as e:
        print(f"❌ Hata oluştu: {e}")


if __name__ == "__main__":
    fetch_and_save_data()
