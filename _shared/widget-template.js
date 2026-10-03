// ==========================================================
// 🧩 SCRIPTABLE VOCAB WIDGET — TEMPLATE (hardcode)
// ----------------------------------------------------------
// เทมเพลตกลางสำหรับทำวิดเจ็ตท่องศัพท์ภาษาใด ๆ
// ก๊อปไฟล์นี้ไปไว้ในโฟลเดอร์ภาษา เช่น chinese/hsk1/HSK1.js
// แล้วแก้ 3 จุด: CONFIG, คลังรูป (dayImages/nightImages), vocabList
//
// ฟีเจอร์ที่ได้มาเลย:
//   • สุ่มคำเป็นรอบตามเวลา (REFRESH_INTERVAL_MINUTES)
//   • state ร่วม → ทุกวิดเจ็ต/lock screen โชว์คำเดียวกัน
//   • แตะฝั่งซ้าย = อ่านออกเสียง (ผ่าน Shortcut)
//   • แตะฝั่งขวา = สุ่มคำใหม่ทันที
//   • พื้นหลังวิวกลางวัน/กลางคืนสลับอัตโนมัติ
//   • รองรับทั้ง Home Screen และ Lock Screen widget
//
// 📌 สิ่งที่ต้องเตรียมบนเครื่อง:
//   1. ตั้งชื่อสคริปต์ใน Scriptable ให้ตรงกับ "ชื่อไฟล์" (ปุ่มสุ่มใช้ชื่อนี้)
//   2. สร้าง Shortcut อ่านออกเสียงชื่อตรงกับ CONFIG.speakShortcutName
//      (ข้างใน Shortcut: รับ Text → Speak Text → เลือกภาษา/เสียงให้ตรง)
// ==========================================================

// ==========================================================
// ⚙️ CONFIG — แก้ส่วนนี้ให้ตรงกับภาษา/ชุดคำของคุณ
// ==========================================================
const CONFIG = {
  // ชื่อ Shortcut สำหรับอ่านออกเสียง (ต้องสร้างใน Shortcuts เอง)
  speakShortcutName: "SpeakVocab",

  // ป้าย badge มุมบน (เปลี่ยนตามชุด เช่น "HSK1", "TOEIC", "한국어")
  deckLabel: "VOCAB",

  // รอบสุ่มคำ (นาที) — Apple แนะนำ 30 นาที กำลังดี ไม่กินแบต
  refreshIntervalMinutes: 30,

  // ฟอนต์ข้อความ "คำแปล/ความหมาย" (ภาษาปลายทางของผู้เรียน)
  // ไทย: ใช้ SukhumvitSet ถ้าภาษาอื่นใช้ Font.boldSystemFont ได้เลย
  meaningFontBold: (size) => new Font("SukhumvitSet-Bold", size),
  meaningFontMedium: (size) => new Font("SukhumvitSet-Medium", size),
};

// ==========================================================
// ☀️ รูปพื้นหลัง กลางวัน (06:00–17:59) — ใส่ URL รูปแนวนอน
// ==========================================================
const dayImages = [
  "https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=600&h=300&q=75",
  "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=600&h=300&q=75",
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&h=300&q=75"
];

// ==========================================================
// 🌙 รูปพื้นหลัง กลางคืน (18:00–05:59)
// ==========================================================
const nightImages = [
  "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&h=300&q=75",
  "https://images.unsplash.com/photo-1509023464722-18d996393ca8?auto=format&fit=crop&w=600&h=300&q=75",
  "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&h=300&q=75"
];

