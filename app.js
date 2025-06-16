// Sayfa tamamen yüklendiğinde tüm kodların çalışmasını sağlar
document.addEventListener('DOMContentLoaded', () => {

    // ====================================================================
    // YARDIMCI FONKSİYON: Verileri yorumlayıp doğru gösterimi sağlar.
    // ====================================================================
    function getDisplayContent(header, cellValue) {
        if (!cellValue || typeof cellValue !== 'string' || !cellValue.endsWith('.png')) {
            return cellValue;
        }

        // Yön verilerini güvenilir metin olarak döndür
        const directions = ["K", "KDK", "KD", "DKD", "D", "DGD", "GD", "GGD", "G", "GGB", "GB", "BGB", "B", "BKB", "KB", "KKB", "K"];
        if (header.includes('Yonu')) {
            const match = cellValue.match(/(\d+)/);
            if (match) {
                const angle = parseFloat(match[0]);
                const index = Math.floor((angle + 11.25) / 22.5);
                return directions[index];
            }
        }

        // Hava Durumu için sevdiğiniz ikonları geri getir
        if (header.includes('Hava Durumu')) {
            if (cellValue.includes('acik')) return '☀️';
            if (cellValue.includes('bulutlu')) return '☁️'; // 'acikazbulutlu' ve 'cokbulutlu' da bunu kullanır
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

    // 2. PDF İndirme Butonu (Mobil Uyumlu Nihai Çözüm)
    if (downloadPdfButton) {
        downloadPdfButton.addEventListener('click', () => {
            const originalTable = document.getElementById('data-table');
            if (!originalTable) return;

            const overlay = document.createElement('div');
            overlay.id = 'pdf-overlay';
            const clone = originalTable.cloneNode(true);
            overlay.appendChild(clone);
            document.body.appendChild(overlay);
            overlay.style.display = 'flex';

            const opt = {
                margin: 0.3,
                filename: 'deniz-durum-tablosu.pdf',
                image: { type: 'jpeg', quality: 0.95 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
            };

            html2pdf().from(clone).set(opt).save().then(() => {
                document.body.removeChild(overlay);
            }).catch((err) => {
                console.error("PDF oluşturulurken hata oluştu:", err);
                document.body.removeChild(overlay);
            });
        });
    }
});
