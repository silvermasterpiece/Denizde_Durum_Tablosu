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

      const aylar = {
        "Oca": "01", "Şub": "02", "Mar": "03", "Nis": "04",
        "May": "05", "Haz": "06", "Tem": "07", "Ağu": "08",
        "Eyl": "09", "Eki": "10", "Kas": "11", "Ara": "12"
      };

      const parseDate = (tarihStr) => {
        const parts = tarihStr.split(" ");
        const [gun, ayStr] = parts[1].split("-");
        const saatStr = parts[2];
        const ay = aylar[ayStr];
        const yil = new Date().getFullYear();
        return new Date(`${yil}-${ay}-${gun}T${saatStr}:00`);
      };

      const now = new Date();

      data.forEach(item => {
        const veriTarihi = parseDate(item["Tarih/Saat"]);
        if (veriTarihi >= now) {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${item["Tarih/Saat"]}</td>
            <td><img src="https://dts.mgm.gov.tr/dts/v1/${item["Ruzgar Yonu"]}"></td>
            <td>${item["Hizi (knot)"]}</td>
            <td>${item["Hizi (bofor)"]}</td>
            <td><img src="https://dts.mgm.gov.tr/dts/v1/${item["Dalga Yonu"]}"></td>
            <td>${item["Yuksekligi (m)"]}</td>
            <td>${item["Peryod (sn)"]}</td>
            <td><img src="https://dts.mgm.gov.tr/dts/v1/${item["Hava Durumu"]}"></td>
            <td>${item["Sicaklik (C)"]}</td>
            <td>${item["Basinc (mb)"]}</td>
          `;
          tableBody.appendChild(row);
        }
      });
    })
    .catch(err => {
      console.error("Veri yükleme hatası:", err);
      alert("Veriler yüklenemedi.");
    });
});
