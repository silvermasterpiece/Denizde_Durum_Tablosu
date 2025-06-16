// --- YARDIMCI FONKSİYON ---
    // Bu fonksiyon, resim yollarını daha güvenilir olan ikon/emoji formatına çevirir.
    function getDisplayContent(header, cellValue) {
        // Eğer hücre değeri bir resim yolu değilse, değeri olduğu gibi geri döndür.
        if (typeof cellValue !== 'string' || !cellValue.endsWith('.png')) {
            return cellValue;
        }

        // Rüzgar ve Dalga Yönü sütunları için...
        if (header.includes('Yonu')) {
            // Dosya adından dereceyi (örn: 222, 318) çıkarmak için regex kullanıyoruz.
            const match = cellValue.match(/(\d+)/);
            if (match) {
                const angle = parseInt(match[0], 10);
                if (angle >= 337.5 || angle < 22.5) return '⬇️ K'; // Kuzey
                if (angle >= 22.5 && angle < 67.5) return '↙️ KD'; // Kuzeydoğu
                if (angle >= 67.5 && angle < 112.5) return '⬅️ D'; // Doğu
                if (angle >= 112.5 && angle < 157.5) return '↖️ GD'; // Güneydoğu
                if (angle >= 157.5 && angle < 202.5) return '⬆️ G'; // Güney
                if (angle >= 202.5 && angle < 247.5) return '↗️ GB'; // Güneybatı
                if (angle >= 247.5 && angle < 292.5) return '➡️ B'; // Batı
                if (angle >= 292.5 && angle < 337.5) return '↘️ KB'; // Kuzeybatı
            }
        }

        // Hava Durumu sütunu için...
        if (header.includes('Hava Durumu')) {
            if (cellValue.includes('acik')) return '☀️';      // Açık
            if (cellValue.includes('yagmurlu')) return '🌧️';   // Yağmurlu
            if (cellValue.includes('bulutlu')) return '☁️';    // Bulutlu
        }

        // Eğer hiçbir kategoriyle eşleşmezse, boş bir metin döndür.
        return '';
    }

    // Verileri çeker ve tabloyu oluşturur
    fetch('veriler.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
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
                    const cellValue = kayit[header];

                    // Resim yolu yerine ikon gösteren yeni fonksiyonumuzu kullanıyoruz
                    cell.textContent = getDisplayContent(header, cellValue);

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
          html2canvas:  { scale: 2, useCORS: true }, // Resimlerin yüklenmesi için useCORS ekledik
          jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
        };
        // html2pdf kütüphanesi, emojileri ve metinleri olduğu gibi PDF'e aktarır.
        html2pdf().from(element).set(opt).save();
    });

});