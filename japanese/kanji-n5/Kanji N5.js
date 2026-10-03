// ==========================================
// ⚙️ การตั้งค่าระบบ
// ==========================================
const REFRESH_INTERVAL_MINUTES = 30; // ⏱️ แนะนำโดย Apple: 30 นาทีต่อคำ (กำลังพอดีกับการจำ ไม่กินแบต ไม่ติด Throttling)

// � Shortcut ที่ต้องสร้างมีแค่ตัวเดียว: "SpeakJP" (สำหรับอ่านออกเสียง)
//    ปุ่มสุ่มคำใหม่เรียก Scriptable ตรงๆ ไม่ต้องสร้าง Shortcut เพิ่ม
const SPEAK_SHORTCUT_NAME = "SpeakJP";

// ==========================================
// ☀️ คลังรูปภาพวิวญี่ปุ่น เซ็ตกลางวัน (06:00 - 17:59)
// ==========================================
const dayImages = [
  "https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=600&h=300&q=75", // ฟูจิ + เจดีย์แดง
  "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=600&h=300&q=75", // ซากุระสีชมพู
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&h=300&q=75"  // ศาลเจ้าเกียวโต
];

// ==========================================
// 🌙 คลังรูปภาพวิวญี่ปุ่น เซ็ตกลางคืน (18:00 - 05:59)
// ==========================================
const nightImages = [
  "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&h=300&q=75", // Tokyo Tower ส้มสว่าง
  "https://images.unsplash.com/photo-1509023464722-18d996393ca8?auto=format&fit=crop&w=600&h=300&q=75", // นีออนโตเกียว
  "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&h=300&q=75"  // ชิบูย่ากลางคืน
];