// ==========================================================
// 📚 คลังคำศัพท์ — โครงมาตรฐาน (ปรับ field ให้เข้ากับภาษาได้)
// ----------------------------------------------------------
//   word    : คำหลัก (ตัวใหญ่กลางจอ) เช่น 一 / apple / 사과
//   reading : คำอ่าน/การออกเสียง เช่น いち / /ˈæp.əl/ / sagwa  (ใส่ "-" ถ้าไม่มี)
//   reading2: คำอ่านสำรอง (เช่น on-yomi ของญี่ปุ่น) ใส่ "" ถ้าไม่มี
//   meaning : ความหมาย (ภาษาผู้เรียน) เช่น "หนึ่ง"
//   example : ตัวอย่างประโยค/คำประสม เช่น "一人 (ひとり)"
//   exMean  : ความหมายของตัวอย่าง เช่น "คนเดียว"
//   speak   : (ไม่บังคับ) ข้อความให้ Siri อ่าน ถ้าไม่ใส่จะใช้ reading/word อัตโนมัติ
// ==========================================================
const vocabList = [
  { word: "一", reading: "いち", reading2: "イチ", meaning: "หนึ่ง", example: "一人 (ひとり)", exMean: "คนเดียว", speak: "いち" },
  { word: "二", reading: "に", reading2: "ニ", meaning: "สอง", example: "二月 (にがつ)", exMean: "เดือนกุมภาพันธ์", speak: "に" },
  // ... เพิ่มคำที่เหลือตามรูปแบบนี้
];

// ==========================================================
// 🎨 ฟอนต์
// ==========================================================
const mBold = CONFIG.meaningFontBold;
const mMedium = CONFIG.meaningFontMedium;

// ==========================================================
// 📁 State I/O — ไฟล์กลางให้ทุกวิดเจ็ตโชว์คำเดียวกัน
// ==========================================================
const fm = FileManager.local();
const stateFileName = (Script.name() || "vocab").replace(/[^\w]+/g, "_") + "_state.json";
const cachePath = fm.joinPath(fm.documentsDirectory(), stateFileName);

function loadState() {
  if (!fm.fileExists(cachePath)) return null;
  try {
    const obj = JSON.parse(fm.readString(cachePath));
    if (obj && typeof obj.index === "number" && obj.index >= 0 && obj.index < vocabList.length) return obj;
  } catch (e) { /* corrupt → none */ }
  return null;
}
function saveState(s) { try { fm.writeString(cachePath, JSON.stringify(s)); } catch (e) {} }
function pickRandomIndex(cur) {
  if (vocabList.length <= 1) return 0;
  let next = Math.floor(Math.random() * vocabList.length);
  if (next === cur) next = (next + 1) % vocabList.length;
  return next;
}

// ==========================================================
// ⏱️ TIME-SLOT + context
// ==========================================================
const now = Date.now();
const intervalMs = CONFIG.refreshIntervalMinutes * 60 * 1000;
const currentSlot = Math.floor(now / intervalMs);
const nextRefreshTime = (currentSlot + 1) * intervalMs;
const slotIndex = currentSlot % vocabList.length;

const isWidget = config.runsInWidget;
const isApp = config.runsInApp;
const isShortcut = !isWidget && !isApp;

const queryAction = (args.queryParameters && args.queryParameters.action) || "";
const shortcutInput = (typeof args.shortcutParameter === "string") ? args.shortcutParameter.trim() : "";
const wantRandomize = (queryAction === "randomize");

const currentHour = new Date().getHours();
const isDaytime = (currentHour >= 6 && currentHour < 18);
const activeUrls = isDaytime ? dayImages : nightImages;
const modePrefix = isDaytime ? "day" : "night";

// ==========================================================
// 🔄 STATE RESOLUTION — จุดเดียวที่ตัดสินใจเรื่อง state
// ==========================================================
let state = loadState();
if (wantRandomize) {
  const curIndex = state ? state.index : slotIndex;
  state = { slot: currentSlot, index: pickRandomIndex(curIndex), bgIndex: Math.floor(Math.random() * activeUrls.length) };
  saveState(state);
} else if (isWidget) {
  if (!state || state.slot !== currentSlot) {
    state = { slot: currentSlot, index: slotIndex, bgIndex: currentSlot % activeUrls.length };
    saveState(state);
  }
} else {
  if (!state) state = { slot: currentSlot, index: slotIndex, bgIndex: currentSlot % activeUrls.length };
}

const item = vocabList[state.index] || vocabList[0];
const bgIndex = (typeof state.bgIndex === "number") ? state.bgIndex : (currentSlot % activeUrls.length);

