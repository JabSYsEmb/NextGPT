const supportedLangObj = {
  am: {
    soon: "በቅርቡ",
    save_as: "እንደ አስቀምጥ",
    download: "አውርድ",
  },
  ar: {
    soon: "قريبا",
    save_as: "احفظ كـ",
    download: "تنزيل",
  },
  "bg-BG": {
    soon: "Скоро",
    save_as: "Запази като",
    download: "Изтегляне",
  },
  "bn-BD": {
    soon: "শীঘ্রই",
    save_as: "এই নামে সংরক্ষণ করুন",
    download: "ডাউনলোড",
  },
  "bs-BA": {
    soon: "Uskoro",
    save_as: "Sačuvaj kao",
    download: "Preuzimanje",
  },
  "ca-ES": {
    soon: "Aviat",
    save_as: "Desa com a",
    download: "Descarregar",
  },
  "cs-CZ": {
    soon: "Brzy",
    save_as: "Uložit jako",
    download: "Stáhnout",
  },
  "da-DK": {
    soon: "Snart",
    save_as: "Gem som",
    download: "Download",
  },
  "de-DE": {
    soon: "Bald",
    save_as: "Speichern unter",
    download: "Herunterladen",
  },
  "el-GR": {
    soon: "Σύντομα",
    save_as: "Αποθήκευση ως",
    download: "Λήψη",
  },
  "en-US": {
    soon: "Soon",
    save_as: "Save as",
    download: "Download",
  },
  "es-419": {
    soon: "Pronto",
    save_as: "Guardar como",
    download: "Descargar",
  },
  "es-ES": {
    soon: "Pronto",
    save_as: "Guardar como",
    download: "Descargar",
  },
  "et-EE": {
    soon: "Varsti",
    save_as: "Salvesta nimega",
    download: "Laadi alla",
  },
  "fi-FI": {
    soon: "Pian",
    save_as: "Tallenna nimellä",
    download: "Lataa",
  },
  "fr-CA": {
    soon: "Bientôt",
    save_as: "Enregistrer sous",
    download: "Télécharger",
  },
  "fr-FR": {
    soon: "Bientôt",
    save_as: "Enregistrer sous",
    download: "Télécharger",
  },
  "gu-IN": {
    soon: "શીઘ્ર જ",
    save_as: "તેવું સાચવો",
    download: "ડાઉનલોડ",
  },
  "hi-IN": {
    soon: "जल्द ही",
    save_as: "इस रूप में सहेजें",
    download: "डाउनलोड",
  },
  "hr-HR": {
    soon: "Uskoro",
    save_as: "Spremi kao",
    download: "Preuzimanje",
  },
  "hu-HU": {
    soon: "Hamarosan",
    save_as: "Mentés másként",
    download: "Letöltés",
  },
  "hy-AM": {
    soon: "Շուտով",
    save_as: "Պահել որպես",
    download: "Ներբեռնել",
  },
  "id-ID": {
    soon: "Segera",
    save_as: "Simpan sebagai",
    download: "Unduh",
  },
  "is-IS": {
    soon: "Bráðum",
    save_as: "Vista sem",
    download: "Niðurhal",
  },
  "it-IT": {
    soon: "Presto",
    save_as: "Salva con nome",
    download: "Scaricare",
  },
  "ja-JP": {
    soon: "近日中",
    save_as: "名前を付けて保存",
    download: "ダウンロード",
  },
  "ka-GE": {
    soon: "მალე",
    save_as: "შენახვა როგორც",
    download: "ჩამოტვირთვა",
  },
  kk: {
    soon: "Жақында",
    save_as: "Басқаша сақтау",
    download: "Жүктеу",
  },
  "kn-IN": {
    soon: "ಶೀಘ್ರದಲ್ಲೇ",
    save_as: "ಹೆಸರುಗಳನ್ನು ಉಳಿಸು",
    download: "ಡೌನ್‌ಲೋಡ್",
  },
  "ko-KR": {
    soon: "곧",
    save_as: "다른 이름으로 저장",
    download: "다운로드",
  },
  lt: {
    soon: "Netrukus",
    save_as: "Įrašyti kaip",
    download: "Atsisiųsti",
  },
  "lv-LV": {
    soon: "Drīzumā",
    save_as: "Saglabāt kā",
    download: "Lejupielādēt",
  },
  "mk-MK": {
    soon: "Набргу",
    save_as: "Зачувај како",
    download: "Преземи",
  },
  ml: {
    soon: "വെറും കുറച്ച് ദിവസങ്ങൾ",
    save_as: "ഇത് പോലെ സംരക്ഷിക്കുക",
    download: "ഡൗൺലോഡ്",
  },
  mn: {
    soon: "Удахгүй",
    save_as: "Гэж хадгалах",
    download: "Татах",
  },
  "mr-IN": {
    soon: "लवकरच",
    save_as: "या नावाने साठवा",
    download: "डाउनलोड",
  },
  "ms-MY": {
    soon: "Segera",
    save_as: "Simpan sebagai",
    download: "Muat turun",
  },
  "my-MM": {
    soon: "မကြာခင်",
    save_as: "အဖြစ် သိမ်းမည်",
    download: "ဒေါင်းလုပ်",
  },
  "nb-NO": {
    soon: "Snart",
    save_as: "Lagre som",
    download: "Last ned",
  },
  "nl-NL": {
    soon: "Binnenkort",
    save_as: "Opslaan als",
    download: "Downloaden",
  },
  pa: {
    soon: "ਜਲਦੀ ਹੀ",
    save_as: "ਇਸ ਤਰ੍ਹਾਂ ਸੇਵ ਕਰੋ",
    download: "ਡਾਊਨਲੋਡ",
  },
  "pl-PL": {
    soon: "Wkrótce",
    save_as: "Zapisz jako",
    download: "Pobierz",
  },
  "pt-BR": {
    soon: "Em breve",
    save_as: "Salvar como",
    download: "Baixar",
  },
  "pt-PT": {
    soon: "Em breve",
    save_as: "Guardar como",
    download: "Descarregar",
  },
  "ro-RO": {
    soon: "În curând",
    save_as: "Salvează ca",
    download: "Descărcare",
  },
  "ru-RU": {
    soon: "Скоро",
    save_as: "Сохранить как",
    download: "Скачать",
  },
  "sk-SK": {
    soon: "Čoskoro",
    save_as: "Uložiť ako",
    download: "Stiahnuť",
  },
  "sl-SI": {
    soon: "Kmalu",
    save_as: "Shrani kot",
    download: "Prenesi",
  },
  "so-SO": {
    soon: "Dhawaan",
    save_as: "Keydso sidii",
    download: "Soo dejiso",
  },
  "sq-AL": {
    soon: "Së shpejti",
    save_as: "Ruaj si",
    download: "Shkarko",
  },
  "sr-RS": {
    soon: "Ускоро",
    save_as: "Сачувај као",
    download: "Преузми",
  },
  "sv-SE": {
    soon: "Snart",
    save_as: "Spara som",
    download: "Ladda ner",
  },
  "sw-TZ": {
    soon: "Hivi karibuni",
    save_as: "Hifadhi kama",
    download: "Pakua",
  },
  "ta-IN": {
    soon: "விரைவில்",
    save_as: "இதுபோல சேமி",
    download: "பதிவிறக்கம்",
  },
  "te-IN": {
    soon: "త్వరలో",
    save_as: "ఇలా సేవ్ చేయి",
    download: "డౌన్‌లోడ్",
  },
  "th-TH": {
    soon: "เร็ว ๆ นี้",
    save_as: "บันทึกเป็น",
    download: "ดาวน์โหลด",
  },
  tl: {
    soon: "Malapit na",
    save_as: "I-save bilang",
    download: "I-download",
  },
  "tr-TR": {
    soon: "Yakında",
    save_as: "Farklı kaydet",
    download: "İndir",
  },
  "uk-UA": {
    soon: "Незабаром",
    save_as: "Зберегти як",
    download: "Завантажити",
  },
  ur: {
    soon: "جلد",
    save_as: "اس نام سے محفوظ کریں",
    download: "ڈاؤن لوڈ",
  },
  "vi-VN": {
    soon: "Sắp tới",
    save_as: "Lưu thành",
    download: "Tải xuống",
  },
  "zh-CN": {
    soon: "即将推出",
    save_as: "另存为",
    download: "下载",
  },
  "zh-HK": {
    soon: "即將推出",
    save_as: "另存為",
    download: "下載",
  },
  "zh-TW": {
    soon: "即將推出",
    save_as: "另存為",
    download: "下載",
  },
  code: "Object.fromEntries(Object.keys(obj).map(k =>  ([k,  {...obj[k], ...arr1[k]} ]) ))",
};

export default (() => {
  const preferedLang = JSON.parse(localStorage.getItem("oai/apps/locale"));

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
