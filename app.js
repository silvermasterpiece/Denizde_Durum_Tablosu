document.addEventListener('DOMContentLoaded', () => {

    let jsonData = []; // Veriyi, PDF oluşturma gibi diğer fonksiyonların erişebilmesi için saklıyoruz.

    // ====================================================================
    // YARDIMCI FONKSİYON: Ham veriyi, web sayfasında gösterilecek formata çevirir.
    // ====================================================================
    function getWebContent(header, cellValue) {
        if (!cellValue || typeof cellValue !== 'string' || !cellValue.endsWith('.png')) {
            return cellValue;
        }
        const directions = ["K", "KDK", "KD", "DKD", "D", "DGD", "GD", "GGD", "G", "GGB", "GB", "BGB", "B", "BKB", "KB", "KKB", "K"];
        if (header.includes('Yonu')) {
            const match = cellValue.match(/(\d+)/);
            if (match) {
                const angle = parseFloat(match[0]);
                const index = Math.floor((angle + 11.25) / 22.5);
                return directions[index];
            }
        }
        if (header.includes('Hava Durumu')) {
            if (cellValue.includes('acik')) return '☀️';
            if (cellValue.includes('bulutlu')) return '☁️';
            if (cellValue.includes('yagmurlu')) return '🌧️';
        }
        return '';
    }

    // ====================================================================
    // ANA İŞLEM: veriler.json'dan verileri çekip HTML tablosunu oluşturur.
    // ====================================================================
    fetch('veriler.json')
        .then(response => {
            if (!response.ok) { throw new Error('Network response was not ok'); }
            return response.json();
        })
        .then(data => {
            jsonData = data; // Veriyi global değişkene ata
            const tableBody = document.getElementById('table-body');
            const tableHeadersContainer = document.getElementById('table-headers');
            if (!data || data.length === 0) return;

            const headers = Object.keys(data[0]);
            const headerRow = document.createElement('tr');
            headers.forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });
            tableHeadersContainer.appendChild(headerRow);

            data.forEach(kayit => {
                const row = document.createElement('tr');
                headers.forEach(header => {
                    const cell = document.createElement('td');
                    cell.textContent = getWebContent(header, kayit[header]);
                    row.appendChild(cell);
                });
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Tablo oluşturulurken hata oluştu:', error));

    // ====================================================================
    // BUTON İŞLEVLERİ
    // ====================================================================
    const shareButton = document.getElementById('shareButton');
    const downloadPdfButton = document.getElementById('downloadPdfButton');

    // 1. Paylaş Butonu
    if (shareButton) { /* ... Kopyalama Kodu ... */ }

    // 2. PDF İndirme Butonu (TÜRKÇE KARAKTER DÜZELTMESİ İLE)
    if (downloadPdfButton) {
        downloadPdfButton.addEventListener('click', () => {
            if (jsonData.length === 0) {
                alert("Veri henüz yüklenmedi, lütfen bir saniye bekleyip tekrar deneyin.");
                return;
            }

            const doc = new jspdf.jsPDF({ orientation: 'landscape' });
            const tableHeaders = Object.keys(jsonData[0]);

            // SADECE PDF İÇİN veriyi yeniden işle ve Türkçe karakterleri değiştir
            const tableRows = jsonData.map(row => {
                return tableHeaders.map(header => {
                    let cellText = getWebContent(header, row[header]);

                    // PDF'in anlayabileceği karakterlere dönüştür
                    if (typeof cellText === 'string') {
                        cellText = cellText
                            .replace(/Ç/g, 'C').replace(/ç/g, 'c')
                            .replace(/Ğ/g, 'G').replace(/ğ/g, 'g')
                            .replace(/İ/g, 'I').replace(/ı/g, 'i')
                            .replace(/Ö/g, 'O').replace(/ö/g, 'o')
                            .replace(/Ş/g, 'S').replace(/ş/g, 's')
                            .replace(/Ü/g, 'U').replace(/ü/g, 'u')
                            .replace(/☀️/g, 'Acik').replace(/☁️/g, 'Bulutlu').replace(/🌧️/g, 'Yagmurlu'); // Emojileri de metne çevir
                    }
                    return cellText;
                });
            });

            doc.autoTable({
                head: [tableHeaders],
                body: tableRows,
                styles: { fontSize: 7, cellPadding: 2 },
                headStyles: { fillColor: [39, 49, 171] },
                theme: 'grid'
            });

            doc.save('deniz-durum-tablosu.pdf');
        });
    }
});