// ==========================================================
// 🔊 ข้อความอ่านออกเสียง
// ==========================================================
function cleanReading(raw) {
  if (!raw || raw === "-") return "";
  return raw.split(",")[0].replace(/[()]/g, "").trim();
}
let speakWord = item.speak && item.speak.trim();
if (!speakWord) {
  const r1 = cleanReading(item.reading);
  const r2 = cleanReading(item.reading2);
  speakWord = [r1, r2].filter(Boolean).join("、") || item.word;
}

// ==========================================================
// 🔊 PATH A: Shortcut / Back Tap → อ่านอย่างเดียว
// ==========================================================
if (isShortcut) {
  const finalWord = (shortcutInput.length > 0) ? shortcutInput : speakWord;
  Script.setShortcutOutput(finalWord);
  Script.complete();

} else {
  // ========================================================
  // 🌟 PATH B: วาด Widget
  // ========================================================
  const param = (args.widgetParameter || "word").trim().toLowerCase();

  async function ensureAllPhotosDownloaded() {
    const sets = [{ prefix: "day", urls: dayImages }, { prefix: "night", urls: nightImages }];
    for (const set of sets) {
      for (let i = 0; i < set.urls.length; i++) {
        const fp = fm.joinPath(fm.documentsDirectory(), `${set.prefix}_bg_${i}.jpg`);
        if (!fm.fileExists(fp)) {
          try {
            const req = new Request(set.urls[i]);
            req.headers = { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)" };
            req.timeoutInterval = 8;
            fm.writeImage(fp, await req.loadImage());
          } catch (e) {}
        }
      }
    }
  }
  function getThemePhoto(prefix, idx) {
    const fp = fm.joinPath(fm.documentsDirectory(), `${prefix}_bg_${idx}.jpg`);
    if (fm.fileExists(fp)) return fm.readImage(fp);
    for (let i = 0; i < 3; i++) {
      const p = fm.joinPath(fm.documentsDirectory(), `${prefix}_bg_${i}.jpg`);
      if (fm.fileExists(p)) return fm.readImage(p);
    }
    return null;
  }

  const widget = new ListWidget();
  widget.refreshAfterDate = new Date(nextRefreshTime);

  const scriptName = Script.name() || "Vocab";
  const speakUrl = "shortcuts://run-shortcut?name=" + encodeURIComponent(CONFIG.speakShortcutName) + "&input=" + encodeURIComponent(speakWord);
  const changeUrl = "scriptable:///run/" + encodeURIComponent(scriptName) + "?action=randomize";

  const isLockScreen = config.widgetFamily && config.widgetFamily.startsWith("accessory");

  if (!isLockScreen) {
    // ====================== HOME SCREEN ======================
    widget.setPadding(0, 0, 0, 0);

    const bgImg = getThemePhoto(modePrefix, bgIndex);
    if (bgImg) {
      widget.backgroundImage = bgImg;
    } else {
      const g = new LinearGradient();
      g.colors = isDaytime ? [new Color("#2C3E50"), new Color("#4CA1AF")] : [new Color("#1E1E28"), new Color("#111116")];
      g.locations = [0.0, 1.0];
      widget.backgroundGradient = g;
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

    // 🔊 ซ้าย: แตะ = ฟังเสียง
    const leftCol = row.addStack();
    leftCol.layoutVertically();
    leftCol.centerAlignContent();
    leftCol.url = speakUrl;

    const badge = leftCol.addStack();
    badge.backgroundColor = new Color("#00E5FF", 0.35);
    badge.cornerRadius = 4;
    badge.setPadding(2, 6, 2, 6);
    const badgeText = badge.addText((isDaytime ? "☀️ " : "🌙 ") + CONFIG.deckLabel);
    badgeText.font = Font.boldSystemFont(9);
    badgeText.textColor = new Color("#E0FFFF");

    leftCol.addSpacer(2);

    const wordText = leftCol.addText(item.word);
    wordText.font = Font.boldSystemFont(60);
    wordText.textColor = Color.white();
    wordText.shadowColor = new Color("#000000", 0.85);
    wordText.shadowOffset = new Point(0, 2);
    wordText.shadowRadius = 4;
    wordText.minimumScaleFactor = 0.5;
    wordText.lineLimit = 1;

    row.addSpacer(16);
    const divider = row.addStack();
    divider.size = new Size(1, 80);
    divider.backgroundColor = new Color("#ffffff", 0.35);
    row.addSpacer(16);

    // 🔄 ขวา: แตะ = สุ่มใหม่
    const rightCol = row.addStack();
    rightCol.layoutVertically();
    rightCol.url = changeUrl;

    const meanText = rightCol.addText(item.meaning);
    meanText.font = mBold(20);
    meanText.textColor = new Color("#F5C518");
    meanText.lineLimit = 1;
    meanText.minimumScaleFactor = 0.8;

    rightCol.addSpacer(4);

    const readingStack = rightCol.addStack();
    readingStack.layoutHorizontally();
    if (item.reading && item.reading !== "-") {
      const r = readingStack.addText(item.reading);
      r.font = Font.boldSystemFont(15);
      r.textColor = Color.white();
      r.lineLimit = 1; r.minimumScaleFactor = 0.8;
      if (item.reading2) readingStack.addSpacer(10);
    }
    if (item.reading2) {
      const r2 = readingStack.addText(item.reading2);
      r2.font = Font.boldSystemFont(15);
      r2.textColor = new Color("#E0E0E0");
      r2.lineLimit = 1; r2.minimumScaleFactor = 0.8;
    }

    rightCol.addSpacer(5);
    const compStack = rightCol.addStack();
    compStack.layoutVertically();
    const cText = compStack.addText(item.example);
    cText.font = Font.boldSystemFont(14);
    cText.textColor = new Color("#64D2FF");
    cText.lineLimit = 1; cText.minimumScaleFactor = 0.8;
    const cmText = compStack.addText(item.exMean);
    cmText.font = mMedium(12);
    cmText.textColor = new Color("#EBEBF5", 0.85);
    cmText.lineLimit = 1; cmText.minimumScaleFactor = 0.8;

  } else {
    // ====================== LOCK SCREEN ======================
    widget.setPadding(0, 0, 0, 0);
    const card = widget.addStack();
    card.cornerRadius = 10;
    card.backgroundColor = new Color("#ffffff", 0.16);
    card.centerAlignContent();
    card.setPadding(4, 8, 4, 8);

    if (param === "meaning") {
      widget.url = changeUrl;
      card.layoutVertically();
      const mean = card.addText(item.meaning);
      mean.font = mBold(17); mean.textColor = Color.white();
      mean.lineLimit = 1; mean.minimumScaleFactor = 0.8;
      card.addSpacer(2);
      const comp = card.addText(item.example);
      comp.font = Font.boldSystemFont(12); comp.textColor = Color.white();
      comp.lineLimit = 1; comp.minimumScaleFactor = 0.8;
      const compMean = card.addText(item.exMean);
      compMean.font = mMedium(11); compMean.textColor = new Color("#D0D0D0");
      compMean.lineLimit = 1; compMean.minimumScaleFactor = 0.8;
    } else {
      widget.url = speakUrl;
      card.layoutHorizontally();
      const w = card.addText(item.word);
      w.font = Font.boldSystemFont(44); w.textColor = Color.white();
      w.minimumScaleFactor = 0.5; w.lineLimit = 1;
      card.addSpacer(8);
      const info = card.addStack();
      info.layoutVertically();
      if (item.reading && item.reading !== "-") {
        const rt = info.addText(item.reading);
        rt.font = Font.boldSystemFont(14); rt.textColor = Color.white();
        rt.lineLimit = 1; rt.minimumScaleFactor = 0.8;
        if (item.reading2) {
          info.addSpacer(3);
          const ot = info.addText(item.reading2);
          ot.font = Font.boldSystemFont(13); ot.textColor = new Color("#D0D0D0");
          ot.lineLimit = 1; ot.minimumScaleFactor = 0.8;
        }
      } else {
        const only = info.addText(item.reading2 || item.meaning);
        only.font = Font.boldSystemFont(16); only.textColor = Color.white();
        only.lineLimit = 1; only.minimumScaleFactor = 0.8;
      }
    }
  }

  Script.setWidget(widget);
  if (isApp) {
    await ensureAllPhotosDownloaded();
    widget.presentMedium();
  }
  Script.complete();
}
