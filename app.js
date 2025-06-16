// Sayfa tamamen yüklendiğinde tüm kodların çalışmasını sağlar
document.addEventListener('DOMContentLoaded', () => {

    // ====================================================================
    // YARDIMCI FONKSİYON: Verileri yorumlayıp sade metne çevirir.
    // ====================================================================
    function getDisplayContent(header, cellValue) {
        // Eğer hücre boşsa veya resim yolu değilse, değeri olduğu gibi geri döndür.
        if (!cellValue || typeof cellValue !== 'string' || !cellValue.endsWith('.png')) {
            return cellValue;
        }

        // Yön verilerini (K, KB, GB, D...) metin olarak döndür
        const directions = ["K","KDK","KD","DKD","D","DGD", "GD","GGD","G","GGB","GB","BGB", "B","BKB","KB","KKB","K"];
        if (header.includes('Yonu')) {
            const match = cellValue.match(/(\d+)/); // Dosya adından dereceyi al
            if (match) {
                const angle = parseFloat(match[0]);
                // Dereceye göre doğru yönü bul ve döndür
                const index = Math.floor((angle + 11.25) / 22.5);
                return directions[index];
            }
        }

        // Hava Durumu için sade metin döndür
        if (header.includes('Hava Durumu')) {
            if (cellValue.includes('acik-gunduz')) return 'Açık';
            if (cellValue.includes('acik-gece')) return 'Açık';
            if (cellValue.includes('acikazbulutlu')) return 'Az Bulutlu';
            if (cellValue.includes('cokbulutlu')) return 'Çok Bulutlu';
            if (cellValue.includes('yagmurlu')) return 'Yağmurlu';
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
                tableBody.innerHTML = '<tr><td colspan="10" style="color: red; text-align:center;">Veriler yüklenemedi. Lütfen daha sonra tekrar deneyin.</td></tr>';
            }
        });

    // ====================================================================
    // BUTON İŞLEVLERİ
    // ====================================================================
    const shareButton = document.getElementById('shareButton');
    const downloadPdfButton = document.getElementById('downloadPdfButton');
    const shareFeedback = document.getElementById('shareFeedback');

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

    if (downloadPdfButton) {
        downloadPdfButton.addEventListener('click', () => {
            const element = document.getElementById('data-table');
            const opt = {
              margin:       0.5,
              filename:     'deniz-durum-tablosu.pdf',
              image:        { type: 'jpeg', quality: 0.98 },
              html2canvas:  { scale: 2 },
              jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
            };
            html2pdf().from(element).set(opt).save();
        });
    }
});
