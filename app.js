document.addEventListener('DOMContentLoaded', () => {
    function getDisplayContent(header, cellValue) {
        if (!cellValue || typeof cellValue !== 'string' || !cellValue.endsWith('.png')) {
            return cellValue;
        }

        if (header.includes('Yonu')) {
            const match = cellValue.match(/(\d+)/);
            if (match) {
                const angle = parseInt(match[0], 10);
                if (angle >= 337.5 || angle < 22.5) return '⬇️ K';
                if (angle >= 22.5 && angle < 67.5) return '↙️ KD';
                if (angle >= 67.5 && angle < 112.5) return '⬅️ D';
                if (angle >= 112.5 && angle < 157.5) return '↖️ GD';
                if (angle >= 157.5 && angle < 202.5) return '⬆️ G';
                if (angle >= 202.5 && angle < 247.5) return '↗️ GB';
                if (angle >= 247.5 && angle < 292.5) return '➡️ B';
                if (angle >= 292.5 && angle < 337.5) return '↘️ KB';
            }
        }

        if (header.includes('Hava Durumu')) {
            if (cellValue.includes('acik')) return '☀️';
            if (cellValue.includes('yagmurlu')) return '🌧️';
            if (cellValue.includes('bulutlu')) return '☁️';
        }

        return '';
    }

    fetch('veriler.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const tableHeadersContainer = document.getElementById('table-headers');
            const tableBody = document.getElementById('table-body');

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
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="10" style="color: red; text-align:center;">
                            Veriler yüklenemedi. Lütfen daha sonra tekrar deneyin.
                        </td>
                    </tr>`;
            }
        });

    const shareButton = document.getElementById('shareButton');
    const shareFeedback = document.getElementById('shareFeedback');

    if (shareButton) {
        shareButton.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href)
                .then(() => {
                    shareFeedback.textContent = 'Link kopyalandı!';
                    setTimeout(() => {
                        shareFeedback.textContent = '';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Link kopyalanamadı:', err);
                });
        });
    }

    const downloadPdfButton = document.getElementById('downloadPdfButton');

    if (downloadPdfButton) {
        downloadPdfButton.addEventListener('click', () => {
            const element = document.getElementById('data-table');
            const opt = {
                margin: 0.5,
                filename: 'deniz-durum-tablosu.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
            };
            html2pdf().from(element).set(opt).save();
        });
    }
});