// ==========================================
// คลังคันจิ JLPT N5 ตัวเต็ม (101 ตัว ตรวจสอบแล้ว 100%)
// ==========================================
const kanjiList = [
  { k: "一", kun: "ひと(つ)", on: "イチ", m: "หนึ่ง", c: "一人 (ひとり)", cm: "คนเดียว / 1 คน" },
  { k: "二", kun: "ふた(つ)", on: "ニ", m: "สอง", c: "二月 (にがつ)", cm: "เดือนกุมภาพันธ์" },
  { k: "三", kun: "みっ(つ)", on: "サン", m: "สาม", c: "三年 (さんねん)", cm: "ระยะเวลา 3 ปี" },
  { k: "四", kun: "よっ(つ), よん", on: "シ", m: "สี่", c: "四季 (しき)", cm: "สี่ฤดู" },
  { k: "五", kun: "いつ(つ)", on: "ゴ", m: "ห้า", c: "五分 (ごふん)", cm: "ห้านาที" },
  { k: "六", kun: "むっ(つ)", on: "ロク", m: "หก", c: "六日 (むいか)", cm: "วันที่ 6 / 6 วัน" },
  { k: "七", kun: "なな(つ)", on: "シチ", m: "เจ็ด", c: "七月 (しちがつ)", cm: "เดือนกรกฎาคม" },
  { k: "八", kun: "やっ(つ)", on: "ハチ", m: "แปด", c: "八百屋 (やおや)", cm: "ร้านขายผักผลไม้" },
  { k: "九", kun: "ここの(つ)", on: "キュウ", m: "เก้า", c: "九時 (くじ)", cm: "เก้าโมงเช้า" },
  { k: "十", kun: "とお", on: "ジュウ", m: "สิบ", c: "十分 (じゅっぷん)", cm: "สิบนาที" },
  { k: "百", kun: "-", on: "ヒャク", m: "ร้อย", c: "三百 (さんびゃく)", cm: "สามร้อย" },
  { k: "千", kun: "ち", on: "セン", m: "พัน", c: "千円 (せんえん)", cm: "หนึ่งพันเยน" },
  { k: "万", kun: "-", on: "マン", m: "หมื่น", c: "一万円 (いちまんえん)", cm: "หนึ่งหมื่นเยน" },
  { k: "円", kun: "まる(い)", on: "エン", m: "เยน / กลม", c: "百円 (ひゃくえん)", cm: "หนึ่งร้อยเยน" },
  { k: "日", kun: "ひ, び", on: "ニチ", m: "วัน / แดด", c: "日曜日 (にちようび)", cm: "วันอาทิตย์" },
  { k: "月", kun: "つき", on: "ゲツ, ガツ", m: "เดือน / จันทร์", c: "今月 (こんげつ)", cm: "เดือนนี้" },
  { k: "火", kun: "ひ", on: "カ", m: "ไฟ", c: "火曜日 (かようび)", cm: "วันอังคาร" },
  { k: "水", kun: "みず", on: "スイ", m: "น้ำ", c: "水曜日 (すいようび)", cm: "วันพุธ" },
  { k: "木", kun: "き", on: "モク", m: "ต้นไม้ / ไม้", c: "木曜日 (もくようび)", cm: "วันพฤหัสบดี" },
  { k: "金", kun: "かね", on: "キン", m: "เงิน / ทอง", c: "金曜日 (きんようび)", cm: "วันศุกร์" },
  { k: "土", kun: "つち", on: "ド", m: "ดิน", c: "土曜日 (どようび)", cm: "วันเสาร์" },
  { k: "年", kun: "とし", on: "ネン", m: "ปี", c: "去年 (きょねん)", cm: "ปีที่แล้ว" },
  { k: "時", kun: "とき", on: "ジ", m: "เวลา / โมง", c: "時間 (じかん)", cm: "เวลา / ชั่วโมง" },
  { k: "分", kun: "わ(かる)", on: "フン, ブン", m: "นาที / เข้าใจ", c: "分かる (わかる)", cm: "เข้าใจ / รู้เรื่อง" },
  { k: "半", kun: "なか(ば)", on: "ハン", m: "ครึ่ง", c: "半分 (はんぶん)", cm: "ครึ่งหนึ่ง" },
  { k: "今", kun: "いま", on: "コン", m: "ตอนนี้", c: "今日 (きょう)", cm: "วันนี้" },
  { k: "先", kun: "さき", on: "セン", m: "ก่อน / ล่วงหน้า", c: "先生 (せんせい)", cm: "ครู / อาจารย์" },
  { k: "毎", kun: "-", on: "マイ", m: "ทุกๆ", c: "毎日 (まいにち)", cm: "ทุกวัน" },
  { k: "何", kun: "なに, なん", on: "カ", m: "อะไร", c: "何時 (なんじ)", cm: "กี่โมง" },
  { k: "人", kun: "ひと", on: "ジン, ニン", m: "คน", c: "日本人 (にほんじん)", cm: "คนญี่ปุ่น" },
  { k: "男", kun: "おとこ", on: "ダン", m: "ผู้ชาย", c: "男の子 (おとこのこ)", cm: "เด็กผู้ชาย" },
  { k: "女", kun: "おんな", on: "ジョ", m: "ผู้หญิง", c: "女の子 (おんなのこ)", cm: "เด็กผู้หญิง" },
  { k: "子", kun: "こ", on: "シ", m: "เด็ก", c: "子供 (こども)", cm: "เด็กๆ" },
  { k: "母", kun: "はは", on: "ボ", m: "แม่", c: "お母さん (おかあさん)", cm: "คุณแม่" },
  { k: "父", kun: "ちち", on: "フ", m: "พ่อ", c: "お父さん (おとうさん)", cm: "คุณพ่อ" },
  { k: "友", kun: "とも", on: "ユウ", m: "เพื่อน", c: "友達 (ともだち)", cm: "เพื่อนฝูง" },
  { k: "目", kun: "め", on: "モク", m: "ตา", c: "目薬 (めぐすり)", cm: "ยาหยอดตา" },
  { k: "耳", kun: "みみ", on: "ジ", m: "หู", c: "耳 (みみ)", cm: "หู / การได้ยิน" },
  { k: "口", kun: "くち", on: "コウ", m: "ปาก / ทางเข้าออก", c: "入口 (いりぐち)", cm: "ทางเข้า" },
  { k: "手", kun: "て", on: "シュ", m: "มือ", c: "上手 (じょうず)", cm: "เก่ง / ชำนาญ" },
  { k: "足", kun: "あし", on: "ソク", m: "ขา / เท้า", c: "足りる (たりる)", cm: "เพียงพอ" },
  { k: "上", kun: "うえ", on: "ジョウ", m: "บน / เหนือ", c: "上手 (じょうず)", cm: "เก่ง" },
  { k: "下", kun: "した", on: "カ, ゲ", m: "ล่าง / ใต้", c: "地下鉄 (ちかてつ)", cm: "รถไฟใต้ดิน" },
  { k: "左", kun: "ひだり", on: "サ", m: "ซ้าย", c: "左手 (ひだりて)", cm: "มือซ้าย" },
  { k: "右", kun: "みぎ", on: "ウ, ユウ", m: "ขวา", c: "右手 (みぎて)", cm: "มือขวา" },
  { k: "中", kun: "なか", on: "チュウ", m: "ใน / กลาง", c: "一日中 (いちにちじゅう)", cm: "ตลอดทั้งวัน" },
  { k: "外", kun: "そと", on: "ガイ", m: "นอก", c: "外国 (がいこく)", cm: "ต่างประเทศ" },
  { k: "前", kun: "まえ", on: "ゼン", m: "หน้า / ก่อน", c: "午前 (ごぜん)", cm: "ช่วงเช้า" },
  { k: "後", kun: "うしろ, あと", on: "ゴ, コウ", m: "หลัง", c: "午後 (ごご)", cm: "ช่วงบ่าย" },
  { k: "北", kun: "きた", on: "ホク", m: "เหนือ", c: "北口 (きたぐち)", cm: "ทางออกทิศเหนือ" },
  { k: "南", kun: "みなみ", on: "ナン", m: "ใต้", c: "南口 (みなみぐち)", cm: "ทางออกทิศใต้" },
  { k: "東", kun: "ひがし", on: "トウ", m: "ตะวันออก", c: "東京 (とうきょう)", cm: "โตเกียว" },
  { k: "西", kun: "にし", on: "セイ, サイ", m: "ตะวันตก", c: "関西 (かんさい)", cm: "ภูมิภาคคันไซ" },
  { k: "行", kun: "い(く)", on: "コウ", m: "ไป", c: "旅行 (りょこう)", cm: "การท่องเที่ยว" },
  { k: "来", kun: "く(る)", on: "ライ", m: "มา", c: "来週 (らいしゅう)", cm: "สัปดาห์หน้า" },
  { k: "帰", kun: "かえ(る)", on: "キ", m: "กลับ", c: "帰国 (きこく)", cm: "กลับประเทศ" },
  { k: "食", kun: "た(べる)", on: "ショク", m: "กิน", c: "食事 (しょくじ)", cm: "มื้ออาหาร" },
  { k: "飲", kun: "の(む)", on: "イン", m: "ดื่ม", c: "飲み物 (のみもの)", cm: "เครื่องดื่ม" },
  { k: "見", kun: "み(る)", on: "ケン", m: "ดู / มองเห็น", c: "意見 (いけん)", cm: "ความคิดเห็น" },
  { k: "聞", kun: "き(く)", on: "ブン", m: "ฟัง / ถาม", c: "新聞 (しんぶん)", cm: "หนังสือพิมพ์" },
  { k: "読", kun: "よ(む)", on: "ドク", m: "อ่าน", c: "読書 (どくしょ)", cm: "การอ่านหนังสือ" },
  { k: "書", kun: "か(く)", on: "ショ", m: "เขียน", c: "辞書 (じしょ)", cm: "พจนานุกรม" },
  { k: "話", kun: "はな(す)", on: "ワ", m: "พูด / คุย", c: "会話 (かいわ)", cm: "บทสนทนา" },
  { k: "買", kun: "か(う)", on: "バイ", m: "ซื้อ", c: "買い物 (かいもの)", cm: "การซื้อของ" },
  { k: "会", kun: "あ(う)", on: "カイ", m: "พบ / เจอ", c: "会社 (かいしゃ)", cm: "บริษัท" },
  { k: "休", kun: "やす(む)", on: "キュウ", m: "พักผ่อน", c: "休日 (きゅうじつ)", cm: "วันหยุด" },
  { k: "入", kun: "はい(る)", on: "ニュウ", m: "เข้า / ใส่", c: "入学 (にゅうがく)", cm: "การเข้าเรียน" },
  { k: "出", kun: "で(る)", on: "シュツ", m: "ออก", c: "出口 (でぐち)", cm: "ทางออก" },
  { k: "立", kun: "た(つ)", on: "リツ", m: "ยืน / ตั้ง", c: "私立 (しりつ)", cm: "เอกชน" },
  { k: "言", kun: "い(う)", on: "ゲン, ゴン", m: "พูด / บอก", c: "方言 (ほうげん)", cm: "ภาษาถิ่น" },
  { k: "待", kun: "ま(つ)", on: "タイ", m: "รอ", c: "期待 (きたい)", cm: "ความคาดหวัง" },
  { k: "持", kun: "も(つ)", on: "ジ", m: "ถือ / มี", c: "気持ち (きもち)", cm: "ความรู้สึก / อารมณ์" },
  { k: "知", kun: "し(る)", on: "チ", m: "รู้ / รู้จัก", c: "知人 (ちじん)", cm: "คนรู้จัก" },
  { k: "作", kun: "つく(る)", on: "サク", m: "ทำ / สร้าง", c: "作文 (さくぶん)", cm: "เรียงความ" },
  { k: "使", kun: "つか(う)", on: "シ", m: "ใช้", c: "大使 (たいし)", cm: "เอกอัครราชทูต" },
  { k: "大", kun: "おお(きい)", on: "ダイ", m: "ใหญ่", c: "大学 (だいがく)", cm: "มหาวิทยาลัย" },
  { k: "小", kun: "ちい(さい)", on: "ショウ", m: "เล็ก", c: "小学生 (しょうがくせい)", cm: "เด็กประถม" },
  { k: "高", kun: "たか(い)", on: "コウ", m: "สูง / แพง", c: "高校 (こうこう)", cm: "โรงเรียน ม.ปลาย" },
  { k: "安", kun: "やす(い)", on: "アン", m: "ถูก / สงบ", c: "安心 (あんしん)", cm: "ความสบายใจ" },
  { k: "新", kun: "あたら(しい)", on: "シン", m: "ใหม่", c: "新聞 (しんぶん)", cm: "หนังสือพิมพ์" },
  { k: "古", kun: "ふる(い)", on: "コ", m: "เก่า", c: "中古 (ちゅうこ)", cm: "สินค้ามือสอง" },
  { k: "長", kun: "なが(い)", on: "チョウ", m: "ยาว / หัวหน้า", c: "社長 (しゃちょう)", cm: "ประธานบริษัท" },
  { k: "多", kun: "おお(い)", on: "タ", m: "มาก / เยอะ", c: "多分 (たぶん)", cm: "อาจจะ / คงจะ" },
  { k: "少", kun: "すく(ない)", on: "ショウ", m: "น้อย", c: "少し (すこし)", cm: "นิดหน่อย" },
  { k: "早", kun: "はや(い)", on: "ソウ", m: "เร็ว / เช้า", c: "早朝 (そうちょう)", cm: "ช่วงเช้าตรู่" },
  { k: "白", kun: "しろ(い)", on: "ハク", m: "ขาว", c: "白黒 (しろくろ)", cm: "ขาวดำ" },
  { k: "赤", kun: "あか(い)", on: "セキ", m: "แดง", c: "赤ちゃん (あかちゃん)", cm: "เด็กทารก" },
  { k: "青", kun: "あお(い)", on: "セイ", m: "น้ำเงิน / ฟ้า", c: "青空 (あおぞら)", cm: "ท้องฟ้าโปร่ง" },
  { k: "黒", kun: "くろ(い)", on: "コク", m: "ดำ", c: "黒板 (こくばん)", cm: "กระดานดำ" },
  { k: "国", kun: "くに", on: "コク", m: "ประเทศ", c: "外国人 (がいこくじん)", cm: "คนต่างชาติ" },
  { k: "学", kun: "まな(ぶ)", on: "ガク", m: "เรียน", c: "学生 (がくせい)", cm: "นักเรียน / นักศึกษา" },
  { k: "校", kun: "-", on: "コウ", m: "โรงเรียน", c: "学校 (がっこう)", cm: "โรงเรียน" },
  { k: "生", kun: "い(きる)", on: "セイ", m: "เกิด / ชีวิต", c: "生活 (せいかつ)", cm: "การใช้ชีวิต" },
  { k: "本", kun: "もと", on: "ホン", m: "หนังสือ / รากฐาน", c: "日本 (にほん)", cm: "ประเทศญี่ปุ่น" },
  { k: "語", kun: "かた(る)", on: "ゴ", m: "ภาษา", c: "日本語 (にほんご)", cm: "ภาษาญี่ปุ่น" },
  { k: "店", kun: "みせ", on: "テン", m: "ร้านค้า", c: "店員 (てんいん)", cm: "พนักงานร้าน" },
  { k: "駅", kun: "-", on: "エキ", m: "สถานีรถไฟ", c: "駅員 (えきいん)", cm: "พนักงานสถานี" },
  { k: "電", kun: "-", on: "デン", m: "ไฟฟ้า", c: "電車 (でんしゃ)", cm: "รถไฟฟ้า" },
  { k: "車", kun: "くるま", on: "シャ", m: "รถยนต์", c: "自転車 (じてんしゃ)", cm: "รถจักรยาน" },
  { k: "社", kun: "やしろ", on: "シャ", m: "บริษัท / ศาลเจ้า", c: "会社 (かいしゃ)", cm: "บริษัท" },
  { k: "道", kun: "みち", on: "ドウ", m: "ถนน / ทาง", c: "水道 (すいどう)", cm: "น้ำประปา" }
];

