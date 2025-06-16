document.addEventListener('DOMContentLoaded', () => {

    let jsonData = []; // Veriyi PDF oluşturma gibi diğer fonksiyonların erişebilmesi için saklıyoruz.

    // ====================================================================
    // YARDIMCI FONKSİYON: Ham veriyi, tabloda gösterilecek sade metne çevirir.
    // ====================================================================
    function getDisplayContent(header, cellValue) {
        // Eğer hücre boşsa veya bir resim yolu değilse, değeri olduğu gibi geri döndür.
        if (!cellValue || typeof cellValue !== 'string' || !cellValue.endsWith('.png')) {
            return cellValue;
        }

        // Yönleri metin olarak döndür (örn: KB, GD)
        const directions = ["K", "KDK", "KD", "DKD", "D", "DGD", "GD", "GGD", "G", "GGB", "GB", "BGB", "B", "BKB", "KB", "KKB", "K"];
        if (header.includes('Yonu')) {
            const match = cellValue.match(/(\d+)/); // Dosya adından dereceyi alır
            if (match) {
                const angle = parseFloat(match[0]);
                const index = Math.floor((angle + 11.25) / 22.5);
                return directions[index];
            }
        }

        // Hava Durumunu emoji olarak döndür
        if (header.includes('Hava Durumu')) {
            if (cellValue.includes('acik')) return '☀️';
            if (cellValue.includes('bulutlu')) return '☁️';
            if (cellValue.includes('yagmurlu')) return '🌧️';
        }

        return ''; // Eşleşme bulunamazsa boş döndür
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
                    cell.textContent = getDisplayContent(header, kayit[header]);
                    row.appendChild(cell);
                });
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Tablo oluşturulurken hata oluştu:', error);
            const tableBody = document.getElementById('table-body');
            if (tableBody) {
                tableBody.innerHTML = '<tr><td colspan="10" style="color: red; text-align:center;">Veriler yüklenemedi.</td></tr>';
            }
        });

    // ====================================================================
    // BUTON İŞLEVLERİ
    // ====================================================================
    const shareButton = document.getElementById('shareButton');
    const downloadPdfButton = document.getElementById('downloadPdfButton');
    const shareFeedback = document.getElementById('shareFeedback');

    // 1. Paylaş Butonu
    if (shareButton) {
        shareButton.addEventListener('click', () => {
             navigator.clipboard.writeText(window.location.href)
                .then(() => {
                    shareFeedback.textContent = 'Link kopyalandı!';
                    setTimeout(() => { shareFeedback.textContent = ''; }, 2000);
                })
                .catch(err => {
                    console.error('Link kopyalanamadı: ', err);
                });
        });
    }

    // 2. PDF İndirme Butonu (Programatik Yöntem - Nihai Çözüm)
    if (downloadPdfButton) {
        downloadPdfButton.addEventListener('click', () => {
            if (jsonData.length === 0) {
                alert("Veri henüz yüklenmedi, lütfen bir saniye bekleyip tekrar deneyin.");
                return;
            }

            const doc = new jspdf.jsPDF({ orientation: 'landscape' });

            const tableHeaders = Object.keys(jsonData[0]);

            // Veriyi, PDF kütüphanesinin anladığı formata çevir
            const tableRows = jsonData.map(row => {
                return tableHeaders.map(header => {
                    // PDF'e ikonları değil, sade metin hallerini yazdırıyoruz.
                    return getDisplayContent(header, row[header]);
                });
            });

            doc.autoTable({
                head: [tableHeaders],
                body: tableRows,
                styles: { fontSize: 7 }, // Yazı tipini küçülterek sığmasını sağlıyoruz
                headStyles: { fillColor: [39, 49, 171] },
                theme: 'grid' // Kenarlıklı tablo teması
            });

            doc.save('deniz-durum-tablosu.pdf');
        });
    }
});
