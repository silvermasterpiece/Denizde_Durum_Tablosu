document.addEventListener('DOMContentLoaded', () => {

    // Verileri çeker ve tabloyu oluşturur
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

    // Paylaş Butonu İşlevselliği
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

    // PDF İndirme Butonu İşlevselliği
    const downloadPdfButton = document.getElementById('downloadPdfButton');

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

});