// ==========================================
// 🎨 การตั้งค่าฟอนต์ภาษาไทย (ทรงมน โมเดิร์น สไตล์ Apple)
// ==========================================
const thBold = (size) => new Font("SukhumvitSet-Bold", size);
const thMedium = (size) => new Font("SukhumvitSet-Medium", size);
const thRegular = (size) => new Font("SukhumvitSet-Text", size);

// ==========================================
// 📁 Helpers: state I/O + utilities
// ==========================================
const fm = FileManager.local();
const cachePath = fm.joinPath(fm.documentsDirectory(), "kanji_shared_state.json");

function loadState() {
  if (!fm.fileExists(cachePath)) return null;
  try {
    const obj = JSON.parse(fm.readString(cachePath));
    if (obj && typeof obj.index === "number" && obj.index >= 0 && obj.index < kanjiList.length) {
      return obj;
    }
  } catch (e) { /* corrupt → treat as none */ }
  return null;
}

function saveState(s) {
  try { fm.writeString(cachePath, JSON.stringify(s)); } catch (e) {}
}

function pickRandomIndex(currentIndex) {
  if (kanjiList.length <= 1) return 0;
  let next = Math.floor(Math.random() * kanjiList.length);
  if (next === currentIndex) next = (next + 1) % kanjiList.length;
  return next;
}

