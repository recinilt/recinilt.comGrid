//By Recep YENİ
//Geliştirici: Recep YENİ (recepyeni@gmail.com) (ChatGpt yardımıyla)
//Bir lahmacun ayran ısmarlamak isterseniz, BSC BNB Smart Chain (BEP20) USDT adresim:
//0x9a9b5b0eccebd2834f77f764364a14bbfc837dc0


// Veri yönetimi için global değişkenler
let loadedJsonData = null;
let loadedDataInfo = {
    symbol: null,
    interval: null,
    startDate: null,
    endDate: null,
    dataCount: 0
};


function sifirla() {
    levels = [];
    geometric_percentage = [];

    symbol = "";
    start = 1.1;
    end = 1.1;
    num_levels = 1;
    comission = 1.1;
    minmiktarondalik = 8; 
    myticksize = 1;
    precision_info = {};
    data_first_close = 0.032;
    veriinterval = "5m"; // Örnek: Kullanıcıdan alınan veri
    veri_days_back = 3;  // Örnek: Kullanıcıdan alınan veri
    data = [];
    girilenilkbakiye = 0;
    mymyq = 0.0;
    carpim = 1;
    old_alinacaklar = [];
    old_satilacaklar = [];
    start_date = "2024-04-17";
    end_date = "2024-07-27";
    current_price=0.0;
    let alinacaklar = [];
    satilacaklar = [];
    oncekialinacaklar = [];
    oncekisatilacaklar = [];
    oncekialinacaklevelsonprice = 1000000;
    oncekisatilacaklevelilkprice = 1000000;
    gridprofit = 0.0000001;
    new_alinacaklar=[]
    new_satilacaklar=[];
    division_type="geometric";


}

function disableInteractions() {
    // Overlay oluştur
    const overlay = document.createElement('div');
    overlay.id = 'interaction-blocker';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Şeffaf siyah bir kaplama
    overlay.style.zIndex = '999'; // Üstte olması için yüksek bir z-index
    overlay.style.cursor = 'not-allowed'; // Fare işaretçisi değişikliği
    document.body.appendChild(overlay);
}
 
function enableInteractions() {
    const overlay = document.getElementById('interaction-blocker');
    if (overlay) {
        document.body.removeChild(overlay);
    }
}
 
function hesaplabutton() {
    const symbol = document.getElementById("symbol");
    const division_type=document.getElementById("division_type");
    const start = document.getElementById("start");
    const end = document.getElementById("end");
    const num_levels = document.getElementById("num_levels");
    const comission = document.getElementById("comission");
    const girilenilkbakiye = document.getElementById("girilenilkbakiye");
    const veriinterval = document.getElementById("veriinterval");
    const start_date = document.getElementById("start_date");
    const end_date = document.getElementById("end_date");
    const loader = document.getElementById('loader');
    
    // JSON dosyası yüklendi mi kontrolü
    if (!loadedJsonData) {
        alert("Önce 'Veri Yönetimi' bölümünden JSON dosyası yüklemeniz veya büyük veri indirmeniz gerekmektedir!");
        return;
    }

    if (symbol.value.trim() === "" ||
        division_type.value.trim()==="" ||
        start.value.trim() === "" ||
        end.value.trim() === "" ||
        num_levels.value.trim() === "" ||
        comission.value.trim() === "" ||
        girilenilkbakiye.value.trim() === "" ||
        veriinterval.value.trim() === "" ||
        start_date.value.trim() === "" ||
        end_date.value.trim() === "") {
        alert("Lütfen tüm alanları doldurunuz.");
        return; // Fonksiyonu burada durdur
    }

    // Sayısal girişlerin geçerliliğini kontrol et
    if (isNaN(start.value) || parseFloat(start.value) < 0) {
        alert("Alt Seviye geçerli bir pozitif sayı olmalıdır.");
        start.focus();
        return;
    }
     if (isNaN(end.value) || parseFloat(end.value) < 0) {
        alert("Üst Seviye geçerli bir pozitif sayı olmalıdır.");
        end.focus();
        return;
    }
    if (isNaN(num_levels.value) || parseInt(num_levels.value) < 1 || parseInt(num_levels.value) > 1000) {
        alert("Grid Sayısı 1 ile 1000 arasında bir sayı olmalıdır.");
        num_levels.focus();
        return;
    }
    if (isNaN(comission.value) || parseFloat(comission.value) < 0) {
        alert("Komisyon Oranı geçerli bir pozitif sayı olmalıdır.");
        comission.focus();
        return;
    }
     if (isNaN(girilenilkbakiye.value) || parseFloat(girilenilkbakiye.value) < 0) {
        alert("Başlangıç Sermayesi geçerli bir pozitif sayı olmalıdır.");
        girilenilkbakiye.focus();
        return;
    }

    console.log("Merhaba!");

    const resultsContainer = document.getElementById('results');
    const submitButton = document.getElementById('submit-button');
    const by=document.getElementById("beklemeyazisi");
    disableInteractions()
    submitButton.disabled=true;
    submitButton.style.display = 'none';
    
    
    loader.style.display = 'block';
    submitButton.innerText="LÜTFEN BEKLEYİNİZZZ!!!!"
    by.innerHTML="LÜTFEN BEKLEYİNİZZZZZ!!!!!!!! (Tarihler arasında 1 ay varsa, 1 dk beklemeniz gerekir. Sonuç AŞAĞIDA gösterilecektir.)"

    var result="";
    setTimeout(() => {
        
        result = mybacktest(symbol.value.toUpperCase().trim().replace("İ","I"), division_type.value.trim().toLowerCase(), start.value.trim(), end.value.trim(), num_levels.value.trim(), comission.value.trim(), girilenilkbakiye.value.trim(), veriinterval.value.toLowerCase().trim(), start_date.value.trim(), end_date.value.trim());
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = result;
        resultsContainer.prepend(resultItem);
        enableInteractions();
        by.innerHTML="";
        submitButton.innerText="GÖNDER"
        submitButton.disabled=false;
        submitButton.style.display = 'block';
        enableInteractions()
        loader.style.display = 'none';

    }, 1000);

    // Form verilerini işleme veya gönderme kodları buraya eklenebilir.
    // Örneğin:
    // const formData = {
    //     symbol: symbol.value,
    //     start: start.value,
    //     ... diğer alanlar
    // };
    // fetch('/api/backtest', {
    //     method: 'POST',
    //     body: JSON.stringify(formData)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     // Sonuçları göster
    // });


}

function geometrikParcaHesapla(baslangic, bitis, parcaSayisi) {
    /**
     * Geometrik parçalara böler
     * @param {number} baslangic - Başlangıç değeri
     * @param {number} bitis - Bitiş değeri  
     * @param {number} parcaSayisi - Parça sayısı
     * @return {Array} - Geometrik parçalar dizisi
     */
    const parcalar = [];
    const oran = Math.pow(bitis / baslangic, 1 / (parcaSayisi - 1));
    
    for (let i = 0; i < parcaSayisi; i++) {
        const deger = baslangic * Math.pow(oran, i);
        parcalar.push(parseFloat(deger.toFixed(2)));
    }
    
    return parcalar;
}

function yuzdedenGridSayisiHesapla(altSeviye, ustSeviye, gridlerArasiYuzde) {
    /**
     * Gridler arası yüzdeden grid sayısını hesaplar
     * @param {number} altSeviye - Alt seviye fiyatı
     * @param {number} ustSeviye - Üst seviye fiyatı
     * @param {number} gridlerArasiYuzde - Gridler arası yüzde
     * @return {number} - Gerekli grid sayısı (tam sayı)
     */
    // Geometrik grid formülü: gridSayisi = ln(ustSeviye/altSeviye) / ln(1 + yuzde/100) + 1
    const oran = ustSeviye / altSeviye;
    const yuzdeOrani = gridlerArasiYuzde / 100;
    const gridSayisi = Math.log(oran) / Math.log(1 + yuzdeOrani) + 1;
    
    return Math.round(gridSayisi);
}

