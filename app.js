document.addEventListener('DOMContentLoaded', () => {

    // ====================================================================
    // YARDIMCI FONKSİYONLAR
    // ====================================================================
    function getDisplayContent(header, cellValue) {
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
            if (cellValue.includes('acik-gunduz')) return 'Açık';
            if (cellValue.includes('acik-gece')) return 'Açık';
            if (cellValue.includes('acikazbulutlu')) return 'Az Bulutlu';
            if (cellValue.includes('cokbulutlu')) return 'Çok Bulutlu';
            if (cellValue.includes('yagmurlu')) return 'Yağmurlu';
        }
        return '';
    }

    // ====================================================================
    // ANA İŞLEM: Tabloyu doldurma
    // ====================================================================
    fetch('veriler.json')
        .then(response => {
            if (!response.ok) { throw new Error('Network response was not ok'); }
            return response.json();
        })
        .then(data => {
            // ... (Bu kısım aynı, değişiklik yok) ...
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
                    cell.textContent = getDisplayContent(header, kayit[header]);
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
    if (shareButton) {
        shareButton.addEventListener('click', () => { /* ... Kopyalama Kodu ... */ });
    }

    // 2. PDF İndirme Butonu (NİHAİ MOBİL ÇÖZÜMÜ)
    if (downloadPdfButton) {
        downloadPdfButton.addEventListener('click', () => {
            const originalTable = document.getElementById('data-table');
            if (!originalTable) return;

            // 1. Bir perde (overlay) ve klonlanmış tablo oluştur
            const overlay = document.createElement('div');
            overlay.id = 'pdf-overlay';
            const clone = originalTable.cloneNode(true);
            overlay.appendChild(clone);
            document.body.appendChild(overlay);
            overlay.style.display = 'flex'; // Perdeyi göster

            const opt = {
                margin: 0.3,
                filename: 'deniz-durum-tablosu.pdf',
                image: { type: 'jpeg', quality: 0.95 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
            };

            // 2. PDF'i, perdenin içindeki klonlanmış tablodan oluştur
            html2pdf().from(clone).set(opt).save().then(() => {
                // 3. İşlem bittiğinde perdeyi kaldır
                document.body.removeChild(overlay);
            }).catch((err) => {
                console.error("PDF oluşturulurken hata oluştu:", err);
                // Hata durumunda bile perdeyi kaldır
                document.body.removeChild(overlay);
            });
        });
    }
});