// ==========================================
// ⏱️ TIME-SLOT + context detection
// ==========================================
const now = Date.now();
const intervalMs = REFRESH_INTERVAL_MINUTES * 60 * 1000;
const currentSlot = Math.floor(now / intervalMs);
const nextRefreshTime = (currentSlot + 1) * intervalMs;
const slotIndex = currentSlot % kanjiList.length;

const isWidget = config.runsInWidget;
const isApp = config.runsInApp;
const isShortcut = !isWidget && !isApp;

// ✅ แยก intent ด้วย explicit parameter ไม่ใช่ context
// ปุ่มสุ่มส่ง URL: scriptable:///run/<name>?action=randomize
const queryAction = (args.queryParameters && args.queryParameters.action) || "";
const shortcutInput = (typeof args.shortcutParameter === "string") ? args.shortcutParameter.trim() : "";
const wantRandomize = (queryAction === "randomize");

// กลางวัน / กลางคืน
const currentHour = new Date().getHours();
const isDaytime = (currentHour >= 6 && currentHour < 18);
const activeUrls = isDaytime ? dayImages : nightImages;
const modePrefix = isDaytime ? "day" : "night";

// ==========================================
// 🔄 STATE RESOLUTION — จุดเดียวที่ตัดสินใจเรื่อง state
// 4 เส้นทาง: randomize | widget | shortcut | app-preview
// ==========================================
let state = loadState();

