import requests
from bs4 import BeautifulSoup
import re
import json

URL = "https://dts.mgm.gov.tr/dts/v1/nokta.php?xx=343&yy=1302&lt=41.428&ln=36.384&marina=False"
HEADERS = {
    "User-Agent": "Mozilla/5.0"
}

WEATHER_MAP = {
    "acik-gunduz": "wi-day-sunny",
    "acik-gece": "wi-night-clear",
    "yagmurlu": "wi-rain",
    "cokbulutlu": "wi-cloudy",
    "parcali-bulutlu": "wi-day-cloudy",
    "acikazbulutlu": "wi-day-sunny-overcast"
}

# Yardımcı: img/343c.png → 340
def extract_degree(path):
    match = re.search(r"(\d+)", path)
    if match:
        return str(round(int(match.group(1)) / 10) * 10)
    return ""

def simplify_icon(path):
    name = path.split("/")[-1].replace(".png", "")
    return WEATHER_MAP.get(name, "wi-na")

def fetch_mgm():
    r = requests.get(URL, headers=HEADERS)
    r.raise_for_status()
    r.encoding = "utf-8"

    soup = BeautifulSoup(r.text, "html.parser")
    scripts = soup.find_all("script")

    data_str, header_str = None, None
    for script in scripts:
        if not script.string:
            continue
        data_match = re.search(r'var arr = (\[\[.*?\]\]);', script.string, re.DOTALL)
        header_match = re.search(r'mygrid.setHeader\("(.*?)"\)', script.string)
        if data_match:
            data_str = data_match.group(1)
        if header_match:
            header_str = header_match.group(1)
        if data_str and header_str:
            break

    if not data_str or not header_str:
        raise ValueError("Tablo verisi bulunamadı!")

    headers = [h.strip() for h in header_str.split(",")]
    rows = json.loads(data_str.replace("'", '"'))

    result = []
    for row in rows:
        item = {}
        for i, h in enumerate(headers):
            val = row[i] if i < len(row) else ""
            if "Ruzgar Yonu" in h or "Dalga Yonu" in h:
                val = extract_degree(val)
            elif "Hava Durumu" in h:
                val = simplify_icon(val)
            item[h] = val
        result.append(item)

    with open("veriler.json", "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    fetch_mgm()
