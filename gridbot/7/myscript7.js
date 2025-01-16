//By Recep YENİ
//Geliştirici: Recep YENİ (recepyeni@gmail.com) (ChatGpt yardımıyla)
//Bir lahmacun ayran ısmarlamak isterseniz, BSC BNB Smart Chain (BEP20) USDT adresim:
//0x9a9b5b0eccebd2834f77f764364a14bbfc837dc0

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
     * Kullanıcıdan başlangıç ve bitiş tarihine göre veri çekme fonksiyonu.
     *
     * @param {string} veriinterval - Zaman dilimi (örn. "1m", "5m", "1h", "1d").
     * @param {string} start_date - Başlangıç tarihi ("YYYY-MM-DD").
     * @param {string} end_date - Bitiş tarihi ("YYYY-MM-DD").
     * @return {Array} - Veriler [timestamp, open, high, low, close, volume] formatında.
     */
    return collect_data(symbol, veriinterval, start_date, end_date);
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
<li>Her ay, gridden ekstra kazandığını tekrar aynı gride yatırsaydı (yani bileşik faiz yapsaydı):
<li>Bileşik faiz yapsaydı, sonuçta, ${sonuc-girilenilkbakiye} sadece grid getirisi olurdu.</li>
<li>Bileşik faiz yapsaydı, sadece gridden, anaparanın ${katlama-1} katı kazanç elde ederdi.</li>
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