if (wantRandomize) {
  // ✅ จุดเดียวในระบบที่ "สุ่ม" และเขียน state
  const curIndex = state ? state.index : slotIndex;
  state = {
    slot: currentSlot,
    index: pickRandomIndex(curIndex),
    bgIndex: Math.floor(Math.random() * activeUrls.length)
  };
  saveState(state);

} else if (isWidget) {
  // Widget ที่ iOS สั่งวาด: อัปเดตตามรอบเวลา แล้วเขียน state
  if (!state || state.slot !== currentSlot) {
    state = {
      slot: currentSlot,
      index: slotIndex,
      bgIndex: currentSlot % activeUrls.length
    };
    saveState(state);
  }

} else {
  // ✅ FIX #3: shortcut / back-tap / เปิดแอปดูเฉยๆ = อ่านอย่างเดียว ห้ามเขียนไฟล์
  // ถ้า state หาย ใช้ค่า default ในหน่วยความจำ (ไม่ touch ไฟล์กลาง)
  if (!state) {
    state = { slot: currentSlot, index: slotIndex, bgIndex: currentSlot % activeUrls.length };
  }
}

const item = kanjiList[state.index] || kanjiList[0];
const bgIndex = (typeof state.bgIndex === "number") ? state.bgIndex : (currentSlot % activeUrls.length);