function cokluHesaplaButton() {
    const multiParams = document.getElementById('multi-grid-params').value.trim();
    const multiLoader = document.getElementById('multi-loader');
    const multiButton = document.getElementById('multi-submit-button');
    
    // JSON dosyası kontrolü
    if (!loadedJsonData) {
        alert("Önce 'Veri Yönetimi' bölümünden JSON dosyası yüklemeniz veya büyük veri indirmeniz gerekmektedir!");
        return;
    }
    
    // Parametre doğrulama
    const paramPattern = /^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)-(\d+)$/;
    const match = multiParams.match(paramPattern);
    
    if (!match) {
        alert('Parametreler "başlangıç-bitiş-parça" formatında olmalıdır (örn: 1-16-5)');
        return;
    }
    
    const baslangic = parseFloat(match[1]);
    const bitis = parseFloat(match[2]);
    const parcaSayisi = parseInt(match[3]);
    
    if (baslangic >= bitis) {
        alert('Başlangıç değeri bitiş değerinden küçük olmalıdır!');
        return;
    }
    
    if (parcaSayisi < 2 || parcaSayisi > 20) {
        alert('Parça sayısı 2 ile 20 arasında olmalıdır!');
        return;
    }
    
    // Form verilerini al
    const altSeviye = parseFloat(document.getElementById('start').value);
    const ustSeviye = parseFloat(document.getElementById('end').value);
    
    if (!altSeviye || !ustSeviye) {
        alert('Önce alt ve üst seviye değerlerini girmelisiniz!');
        return;
    }
    
    // Geometrik parçaları hesapla
    const geometrikParcalar = geometrikParcaHesapla(baslangic, bitis, parcaSayisi);
    console.log('Geometrik parçalar:', geometrikParcalar);
    
    // Her parça için grid sayısını hesapla
    const gridKonfigurasyonlari = [];
    for (let yuzde of geometrikParcalar) {
        const gridSayisi = yuzdedenGridSayisiHesapla(altSeviye, ustSeviye, yuzde);
        gridKonfigurasyonlari.push({
            yuzde: yuzde,
            gridSayisi: gridSayisi
        });
    }
    
    console.log('Grid konfigürasyonları:', gridKonfigurasyonlari);
    
    // UI'ı güncelle
    multiLoader.style.display = 'block';
    multiButton.disabled = true;
    multiButton.textContent = 'Hesaplanıyor...';
    
    // Sonuçları saklamak için
    const sonuclar = [];
    let tamamlananHesaplamaSayisi = 0;
    
    // Her konfigürasyon için hesaplama yap
    gridKonfigurasyonlari.forEach((config, index) => {
        setTimeout(() => {
            // Grid sayısını geçici olarak değiştir
            const eskiGridSayisi = document.getElementById('num_levels').value;
            document.getElementById('num_levels').value = config.gridSayisi;
            
            try {
                // Hesaplama yap
                const sonuc = mybacktest(
                    document.getElementById('symbol').value.toUpperCase().trim().replace("İ","I"),
                    document.getElementById('division_type').value.trim().toLowerCase(),
                    document.getElementById('start').value.trim(),
                    document.getElementById('end').value.trim(),
                    config.gridSayisi.toString(),
                    document.getElementById('comission').value.trim(),
                    document.getElementById('girilenilkbakiye').value.trim(),
                    document.getElementById('veriinterval').value.toLowerCase().trim(),
                    document.getElementById('start_date').value.trim(),
                    document.getElementById('end_date').value.trim()
                );
                
                // Sonucu kaydet
                sonuclar.push({
                    yuzde: config.yuzde,
                    gridSayisi: config.gridSayisi,
                    sonuc: sonuc,
                    index: index
                });
                
            } catch (error) {
                console.error(`Hesaplama hatası (Grid: ${config.gridSayisi}):`, error);
                sonuclar.push({
                    yuzde: config.yuzde,
                    gridSayisi: config.gridSayisi,
                    sonuc: `Hata: ${error.message}`,
                    index: index
                });
            }
            
            // Grid sayısını eski haline döndür
            document.getElementById('num_levels').value = eskiGridSayisi;
            
            tamamlananHesaplamaSayisi++;
            
            // Tüm hesaplamalar bitince sonuçları göster
            if (tamamlananHesaplamaSayisi === gridKonfigurasyonlari.length) {
                cokluSonuclariGoster(sonuclar, multiParams);
                multiLoader.style.display = 'none';
                multiButton.disabled = false;
                multiButton.textContent = 'Çoklu Gönder';
            }
            
        }, index * 2000); // Her hesaplama arasında 2 saniye bekle
    });
}

function cokluSonuclariGoster(sonuclar, parametreler) {
    const resultsContainer = document.getElementById('results');
    
    // Sonuçları kazanca göre sırala (en yüksekten en düşüğe)
    const siraliSonuclar = sonuclar.sort((a, b) => {
        // Sonuçlardan kazanç yüzdesini çıkar
        const aKazanc = kazancYuzdesiniCikar(a.sonuc);
        const bKazanc = kazancYuzdesiniCikar(b.sonuc);
        return bKazanc - aKazanc;
    });
    
    // Çoklu analiz başlığı
    let cokluSonucHTML = `
        <div style="background-color: #e3f2fd; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 5px solid #2196f3;">
            <h2 style="color: #1976d2; margin-top: 0;">🔍 Çoklu Grid Analizi Sonuçları</h2>
            <p><strong>Parametreler:</strong> ${parametreler}</p>
            <p><strong>Toplam ${sonuclar.length} farklı grid konfigürasyonu test edildi</strong></p>
        </div>
    `;
    
    // Her sonucu göster
    siraliSonuclar.forEach((item, siralama) => {
        const kazancYuzdesi = kazancYuzdesiniCikar(item.sonuc);
        cokluSonucHTML += `
            <div style="background-color: ${siralama === 0 ? '#e8f5e8' : '#f8f9fa'}; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid ${siralama === 0 ? '#4caf50' : '#6c757d'};">
                <h3 style="color: #495057; margin-top: 0;">
                    ${siralama + 1}. Sıra - Grid Arası %${item.yuzde} (${item.gridSayisi} Grid)
                    ${siralama === 0 ? '🏆 EN İYİ' : ''}
                </h3>
                <div style="background-color: white; padding: 10px; border-radius: 4px;">
                    ${item.sonuc}
                </div>
            </div>
        `;
    });
    
    // Özet rapor
    cokluSonucHTML += `
        <div style="background-color: #fff3cd; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 5px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">📊 Özet Rapor</h3>
            <table style="width: 100%; border-collapse: collapse; background-color: white;">
                <thead>
                    <tr style="background-color: #f8f9fa;">
                        <th style="border: 1px solid #dee2e6; padding: 8px;">Sıra</th>
                        <th style="border: 1px solid #dee2e6; padding: 8px;">Grid Arası %</th>
                        <th style="border: 1px solid #dee2e6; padding: 8px;">Grid Sayısı</th>
                        <th style="border: 1px solid #dee2e6; padding: 8px;">Kazanç %</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    siraliSonuclar.forEach((item, index) => {
        const kazancYuzdesi = kazancYuzdesiniCikar(item.sonuc);
        cokluSonucHTML += `
            <tr>
                <td style="border: 1px solid #dee2e6; padding: 8px; text-align: center;">${index + 1}</td>
                <td style="border: 1px solid #dee2e6; padding: 8px; text-align: center;">${item.yuzde}</td>
                <td style="border: 1px solid #dee2e6; padding: 8px; text-align: center;">${item.gridSayisi}</td>
                <td style="border: 1px solid #dee2e6; padding: 8px; text-align: center; color: ${kazancYuzdesi > 0 ? 'green' : 'red'};">${kazancYuzdesi.toFixed(2)}%</td>
            </tr>
        `;
    });
    
    cokluSonucHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    // Sonuçları göster
    const resultItem = document.createElement('div');
    resultItem.className = 'multi-result-item';
    resultItem.innerHTML = cokluSonucHTML;
    resultsContainer.prepend(resultItem);
}

function kazancYuzdesiniCikar(sonucHTML) {
    /**
     * HTML sonucundan kazanç yüzdesini çıkarır
     * @param {string} sonucHTML - HTML formatındaki sonuç
     * @return {number} - Kazanç yüzdesi
     */
    try {
        // "Gridden yüzde kazanç" satırını bul
        const match = sonucHTML.match(/Gridden yüzde kazanç:.*?%([0-9.-]+)/);
        if (match && match[1]) {
            return parseFloat(match[1]);
        }
        return 0;
    } catch (error) {
        console.error('Kazanç yüzdesi çıkarılırken hata:', error);
        return 0;
    }
}

function downloadBigData() {
    const symbol = document.getElementById('download-symbol').value.toUpperCase().trim();
    const interval = document.getElementById('download-interval').value;
    const startDate = document.getElementById('download-start-date').value;
    const endDate = document.getElementById('download-end-date').value;
    const loader = document.getElementById('download-loader');
    const btn = document.getElementById('download-data-btn');
    
    // Validasyon
    if (!symbol || !startDate || !endDate) {
        alert('Lütfen tüm alanları doldurunuz.');
        return;
    }
    
    if (new Date(startDate) >= new Date(endDate)) {
        alert('Bitiş tarihi başlangıç tarihinden sonra olmalıdır.');
        return;
    }
    
    loader.style.display = 'block';
    btn.disabled = true;
    btn.textContent = 'İndiriliyor...';
    
    try {
        // Veriyi çek
        const finalSymbol = symbol.includes('USDT') ? symbol : symbol + 'USDT';
        const data = collect_data(finalSymbol, interval, startDate, endDate);
        
        if (data && data.length > 0) {
            // JSON formatında indir
            const jsonData = {
                symbol: finalSymbol,
                interval: interval,
                startDate: startDate,
                endDate: endDate,
                dataCount: data.length,
                data: data,
                downloadDate: new Date().toISOString()
            };
            
            // Hafızaya da yükle
            loadedJsonData = jsonData;
            loadedDataInfo = {
                symbol: finalSymbol,
                interval: interval,
                startDate: startDate,
                endDate: endDate,
                dataCount: data.length
            };

            // Dosya bilgilerini göster
            showFileInfo();

            // Form alanlarını güncelle
            updateFormLimits();

            const jsonString = JSON.stringify(jsonData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `${finalSymbol}_${interval}_${startDate}_${endDate}_${data.length}rows.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            alert(`${data.length} satır veri başarıyla indirildi!`);
        } else {
            alert('Veri çekilemedi veya boş veri döndü.');
        }
    } catch (error) {
        console.error('Veri indirme hatası:', error);
        alert('Veri indirme sırasında hata oluştu: ' + error.message);
    } finally {
        loader.style.display = 'none';
        btn.disabled = false;
        btn.textContent = 'Büyük Veri İndir';
    }
}


function uploadJsonData() {
    const fileInput = document.getElementById('json-file-input');
    const statusDiv = document.getElementById('upload-status');
    const fileInfoDiv = document.getElementById('file-info');
    
    if (!fileInput.files || fileInput.files.length === 0) {
        showUploadStatus('Lütfen bir JSON dosyası seçiniz.', 'error');
        return;
    }
    
    const file = fileInput.files[0];
    
    if (!file.name.toLowerCase().endsWith('.json')) {
        showUploadStatus('Lütfen sadece .json uzantılı dosya seçiniz.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);
            
            // JSON validasyonu
            if (!validateJsonData(jsonData)) {
                showUploadStatus('JSON dosyası geçersiz format. Gerekli alanlar eksik.', 'error');
                return;
            }
            
            // Global değişkenlere ata
            loadedJsonData = jsonData;
            loadedDataInfo = {
                symbol: jsonData.symbol,
                interval: jsonData.interval,
                startDate: jsonData.startDate,
                endDate: jsonData.endDate,
                dataCount: jsonData.dataCount || jsonData.data.length
            };
            
            // Dosya bilgilerini göster
            showFileInfo();
            showUploadStatus('JSON dosyası başarıyla yüklendi!', 'success');
            
            // Form alanlarını güncelle
            updateFormLimits();
            
        } catch (error) {
            console.error('JSON parse hatası:', error);
            showUploadStatus('JSON dosyası okunamadı. Dosya bozuk olabilir.', 'error');
        }
    };
    
    reader.onerror = function() {
        showUploadStatus('Dosya okuma hatası oluştu.', 'error');
    };
    
    reader.readAsText(file);
}

