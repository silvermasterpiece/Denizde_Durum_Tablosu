document.addEventListener("DOMContentLoaded", () => {
  fetch("veriler.json")
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#main-table tbody");

      const getDirectionEmoji = (imgPath) => {
        if (!imgPath) return "";
        const match = imgPath.match(/(\d+)/);
        if (!match) return "";
        const angle = parseInt(match[1]);
        if (angle >= 337.5 || angle < 22.5) return "⬇️ K";
        if (angle >= 22.5 && angle < 67.5) return "↙️ KD";
        if (angle >= 67.5 && angle < 112.5) return "⬅️ D";
        if (angle >= 112.5 && angle < 157.5) return "↖️ GD";
        if (angle >= 157.5 && angle < 202.5) return "⬆️ G";
        if (angle >= 202.5 && angle < 247.5) return "↗️ GB";
        if (angle >= 247.5 && angle < 292.5) return "➡️ B";
        if (angle >= 292.5 && angle < 337.5) return "↘️ KB";
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
