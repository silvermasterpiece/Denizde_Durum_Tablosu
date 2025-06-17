document.addEventListener("DOMContentLoaded", () => {
  fetch("veriler.json")
    .then(res => res.json())
    .then(data => {
      const tableHead = document.querySelector("#main-table thead");
      const tableBody = document.querySelector("#main-table tbody");

      // 📌 TABLO BAŞLIKLARI
      tableHead.innerHTML = `
        <tr>
          <th>Tarih/Saat</th>
          <th>Rüzgar Yönü</th>
          <th>Rüzgar Hızı (knot)</th>
          <th>Rüzgar Hızı (bofor)</th>
          <th>Dalga Yönü</th>
          <th>Dalga Yüksekliği (m)</th>
          <th>Dalga Periyodu (sn)</th>
          <th>Hava Durumu</th>
          <th>Sıcaklık (°C)</th>
          <th>Basınç (mb)</th>
        </tr>
      `;

      const getDirectionEmoji = (imgPath) => {
        if (!imgPath) return "";
        const match = imgPath.match(/(\d+)/);
        if (!match) return "";
        const angle = parseInt(match[1]);
        if (angle >= 337.5 || angle < 22.5) return "⬇️";
        if (angle >= 22.5 && angle < 67.5) return "↙️";
        if (angle >= 67.5 && angle < 112.5) return "⬅️";
        if (angle >= 112.5 && angle < 157.5) return "↖️";
        if (angle >= 157.5 && angle < 202.5) return "⬆️";
        if (angle >= 202.5 && angle < 247.5) return "↗️";
        if (angle >= 247.5 && angle < 292.5) return "➡️";
        if (angle >= 292.5 && angle < 337.5) return "↘️";
        return "";
      };

      const getWeatherEmoji = (imgPath) => {
        if (!imgPath) return "";
        if (imgPath.includes("acik-gunduz")) return "☀️";
        if (imgPath.includes("acik-gece")) return "🌙";
        if (imgPath.includes("acikazbulutlu")) return "🌤️";
        if (imgPath.includes("parcalibulutlu")) return "🌥️";
        if (imgPath.includes("kapali")) return "☁️";
        if (imgPath.includes("yagmurlu")) return "🌧️";
        return "❓";
      };

      data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item["Tarih/Saat"]}</td>
          <td>${getDirectionEmoji(item["Ruzgar Yonu"])}</td>
          <td>${item["Hizi (knot)"]}</td>
          <td>${item["Hizi (bofor)"]}</td>
          <td>${getDirectionEmoji(item["Dalga Yonu"])}</td>
          <td>${item["Yuksekligi (m)"]}</td>
          <td>${item["Peryod (sn)"]}</td>
          <td>${getWeatherEmoji(item["Hava Durumu"])}</td>
          <td>${item["Sicaklik (C)"]}</td>
          <td>${item["Basinc (mb)"]}</td>
        `;
        tableBody.appendChild(row);
      });
    });
});