function validateJsonData(jsonData) {
    // Gerekli alanları kontrol et
    const requiredFields = ['symbol', 'interval', 'startDate', 'endDate', 'data'];
    
    for (let field of requiredFields) {
        if (!jsonData.hasOwnProperty(field) || jsonData[field] === null || jsonData[field] === undefined) {
            console.error(`JSON validasyon hatası: ${field} alanı eksik`);
            return false;
        }
    }
    
    // Data array kontrolü
    if (!Array.isArray(jsonData.data) || jsonData.data.length === 0) {
        console.error('JSON validasyon hatası: data alanı boş veya array değil');
        return false;
    }
    
    // İlk veri satırı format kontrolü
    const firstRow = jsonData.data[0];
    if (!Array.isArray(firstRow) || firstRow.length < 6) {
        console.error('JSON validasyon hatası: Veri formatı hatalı');
        return false;
    }
    
    return true;
}

function showUploadStatus(message, type) {
    const statusDiv = document.getElementById('upload-status');
    statusDiv.textContent = message;
    statusDiv.className = type === 'error' ? 'status-error' : 'status-success';
    statusDiv.style.display = 'block';
}

function showFileInfo() {
    const fileInfoDiv = document.getElementById('file-info');
    document.getElementById('file-symbol').textContent = loadedDataInfo.symbol;
    document.getElementById('file-interval').textContent = loadedDataInfo.interval;
    document.getElementById('file-date-range').textContent = `${loadedDataInfo.startDate} - ${loadedDataInfo.endDate}`;
    document.getElementById('file-data-count').textContent = loadedDataInfo.dataCount;
    fileInfoDiv.style.display = 'block';
}

function updateFormLimits() {
    if (!loadedDataInfo.symbol) return;
    
    // Tarih inputlarının min/max değerlerini güncelle
    const startDateInput = document.getElementById('start_date');
    const endDateInput = document.getElementById('end_date');
    
    startDateInput.min = loadedDataInfo.startDate;
    startDateInput.max = loadedDataInfo.endDate;
    endDateInput.min = loadedDataInfo.startDate;
    endDateInput.max = loadedDataInfo.endDate;
    
    // Symbol inputunu güncelle
    document.getElementById('symbol').value = loadedDataInfo.symbol;
    document.getElementById('veriinterval').value = loadedDataInfo.interval;
}



/*
function hesaplabutton() {
    const resultsContainer = document.getElementById('results');
    const submitButton = document.getElementById('submit-button');
    const by=document.getElementById("beklemeyazisi");
    disableInteractions()
    submitButton.disabled=true;
    submitButton.style.display = 'none';
    
    
    
    submitButton.innerText="LÜTFEN BEKLEYİNİZZZ!!!!"
    by.innerHTML="LÜTFEN BEKLEYİNİZZZZZ!!!!!!!! (Tarihler arasında 1 ay varsa, 1 dk beklemeniz gerekir.)"
    let symbolg=document.getElementById("symbol").value;
    let startg=document.getElementById("start").value;
    let endg=document.getElementById("end").value;
    let num_levelsg=document.getElementById("num_levels").value;
    let comissiong=document.getElementById("comission").value;
    let girilenilkbakiyeg=document.getElementById("girilenilkbakiye").value;
    let veriintervalg=document.getElementById("veriinterval").value;
    let start_dateg=document.getElementById("start_date").value;
    let end_dateg=document.getElementById("end_date").value;
    var result=""
    
    if (symbolg==null || startg==null || endg==null || num_levelsg==null || comissiong==null ||girilenilkbakiyeg==null || veriintervalg==null ||start_dateg==null || end_dateg==null) {
        alert("Lütfen tüm alanları doldurunuz!")       
    } else {
        setTimeout(() => {
            result = mybacktest(symbolg, startg, endg, num_levelsg, comissiong, girilenilkbakiyeg, veriintervalg, start_dateg, end_dateg);
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = result;
            resultsContainer.prepend(resultItem);
            enableInteractions();
            by.innerHTML="";
            submitButton.innerText="GÖNDER"
            submitButton.disabled=false;
            submitButton.style.display = 'block';
            enableInteractions()
    
        }, 1000);
    }
    
}
*/
//submitButton.addEventListener('click', () => {
    
    
    
//});

//import { mybacktest } from './myscript3.js';
document.addEventListener('DOMContentLoaded', () => {
    const startDateInput = document.getElementById('start_date');
    const endDateInput = document.getElementById('end_date');
    const resultsContainer = document.getElementById('results');
    const submitButton = document.getElementById('submit-button');
    const by=document.getElementById("beklemeyazisi");

    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    // Set default values
    startDateInput.value = oneMonthAgo.toISOString().split('T')[0];
    endDateInput.value = today.toISOString().split('T')[0];

    // Set min and max constraints
    startDateInput.min = '2014-01-01';
    startDateInput.max = today.toISOString().split('T')[0];
    endDateInput.min = '2014-01-01';
    endDateInput.max = today.toISOString().split('T')[0];

    // Add restrictions to ensure logic
    startDateInput.addEventListener('change', () => {
        if (new Date(startDateInput.value) > new Date(endDateInput.value)) {
            endDateInput.value = startDateInput.value;
        }
        endDateInput.min = startDateInput.value;
    });

    endDateInput.addEventListener('change', () => {
        if (new Date(endDateInput.value) < new Date(startDateInput.value)) {
            startDateInput.value = endDateInput.value;
        }
        startDateInput.max = endDateInput.value;
    });

    function generateResult() {
        const startDate = document.getElementById('start_date').value;
        const endDate = document.getElementById('end_date').value;
        const result = `Start Date: ${startDate}, End Date: ${endDate}`;
        return result;
    }

    // Veri yönetimi butonları
    document.getElementById('download-data-btn').addEventListener('click', downloadBigData);
    document.getElementById('upload-json-btn').addEventListener('click', uploadJsonData);

    // Tarih inputları için veri yönetimi kontrolleri
    document.getElementById('download-start-date').addEventListener('change', function() {
        const endInput = document.getElementById('download-end-date');
        if (new Date(this.value) > new Date(endInput.value)) {
            endInput.value = this.value;
        }
        endInput.min = this.value;
    });

    document.getElementById('download-end-date').addEventListener('change', function() {
        const startInput = document.getElementById('download-start-date');
        if (new Date(this.value) < new Date(startInput.value)) {
            startInput.value = this.value;
        }
        startInput.max = this.value;
    });
    
});







//////////////////////////Grid Bor Backtest Fonksiyonları:
// Değişkenler
let levels = [];
let geometric_percentage = [];

let symbol = "";
let start = 1.1;
let end = 1.1;
let num_levels = 1;
let comission = 1.1;
let minmiktarondalik = 8;
let myticksize = 1;
let precision_info = {};
let data_first_close = 0.032;
let veriinterval = "5m"; // Örnek: Kullanıcıdan alınan veri
let veri_days_back = 3;  // Örnek: Kullanıcıdan alınan veri
let data = [];
let girilenilkbakiye = 0;
let mymyq = 0.0;
let carpim = 1;
let old_alinacaklar = [];
let old_satilacaklar = [];
let start_date = "2024-04-17";
let end_date = "2024-07-27";
let current_price=0.0;
let division_type="geometric"

// Sorular
let soracaklarim = [
"Bu bir telegram botu mesajıdır. Grid bactestine baştan başlıyoruz. Grid botu, verdiğiniz tarih aralıklarında spot grid bot yapsanız, kaç dolar elde ederdiniz, bunu öğreneceksiniz. Lütfen, parantez içlerindeki örnek formatında giriniz. istediğiniz zaman başlat yazarak soruları baştan başlatabilirsiniz. \nCoin Çiftini Giriniz (Örn:     ONEUSDT      ): ",
"Alt seviyeyi giriniz (Örn: 0.02): ",
"Üst seviyeyi giriniz (Örn: 0.6): ",
"Grid sayısını giriniz (alt üst sınır arası kaça bölünsün?) (Binance limit=max 200) (Örn: 200): ",
"Komisyon yüzdesi (Örn: 0.1 (yani binde bir) (sadece sayı giriniz, yüzde işareti girmeyiniz)): ",
"Başlangıç sermayesi kaç USDT olsun (Örn. 1000): ",
"Zaman dilimi ne olsun? (1 dakikalıklarda kontrol etmek için 1m yazınız) (Örn.: 1m, 5m, 1h, 1d): ",
"Botun çalışma başlangıç tarihini yıl tire ay tire gün şeklinde yazınız (Örn. 2024-01-17): ",
"Botun çalışma bitiş tarihini yıl tire ay tire gün şeklinde yazınız (Örn. 2024-12-27): \n(bu soruyu cevapladıktan sonra lütfen işlemin bitmesini bekleyiniz, cevabınız gelecek. 365 günlük veri işlenmesi yaklaşık 20 dakika sürer...)"
];