// 🔊 ข้อความสำหรับอ่านออกเสียง (Kun + On + คำประสม)
// ✅ FIX #4: ตัด comma / ตัวอ่านสำรองออก กันเสียง Siri เพี้ยน
function cleanReading(raw) {
  if (!raw || raw === "-") return "";
  // เอาเฉพาะตัวอ่านแรก ก่อน comma แล้วลบวงเล็บ
  return raw.split(",")[0].replace(/[()]/g, "").trim();
}
const kunClean = cleanReading(item.kun);
const onClean = cleanReading(item.on);
const compClean = (item.c.match(/\((.*?)\)/) || [])[1] || item.c.replace(/[()]/g, "").trim();
let speakWord = [kunClean, onClean, compClean].filter(Boolean).join("、");
if (!speakWord) speakWord = item.k;

// ==========================================
// 🔊 PATH A: เรียกจาก Shortcuts / Back Tap → อ่านอย่างเดียว ส่ง output แล้วจบ
// ==========================================
if (isShortcut) {
  // มาจาก "SpeakJP" / Back Tap → อ่านคำปัจจุบัน (อ่านอย่างเดียว ไม่สุ่ม ไม่เขียนไฟล์)
  // ถ้า SpeakJP ส่งคำมาเอง (input) ก็ใช้คำนั้น ไม่งั้นใช้คำบนจอปัจจุบัน
  const finalWord = (shortcutInput.length > 0) ? shortcutInput : speakWord;
  Script.setShortcutOutput(finalWord);
  Script.complete();

} else {
  // ==========================================
  // 🌟 PATH B: วาด Widget (Home / Lock) หรือ preview ในแอป
  // ==========================================
  const param = (args.widgetParameter || "kanji").trim().toLowerCase();

  // โหลดรูปทั้งเซ็ต day + night (ครั้งเดียว cache ไว้)
  async function ensureAllPhotosDownloaded() {
    const allSets = [
      { prefix: "day", urls: dayImages },
      { prefix: "night", urls: nightImages }
    ];
    for (const set of allSets) {
      for (let i = 0; i < set.urls.length; i++) {
        const filePath = fm.joinPath(fm.documentsDirectory(), `${set.prefix}_bg_${i}.jpg`);
        if (!fm.fileExists(filePath)) {
          try {
            const req = new Request(set.urls[i]);
            req.headers = { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)" };
            req.timeoutInterval = 8;
            const img = await req.loadImage();
            fm.writeImage(filePath, img);
          } catch (e) {}
        }
      }
    }
  }

  function getThemePhoto(prefix, targetIndex) {
    const targetPath = fm.joinPath(fm.documentsDirectory(), `${prefix}_bg_${targetIndex}.jpg`);
    if (fm.fileExists(targetPath)) return fm.readImage(targetPath);
    for (let i = 0; i < 3; i++) {
      const p = fm.joinPath(fm.documentsDirectory(), `${prefix}_bg_${i}.jpg`);
      if (fm.fileExists(p)) return fm.readImage(p);
    }
    return null;
  }

  const widget = new ListWidget();
  // ⚡️ sync รอบรีเฟรชกับขอบ time-slot ถัดไป (best-effort ของ iOS)
  widget.refreshAfterDate = new Date(nextRefreshTime);

  const currentScriptName = Script.name() || "Kanji N5";
  // 🔊 แตะเพื่ออ่านออกเสียง → เรียก Shortcut "SpeakJP"
  const speakUrl = "shortcuts://run-shortcut?name=" + encodeURIComponent(SPEAK_SHORTCUT_NAME) + "&input=" + encodeURIComponent(speakWord);
  // 🔄 แตะเพื่อสุ่มคำใหม่ → เรียก Scriptable ตรงๆ (เด้งเข้าแอปจังหวะเดียว กดสุ่มรัวใน preview ได้)
  const changeUrl = "scriptable:///run/" + encodeURIComponent(currentScriptName) + "?action=randomize";

  const isLockScreen = config.widgetFamily && config.widgetFamily.startsWith("accessory");

  if (!isLockScreen) {
    // ========================================================
    // 🌟 HOME SCREEN WIDGET (Day/Night + Split Interactive Tap)
    // ========================================================
    widget.setPadding(0, 0, 0, 0);

    const bgImg = getThemePhoto(modePrefix, bgIndex);
    if (bgImg) {
      widget.backgroundImage = bgImg;
    } else {
      const gradient = new LinearGradient();
      gradient.colors = isDaytime
        ? [new Color("#2C3E50"), new Color("#4CA1AF")]
        : [new Color("#1E1E28"), new Color("#111116")];
      gradient.locations = [0.0, 1.0];
      widget.backgroundGradient = gradient;
    }

    const outer = widget.addStack();
    outer.setPadding(12, 14, 12, 14);
    outer.centerAlignContent();

    const mainCard = outer.addStack();
    mainCard.cornerRadius = 12;
    mainCard.backgroundColor = new Color("#000000", 0.40);
    mainCard.setPadding(10, 14, 10, 14);
    mainCard.centerAlignContent();

    const row = mainCard.addStack();
    row.layoutHorizontally();
    row.centerAlignContent();

    // 🔊 ฝั่งซ้าย: แตะ = ฟังเสียงอ่าน
    const leftCol = row.addStack();
    leftCol.layoutVertically();
    leftCol.centerAlignContent();
    leftCol.url = speakUrl;

    const badge = leftCol.addStack();
    badge.backgroundColor = new Color("#00E5FF", 0.35);
    badge.cornerRadius = 4;
    badge.setPadding(2, 6, 2, 6);
    const badgeText = badge.addText(isDaytime ? "☀️ N5 DAY" : "🌙 N5 NIGHT");
    badgeText.font = Font.boldSystemFont(9);
    badgeText.textColor = new Color("#E0FFFF");

    leftCol.addSpacer(2);

    const kanjiText = leftCol.addText(item.k);
    kanjiText.font = Font.boldSystemFont(60);
    kanjiText.textColor = Color.white();
    kanjiText.shadowColor = new Color("#000000", 0.85);
    kanjiText.shadowOffset = new Point(0, 2);
    kanjiText.shadowRadius = 4;

    row.addSpacer(16);

    const divider = row.addStack();
    divider.size = new Size(1, 80);
    divider.backgroundColor = new Color("#ffffff", 0.35);

    row.addSpacer(16);

    // 🔄 ฝั่งขวา: แตะ = สุ่มคำใหม่
    const rightCol = row.addStack();
    rightCol.layoutVertically();
    rightCol.url = changeUrl;

    const meanText = rightCol.addText(item.m);
    meanText.font = thBold(20);
    meanText.textColor = new Color("#F5C518");
    meanText.lineLimit = 1;
    meanText.minimumScaleFactor = 0.8;

    rightCol.addSpacer(4);

    const readingStack = rightCol.addStack();
    readingStack.layoutHorizontally();

    if (item.kun && item.kun !== "-") {
      const kun = readingStack.addText(item.kun);
      kun.font = Font.boldSystemFont(15);
      kun.textColor = Color.white();
      kun.lineLimit = 1;
      kun.minimumScaleFactor = 0.8;
      readingStack.addSpacer(10);
    }

    const on = readingStack.addText(item.on);
    on.font = Font.boldSystemFont(15);
    on.textColor = new Color("#E0E0E0");
    on.lineLimit = 1;
    on.minimumScaleFactor = 0.8;

    rightCol.addSpacer(5);

    const compStack = rightCol.addStack();
    compStack.layoutVertically();

    const cText = compStack.addText(item.c);
    cText.font = Font.boldSystemFont(14);
    cText.textColor = new Color("#64D2FF");
    cText.lineLimit = 1;
    cText.minimumScaleFactor = 0.8;

    const cmText = compStack.addText(item.cm);
    cmText.font = thMedium(12);
    cmText.textColor = new Color("#EBEBF5", 0.85);
    cmText.lineLimit = 1;
    cmText.minimumScaleFactor = 0.8;

  } else {
    // ========================================================
    // 🔒 LOCK SCREEN WIDGET (กล่องคู่ 2 ช่อง)
    // ========================================================
    widget.setPadding(0, 0, 0, 0);

    const card = widget.addStack();
    card.cornerRadius = 10;
    card.backgroundColor = new Color("#ffffff", 0.16);
    card.centerAlignContent();
    card.setPadding(4, 8, 4, 8);

    if (param === "meaning") {
      widget.url = changeUrl;
      card.layoutVertically();

      const mean = card.addText(item.m);
      mean.font = thBold(17);
      mean.textColor = Color.white();
      mean.lineLimit = 1;
      mean.minimumScaleFactor = 0.8;

      card.addSpacer(2);

      const compound = card.addText(item.c);
      compound.font = Font.boldSystemFont(12);
      compound.textColor = Color.white();
      compound.lineLimit = 1;
      compound.minimumScaleFactor = 0.8;

      const compoundMean = card.addText(item.cm);
      compoundMean.font = thMedium(11);
      compoundMean.textColor = new Color("#D0D0D0");
      compoundMean.lineLimit = 1;
      compoundMean.minimumScaleFactor = 0.8;

    } else {
      widget.url = speakUrl;
      card.layoutHorizontally();

      const kanji = card.addText(item.k);
      kanji.font = Font.boldSystemFont(44);
      kanji.textColor = Color.white();

      card.addSpacer(8);

      const info = card.addStack();
      info.layoutVertically();

      if (item.kun && item.kun !== "-") {
        const kunText = info.addText(item.kun);
        kunText.font = Font.boldSystemFont(14);
        kunText.textColor = Color.white();
        kunText.lineLimit = 1;
        kunText.minimumScaleFactor = 0.8;

        info.addSpacer(3);

        const onText = info.addText(item.on);
        onText.font = Font.boldSystemFont(13);
        onText.textColor = new Color("#D0D0D0");
        onText.lineLimit = 1;
        onText.minimumScaleFactor = 0.8;
      } else {
        const onOnly = info.addText(item.on);
        onOnly.font = Font.boldSystemFont(16);
        onOnly.textColor = Color.white();
        onOnly.lineLimit = 1;
        onOnly.minimumScaleFactor = 0.8;
      }
    }
  }

  // ✅ FIX #5: ตั้ง widget ให้ iOS หยิบ snapshot ใหม่เร็วที่สุด (ช่วยลด refresh delay)
  Script.setWidget(widget);

  // ✅ FIX #4 (latency): โหลดรูปหลังจากตั้ง widget แล้ว เฉพาะตอนอยู่ในแอป
  //    ทำให้ปุ่มสุ่มแสดงผลคำใหม่ก่อน แล้วค่อย warm cache เบื้องหลัง
  if (isApp) {
    await ensureAllPhotosDownloaded();
    widget.presentMedium();
  }

  Script.complete();
}
