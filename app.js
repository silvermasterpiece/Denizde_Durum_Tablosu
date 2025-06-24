document.addEventListener("DOMContentLoaded", () => {
  fetch("veriler.json")
    .then(res => res.json())
    .then(data => {
      const tableHead = document.querySelector("#main-table thead");
      const tableBody = document.querySelector("#main-table tbody");

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

      const getFullUrl = (path) => {
        return `https://dts.mgm.gov.tr/dts/v1/${path}`;
      };

      data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item["Tarih/Saat"]}</td>
          <td><img src="${getFullUrl(item["Ruzgar Yonu"])}"></td>
          <td>${item["Hizi (knot)"]}</td>
          <td>${item["Hizi (bofor)"]}</td>
          <td><img src="${getFullUrl(item["Dalga Yonu"])}"></td>
          <td>${item["Yuksekligi (m)"]}</td>
          <td>${item["Peryod (sn)"]}</td>
          <td><img src="${getFullUrl(item["Hava Durumu"])}"></td>
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