// Grid Backtest Fonksiyonları
function girdiler() {
// Global değişkenlere erişim
symbol = symbol;
start = start;
end = end;
num_levels = num_levels;
comission = comission;
girilenilkbakiye = girilenilkbakiye;
veriinterval = veriinterval;
veri_days_back = veri_days_back;
division_type=division_type;

levels = levels;
geometric_percentage = geometric_percentage;
minmiktarondalik = minmiktarondalik;
myticksize = myticksize;
precision_info = precision_info;
data_first_close = data_first_close;
data = data;
start_date = start_date;
end_date = end_date;

// Veriyi çekmek ve precision bilgisi almak
data = vericekis(veriinterval, start_date, end_date);
data_first_close = parseFloat(data[0][4]);

let precisionResults = get_precision(symbol);
minmiktarondalik = precisionResults[0]//==null?8:precisionResults[0];
myticksize = precisionResults[1];
precision_info = precisionResults[2];

let divisionResults = geometric_division(start, end, num_levels,division_type);
levels = divisionResults[0];
geometric_percentage = divisionResults[1];
arithmetic_step=divisionResults[2]
}

function get_coin_price(symbol) {
    /**
     * Belirtilen coin çiftinin fiyatını döndürür.
     * @param {string} symbol - Coin çifti (örn: 'ONEUSDT')
     * @return {number|null} - Fiyat (float) veya null (hata durumunda)
     */
    let url = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol.toUpperCase()}`;
    try {
        let request = new XMLHttpRequest();
        request.open("GET", url, false); // Senkron HTTP isteği
        request.send();
        if (request.status === 200) {
            let response = JSON.parse(request.responseText);
            return parseFloat(response.price);
        } else {
            console.error(`Hata: HTTP Durum Kodu ${request.status}`);
            return null;
        }
    } catch (e) {
        console.error(`Get_coin_price Hata: ${e}`);
        return null;
    }
}

function count_decimal_places(number) {
    /**
     * Bir float sayının noktadan sonraki matematiksel anlamlı basamak sayısını döndürür.
     * @param {number} number - Kontrol edilecek sayı
     * @return {number} - Noktadan sonraki anlamlı basamak sayısı
     */
    let normalized = parseFloat(number).toString();
    if (normalized.includes(".")) {
        return normalized.split(".")[1].length;
    }
    return 0;
}

function get_precision(symbol) {
    /**
     * Binance API kullanarak bir coinin precision değerlerini alır.
     * @param {string} symbol - İşlem çifti (örn. "ONEUSDT").
     * @return {Array|null} - [minmiktarondalik, myticksize, precision_info] veya null (hata durumunda).
     */
    console.log("preciion bilgileri alınıyoooooooooooooooooooooooooorrrrrrrrrrrrrr!!!!!!!!!!!!!!!")
    let url = "https://api.binance.com/api/v3/exchangeInfo";
    try {
        let request = new XMLHttpRequest();
        request.open("GET", url, false); // Senkron HTTP isteği
        request.send();

        if (request.status === 200) {
            let exchange_info = JSON.parse(request.responseText);

            // İlgili sembolün bilgilerini bul
            for (let s of exchange_info.symbols) {
                if (s.symbol === symbol) {
                    let precision_info = {
                        baseAssetPrecision: s.baseAssetPrecision,  // Coin miktar hassasiyeti
                        quoteAssetPrecision: s.quoteAssetPrecision,  // USDT veya BTC hassasiyeti
                        stepSize: null,  // Minimum miktar adımı
                        tickSize: null   // Minimum fiyat adımı
                    };

                    // Emir hassasiyetlerini al
                    for (let filt of s.filters) {
                        if (filt.filterType === "LOT_SIZE") {
                            precision_info.stepSize = filt.stepSize;
                        }
                        if (filt.filterType === "PRICE_FILTER") {
                            precision_info.tickSize = filt.tickSize;
                        }
                    }

                    let minmiktarondalik2 = count_decimal_places(precision_info.stepSize);
                    let myticksize2 = count_decimal_places(precision_info.tickSize);
                    console.log(minmiktarondalik2,myticksize2,precision_info)
                    return [minmiktarondalik2, myticksize2, precision_info];
                }
            }

            // Sembol bulunamazsa
            console.error(`Precision: ${symbol} çifti bulunamadı.`);
            return null;
        } else {
            console.error(`Hata: Precision: HTTP Durum Kodu ${request.status}`);
            return null;
        }
    } catch (e) {
        console.error(" Precision: Hata oluştu:", e);
        return null;
    }
}

function geometric_division(start, end, num_levels, type = "geometric") {
    /**
     * Belirli bir aralığı geometrik veya aritmetik olarak bölerek seviyeleri ve yüzdeleri döndürür.
     *
     * @param {number} start - Başlangıç değeri (aralığın alt sınırı).
     * @param {number} end - Bitiş değeri (aralığın üst sınırı).
     * @param {number} num_levels - Bölünmek istenen seviye sayısı.
     * @param {string} type - Bölme tipi. "geometric" (varsayılan) veya "arithmetic".
     * @return {[Array<number>, number|Array<number>]} - [Seviyelerin listesi, yüzde(ler)].
     */
    if (num_levels <= 1) {
        throw new Error("Number of levels must be greater than 1.");
    }

    let levels = [];
    let percentages = [];
    let mystep=0.0;

    if (type.toLowerCase() === "geometric") {
        let ratio = Math.pow(end / start, 1 / (num_levels - 1));
        let current = start;

        for (let i = 0; i < num_levels; i++) {
            levels.push(parseFloat(current.toFixed(8)));
            current *= ratio;
        }

        let geometric_percentage = levels.length > 1 ? ((levels[1] - levels[0]) / levels[0]) * 100 : 0;
        percentages = [parseFloat(geometric_percentage.toFixed(2))]; // Tek bir sayı olarak döndür
    } else if (type.toLowerCase() === "arithmetic") {
        let step = (end - start) / (num_levels - 1);
        mystep=step;
        let current = start;

        for (let i = 0; i < num_levels; i++) {
            levels.push(parseFloat(current.toFixed(8)));
            current += step;
        }

        // Aritmetik için yüzdeleri hesapla ve bir dizi olarak döndür
        if (levels.length > 1) {
            percentages.push(parseFloat(((levels[1] - levels[0]) / levels[0]) * 100).toFixed(2)); // İlk aralık yüzdesi
            percentages.push(parseFloat(((levels[levels.length - 1] - levels[levels.length - 2]) / levels[levels.length - 2]) * 100).toFixed(2)); // Son aralık yüzdesi
        } else {
            percentages = [0,0];
        }
    } else {
        throw new Error("Invalid type. Must be 'geometric' or 'arithmetic'.");
    }

    return [levels, percentages,mystep];
}



function geometric_division_eski2(start, end, num_levels, type = "geometric") {
    /**
     * Belirli bir aralığı geometrik veya aritmetik olarak bölerek seviyeleri döndürür.
     *
     * @param {number} start - Başlangıç değeri (aralığın alt sınırı).
     * @param {number} end - Bitiş değeri (aralığın üst sınırı).
     * @param {number} num_levels - Bölünmek istenen seviye sayısı.
     * @param {string} type - Bölme tipi. "geometric" (varsayılan) veya "arithmetic".
     * @return {[Array<number>, number]} - [Seviyelerin listesi, yüzde].
     */
    if (num_levels <= 1) {
        throw new Error("Number of levels must be greater than 1.");
    }

    let levels = [];
    let percentage = 0;

    if (type.toLowerCase() === "geometric") {
        let ratio = Math.pow(end / start, 1 / (num_levels - 1));
        let current = start;

        for (let i = 0; i < num_levels; i++) {
            levels.push(parseFloat(current.toFixed(8))); // Hassasiyeti 8 basamağa yuvarlama
            current *= ratio;
        }

        percentage =
            levels.length > 1
                ? ((levels[1] - levels[0]) / levels[0]) * 100
                : 0;
    } else if (type.toLowerCase() === "arithmetic") {
        let step = (end - start) / (num_levels - 1);
        let current = start;

        for (let i = 0; i < num_levels; i++) {
            levels.push(parseFloat(current.toFixed(8))); // Hassasiyeti 8 basamağa yuvarlama
            current += step;
        }

        percentage = levels.length > 1 ? ((levels[1] - levels[0])) *100 / levels[0]: 0;
    } else {
        throw new Error("Invalid type. Must be 'geometric' or 'arithmetic'.");
    }

    return [levels, parseFloat(percentage.toFixed(2))];
}


function geometric_division_eski(start, end, num_levels) {
    /**
     * Belirli bir aralığı geometrik olarak bölerek seviyeleri döndürür.
     *
     * @param {number} start - Başlangıç değeri (aralığın alt sınırı).
     * @param {number} end - Bitiş değeri (aralığın üst sınırı).
     * @param {number} num_levels - Bölünmek istenen geometrik seviye sayısı.
     * @return {[Array<number>, number]} - [Geometrik seviyelerin listesi, geometrik yüzde].
     */
    if (num_levels <= 1) {
        throw new Error("Number of levels must be greater than 1.");
    }

    let levels = [];
    let ratio = Math.pow(end / start, 1 / (num_levels - 1));
    let current = start;

    for (let i = 0; i < num_levels; i++) {
        levels.push(parseFloat(current.toFixed(8))); // Hassasiyeti 8 basamağa yuvarlama
        current *= ratio;
    }

    let geometric_percentage =
        levels.length > 1
            ? ((levels[1] - levels[0]) / levels[0]) * 100
            : 0;

    return [levels, parseFloat(geometric_percentage.toFixed(2))];
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function collect_data(symbol, interval, start_date, end_date) {
    /**
     * Binance API'den belirtilen tarih aralığı için geçmiş fiyat verilerini toplar.
     * @param {string} symbol - Coin çifti.
     * @param {string} interval - Zaman aralığı (örn. "1m", "5m", "1h", "1d").
     * @param {string} start_date - Başlangıç tarihi ("YYYY-MM-DD").
     * @param {string} end_date - Bitiş tarihi ("YYYY-MM-DD").
     * @return {Array} - Veriler [timestamp, open, high, low, close, volume] formatında.
     */

    const url = "https://api.binance.com/api/v3/klines";
    let all_data = [];
    const startTime = new Date(start_date).getTime();
    const endTime = new Date(end_date).getTime();
    let currentStartTime = startTime;

    while (currentStartTime < endTime) {
        let currentEndTime = Math.min(currentStartTime + 24 * 60 * 60 * 1000, endTime); // Günlük istek sınırı
        const requestUrl = `${url}?symbol=${symbol.toUpperCase()}&interval=${interval}&startTime=${currentStartTime}&endTime=${currentEndTime}&limit=1000`;

        let xhr = new XMLHttpRequest();

        try {
            xhr.open("GET", requestUrl, false); // Senkron istek
            xhr.send();

            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);

                response.forEach((kline) => {
                    all_data.push([
                        new Date(kline[0]).toISOString(), // timestamp
                        parseFloat(kline[1]), // open
                        parseFloat(kline[2]), // high
                        parseFloat(kline[3]), // low
                        parseFloat(kline[4]), // close
                        parseFloat(kline[5]) // volume
                    ]);
                });

                // Son zaman damgasını güncelle
                currentStartTime = response[response.length - 1][6];
            } else {
                console.log(`Collect_data Hata: ${xhr.status} - ${xhr.statusText}`);
                break;
            }
        } catch (e) {
            console.log(`collect data Hata: ${e.message}`);
            break;
        }
    }
    console.log(all_data)
    return all_data;
}


function collect_data_iptal(symbol, interval, start_date, end_date) {
    /**
     * Binance API'den belirtilen tarih aralığı için geçmiş fiyat verilerini toplar.
     *
     * @param {string} symbol - Coin çifti.
     * @param {string} interval - Zaman aralığı (örn. "1m", "5m", "1h", "1d").
     * @param {string} start_date - Başlangıç tarihi ("YYYY-MM-DD").
     * @param {string} end_date - Bitiş tarihi ("YYYY-MM-DD").
     * @return {Array} - Veriler [timestamp, open, high, low, close, volume] formatında.
     */
    function parseDate(dateString) {
        return new Date(dateString + "T00:00:00Z").getTime();
    }

    let start_time = parseDate(start_date);
    let end_time = parseDate(end_date);

    console.log(`Fetching data for ${symbol} from ${start_date} to ${end_date} with interval ${interval}...`);
    let all_data = [];
    let current_start_time = start_time;

    while (current_start_time < end_time) {
        let current_end_time = Math.min(current_start_time + 24 * 60 * 60 * 1000, end_time); // 1 gün

        try {
            let klines = fetch_binance_klines(symbol, interval, current_start_time, current_end_time);
            for (let kline of klines) {
                let timestamp = new Date(kline[0]).toISOString();
                let open_price = kline[1];
                let high_price = kline[2];
                let low_price = kline[3];
                let close_price = kline[4];
                let volume = kline[5];
                all_data.push([timestamp, open_price, high_price, low_price, close_price, volume]);
            }

            current_start_time = klines.length > 0 ? klines[klines.length - 1][6] : current_end_time;
            delay(140); // 1 saniye bekleme
        } catch (e) {
            console.error(`Error fetching data: ${e}`);
            break;
        }
    }

    return all_data;
}

function fetch_binance_klines(symbol, interval, start_time, end_time) {
    /**
     * Binance API'den kline verilerini alır.
     *
     * @param {string} symbol - Coin çifti.
     * @param {string} interval - Zaman aralığı.
     * @param {number} start_time - Başlangıç zaman damgası (milisaniye cinsinden).
     * @param {number} end_time - Bitiş zaman damgası (milisaniye cinsinden).
     * @return {Array} - Kline verileri.
     */
    let url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${start_time}&endTime=${end_time}`;
    let request = new XMLHttpRequest();
    request.open("GET", url, false); // Senkron istek
    request.send();

    if (request.status === 200) {
        return JSON.parse(request.responseText);
    } else {
        throw new Error(`HTTP Error: ${request.status}`);
    }
}


