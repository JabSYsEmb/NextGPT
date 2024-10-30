import { getCookie } from "./utils";

const supportedLangObj = {
  am: {
    soon: "በቅርቡ",
    save_as: "እንደ አስቀምጥ",
    download: "አውርድ",
    copy_to_clipboard: "ወደ ቅንጥብ ሰሌዳ ይቅዱ",
  },
  ar: {
    soon: "قريبا",
    save_as: "احفظ كـ",
    download: "تنزيل",
    copy_to_clipboard: "نسخ إلى الحافظة",
  },
  "bg-BG": {
    soon: "Скоро",
    save_as: "Запази като",
    download: "Изтегляне",
    copy_to_clipboard: "Копиране в клипборда",
  },
  "bn-BD": {
    soon: "শীঘ্রই",
    save_as: "এই নামে সংরক্ষণ করুন",
    download: "ডাউনলোড",
    copy_to_clipboard: "ক্লিপবোর্ডে কপি করুন",
  },
  "bs-BA": {
    soon: "Uskoro",
    save_as: "Sačuvaj kao",
    download: "Preuzimanje",
    copy_to_clipboard: "Kopiraj u međuspremnik",
  },
  "ca-ES": {
    soon: "Aviat",
    save_as: "Desa com a",
    download: "Descarregar",
    copy_to_clipboard: "Copia al porta-retalls",
  },
  "cs-CZ": {
    soon: "Brzy",
    save_as: "Uložit jako",
    download: "Stáhnout",
    copy_to_clipboard: "Kopírovat do schránky",
  },
  "da-DK": {
    soon: "Snart",
    save_as: "Gem som",
    download: "Download",
    copy_to_clipboard: "Kopiér til udklipsholder",
  },
  "de-DE": {
    soon: "Bald",
    save_as: "Speichern unter",
    download: "Herunterladen",
    copy_to_clipboard: "In die Zwischenablage kopieren",
  },
  "el-GR": {
    soon: "Σύντομα",
    save_as: "Αποθήκευση ως",
    download: "Λήψη",
    copy_to_clipboard: "Αντιγραφή στο πρόχειρο",
  },
  "en-US": {
    soon: "Soon",
    save_as: "Save as",
    download: "Download",
    copy_to_clipboard: "Copy to Clipboard",
  },
  "es-419": {
    soon: "Pronto",
    save_as: "Guardar como",
    download: "Descargar",
    copy_to_clipboard: "Copiar al portapapeles",
  },
  "es-ES": {
    soon: "Pronto",
    save_as: "Guardar como",
    download: "Descargar",
    copy_to_clipboard: "Copiar al portapapeles",
  },
  "et-EE": {
    soon: "Varsti",
    save_as: "Salvesta nimega",
    download: "Laadi alla",
    copy_to_clipboard: "Kopeeri lõikelauale",
  },
  "fi-FI": {
    soon: "Pian",
    save_as: "Tallenna nimellä",
    download: "Lataa",
    copy_to_clipboard: "Kopioi leikepöydälle",
  },
  "fr-CA": {
    soon: "Bientôt",
    save_as: "Enregistrer sous",
    download: "Télécharger",
    copy_to_clipboard: "Copier dans le presse-papiers",
  },
  "fr-FR": {
    soon: "Bientôt",
    save_as: "Enregistrer sous",
    download: "Télécharger",
    copy_to_clipboard: "Copier dans le presse-papiers",
  },
  "gu-IN": {
    soon: "શીઘ્ર જ",
    save_as: "તેવું સાચવો",
    download: "ડાઉનલોડ",
    copy_to_clipboard: "ક્લિપબોર્ડમાં કૉપિ કરો",
  },
  "hi-IN": {
    soon: "जल्द ही",
    save_as: "इस रूप में सहेजें",
    download: "डाउनलोड",
    copy_to_clipboard: "क्लिपबोर्ड पर कॉपी करें",
  },
  "hr-HR": {
    soon: "Uskoro",
    save_as: "Spremi kao",
    download: "Preuzimanje",
    copy_to_clipboard: "Kopiraj u međuspremnik",
  },
  "hu-HU": {
    soon: "Hamarosan",
    save_as: "Mentés másként",
    download: "Letöltés",
    copy_to_clipboard: "Másolás vágólapra",
  },
  "hy-AM": {
    soon: "Շուտով",
    save_as: "Պահել որպես",
    download: "Ներբեռնել",
    copy_to_clipboard: "Պատճենել սեղմատախտակին",
  },
  "id-ID": {
    soon: "Segera",
    save_as: "Simpan sebagai",
    download: "Unduh",
    copy_to_clipboard: "Salin ke papan klip",
  },
  "is-IS": {
    soon: "Bráðum",
    save_as: "Vista sem",
    download: "Niðurhal",
    copy_to_clipboard: "Afrita í klippiborð",
  },
  "it-IT": {
    soon: "Presto",
    save_as: "Salva con nome",
    download: "Scaricare",
    copy_to_clipboard: "Copia negli appunti",
  },
  "ja-JP": {
    soon: "近日中",
    save_as: "名前を付けて保存",
    download: "ダウンロード",
    copy_to_clipboard: "クリップボードにコピー",
  },
  "ka-GE": {
    soon: "მალე",
    save_as: "შენახვა როგორც",
    download: "ჩამოტვირთვა",
    copy_to_clipboard: "კოპირება ბუფერში",
  },
  kk: {
    soon: "Жақында",
    save_as: "Басқаша сақтау",
    download: "Жүктеу",
    copy_to_clipboard: "Буферге көшіру",
  },
  "kn-IN": {
    soon: "ಶೀಘ್ರದಲ್ಲೇ",
    save_as: "ಹೆಸರುಗಳನ್ನು ಉಳಿಸು",
    download: "ಡೌನ್‌ಲೋಡ್",
    copy_to_clipboard: "ಕ್ಲಿಪ್‌ಬೋರ್ಡ್‌ಗೆ ಪ್ರತಿಲಿಪಿ ಮಾಡಿ",
  },
  "ko-KR": {
    soon: "곧",
    save_as: "다른 이름으로 저장",
    download: "다운로드",
    copy_to_clipboard: "클립보드에 복사",
  },
  lt: {
    soon: "Netrukus",
    save_as: "Įrašyti kaip",
    download: "Atsisiųsti",
    copy_to_clipboard: "Kopijuoti į mainų sritį",
  },
  "lv-LV": {
    soon: "Drīzumā",
    save_as: "Saglabāt kā",
    download: "Lejupielādēt",
    copy_to_clipboard: "Kopēt starpliktuvē",
  },
  "mk-MK": {
    soon: "Набргу",
    save_as: "Зачувај како",
    download: "Преземи",
    copy_to_clipboard: "Копирај во привремената меморија",
  },
  ml: {
    soon: "വെറും കുറച്ച് ദിവസങ്ങൾ",
    save_as: "ഇത് പോലെ സംരക്ഷിക്കുക",
    download: "ഡൗൺലോഡ്",
    copy_to_clipboard: "ക്ലിപ്പ്ബോർഡിലേക്ക് പകർത്തുക",
  },
  mn: {
    soon: "Удахгүй",
    save_as: "Гэж хадгалах",
    download: "Татах",
    copy_to_clipboard: "Түр санах ойд хуулбарлах",
  },
  "mr-IN": {
    soon: "लवकरच",
    save_as: "या नावाने साठवा",
    download: "डाउनलोड",
    copy_to_clipboard: "क्लिपबोर्डवर कॉपी करा",
  },
  "ms-MY": {
    soon: "Segera",
    save_as: "Simpan sebagai",
    download: "Muat turun",
    copy_to_clipboard: "Salin ke papan keratan",
  },
  "my-MM": {
    soon: "မကြာခင်",
    save_as: "အဖြစ် သိမ်းမည်",
    download: "ဒေါင်းလုပ်",
    copy_to_clipboard: "ကလစ်ဘုတ်သို့ ကော်ပီလုပ်ပါ",
  },
  "nb-NO": {
    soon: "Snart",
    save_as: "Lagre som",
    download: "Last ned",
    copy_to_clipboard: "Kopier til utklippstavle",
  },
  "nl-NL": {
    soon: "Binnenkort",
    save_as: "Opslaan als",
    download: "Downloaden",
    copy_to_clipboard: "Kopiëren naar klembord",
  },
  pa: {
    soon: "ਜਲਦੀ ਹੀ",
    save_as: "ਇਸ ਤਰ੍ਹਾਂ ਸੇਵ ਕਰੋ",
    download: "ਡਾਊਨਲੋਡ",
    copy_to_clipboard: "ਕਲਿੱਪਬੋਰਡ ਤੇ ਕਾਪੀ ਕਰੋ",
  },
  "pl-PL": {
    soon: "Wkrótce",
    save_as: "Zapisz jako",
    download: "Pobierz",
    copy_to_clipboard: "Kopiuj do schowka",
  },
  "pt-BR": {
    soon: "Em breve",
    save_as: "Salvar como",
    download: "Baixar",
    copy_to_clipboard: "Copiar para a área de transferência",
  },
  "pt-PT": {
    soon: "Em breve",
    save_as: "Guardar como",
    download: "Descarregar",
    copy_to_clipboard: "Copiar para a área de transferência",
  },
  "ro-RO": {
    soon: "În curând",
    save_as: "Salvează ca",
    download: "Descărcare",
    copy_to_clipboard: "Copiază în clipboard",
  },
  "ru-RU": {
    soon: "Скоро",
    save_as: "Сохранить как",
    download: "Скачать",
    copy_to_clipboard: "Копировать в буфер обмена",
  },
  "sk-SK": {
    soon: "Čoskoro",
    save_as: "Uložiť ako",
    download: "Stiahnuť",
    copy_to_clipboard: "Kopírovať do schránky",
  },
  "sl-SI": {
    soon: "Kmalu",
    save_as: "Shrani kot",
    download: "Prenesi",
    copy_to_clipboard: "Kopiraj v odložišče",
  },
  "so-SO": {
    soon: "Dhawaan",
    save_as: "Keydso sidii",
    download: "Soo dejiso",
    copy_to_clipboard: "Nuqul ka samee sabuuradda",
  },
  "sq-AL": {
    soon: "Së shpejti",
    save_as: "Ruaj si",
    download: "Shkarko",
    copy_to_clipboard: "Kopjo në kujtesë",
  },
  "sr-RS": {
    soon: "Ускоро",
    save_as: "Сачувај као",
    download: "Преузми",
    copy_to_clipboard: "Копирај у привремену меморију",
  },
  "sv-SE": {
    soon: "Snart",
    save_as: "Spara som",
    download: "Ladda ner",
    copy_to_clipboard: "Kopiera till urklipp",
  },
  "sw-TZ": {
    soon: "Hivi karibuni",
    save_as: "Hifadhi kama",
    download: "Pakua",
    copy_to_clipboard: "Nakili kwenye ubao wa kunakili",
  },
  "ta-IN": {
    soon: "விரைவில்",
    save_as: "இதுபோல சேமி",
    download: "பதிவிறக்கம்",
    copy_to_clipboard: "பட்டிகையில் நகலெடுக்கவும்",
  },
  "te-IN": {
    soon: "త్వరలో",
    save_as: "ఇలా సేవ్ చేయి",
    download: "డౌన్‌లోడ్",
    copy_to_clipboard: "క్లిప్‌బోర్డ్‌కు కాపీ చేయండి",
  },
  "th-TH": {
    soon: "เร็ว ๆ นี้",
    save_as: "บันทึกเป็น",
    download: "ดาวน์โหลด",
    copy_to_clipboard: "คัดลอกไปที่คลิปบอร์ด",
  },
  tl: {
    soon: "Malapit na",
    save_as: "I-save bilang",
    download: "I-download",
    copy_to_clipboard: "Kopyahin sa clipboard",
  },
  "tr-TR": {
    soon: "Yakında",
    save_as: "Farklı kaydet",
    download: "İndir",
    copy_to_clipboard: "Panoya kopyala",
  },
  "uk-UA": {
    soon: "Незабаром",
    save_as: "Зберегти як",
    download: "Завантажити",
    copy_to_clipboard: "Копіювати в буфер обміну",
  },
  ur: {
    soon: "جلد",
    save_as: "اس نام سے محفوظ کریں",
    download: "ڈاؤن لوڈ",
    copy_to_clipboard: "کلپ بورڈ پر کاپی کریں",
  },
  "vi-VN": {
    soon: "Sắp tới",
    save_as: "Lưu thành",
    download: "Tải xuống",
    copy_to_clipboard: "Sao chép vào bộ nhớ tạm",
  },
  "zh-CN": {
    soon: "即将推出",
    save_as: "另存为",
    download: "下载",
    copy_to_clipboard: "复制到剪贴板",
  },
  "zh-HK": {
    soon: "即將推出",
    save_as: "另存為",
    download: "下載",
    copy_to_clipboard: "複製到剪貼簿",
  },
  "zh-TW": {
    soon: "即將推出",
    save_as: "另存為",
    download: "下載",
    copy_to_clipboard: "複製到剪貼簿",
  },
  code: "Object.fromEntries(Object.keys(obj).map(k =>  ([k,  {...obj[k], ...arr1[k]} ]) ))",
};

export default (() => {
  const preferedLang = JSON.parse(localStorage.getItem("oai/apps/locale")) || getCookie("oai-locale");

  if (preferedLang) return supportedLangObj[preferedLang];
  else {
    const browserPreferedLangauge = [navigator.language] || navigator.languages;

    for (let [k, v] of Object.entries(supportedLangObj)) {
      k = k.split("-")[0];

      if (browserPreferedLangauge.some((item) => item.startsWith(k))) return v;
    }
  }

  return supportedLangObj["en-US"];
})();
