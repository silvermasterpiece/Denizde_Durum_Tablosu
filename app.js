document.addEventListener('DOMContentLoaded', () => {

    fetch('veriler.json')
        .then(response => response.json())
        .then(data => {
            const tableHeadersContainer = document.getElementById('table-headers');
            const tableBody = document.getElementById('table-body');

            // Eğer veri yoksa işlemi durdur
            if (data.length === 0) return;

            // 1. Tablo Başlıklarını Oluştur
            const headers = Object.keys(data[0]);
            const headerRow = document.createElement('tr');
            headers.forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });
            tableHeadersContainer.appendChild(headerRow);

            // 2. Veri Satırlarını Oluştur
            data.forEach(kayit => {
                const row = document.createElement('tr');

                // Her bir kayıt içindeki değerleri gez
                headers.forEach(header => {
                    const cell = document.createElement('td');
                    const cellValue = kayit[header];

                    // Eğer hücre verisi bir resim yolu içeriyorsa, resim olarak ekle
                    if (typeof cellValue === 'string' && cellValue.endsWith('.png')) {
                        const img = document.createElement('img');
                        // Resimlerin tam yolunu oluşturuyoruz
                        img.src = `https://dts.mgm.gov.tr/dts/v1/${cellValue}`;
                        img.alt = header; // Resim yüklenmezse başlık görünsün
                        cell.appendChild(img);
                    } else {
                        // Değilse, metin olarak ekle
                        cell.textContent = cellValue;
                    }
                    row.appendChild(cell);
                });
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Veri dosyası okunurken hata oluştu:', error);
            const tableBody = document.getElementById('table-body');
            tableBody.innerHTML = '<tr><td colspan="10" style="color: red;">Veriler yüklenemedi.</td></tr>';
        });
});