function vericekis(veriinterval, start_date, end_date) {
    /**
     * JSON dosyasından veri çeken veya API'den çeken fonksiyon.
     */
    if (!loadedJsonData) {
        throw new Error("Önce JSON dosyası yüklenmelidir veya büyük veri indirilmelidir!");
    }
    
    // Yüklenen veri ile uyumluluk kontrolü
    if (loadedDataInfo.interval !== veriinterval) {
        throw new Error(`Zaman dilimi uyumsuz! Yüklenen: ${loadedDataInfo.interval}, İstenen: ${veriinterval}`);
    }
    
    if (loadedDataInfo.symbol !== symbol) {
        throw new Error(`Sembol uyumsuz! Yüklenen: ${loadedDataInfo.symbol}, İstenen: ${symbol}`);
    }
    
    // Tarih aralığı kontrolü
    const requestStart = new Date(start_date);
    const requestEnd = new Date(end_date);
    const loadedStart = new Date(loadedDataInfo.startDate);
    const loadedEnd = new Date(loadedDataInfo.endDate);
    
    if (requestStart < loadedStart || requestEnd > loadedEnd) {
        throw new Error(`Tarih aralığı uyumsuz! Yüklenen: ${loadedDataInfo.startDate} - ${loadedDataInfo.endDate}, İstenen: ${start_date} - ${end_date}`);
    }
    
    // İstenen tarih aralığındaki veriyi filtrele
    const filteredData = loadedJsonData.data.filter(row => {
        const rowDate = new Date(row[0]);
        return rowDate >= requestStart && rowDate <= requestEnd;
    });
    
    console.log(`Filtrelenen veri sayısı: ${filteredData.length}`);
    return filteredData;
}

