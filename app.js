document.addEventListener("DOMContentLoaded", () => {
  fetch("veriler.json")
    .then(res => res.json())
    .then(data => {
      const tableHead = document.querySelector("#main-table thead");
      const tableBody = document.querySelector("#main-table tbody");

      tableHead.innerHTML =
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
      ;

      const getDirectionEmoji = (imgPath) => {
        if (!imgPath) return "";
        const match = imgPath.match(/(\d+)/);
        if (!match) return "";
        const angle = parseInt(match[1]);
        let icon = "❓";
        if (angle >= 337.5 || angle < 22.5) icon = "⬆️";
        else if (angle >= 22.5 && angle < 67.5) icon = "↗️";
        else if (angle >= 67.5 && angle < 112.5) icon = "➡️";
        else if (angle >= 112.5 && angle < 157.5) icon = "↘️";
        else if (angle >= 157.5 && angle < 202.5) icon = "⬇️";
        else if (angle >= 202.5 && angle < 247.5) icon = "↙️";
        else if (angle >= 247.5 && angle < 292.5) icon = "⬅️";
        else if (angle >= 292.5 && angle < 337.5) icon = "↖️";
        return <img src="https://dts.mgm.gov.tr/dts/v1/${imgPath}" alt="${icon}">;
      };

      const getWeatherEmoji = (imgPath) => {
        if (!imgPath) return "";
        let emoji = "❓";
        if (imgPath.includes("acik-gunduz")) emoji = "☀️";
        else if (imgPath.includes("acik-gece")) emoji = "🌙";
        else if (imgPath.includes("acikazbulutlu")) emoji = "🌤️";
        else if (imgPath.includes("parcalibulutlu")) emoji = "🌥️";
        else if (imgPath.includes("kapali")) emoji = "☁️";
        else if (imgPath.includes("yagmurlu")) emoji = "🌧️";
        else if (imgPath.includes("cokbulutlu")) emoji = "☁️";
        else if (imgPath.includes("sisli")) emoji = "🌫️";
        else if (imgPath.includes("kar")) emoji = "❄️";
        else if (imgPath.includes("karsimsi")) emoji = "🌨️";
        else if (imgPath.includes("dolu")) emoji = "🌩️";
        else if (imgPath.includes("firtina")) emoji = "🌪️";

        return <img src="https://dts.mgm.gov.tr/dts/v1/${imgPath}" alt="${emoji}">;
      };

      data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML =
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
        ;
        tableBody.appendChild(row);
      });
    });
});