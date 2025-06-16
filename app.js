document.addEventListener('DOMContentLoaded', () => {

    // MEVCUT KODUNUZ: verileri çeker ve tabloyu oluşturur
    fetch('veriler.json')
        .then(response => response.json())
        .then(data => {
            const tableHeadersContainer = document.getElementById('table-headers');
            const tableBody = document.getElementById('table-body');

            if (data.length === 0) return;

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
                    const cellValue = kayit[header];
                    if (typeof cellValue === 'string' && cellValue.endsWith('.png')) {
                        const img = document.createElement('img');
                        img.src = `https://dts.mgm.gov.tr/dts/v1/${cellValue}`;
                        img.alt = header;
                        cell.appendChild(img);
                    } else {
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

    // === YENİ EKLENEN BÖLÜM BAŞLANGICI ===

    // 1. PAYLAŞ BUTONU İŞLEVSELLİĞİ
    const shareButton = document.getElementById('shareButton');
    const shareFeedback = document.getElementById('shareFeedback');

    shareButton.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                shareFeedback.textContent = 'Link kopyalandı!';
                setTimeout(() => {
                    shareFeedback.textContent = '';
                }, 2000);
            })
            .catch(err => {
                console.error('Link kopyalanamadı: ', err);
                shareFeedback.textContent = 'Kopyalanamadı!';
            });
    });

    // 2. PDF İNDİRME BUTONU İŞLEVSELLİĞİ
    const downloadPdfButton = document.getElementById('downloadPdfButton');

    downloadPdfButton.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.autoTable({
            html: '#data-table',
            styles: {
                font: 'helvetica',
                fontSize: 8
            },
            headStyles: {
                fillColor: [38, 50, 56]
            },
            // NOT: Resimleri PDF'e eklemek için daha karmaşık bir kod gerekir.
            // Bu basit versiyon sadece metinleri ve tablo yapısını alır.
        });

        doc.save('deniz-durum-tablosu.pdf');
    });

    // === YENİ EKLENEN BÖLÜM SONU ===

});