function fetch_binance_klines(symbol, interval, start_time, end_time) {
    /**
     * Binance API'den kline verilerini alır.
     *
     * @param {string} symbol - Coin çifti.
     * @param {string} interval - Zaman dilimi (örn. "1m", "5m", "1h", "1d").
     * @param {number} start_time - Başlangıç zaman damgası (milisaniye cinsinden).
     * @param {number} end_time - Bitiş zaman damgası (milisaniye cinsinden).
     * @return {Array} - Kline verileri.
     */
    let url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${start_time}&endTime=${end_time}&limit=1000`;

    let request = new XMLHttpRequest();
    request.open("GET", url, false); // Senkron HTTP isteği
    request.send();

    if (request.status === 200) {
        return JSON.parse(request.responseText);
    } else {
        throw new Error(`Error fetching data from Binance: ${request.status} ${request.responseText}`);
    }
}


let alinacaklar = [];
let satilacaklar = [];
let oncekialinacaklar = [];
let oncekisatilacaklar = [];
let oncekialinacaklevelsonprice = 1000000;
let oncekisatilacaklevelilkprice = 1000000;

function split_levels(levels, myclose, high = null, low = null) {
    if (!levels || levels.length === 0) {
        console.error("Hata: 'levels' listesi boş!");
        return [[], []];
    }

    if (low !== null && high !== null) {
        if (high < levels[0]) {
            alinacaklar = [];
            satilacaklar = [...levels];
            oncekisatilacaklevelilkprice = satilacaklar.length > 0 ? satilacaklar[0] : levels[levels.length - 1];
            oncekialinacaklevelsonprice = alinacaklar.length > 0 ? alinacaklar[alinacaklar.length - 1] : levels[0];
            return [alinacaklar, satilacaklar];
        } else if (low > levels[levels.length - 1]) {
            alinacaklar = [...levels];
            satilacaklar = [];
            oncekisatilacaklevelilkprice = satilacaklar.length > 0 ? satilacaklar[0] : levels[levels.length - 1];
            oncekialinacaklevelsonprice = alinacaklar.length > 0 ? alinacaklar[alinacaklar.length - 1] : levels[0];
            return [alinacaklar, satilacaklar];
        }
    } else {
        if (myclose < levels[0]) {
            alinacaklar = [];
            satilacaklar = [...levels];
            oncekisatilacaklevelilkprice = satilacaklar.length > 0 ? satilacaklar[0] : levels[levels.length - 1];
            oncekialinacaklevelsonprice = alinacaklar.length > 0 ? alinacaklar[alinacaklar.length - 1] : levels[0];
            return [alinacaklar, satilacaklar];
        } else if (myclose > levels[levels.length - 1]) {
            alinacaklar = [...levels];
            satilacaklar = [];
            oncekisatilacaklevelilkprice = satilacaklar.length > 0 ? satilacaklar[0] : levels[levels.length - 1];
            oncekialinacaklevelsonprice = alinacaklar.length > 0 ? alinacaklar[alinacaklar.length - 1] : levels[0];
            return [alinacaklar, satilacaklar];
        }
    }

    if (oncekisatilacaklevelilkprice === 1000000) {
        let closest_level = levels.reduce((prev, curr) =>
            Math.abs(curr - myclose) < Math.abs(prev - myclose) ? curr : prev
        );
        let gecicilevels = levels.filter(level => level !== closest_level);
        satilacaklar = gecicilevels.filter(level => level > myclose);
        alinacaklar = gecicilevels.filter(level => level < myclose);
        oncekisatilacaklar = [...satilacaklar];
        oncekialinacaklar = [...alinacaklar];
        oncekisatilacaklevelilkprice = satilacaklar.length > 0 ? satilacaklar[0] : levels[levels.length - 1];
        oncekialinacaklevelsonprice = alinacaklar.length > 0 ? alinacaklar[alinacaklar.length - 1] : levels[0];
    }

    if (low !== null && high !== null) {
        if (low > oncekialinacaklevelsonprice && high < oncekisatilacaklevelilkprice) {
            return [oncekialinacaklar, oncekisatilacaklar];
        } else if (low < oncekialinacaklevelsonprice) {
            let closest_level = levels.reduce((prev, curr) =>
                Math.abs(curr - low) < Math.abs(prev - low) ? curr : prev
            );
            let gecicilevels = levels.filter(level => level !== closest_level);
            satilacaklar = gecicilevels.filter(level => level > low);
            alinacaklar = gecicilevels.filter(level => level < low);
            oncekisatilacaklar = [...satilacaklar];
            oncekisatilacaklevelilkprice = satilacaklar.length > 0 ? satilacaklar[0] : levels[levels.length - 1];
            oncekialinacaklevelsonprice = alinacaklar.length > 0 ? alinacaklar[alinacaklar.length - 1] : levels[0];
            oncekialinacaklar = [...alinacaklar];
            return [alinacaklar, satilacaklar];
        } else if (high > oncekisatilacaklevelilkprice) {
            let closest_level = levels.reduce((prev, curr) =>
                Math.abs(curr - high) < Math.abs(prev - high) ? curr : prev
            );
            let gecicilevels = levels.filter(level => level !== closest_level);
            satilacaklar = gecicilevels.filter(level => level > high);
            alinacaklar = gecicilevels.filter(level => level < high);
            oncekisatilacaklar = [...satilacaklar];
            oncekisatilacaklevelilkprice = satilacaklar.length > 0 ? satilacaklar[0] : levels[levels.length - 1];
            oncekialinacaklevelsonprice = alinacaklar.length > 0 ? alinacaklar[alinacaklar.length - 1] : levels[0];
            oncekialinacaklar = [...alinacaklar];
            return [alinacaklar, satilacaklar];
        }
    } else {
        if (myclose > oncekialinacaklevelsonprice && myclose < oncekisatilacaklevelilkprice) {
            return [oncekialinacaklar, oncekisatilacaklar];
        } else {
            let closest_level = levels.reduce((prev, curr) =>
                Math.abs(curr - myclose) < Math.abs(prev - myclose) ? curr : prev
            );
            let gecicilevels = levels.filter(level => level !== closest_level);
            satilacaklar = gecicilevels.filter(level => level > myclose);
            alinacaklar = gecicilevels.filter(level => level < myclose);
            oncekisatilacaklar = [...satilacaklar];
            oncekialinacaklar = [...alinacaklar];
            oncekisatilacaklevelilkprice = satilacaklar.length > 0 ? satilacaklar[0] : levels[levels.length - 1];
            oncekialinacaklevelsonprice = alinacaklar.length > 0 ? alinacaklar[alinacaklar.length - 1] : levels[0];
            return [alinacaklar, satilacaklar];
        }
    }
}

function ilkbakiyehesapla() {
    /**
     * İlk bakiye hesaplama fonksiyonu.
     * @return {number} - Gerekli toplam USDT miktarı.
     */
    let q1 = 5.5 / start;
    let carpim = 1;

    for (let i = 0; i < minmiktarondalik; i++) {
        carpim *= 10;
    }

    q1 = Math.ceil(q1 * carpim) / carpim; // Hep aynı miktar alınacak.
    let gereklialtusdt = 0.0;

    for (let level of old_alinacaklar) {
        gereklialtusdt += Math.ceil((level * q1) * carpim) / carpim;
    }

    let gerekliustusdt = (Math.ceil((current_price * q1) * carpim) / carpim) * old_satilacaklar.length;

    return gereklialtusdt + gerekliustusdt;
}

function sonbakiyehesapla(sonclose, sonalinacaklar, sonsatilacaklar) {
    /**
     * Son bakiye hesaplama fonksiyonu.
     * @param {number} sonclose - Son kapanış fiyatı.
     * @param {Array<number>} sonalinacaklar - Alınacak seviyeler.
     * @param {Array<number>} sonsatilacaklar - Satılacak seviyeler.
     * @return {number} - Gerekli toplam USDT miktarı.
     */
    let q1 = 5.5 / start;
    let carpim = 1;

    for (let i = 0; i < minmiktarondalik; i++) {
        carpim *= 10;
    }

    q1 = Math.ceil(q1 * carpim) / carpim; // Hep aynı miktar alınacak.
    let gereklialtusdt = 0.0;

    for (let level of sonalinacaklar) {
        gereklialtusdt += Math.ceil((level * q1) * carpim) / carpim;
    }

    let gerekliustusdt = (Math.ceil((sonclose * q1) * carpim) / carpim) * sonsatilacaklar.length;

    return gereklialtusdt + gerekliustusdt;
}


function find_excess_items(old_list, new_list) {
    /**
     * Yeni alinacaklar listesindeki, eski alinacaklar listesine göre fazla olan elemanları döndürür.
     *
     * @param {Array} old_list - Eski alinacaklar listesi.
     * @param {Array} new_list - Yeni alinacaklar listesi.
     * @return {Array} - Yeni alinacaklar listesindeki fazlalık elemanlar.
     */
    let excess_items = new_list.filter(item => !old_list.includes(item));
    return excess_items;
}

function get_coin_data(symbol) {
    /**
     * Coin çiftinin fiyat, high ve low değerlerini döndürür.
     *
     * @param {string} symbol - Coin çifti (örn: 'ONEUSDT').
     * @return {Array|null} - Liste [price, high, low] veya null (hata durumunda).
     */
    let url = `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol.toUpperCase()}`;
    try {
        let request = new XMLHttpRequest();
        request.open("GET", url, false); // Senkron HTTP isteği
        request.send();

        if (request.status === 200) {
            let data = JSON.parse(request.responseText);
            let price = parseFloat(data.lastPrice);
            let high = parseFloat(data.highPrice);
            let low = parseFloat(data.lowPrice);
            return [price, high, low];
        } else {
            console.error(`Hata: HTTP Durum Kodu ${request.status}`);
            return null;
        }
    } catch (e) {
        console.error(`Get_coin_data1 Hata: ${e}`);
        return null;
    }
}


function ilkgiris() {
    /**
     * İlk giriş işlemlerini gerçekleştirir.
     */
    let alinacaklar, satilacaklar;
    [alinacaklar, satilacaklar] = split_levels(levels, data_first_close);
    let new_alinacaklar = [...alinacaklar];
    let new_satilacaklar = [...satilacaklar];

    if (new_alinacaklar.length > 0) {
        for (let orderprice of new_alinacaklar) {
            // place_buy_order(symbol, orderprice, mymyq);
            console.log("aşağıya al emri konuldu", orderprice);
        }
    }

    let carpim = 1;
    for (let i = 0; i < minmiktarondalik; i++) {
        carpim *= 10;
    }

    let alinacakcoin = Math.ceil(0.00000000000001 * carpim) / carpim;

    if (new_satilacaklar.length > 0) {
        for (let orderprice of new_satilacaklar) {
            let quantity = mymyq;
            alinacakcoin += quantity;
            // place_sell_order(symbol, orderprice, mymyq);
            console.log("yukarıya sat emri konuldu", orderprice, quantity);
        }
    }

    alinacakcoin = Math.ceil(alinacakcoin * carpim) / carpim;
    // place_market_buy_order(symbol, alinacakcoin);
    console.log("şu kadar başlangıç için coin alındı:", alinacakcoin);
}

function create_and_write_txt(file_name, content) {
    /**
     * Belirtilen isimle bir txt dosyası oluşturur ve içine belirtilen içeriği yazar.
     *
     * @param {string} file_name - Dosya adı (uzantı .txt ile bitmeli).
     * @param {string} content - Dosyaya yazılacak içerik.
     */
    if (!file_name.endsWith('.txt')) {
        file_name += '.txt';
    }

    try {
        let file = new Blob([content], { type: "text/plain;charset=utf-8" });
        let link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.download = file_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log(`'${file_name}' dosyası başarıyla oluşturuldu ve içerik yazıldı.`);
    } catch (e) {
        console.error(`Hata oluştu: ${e}`);
    }
}


function read_api_key(dosya) {
    /**
     * Belirtilen dosyayı okuyarak içeriğini döner.
     * 
     * @param {string} dosya - Dosya adı (örn: "akey.txt").
     * @return {string|null} - Dosya içeriği veya `null` (dosya yoksa).
     */
    try {
        let request = new XMLHttpRequest();
        request.open("GET", dosya, false); // Senkron olarak dosya içeriğini oku
        request.send();

        if (request.status === 200) {
            return request.responseText.trim();
        } else {
            return null;
        }
    } catch (e) {
        return null;
    }
}

function check_api_key_file() {
    /**
     * Çalışma dizinindeki "a.txt" ve "s.txt" dosyalarının varlığını kontrol eder.
     * 
     * @return {boolean} - Tüm dosyalar mevcutsa `true`, aksi halde `false`.
     */
    try {
        let aFileExists = false;
        let sFileExists = false;

        let aRequest = new XMLHttpRequest();
        aRequest.open("HEAD", "a.txt", false);
        aRequest.send();
        if (aRequest.status === 200) {
            aFileExists = true;
        }

        let sRequest = new XMLHttpRequest();
        sRequest.open("HEAD", "s.txt", false);
        sRequest.send();
        if (sRequest.status === 200) {
            sFileExists = true;
        }

        return aFileExists && sFileExists;
    } catch (e) {
        return false;
    }
}

function get_current_datetime_text() {
    /**
    * Şimdiki zamanı yıl, ay, gün, saat, dakika ve saniye olarak döner.
    * 
    * @return {string} - Zaman bilgisi (örn: "2025-01-04-14-30-45").
    */
    let now = new Date();
    let year = now.getFullYear();
    let month = String(now.getMonth() + 1).padStart(2, "0");
    let day = String(now.getDate()).padStart(2, "0");
    let hours = String(now.getHours()).padStart(2, "0");
    let minutes = String(now.getMinutes()).padStart(2, "0");
    let seconds = String(now.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
}

// Kullanım Örnekleri
// let apiKey = read_api_key("akey.txt");
// if (apiKey) {
//     console.log(`API Anahtarı: ${apiKey}`);
// } else {
//     console.log("Dosya bulunamadı veya okunamadı.");

// let filesExist = check_api_key_file();
// console.log(filesExist ? "Dosyalar mevcut." : "Dosyalar eksik.");

// let currentTimeText = get_current_datetime_text();
// console.log(currentTimeText);


let gridprofit = 0.0000001;

function toplam_kar_hesapla(son_fiyat, yuzde_artis, komisyon_orani, lot_sayisi) {
    /**
    * Toplam karı hesaplayan fonksiyon.
    *
    * @param {number} son_fiyat - İşlemin bitiş fiyatı.
    * @param {number} yuzde_artis - Başlangıç fiyatından itibaren yüzde kaç artışla son fiyata ulaşıldı (örn: 1 için %1).
    * @param {number} komisyon_orani - Komisyon oranı (örn: 0.003 için %0.3).
    * @param {number} lot_sayisi - İşlem yapılan toplam lot sayısı.
    * @return {number} - İşlemden elde edilen toplam kar.
    */
    // Başlangıç fiyatını hesapla
    let baslangic_fiyati = son_fiyat / (1 + yuzde_artis);

    // Birim başına karı hesapla
    let birim_kar = (son_fiyat - baslangic_fiyati) - (son_fiyat * komisyon_orani);

    // Toplam karı hesapla
    let toplam_kar = birim_kar * lot_sayisi;

    return toplam_kar;
}

function toplam_kar_hesapla_arithmetic(buy_fiyat, arithmetic_step, komisyon_orani, lot_sayisi) {
    /**
     * Tek birim işlemde kar hesabı yapar (aritmetik artışlı).
     *
     * @param {number} buy_fiyat - Coini aldığımız fiyat.
     * @param {number} arithmetic_step - Fiyat artış miktarı.
     * @param {number} komisyon_orani - Komisyon oranı (yüzde olarak).
     * @param {number} lot_sayisi - Alınan lot sayısı.
     * @return {number} - Toplam kar.
     */

    if (typeof buy_fiyat !== 'number' || typeof arithmetic_step !== 'number' || typeof komisyon_orani !== 'number' || typeof lot_sayisi !== 'number') {
        throw new Error("Tüm parametreler sayı olmalıdır.");
    }

    if (komisyon_orani < 0 || komisyon_orani > 100)
    {
        throw new Error("Komisyon oranı 0 ile 100 arasında olmalıdır.");
    }

    if (lot_sayisi <= 0)
    {
        throw new Error("Lot sayısı 0'dan büyük olmalıdır.");
    }

    if (buy_fiyat <= 0)
    {
        throw new Error("Alış fiyatı 0'dan büyük olmalıdır.");
    }

    let sell_fiyat = buy_fiyat + arithmetic_step;
    let ham_kar = (sell_fiyat - buy_fiyat) * lot_sayisi;
    let komisyon_miktari = (sell_fiyat * komisyon_orani / 100) * lot_sayisi;
    let net_kar = ham_kar - komisyon_miktari;

    return parseFloat(net_kar.toFixed(8)); // Hassasiyet için 8 basamağa yuvarlama
}

function ilkveonbakiyehesapla() {
    /**
    * İlk ve son bakiye hesaplama fonksiyonu.
    *
    * @return {[number, number]} - İlk bakiye ve son bakiye.
    */
    let mymyilkprice = parseFloat(data[0][4]);
    let mymyilkhigh = parseFloat(data[0][2]);
    let mymyilklow = parseFloat(data[0][3]);
    let mymysonprice = parseFloat(data[data.length - 1][4]);
    let mymysonhigh = parseFloat(data[data.length - 1][2]);
    let mymysonlow = parseFloat(data[data.length - 1][3]);

    let levels, geometric_percentage,arithmetic_step;
    [levels, geometric_percentage,arithmetic_step] = geometric_division(start, end, num_levels,division_type);

    let mymyilkbakiye = 0.0;
    let suankibakiye = 0.0;

    try {
        let ilk_alinacaklar, ilk_satilacaklar;
        [ilk_alinacaklar, ilk_satilacaklar] = split_levels(levels, mymyilkprice, mymyilkhigh, mymyilklow);

        let son_alinacaklar, son_satilacaklar;
        [son_alinacaklar, son_satilacaklar] = split_levels(levels, mymysonprice, mymysonhigh, mymysonlow);

        mymyilkbakiye = sonbakiyehesapla(mymyilkprice, ilk_alinacaklar, ilk_satilacaklar);
        suankibakiye = sonbakiyehesapla(mymysonprice, son_alinacaklar, son_satilacaklar);
    } catch (e) {
        console.error("Hata oluştu:", e);
    }

    return [mymyilkbakiye, suankibakiye];
}

// Örnek kullanım
// let toplamKar = toplam_kar_hesapla(123, 0.01, 0.003, 14);
// console.log(`Toplam kar: ${toplamKar.toFixed(2)}`);

// let [ilkBakiye, sonBakiye] = ilkveonbakiyehesapla();
// console.log(`İlk Bakiye: ${ilkBakiye}, Son Bakiye: ${sonBakiye}`);


function calculate_days_between(start_date, end_date) {
    /**
    * İki tarih arasındaki gün sayısını hesaplar.
    *
    * @param {string} start_date - Başlangıç tarihi ('YYYY-MM-DD' formatında).
    * @param {string} end_date - Bitiş tarihi ('YYYY-MM-DD' formatında).
    * @return {number|null} - İki tarih arasındaki gün sayısı veya hata durumunda `null`.
    */
    try {
        let start = new Date(start_date + "T00:00:00Z");
        let end = new Date(end_date + "T00:00:00Z");

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error("Invalid date format. Please use 'YYYY-MM-DD'.");
        }

        if (start > end) {
            throw new Error("Start date must be earlier than end date.");
        }

        let difference = Math.floor((end - start) / (1000 * 60 * 60 * 24));
        return difference;
    } catch (e) {
        console.error(`Error: ${e.message}`);
        return null;
    }
}

// Örnek kullanım
// let daysBetween = calculate_days_between("2024-01-17", "2024-12-27");
// console.log(`Number of days between: ${daysBetween}`);


function process_close_values(data) {
    /**
    * Verilen veri listesindeki 'close', 'high', ve 'low' sütunlarındaki değerleri işler.
    *
    * @param {Array} data - Binance API'den alınan veri.
    * @return {string|null} - İşlenmiş istatistik bilgileri veya hata durumunda `null`.
    */
    try {
        if (data.length > 0) {
            let sonkapanis = 0;
            let satimsayisi = 0;

            for (let row of data) {
                let close_value = parseFloat(row[4]);
                let high_value = parseFloat(row[2]);
                let low_value = parseFloat(row[3]);

                if (close_value > start && close_value < end) {
                    let new_alinacaklar, new_satilacaklar;
                    try {
                        [new_alinacaklar, new_satilacaklar] = split_levels(levels, close_value, high_value, low_value);
                    } catch (e) {
                        console.error(`process_close_values Hata: ${e}`);
                        new_alinacaklar = [...old_alinacaklar];
                        new_satilacaklar = [...old_satilacaklar];
                        continue;
                    }

                    let fazlalikalinacaklar = find_excess_items(old_alinacaklar, new_alinacaklar);
                    let fazlaliksatilacaklar = find_excess_items(old_satilacaklar, new_satilacaklar);

                    old_alinacaklar = [...new_alinacaklar];
                    old_satilacaklar = [...new_satilacaklar];

                    if (fazlalikalinacaklar.length > 0) {
                        satimsayisi += fazlalikalinacaklar.length;
                        for (let price of fazlalikalinacaklar) {
                            if (division_type=="geometric"){
                                gridprofit += toplam_kar_hesapla(price, (geometric_percentage[0] * 0.01), (comission * 0.01), mymyq);
                            } else {
                                gridprofit += toplam_kar_hesapla_arithmetic(price,arithmetic_step,comission,mymyq);
                            }
                        }
                    }
                }
                sonkapanis = close_value;
            }

            let yavilkbakiyeiste, yavsonbakiyeiste;
            [yavilkbakiyeiste, yavsonbakiyeiste] = ilkveonbakiyehesapla();

            let kazancorani = (yavsonbakiyeiste + gridprofit) / yavilkbakiyeiste;
            let girilenboluminbakiye = parseFloat((girilenilkbakiye / yavilkbakiyeiste).toFixed(2));
            var aylikKazancYuzdesi=parseFloat((30 * ((gridprofit / yavilkbakiyeiste) * 100) / calculate_days_between(start_date, end_date)).toFixed(2));
            var kacGundurBotCalisiyor=calculate_days_between(start_date, end_date);
            var aySayisi=(kacGundurBotCalisiyor/30).toFixed(0);
            const [sonuc, katlama] = bilesikFaizHesapla(girilenilkbakiye, aylikKazancYuzdesi, aySayisi);

            // Mevcut koddan sonra ekle:
            var yillikKazancYuzdesi = parseFloat((365 * ((gridprofit / yavilkbakiyeiste) * 100) / calculate_days_between(start_date, end_date)).toFixed(2));
            var gunlukKazancYuzdesi = parseFloat((yillikKazancYuzdesi / 365).toFixed(6));

            const yillar = [1,2,3,4,5,6,7,8,9,10,15,20,25,30];
            const gunlukBilesikSonuclar = gunlukBilesikFaizHesapla(girilenilkbakiye, yillikKazancYuzdesi, yillar);

            // Karşılaştırma metni oluştur
            let karsilastirmaMetni = "";
            for (let sonuc of gunlukBilesikSonuclar) {
                karsilastirmaMetni += `<span style="color: red;">${sonuc.yil}. yıl:</span> Düz kar ${sonuc.bilesikFaizsiz} USDT, Günlük reinvest ${sonuc.bilesikFaizli} USDT (${sonuc.fark} USDT fark). `;
            }

            console.log();
            console.log(``);
            
            let istatistik = `<ul>
