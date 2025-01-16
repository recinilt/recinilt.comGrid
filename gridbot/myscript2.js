/*
import time;
import random;
const { Client } = require('binance-api-node'); // Use a Binance API client for Node.js
const dotenv = require('dotenv');
const { DateTime } = require('luxon'); // For date handling
const axios = require('axios'); // For HTTP requests

// Load environment variables from .env file
dotenv.config();

// API keys from .env
const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;

const client = Client({ apiKey: api_key, apiSecret: api_secret });
*/
let levels = [];
const geometric_percentage = 1.1;

let symbol = "";
let start = 1.1;
let end = 1.1;
let num_levels = 1;
let comission = 1.1;
let minmiktarondalik = 1;
let myticksize = 1;
let precision_info = {};
let data_first_close = 0.032;
let veriinterval = "1m"; // Input for interval
let veri_days_back = 3; // Input for days back
let data = [];
let girilenilkbakiye = 0;
let mymyq = 0.0;
let carpim = 1;
let old_alinacaklar = [];
let old_satilacaklar = [];
let start_date = "2024-04-17";
let end_date = "2024-07-27";

const soracaklarim = [
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

// Grid Backtest Functions
function girdiler() {
    

    data = vericekis(veriinterval, start_date, end_date);
    data_first_close = parseFloat(data[0][4]);

    [minmiktarondalik, myticksize, precision_info] = get_precision(symbol);
    [levels, geometric_percentage] = geometric_division(start, end, num_levels);
}

async function get_coin_price(symbol) {
    const url = `https://api.binance.com/api/v3/ticker/price`;
    const params = { symbol: symbol.toUpperCase() };
    try {
        const response = await axios.get(url, { params });
        return parseFloat(response.data.price);
    } catch (error) {
        console.error(`Hata: ${error}`);
        return null;
    }
}

function count_decimal_places(number) {
    number = parseFloat(number).toString();
    const decimalIndex = number.indexOf('.');
    return decimalIndex === -1 ? 0 : number.length - decimalIndex - 1;
}

async function get_precision(symbol) {
    try {
        const exchange_info = await client.exchangeInfo();
        for (const s of exchange_info.symbols) {
            if (s.symbol === symbol) {
                const precision_info = {
                    baseAssetPrecision: s.baseAssetPrecision,
                    quoteAssetPrecision: s.quoteAssetPrecision,
                    stepSize: null,
                    tickSize: null
                };
                for (const filt of s.filters) {
                    if (filt.filterType === 'LOT_SIZE') {
                        precision_info.stepSize = filt.stepSize;
                    }
                    if (filt.filterType === 'PRICE_FILTER') {
                        precision_info.tickSize = filt.tickSize;
                    }
                }
                minmiktarondalik = count_decimal_places(precision_info.stepSize);
                myticksize = count_decimal_places(precision_info.tickSize);
                return [minmiktarondalik, myticksize, precision_info];
            }
        }
        console.log(`${symbol} çifti bulunamadı.`);
        return null;
    } catch (error) {
        console.error("Hata oluştu:", error);
        return null;
    }
}

function geometric_division(start, end, num_levels) {
    if (num_levels <= 1) {
        throw new Error("Number of levels must be greater than 1.");
    }

    const levels = [];
    const ratio = Math.pow(end / start, 1 / (num_levels - 1));
    let current = start;
    for (let i = 0; i < num_levels; i++) {
        levels.push(parseFloat(current.toFixed(8))); // Precision can be adjusted if needed
        current *= ratio;
    }

    const geometric_percentage = (levels[1] - levels[0]) / levels[0] * 100;
    return [levels, parseFloat(geometric_percentage.toFixed(2))];
}

async function collect_data(symbol, interval, start_date, end_date) {
    const start_time = DateTime.fromISO(start_date).toUTC();
    const end_time = DateTime.fromISO(end_date).toUTC();

    console.log(`Fetching data for ${symbol} from ${start_date} to ${end_date} with interval ${interval}...`);
    const all_data = [];
    let current_start_time = start_time;

    const total_steps = end_time.diff(start_time, 'days').days + 1;
    for (let step = 0; step < total_steps; step++) {
        const current_end_time = current_start_time.plus({ days: 1 }).min(end_time);
        try {
            const klines = await fetch_binance_klines(symbol, interval, current_start_time, current_end_time);
            for (const kline of klines) {
                const timestamp = DateTime.fromMillis(kline[0]).toUTC().toISO();
                const open_price = kline[1];
                const high_price = kline[2];
                const low_price = kline[3];
                const close_price = kline[4];
                const volume = kline[5];
                all_data.push([timestamp, open_price, high_price, low_price, close_price, volume]);
            }
            current_start_time = DateTime.fromMillis(klines[klines.length - 1][6]);
        } catch (error) {
            console.error(`Error fetching data: ${error}`);
            break;
        }
    }

    return all_data;
}

async function vericekis(veriinterval, start_date, end_date) {
    const data = await collect_data(symbol, veriinterval, start_date, end_date);
    return data;
}

async function fetch_binance_klines(symbol, interval, start_time, end_time) {
    const url = "https://api.binance.com/api/v3/klines";
    const params = {
        symbol: symbol,
        interval: interval,
        startTime: Math.floor(start_time.toMillis()),
        endTime: Math.floor(end_time.toMillis()),
        limit: 1000
    };
    const response = await axios.get(url, { params });
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Error fetching data from Binance: ${response.status} ${response.data}`);
    }
}

let alinacaklar = [];
let satilacaklar = [];
let oncekialinacaklar = [];
let oncekisatilacaklar = [];
let oncekialinacaklevelsonprice = 1000000;
let oncekisatilacaklevelilkprice = 1000000;

function split_levels(levels, myclose, high = null, low = null) {
    if (true) { // close > start and close < end:
        

        if (!levels.length) {
            console.error("Hata: 'levels' listesi boş!");
            process.exit();
            return [[], []];
        }

        if (low !== null && high !== null) {
            if (high < levels[0]) {
                alinacaklar = [];
                satilacaklar = [...levels];
                oncekisatilacaklevelilkprice = satilacaklar[0] || levels[levels.length - 1];
                oncekialinacaklevelsonprice = alinacaklar[alinacaklar.length - 1] || levels[0];
                return [alinacaklar, satilacaklar];
            } else if (low > levels[levels.length - 1]) {
                alinacaklar = [...levels];
                satilacaklar = [];
                oncekisatilacaklevelilkprice = satilacaklar[0] || levels[levels.length - 1];
                oncekialinacaklevelsonprice = alinacaklar[alinacaklar.length - 1] || levels[0];
                return [alinacaklar, satilacaklar];
            }
        } else {
            if (myclose < levels[0]) {
                alinacaklar = [];
                satilacaklar = [...levels];
                oncekisatilacaklevelilkprice = satilacaklar[0] || levels[levels.length - 1];
                oncekialinacaklevelsonprice = alinacaklar[alinacaklar.length - 1] || levels[0];
                return [alinacaklar, satilacaklar];
            } else if (myclose > levels[levels.length - 1]) {
                alinacaklar = [...levels];
                satilacaklar = [];
                oncekisatilacaklevelilkprice = satilacaklar[0] || levels[levels.length - 1];
                oncekialinacaklevelsonprice = alinacaklar[alinacaklar.length - 1] || levels[0];
                return [alinacaklar, satilacaklar];
            }
        }

        if (oncekisatilacaklevelilkprice === 1000000) {
            const closest_level = levels.reduce((prev, curr) => Math.abs(curr - myclose) < Math.abs(prev - myclose) ? curr : prev);
            const gecicilevels = [...levels];
            gecicilevels.splice(gecicilevels.indexOf(closest_level), 1);
            satilacaklar = gecicilevels.filter(level => level > myclose);
            alinacaklar = gecicilevels.filter(level => level < myclose);
            oncekisatilacaklar = [...satilacaklar];
            oncekialinacaklar = [...alinacaklar];
            oncekisatilacaklevelilkprice = satilacaklar[0] || levels[levels.length - 1];
            oncekialinacaklevelsonprice = alinacaklar[alinacaklar.length - 1] || levels[0];
        }

        if (low !== null && high !== null) {
            if (low > oncekialinacaklevelsonprice && high < oncekisatilacaklevelilkprice) {
                return [oncekialinacaklar, oncekisatilacaklar];
            } else if (low < oncekialinacaklevelsonprice) {
                const closest_level = levels.reduce((prev, curr) => Math.abs(curr - low) < Math.abs(prev - low) ? curr : prev);
                const gecicilevels = [...levels];
                gecicilevels.splice(gecicilevels.indexOf(closest_level), 1);
                satilacaklar = gecicilevels.filter(level => level > low);
                alinacaklar = gecicilevels.filter(level => level < low);
                oncekisatilacaklar = [...satilacaklar];
                oncekisatilacaklevelilkprice = satilacaklar[0] || levels[levels.length - 1];
                oncekialinacaklevelsonprice = alinacaklar[alinacaklar.length - 1] || levels[0];
                oncekialinacaklar = [...alinacaklar];
                return [alinacaklar, satilacaklar];
            } else if (high > oncekisatilacaklevelilkprice) {
                const closest_level = levels.reduce((prev, curr) => Math.abs(curr - high) < Math.abs(prev - high) ? curr : prev);
                const gecicilevels = [...levels];
                gecicilevels.splice(gecicilevels.indexOf(closest_level), 1);
                satilacaklar = gecicilevels.filter(level => level > high);
                alinacaklar = gecicilevels.filter(level => level < high);
                oncekisatilacaklar = [...satilacaklar];
                oncekisatilacaklevelilkprice = satilacaklar[0] || levels[levels.length - 1];
                oncekialinacaklevelsonprice = alinacaklar[alinacaklar.length - 1] || levels[0];
                oncekialinacaklar = [...alinacaklar];
                return [alinacaklar, satilacaklar];
            } else {
                const closest_level = levels.reduce((prev, curr) => Math.abs(curr - myclose) < Math.abs(prev - myclose) ? curr : prev);
                const gecicilevels = [...levels];
                gecicilevels.splice(gecicilevels.indexOf(closest_level), 1);
                satilacaklar = gecicilevels.filter(level => level > myclose);
                alinacaklar = gecicilevels.filter(level => level < myclose);
                oncekisatilacaklar = [...satilacaklar];
                oncekialinacaklar = [...alinacaklar];
                oncekisatilacaklevelilkprice = satilacaklar[0] || levels[levels.length - 1];
                oncekialinacaklevelsonprice = alinacaklar[alinacaklar.length - 1] || levels[0];

                return [alinacaklar, satilacaklar];
            }
        } else {
            if (myclose > oncekialinacaklevelsonprice && myclose < oncekisatilacaklevelilkprice) {
                return [oncekialinacaklar, oncekisatilacaklar];
            } else {
                const closest_level = levels.reduce((prev, curr) => Math.abs(curr - myclose) < Math.abs(prev - myclose) ? curr : prev);
                const gecicilevels = [...levels];
                gecicilevels.splice(gecicilevels.indexOf(closest_level), 1);
                satilacaklar = gecicilevels.filter(level => level > myclose);
                alinacaklar = gecicilevels.filter(level => level < myclose);
                oncekisatilacaklar = [...satilacaklar];
                oncekialinacaklar = [...alinacaklar];
                oncekisatilacaklevelilkprice = satilacaklar[0] || levels[levels.length - 1];
                oncekialinacaklevelsonprice = alinacaklar[alinacaklar.length - 1] || levels[0];
                return [alinacaklar, satilacaklar];
            }
        }
    }
}

function ilkbakiyehesapla() {
    let q1 = 5.5 / start;
    let carpim = 1;
    for (let i = 0; i < minmiktarondalik; i++) {
        carpim *= 10;
    }
    q1 = Math.ceil(q1 * carpim) / carpim; // hep aynı quantity de alınacak.
    let gereklialtusdt = 0.0;

    for (const level of old_alinacaklar) {
        gereklialtusdt += Math.ceil((level * q1) * carpim) / carpim;
    }
    const gerekliustusdt = (Math.ceil((current_price * q1) * carpim) / carpim) * old_satilacaklar.length;
    return (gereklialtusdt + gerekliustusdt);
}

function sonbakiyehesapla(sonclose, sonalinacaklar, sonsatilacaklar) {
    let q1 = 5.5 / start;
    let carpim = 1;
    for (let i = 0; i < minmiktarondalik; i++) {
        carpim *= 10;
    }
    q1 = Math.ceil(q1 * carpim) / carpim; // hep aynı quantity de alınacak.
    let gereklialtusdt = 0.0;

    for (const level of sonalinacaklar) {
        gereklialtusdt += Math.ceil((level * q1) * carpim) / carpim;
    }
    const gerekliustusdt = (Math.ceil((sonclose * q1) * carpim) / carpim) * sonsatilacaklar.length;
    return (gereklialtusdt + gerekliustusdt);
}

function findExcessItems(oldList, newList) {
    /**
     * Returns excess elements in the new shopping list compared to the old shopping list.
     * 
     * @param {Array} oldList - Old shopping list.
     * @param {Array} newList - New shopping list.
     * @returns {Array} - Excess elements in the new shopping list.
     */
    return newList.filter(item => !oldList.includes(item));
}

function getCoinData(symbol) {
    /**
     * Returns price, high and low values of a coin pair.
     * @param {string} symbol - Coin pair (e.g., 'ONEUSDT')
     * @returns {Array|null} - Array [price, high, low] or null (in case of error)
     */
    const url = `https://api.binance.com/api/v3/ticker/24hr`;
    const params = new URLSearchParams({ symbol: symbol.toUpperCase() });

    return fetch(`${url}?${params}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const price = parseFloat(data.lastPrice);
            const high = parseFloat(data.highPrice);
            const low = parseFloat(data.lowPrice);
            return [price, high, low];
        })
        .catch(error => {
            console.error(`Error: ${error}`);
            return null;
        });
}

function ilkgiris() {
    let [alinacaklar, satilacaklar] = splitLevels(levels, dataFirstClose);
    let newAlinacaklar = [...alinacaklar];
    let newSatilacaklar = [...satilacaklar];

    if (newAlinacaklar.length) {
        newAlinacaklar.forEach(orderprice => {
            console.log("aşağıya al emri konuldu", orderprice);
        });
    }

    let carpim = 1;
    for (let i = 0; i < minmiktarondalik; i++) {
        carpim *= 10;
    }
    let alinacakcoin = Math.ceil(0.00000000000001 * carpim) / carpim;

    if (newSatilacaklar.length) {
        newSatilacaklar.forEach(orderprice => {
            let quantity = mymyq;
            alinacakcoin += quantity;
            console.log("yukarıya sat emri konuldu", orderprice, quantity);
        });
    }
    alinacakcoin = Math.ceil(alinacakcoin * carpim) / carpim;
    console.log("şu kadar başlangıç için coin alındı:", alinacakcoin);
}

function createAndWriteTxt(fileName, content) {
    /**
     * Creates a txt file with the specified name and writes the content to it.
     * 
     * @param {string} fileName - File name (should end with .txt)
     * @param {string} content - Content to write to the file
     */
    if (!fileName.endsWith('.txt')) {
        fileName += '.txt';
    }

    try {
        const fs = require('fs');
        fs.writeFileSync(fileName, content, 'utf8');
        console.log(`'${fileName}' dosyası başarıyla oluşturuldu ve içerik yazıldı.`);
    } catch (e) {
        console.error(`Hata oluştu: ${e}`);
    }
}

function readApiKey(dosya) {
    try {
        const fs = require('fs');
        return fs.readFileSync(dosya, 'utf8').trim();
    } catch (error) {
        return null;
    }
}

function checkApiKeyFile() {
    const fs = require('fs');
    const myapi = fs.existsSync("a.txt");
    const mysecret = fs.existsSync("s.txt");
    return (myapi && mysecret);
}

function getCurrentDateTimeText() {
    /**
     * Returns current time as text including year, month, day, hour, minute and second.
     * 
     * @returns {string} Time information containing year, month, day, hour, minute and second
     */
    const now = new Date();
    return now.toISOString().replace(/[T:]/g, '-').slice(0, -5);
}

const gridprofit = 0.0000001;

function toplamKarHesapla(sonFiyat, yuzdeArtis, komisyonOrani, lotSayisi) {
    /**
     * Function to calculate total profit.
     * 
     * @param {number} sonFiyat - Final price
     * @param {number} yuzdeArtis - Percentage increase from initial price
     * @param {number} komisyonOrani - Commission rate
     * @param {number} lotSayisi - Number of lots traded
     * @returns {number} Total profit
     */
    const baslangicFiyati = sonFiyat / (1 + yuzdeArtis);
    const birimKar = (sonFiyat - baslangicFiyati) - (sonFiyat * komisyonOrani);
    return birimKar * lotSayisi;
}

function ilkveonbakiyehesapla() {
    const mymyilkprice = parseFloat(data[0][4]);
    const mymyilkhigh = parseFloat(data[0][2]);
    const mymyilklow = parseFloat(data[0][3]);
    const mymysonprice = parseFloat(data[data.length-1][4]);
    const mymysonhigh = parseFloat(data[data.length-1][2]);
    const mymysonlow = parseFloat(data[data.length-1][3]);
    
    [levels, geometric_percentage] = geometricDivision(start, end, numLevels);
    let mymyilkbakiye = 0.0;
    let suankibakiye = 0.0;

    try {
        const [ilkAlinacaklar, ilkSatilacaklar] = splitLevels(levels, mymyilkprice, mymyilkhigh, mymyilklow);
        const [sonAlinacaklar, sonSatilacaklar] = splitLevels(levels, mymysonprice, mymysonhigh, mymysonlow);
        mymyilkbakiye = sonbakiyehesapla(mymyilkprice, ilkAlinacaklar, ilkSatilacaklar);
        suankibakiye = sonbakiyehesapla(mymysonprice, sonAlinacaklar, sonSatilacaklar);
    } catch (error) {
        console.error("sorun çıktı:", error);
    }

    return [mymyilkbakiye, suankibakiye];
}

function calculateDaysBetween(startDate, endDate) {
    /**
     * Calculates the number of days between two dates.
     * 
     * @param {string} startDate - The start date in 'YYYY-MM-DD' format
     * @param {string} endDate - The end date in 'YYYY-MM-DD' format
     * @returns {number|null} The number of days between the two dates or null if error
     */
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (start > end) {
            throw new Error("Start date must be earlier than end date.");
        }

        const difference = Math.floor((end - start) / (1000 * 60 * 60 * 24));
        return difference;
    } catch (e) {
        console.error(`Error: ${e}`);
        return null;
    }
}

function processCloseValues(data) {
    let sonkapanis = 0;
    let satimsayisi = 0;

    try {
        if (data.length > 0) {
            for (const row of data) {
                const closeValue = parseFloat(row[4]);
                const highValue = parseFloat(row[2]);
                const lowValue = parseFloat(row[3]);

                if (closeValue > start && closeValue < end) {
                    let newAlinacaklar, newSatilacaklar;
                    try {
                        [newAlinacaklar, newSatilacaklar] = splitLevels(levels, closeValue, highValue, lowValue);
                    } catch (e) {
                        console.log(`Hata: ${e}`);
                        newAlinacaklar = [...oldAlinacaklar];
                        newSatilacaklar = [...oldSatilacaklar];
                        continue;
                    }

                    const fazlalikalinacaklar = findExcessItems(oldAlinacaklar, newAlinacaklar);
                    const fazlaliksatilacaklar = findExcessItems(oldSatilacaklar, newSatilacaklar);
                    oldAlinacaklar = [...newAlinacaklar];
                    oldSatilacaklar = [...newSatilacaklar];

                    if (fazlalikalinacaklar.length) {
                        satimsayisi += fazlalikalinacaklar.length;
                        for (const price of fazlalikalinacaklar) {
                            gridprofit += toplamKarHesapla(price, (geometricPercentage * 0.01), (comission * 0.01), mymyq);
                        }
                    }
                }
                sonkapanis = closeValue;
            }

            const myqs = oldSatilacaklar.reduce((sum, q) => 
                sum + Math.ceil(5.5 / q * (10 ** minmiktarondalik)) / (10 ** minmiktarondalik), 0);
            const mysatilacakq = mymyq * oldSatilacaklar.length;
            const alinacaklartoplamusdt = oldAlinacaklar.reduce((sum, alinacakusdt) => 
                sum + alinacakusdt * mymyq, 0);
            const satilacaklartoplamusdt = sonkapanis * mysatilacakq;

            const [yavilkbakiyeiste, yavsonbakiyeiste] = ilkveonbakiyehesapla();
            const kazancorani = (yavsonbakiyeiste + gridprofit) / yavilkbakiyeiste;
            const girilenboluminbakiye = Math.round((girilenilkbakiye/yavilkbakiyeiste) * 100) / 100;

            const istatistik = `
            Sembol: ${symbol}
            Alt sınır: ${start} USDT
            Üst sınır: ${end} USDT
            Grid Sayısı: ${numLevels}
            Komisyon: %${comission}
            Bot başlangıç tarihi: ${startDate}
            Bot bitiş tarihi: ${endDate}
            Kaç gündür bot çalışıyor: ${calculateDaysBetween(startDate, endDate)} gün
            Gridler arası yüzde: %${geometricPercentage}
            Binance'ta açmak için gerekli min. bakiye: ${yavilkbakiyeiste} USDT
            Başlangıç bakiyesi: ${girilenilkbakiye} USDT
            Tamamlanmış işlem sayısı: ${satimsayisi}
            Gridden elde edilen realized USDT: ${Math.round(gridprofit * girilenboluminbakiye * 100) / 100} USDT
            Gridden yüzde kazanç: %${Math.round((gridprofit / yavilkbakiyeiste) * 10000) / 100}
            Grid'den aylık yüzde kazanç: %${Math.round(30 * ((gridprofit / yavilkbakiyeiste) * 100) / calculateDaysBetween(startDate, endDate) * 100) / 100}
            Grid'den yıllık yüzde kazanç: %${12 * Math.round(30 * ((gridprofit / yavilkbakiyeiste) * 100) / calculateDaysBetween(startDate, endDate) * 100) / 100}
            Şuanki gridden gelen hariç bakiye: ${Math.round(yavsonbakiyeiste * girilenboluminbakiye * 100) / 100} USDT
            Şuanki grid dahil bakiye: ${Math.round((yavsonbakiyeiste + gridprofit) * girilenboluminbakiye * 100) / 100} USDT
            Şuanki grid dahil bakiye bölü ilk bakiye: ${Math.round(kazancorani * 100) / 100} X
            Bot başlarkenki coin fiyatı: ${dataFirstClose} USDT
            Coin son fiyatı: ${data[data.length-1][4]} USDT
            `;

            console.log(istatistik);
            const fileName = `${symbol}-${calculateDaysBetween(startDate,endDate)}gun-gridKarYuzde${Math.round((gridprofit / yavilkbakiyeiste) * 10000) / 100}-bakiyeX${Math.round(kazancorani * 100) / 100}-aralikYuzde${geometricPercentage}-${getCurrentDateTimeText()}`;
            createAndWriteTxt(fileName, istatistik);
            return istatistik;
        } else {
            throw new Error("Data is empty.");
        }
    } catch (e) {
        console.log(`Hata: ${e}`);
    }
}





let startDate = ""
let endDate = ""

let oldAlinacaklar=[]
let oldSatilacaklar=[]
let newAlinacaklar=[]
let newSatilacaklar=[]


function mybacktest(symbolg, startg, endg, numLevelsg, comissiong, girilenilkbakiyeg, veriintervalg, startDateg, endDateg) {
    symbol = symbolg.toUpperCase().includes("USDT") ? symbolg.toUpperCase() : symbolg.toUpperCase() + "USDT";
    start = parseFloat(String(startg).replace(",", "."));
    end = parseFloat(String(endg).replace(",", "."));
    numLevels = parseInt(numLevelsg);
    comission = parseFloat(String(comissiong).replace(",", "."));
    girilenilkbakiye = parseFloat(String(girilenilkbakiyeg).replace(",", "."));
    veriinterval = veriintervalg.toLowerCase();
    startDate = startDateg;
    endDate = endDateg;

    console.log("Backtest çalışmaya başladı");
    girdiler();
    currentPrice = getCoinPrice(symbol);
    [alinacaklar, satilacaklar] = splitLevels(levels, dataFirstClose);
    oldAlinacaklar = [...alinacaklar];
    oldSatilacaklar = [...satilacaklar];
    newAlinacaklar = [...alinacaklar];
    newSatilacaklar = [...satilacaklar];

    console.log("Precision bilgileri:", minmiktarondalik);
    mymyq = 5.5/start;
    let carpim = 1;
    for (let i = 0; i < minmiktarondalik; i++) {
        carpim *= 10;
    }
    mymyq = Math.ceil(mymyq * carpim) / carpim;

    const ilkbakiye = ilkbakiyehesapla();
    console.log("minimum gerekli toplam usdt:", ilkbakiye);
    console.log("Gridler arası yüdelik değişim: ", geometricPercentage);

    const fazlalikalinacaklar = findExcessItems(oldAlinacaklar, newAlinacaklar);
    const fazlaliksatilacaklar = findExcessItems(oldSatilacaklar, newSatilacaklar);

    ilkgiris();
    return processCloseValues(data);
}

mybacktest("BTCUSDT", 40000, 150000, 200, 0.1, 1000, "5m", "2024-12-01", "2024-12-31")

