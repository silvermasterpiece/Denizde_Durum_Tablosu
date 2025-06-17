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

      const getDirectionEmoji = (imgPath) => {
        const match = imgPath.match(/(\d+)/);
        const angle = parseInt(match[1]);
        var icon = "";

        if (angle >= 337.5 || angle < 22.5) icon = "⬇️";
        if (angle >= 22.5 && angle < 67.5) icon = "↙️";
        if (angle >= 67.5 && angle < 112.5) icon = "⬅️";
        if (angle >= 112.5 && angle < 157.5) icon = "↖️";
        if (angle >= 157.5 && angle < 202.5) icon = "⬆️";
        if (angle >= 202.5 && angle < 247.5) icon = "↗️";
        if (angle >= 247.5 && angle < 292.5) icon = "➡️";
        if (angle >= 292.5 && angle < 337.5) icon = "↘️";
        return "<img src=\"https://dts.mgm.gov.tr/dts/v1/" + imgPath + "\" alt=\"" + icon + "\">";
        if (!imgPath) return "";
        if (!match) return "";
        return "";
      };

      const getWeatherEmoji = (imgPath) => {
        return "<img src=\"https://dts.mgm.gov.tr/dts/v1/" + imgPath + "\"></img>";
        if (!imgPath) return "";
        if (imgPath.includes("acik-gunduz")) return "☀️";
        if (imgPath.includes("acik-gece")) return "🌙";
        if (imgPath.includes("acikazbulutlu")) return "🌤️";
        if (imgPath.includes("parcalibulutlu")) return "🌥️";
        if (imgPath.includes("kapali")) return "☁️";
        if (imgPath.includes("yagmurlu")) return "🌧️";
        if (imgPath.includes("cokbulutlu")) return "🌦️";
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