<li>Sembol: ${symbol}</li>
<li>Grid tipi: ${division_type}</li>
<li>Alt sınır: ${start} USDT</li>
<li>Üst sınır: ${end} USDT</li>
<li>Grid Sayısı: ${num_levels}</li>
<li>Komisyon: %${comission}</li>
<li>Hangi zaman diliminde backtest kontrolü yapılıyor: ${veriinterval}
<li>Bot başlangıç tarihi: ${start_date}</li>
<li>Bot bitiş tarihi: ${end_date}</li>
<li>Kaç gündür bot çalışıyor: ${kacGundurBotCalisiyor} gün</li>
<li>Gridler arası yüzde: <span  style="color: purple;">%${geometric_percentage}</span></li>
<li>Binance'ta açmak için gerekli min. bakiye: ${yavilkbakiyeiste.toFixed(2)} USDT</li>
<li>Başlangıç bakiyesi: ${girilenilkbakiye} USDT</li>
<li>Tamamlanmış işlem sayısı: ${satimsayisi}</li>
<li>Günlük ortalama işlem sayısı: ${(satimsayisi/calculate_days_between(start_date, end_date)).toFixed(1)}
<li>Gridden elde edilen realized USDT: ${parseFloat((gridprofit * girilenboluminbakiye).toFixed(2))} USDT</li>
<li>Gridden yüzde kazanç: <span  style="color: green;">%${parseFloat(((gridprofit / yavilkbakiyeiste) * 100).toFixed(2))}</span></li>
<li>Grid'den aylık yüzde kazanç: <span  style="color: blue;">%${aylikKazancYuzdesi}</span></li>
<li>Grid'den yıllık yüzde kazanç: %${parseFloat((12 * 30 * ((gridprofit / yavilkbakiyeiste) * 100) / calculate_days_between(start_date, end_date)).toFixed(2))}</li>
<li>Şuanki gridden gelen hariç bakiye: ${parseFloat((yavsonbakiyeiste * girilenboluminbakiye).toFixed(2))} USDT</li>
<li>Şuanki grid dahil bakiye: ${parseFloat(((yavsonbakiyeiste + gridprofit) * girilenboluminbakiye).toFixed(2))} USDT</li>
<li>Şuanki grid dahil bakiye bölü ilk bakiye: ${parseFloat(kazancorani.toFixed(2))} X (yani toplam %${parseFloat((100 * (kazancorani - 1)).toFixed(2))} ekstra gelir gelmiş.)</li>
<li>Bot başlarkenki coin fiyatı: ${data_first_close} USDT</li>
<li>Coin son fiyatı: ${data[data.length - 1][4]} USDT</li>
<li>Günlük kar yüzdesi: %${gunlukKazancYuzdesi}</li>
<li>Her gün, gridden ekstra kazandığını tekrar aynı gride yatırsaydı (yani bileşik faiz yapsaydı): ${karsilastirmaMetni}</li>
</ul>
            `;

            console.log(istatistik);

            let file_name = `${symbol}-${calculate_days_between(start_date, end_date)}gun-gridKarYuzde${parseFloat((gridprofit / yavilkbakiyeiste * 100).toFixed(2))}-bakiyeX${parseFloat(kazancorani.toFixed(2))}-aralikYuzde${geometric_percentage}-${get_current_datetime_text()}`;
            //create_and_write_txt(file_name, istatistik);

            return istatistik;
        } else {
            throw new Error("Data is empty.");
        }
    } catch (e) {
        console.error(`process_close_values2 Hata: ${e}`);
        return null;
    }
}

function gunlukBilesikFaizHesapla(anapara, yillikKazancYuzdesi, yilSayilari) {
    const gunlukKazancYuzdesi = yillikKazancYuzdesi / 365;
    const sonuclar = [];
    
    for (let yil of yilSayilari) {
        const gunSayisi = yil * 365;
        
        // Bileşik faizsiz (düz kar)
        const bilesikFaizsiz = anapara + (anapara * (yillikKazancYuzdesi / 100) * yil);
        
        // Bileşik faizli (günlük reinvest)
        const bilesikFaizli = anapara * Math.pow(1 + (gunlukKazancYuzdesi / 100), gunSayisi);
        
        sonuclar.push({
            yil: yil,
            bilesikFaizsiz: bilesikFaizsiz.toFixed(2),
            bilesikFaizli: bilesikFaizli.toFixed(2),
            fark: (bilesikFaizli - bilesikFaizsiz).toFixed(2)
        });
    }
    
    return sonuclar;
}

function bilesikFaizHesapla(anapara, aylikKazancYuzdesi, aySayisi) {
    let toplamPara = anapara;
    for (let i = 0; i < aySayisi; i++) {
      toplamPara += toplamPara * (aylikKazancYuzdesi / 100);
    }
    const katlamaOrani = toplamPara / anapara;
    return [toplamPara.toFixed(2), katlamaOrani.toFixed(2)];
  }

let new_alinacaklar=[]
let new_satilacaklar=[]
function mybacktest(symbolg, division_typeg, startg, endg, num_levelsg, comissiong, girilenilkbakiyeg, veriintervalg, start_dateg, end_dateg) {
    try {
        sifirla();
            // Hata oluşabilecek kod buraya yazılır.
        /**
        * Backtest işlemini gerçekleştiren ana fonksiyon.
        *
        * @param {string} symbolg - İşlem çifti.
        * @param {string} division_typeg - Grid tipi.
        * @param {number|string} startg - Alt seviye.
        * @param {number|string} endg - Üst seviye.
        * @param {number} num_levelsg - Grid sayısı.
        * @param {number|string} comissiong - Komisyon oranı.
        * @param {number|string} girilenilkbakiyeg - Başlangıç bakiyesi.
        * @param {string} veriintervalg - Veri aralığı.
        * @param {string} start_dateg - Başlangıç tarihi.
        * @param {string} end_dateg - Bitiş tarihi.
        * @return {string|null} - İstatistik verileri veya hata durumunda `null`.
        */
        minmiktarondalik=minmiktarondalik
        //let symbol, start, end, num_levels, comission, girilenilkbakiye, veriinterval, start_date, end_date;
        //let mymyq, carpim, alinacaklar, satilacaklar, old_alinacaklar, old_satilacaklar;
        //let ilkbakiye, new_alinacaklar, new_satilacaklar, fazlalikalinacaklar, fazlaliksatilacaklar;
        
        // Parametreleri ayarla
        symbol = symbolg.toUpperCase().includes("USDT") ? symbolg.toUpperCase() : symbolg.toUpperCase() + "USDT";
        division_type=division_typeg.toLowerCase();
        start = parseFloat(String(startg).replace(",", "."));
        end = parseFloat(String(endg).replace(",", "."));
        num_levels = parseInt(num_levelsg, 10);
        comission = parseFloat(String(comissiong).replace(",", "."));
        girilenilkbakiye = parseFloat(String(girilenilkbakiyeg).replace(",", "."));
        veriinterval = veriintervalg.toLowerCase();
        start_date = start_dateg;
        end_date = end_dateg; 
        gridprofit = 0.0000001;

        console.log("Backtest çalışmaya başladı");

        // Girdi işlemlerini başlat
        girdiler();

        // Mevcut fiyatı al
        current_price = get_coin_price(symbol);

        // Başlangıç seviyelerini belirle
        [alinacaklar, satilacaklar] = split_levels(levels, data_first_close);
        old_alinacaklar = [...alinacaklar];
        old_satilacaklar = [...satilacaklar];
        new_alinacaklar = [...alinacaklar];
        new_satilacaklar = [...satilacaklar];
        minmiktarondalik=minmiktarondalik==null?8:minmiktarondalik;
        console.log("Precision bilgileri:", minmiktarondalik);
        
        // Miktar ayarla
        mymyq = 5.5 / start;
        carpim = 1;
        for (let i = 0; i < minmiktarondalik; i++) {
            carpim *= 10;
        }
        mymyq = Math.ceil(mymyq * carpim) / carpim;

        // İlk bakiyeyi hesapla
        ilkbakiye = ilkbakiyehesapla();
        console.log("Minimum gerekli toplam USDT:", ilkbakiye);
        console.log("Gridler arası yüzdelik değişim:", geometric_percentage);

        // Fazlalık elemanları bul
        fazlalikalinacaklar = find_excess_items(old_alinacaklar, new_alinacaklar);
        fazlaliksatilacaklar = find_excess_items(old_satilacaklar, new_satilacaklar);

        // İlk giriş işlemini gerçekleştir
        ilkgiris();

        // Veriyi işle ve sonuçları döndür
        return process_close_values(data);
        
      } catch (error) {
        // try bloğunda bir hata oluşursa, bu blok çalışır.
        // 'error' değişkeni, yakalanan hata nesnesini içerir.
        console.error("Bir hata oluştu:", error.message); // Hata mesajını konsola yazdırır.
        // Hatayı ele almak için başka işlemler de yapılabilir.
        // Örneğin, kullanıcıya bir mesaj gösterme, bir fonksiyonu yeniden çağırma vb.
        return "Lütfen girdileri örneklerdeki gibi ve boşluk olmadan giriniz."
      } finally {
        // Bu blok, try bloğunda hata oluşsa da oluşmasa da her zaman çalışır.
        // Genellikle temizleme işlemleri için kullanılır (örneğin, dosyaları kapatma, bağlantıları sonlandırma).
        console.log("try...catch bloğu tamamlandı.");
      }

}

// Kullanım Örnekleri:
//let result = mybacktest("BTCUSDT", 40000, 150000, 200, 0.1, 1000, "1d", "2024-12-01", "2024-12-31");
//console.log(result);



