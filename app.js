document.addEventListener("DOMContentLoaded", () => {
  fetch("veriler.json")
    .then(res => res.json())
    .then(data => {
      const tableHead = document.querySelector("#main-table thead");
      const tableBody = document.querySelector("#main-table tbody");

      // Başlıkları yükle
      tableHead.innerHTML = `
        <tr>
          <th>Tarih/Saat</th>
          <th>Rüzgar<br>Yönü</th>
          <th>Rüzgar<br>Hızı<br>(knot)</th>
          <th>Rüzgar<br>Hızı<br>(bofor)</th>
          <th>Dalga<br>Yönü</th>
          <th>Dalga<br>Yüksekliği<br>(m)</th>
          <th>Dalga<br>Periyodu<br>(sn)</th>
          <th>Hava<br>Durumu</th>
          <th>Sıcaklık<br>(°C)</th>
          <th>Basınç<br>(mb)</th>
        </tr>
      `;

      // Yardımcı fonksiyonlar:
      const getDirectionIcon = (imgPath) => {
        if (!imgPath) return "";
        const match = imgPath.match(/(\d+)/);
        if (!match) return "";
        const angle = parseInt(match[1]);
        const directions = [
          { range: [337.5, 360], icon: "⬆️" },
          { range: [0, 22.5], icon: "⬆️" },
          { range: [22.5, 67.5], icon: "↗️" },
          { range: [67.5, 112.5], icon: "➡️" },
          { range: [112.5, 157.5], icon: "↘️" },
          { range: [157.5, 202.5], icon: "⬇️" },
          { range: [202.5, 247.5], icon: "↙️" },
          { range: [247.5, 292.5], icon: "⬅️" },
          { range: [292.5, 337.5], icon: "↖️" }
        ];
        const found = directions.find(d => angle >= d.range[0] && angle < d.range[1]);
        return `<img src="https://dts.mgm.gov.tr/dts/v1/${imgPath}" alt="${found?.icon || '❓'}">`;
      };

      const getWeatherIcon = (imgPath) => {
        if (!imgPath) return "";
        const mapping = {
          "acik-gunduz": "☀️",
          "acik-gece": "🌙",
          "acikazbulutlu": "🌤️",
          "parcalibulutlu": "🌥️",
          "kapali": "☁️",
          "yagmurlu": "🌧️",
          "cokbulutlu": "☁️",
          "sisli": "🌫️",
          "kar": "❄️",
          "karsimsi": "🌨️",
          "dolu": "🌩️",
          "firtina": "🌪️"
        };
        const foundKey = Object.keys(mapping).find(key => imgPath.includes(key));
        return `<img src="https://dts.mgm.gov.tr/dts/v1/${imgPath}" alt="${mapping[foundKey] || '❓'}">`;
      };

      // Verileri tabloya yükle
      data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item["Tarih/Saat"]}</td>
          <td>${getDirectionIcon(item["Ruzgar Yonu"])}</td>
          <td>${item["Hizi (knot)"]}</td>
          <td>${item["Hizi (bofor)"]}</td>
          <td>${getDirectionIcon(item["Dalga Yonu"])}</td>
          <td>${item["Yuksekligi (m)"]}</td>
          <td>${item["Peryod (sn)"]}</td>
          <td>${getWeatherIcon(item["Hava Durumu"])}</td>
          <td>${item["Sicaklik (C)"]}</td>
          <td>${item["Basinc (mb)"]}</td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(err => {
      console.error("Veri yükleme hatası:", err);
      alert("Veriler yüklenemedi.");
    });
});
