// ============================================================
//  TravelNest Demo – i18n (Internationalization) Module
// ============================================================

const I18n = (() => {
  const SS_KEY = 'tn_lang';

  // ── URL ?lang=en → sessionStorage（スクリプトロード時に即時実行）──
  (() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get('lang') === 'en') sessionStorage.setItem(SS_KEY, 'en');
  })();

  // ── 英語モード判定 ─────────────────────────────────────────
  function isEN() {
    return sessionStorage.getItem(SS_KEY) === 'en';
  }

  // ── 言語に応じた文字列を返す ──────────────────────────────
  function t(ja, en) {
    return isEN() ? en : ja;
  }

  // ── URL に ?lang=en を付加して返す ────────────────────────
  function urlWith(url) {
    if (!isEN() || !url) return url;
    if (url.startsWith('#') || url === '') return url;      // ページ内アンカー
    if (url.includes('lang=en')) return url;                // 重複回避
    const hashIdx = url.indexOf('#');
    if (hashIdx !== -1) {
      const base   = url.slice(0, hashIdx);
      const anchor = url.slice(hashIdx);
      const sep    = base.includes('?') ? '&' : '?';
      return base + sep + 'lang=en' + anchor;
    }
    const sep = url.includes('?') ? '&' : '?';
    return url + sep + 'lang=en';
  }

  // ── window.location.href の代替（lang 付加）──────────────
  function go(url) {
    window.location.href = urlWith(url);
  }

  // ── window.open の代替（lang 付加）───────────────────────
  function open(url, target, features) {
    window.open(urlWith(url), target || '_blank', features);
  }

  // ── 設備名の英語マップ ────────────────────────────────────
  const _FACILITY_EN = {
    "WiFi": "WiFi",
    "朝食": "Breakfast",
    "朝食付き": "Breakfast Incl.",
    "駐車場": "Parking",
    "プール": "Pool",
    "リゾートプール": "Resort Pool",
    "スパ": "Spa",
    "バー": "Bar",
    "ジム": "Gym",
    "温泉": "Hot Spring",
    "温泉・大浴場": "Hot Spring & Bath",
    "レストラン": "Restaurant",
    "コンシェルジュ": "Concierge",
    "ルームサービス": "Room Service",
    "禁煙": "Non-smoking",
    "フィットネス": "Fitness",
    "テニスコート": "Tennis Court",
    "空港シャトル": "Airport Shuttle",
    "ランドリー": "Laundry",
    "会議室": "Meeting Room",
    "ビジネスセンター": "Business Center",
    "バンガロー": "Bungalow",
    "ダイビング": "Diving",
    "マングローブツアー": "Mangrove Tour",
    "海水浴場近く": "Near Beach",
    "観光案内所": "Tourist Info",
    "バルコニー": "Balcony",
    "ビーチフロント": "Beachfront",
    "眺望": "Scenic View",
    "海側": "Ocean View",
    "山側": "Mountain View",
    "キッチン付き": "Kitchenette",
  };

  function tFacility(name) {
    if (!isEN()) return name;
    return _FACILITY_EN[name] || name;
  }

  // ── [data-i18n-en] 属性を持つ要素に英語テキストを適用 ────
  // buildPage() の末尾から呼ぶ
  function apply() {
    if (!isEN()) return;

    // テキストコンテンツの置換
    document.querySelectorAll('[data-i18n-en]').forEach(el => {
      const en = el.getAttribute('data-i18n-en');
      if (en === null) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = en;
      } else {
        el.textContent = en;
      }
    });

    // placeholder のみ置換
    document.querySelectorAll('[data-i18n-ph-en]').forEach(el => {
      el.placeholder = el.getAttribute('data-i18n-ph-en');
    });

    // 内部リンクに ?lang=en を付加
    document.querySelectorAll('a[href]').forEach(el => {
      const href = el.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') ||
          href.startsWith('javascript') || href.startsWith('mailto')) return;
      el.setAttribute('href', urlWith(href));
    });
  }

  return { isEN, t, urlWith, go, open, tFacility, apply };
})();
