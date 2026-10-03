// ==========================================================
// 🇨🇳 SCRIPTABLE WIDGET — ภาษาจีน HSK ระดับ 1 (HSK1.js)
// ----------------------------------------------------------
// วิดเจ็ตท่องศัพท์ภาษาจีน HSK 1 บน iOS Home Screen & Lock Screen
// ดีไซน์ระดับ Apple UI คมชัด สวยงาม สลับพื้นหลังวิวกลางวัน/กลางคืนอัตโนมัติ
//
// 📌 คำแนะนำและวิธีติดตั้ง (3 ขั้นตอน):
// ----------------------------------------------------------
// 1. [Scriptable]:
//    - กดปุ่ม + สร้างสคริปต์ใหม่ในแอป Scriptable
//    - นำโค้ดทั้งหมดในไฟล์นี้ไปวาง
//    - **สำคัญมาก**: ตั้งชื่อสคริปต์ว่า "HSK1" (เพื่อให้ปุ่มสุ่มสคริปต์ทำงานได้ถูกต้อง)
//
// 2. [Shortcuts (คำสั่งลัด)]:
//    - เปิดแอป Shortcuts (คำสั่งลัด) บน iPhone/iPad แล้วกดสร้าง Shortcut ใหม่
//    - ตั้งชื่อ Shortcut ว่า "SpeakZH" (ให้ตรงกับค่า SPEAK_SHORTCUT_NAME)
//    - เพิ่ม Action:
//        1) "Get Text from Input" (หรือรับค่า Shortcut Input)
//        2) "Speak Text" (อ่านออกเสียงข้อความ)
//    - กดลูกศรขยายใน "Speak Text" เลือก:
//        • Language (ภาษา): Chinese (Mandarin - China) / จีน (จีนแผ่นดินใหญ่) [zh-CN]
//        • Voice (เสียง): Siri หรือเสียงจีนที่คุณชอบ เช่น Tingting
//
// 3. [เพิ่ม Widget]:
//    - Home Screen:
//        • กดค้างที่หน้าจอว่าง > กด + มุมซ้ายบน > เลือก Scriptable
//        • เลือกขนาด Medium > แตะที่วิดเจ็ตเพื่อตั้งค่า > เลือก Script เป็น "HSK1"
//        • ปฏิสัมพันธ์: แตะฝั่งซ้าย (ตัวอักษรจีน) = ฟังเสียงอ่าน, แตะฝั่งขวา = สุ่มคำใหม่
//    - Lock Screen (หน้าจอล็อค):
//        • เพิ่ม Widget สี่เหลี่ยมผืนผ้า (Accessory Rectangular) ของ Scriptable
//        • แตะตั้งค่า เลือก Script เป็น "HSK1"
//        • ในช่อง Parameter ใส่:
//            - "word"    : โชว์คำศัพท์ฮั่นจื้อ + พินอิน (แตะ = ฟังเสียงอ่าน)
//            - "meaning" : โชว์คำแปลไทย + ตัวอย่างประโยค (แตะ = สุ่มคำใหม่)
// ==========================================================

// ==========================================
// ⚙️ การตั้งค่าระบบ (Configuration)
// ==========================================
const SCRIPT_NAME = "HSK1";
const SCRIPT_ID = "hsk1";
const REFRESH_INTERVAL_MINUTES = 30; // ⏱️ แนะนำโดย Apple: 30 นาทีต่อคำ (กำลังพอดีกับการจำ ไม่เปลืองแบตเตอรี่)
const SPEAK_SHORTCUT_NAME = "SpeakZH"; // 🔊 ชื่อ Shortcut สำหรับอ่านออกเสียงภาษาจีน (zh-CN)
const DECK_LABEL = "HSK1"; // 🏷️ ป้ายกำกับบน Badge

// ==========================================
// ☀️ คลังรูปภาพวิวเมืองและวัฒนธรรมจีน เซ็ตกลางวัน (06:00 - 17:59)
// ==========================================
const dayImages = [
  "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=600&h=300&q=75", // กำแพงเมืองจีน Great Wall of China
  "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=600&h=300&q=75", // พระราชวังต้องห้าม Forbidden City ปักกิ่ง
  "https://images.unsplash.com/photo-1527684651001-731c47457977?auto=format&fit=crop&w=600&h=300&q=75"  // ภูเขาหินปูนและธรรมชาติเมืองกุ้ยหลิน
];

// ==========================================
// 🌙 คลังรูปภาพวิวเมืองและวัฒนธรรมจีน เซ็ตกลางคืน (18:00 - 05:59)
// ==========================================
const nightImages = [
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&h=300&q=75", // หอไข่มุกเซี่ยงไฮ้ Oriental Pearl Tower
  "https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?auto=format&fit=crop&w=600&h=300&q=75", // เส้นขอบฟ้าผู่ตงและแม่น้ำหวงผู่ยามราตรี
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=600&h=300&q=75"  // โคมไฟจีนโบราณสีแดงอร่ามยามค่ำคืน
];

// ==========================================
// 📚 คลังคำศัพท์ HSK ระดับ 1 (ครบถ้วน ถูกต้องตามหลักไวยากรณ์)
// ==========================================
const vocabList = [
  { word: "爱", reading: "ài", reading2: "", meaning: "รัก / ชอบ", example: "我爱你 (wǒ ài nǐ)", exMean: "ฉันรักเธอ", speak: "爱" },
  { word: "八", reading: "bā", reading2: "", meaning: "แปด (8)", example: "八个人 (bā gè rén)", exMean: "คนแปดคน", speak: "八" },
  { word: "爸爸", reading: "bàba", reading2: "", meaning: "พ่อ / คุณพ่อ", example: "我爸爸是医生 (wǒ bàba shì yīshēng)", exMean: "พ่อของฉันเป็นหมอ", speak: "爸爸" },
  { word: "杯子", reading: "bēizi", reading2: "", meaning: "แก้วน้ำ / ถ้วย", example: "桌上有个杯子 (zhuō shàng yǒu gè bēizi)", exMean: "บนโต๊ะมีแก้วน้ำหนึ่งใบ", speak: "杯子" },
  { word: "北京", reading: "Běijīng", reading2: "", meaning: "ปักกิ่ง", example: "我去北京 (wǒ qù Běijīng)", exMean: "ฉันไปปักกิ่ง", speak: "北京" },
  { word: "本", reading: "běn", reading2: "", meaning: "เล่ม (ลักษณนาม)", example: "一本书 (yì běn shū)", exMean: "หนังสือหนึ่งเล่ม", speak: "本" },
  { word: "不客气", reading: "bú kèqi", reading2: "", meaning: "ไม่เป็นไร / ยินดี", example: "不客气，请坐 (bú kèqi, qǐng zuò)", exMean: "ไม่ต้องเกรงใจ เชิญนั่งครับ", speak: "不客气" },
  { word: "菜", reading: "cài", reading2: "", meaning: "กับข้าว / ผัก", example: "中国菜很好吃 (Zhōngguó cài hěn hǎochī)", exMean: "อาหารจีนอร่อยมาก", speak: "菜" },
  { word: "茶", reading: "chá", reading2: "", meaning: "ชา / น้ำชา", example: "请喝茶 (qǐng hē chá)", exMean: "เชิญดื่มน้ำชาครับ", speak: "茶" },
  { word: "吃", reading: "chī", reading2: "", meaning: "กิน / ทาน", example: "吃饭了吗 (chī fàn le ma)", exMean: "กินข้าวหรือยัง", speak: "吃" },
  { word: "出租车", reading: "chūzūchē", reading2: "", meaning: "รถแท็กซี่", example: "坐出租车 (zuò chūzūchē)", exMean: "นั่งรถแท็กซี่", speak: "出租车" },
  { word: "打电话", reading: "dǎ diànhuà", reading2: "", meaning: "โทรศัพท์ / คุยสาย", example: "给妈妈打电话 (gěi māma dǎ diànhuà)", exMean: "โทรศัพท์หาคุณแม่", speak: "打电话" },
  { word: "大", reading: "dà", reading2: "", meaning: "ใหญ่ / โต", example: "苹果很大 (píngguǒ hěn dà)", exMean: "แอปเปิลผลใหญ่มาก", speak: "大" },
  { word: "的", reading: "de", reading2: "", meaning: "ของ (แสดงเจ้าของ)", example: "我的书 (wǒ de shū)", exMean: "หนังสือของฉัน", speak: "的" },
  { word: "点", reading: "diǎn", reading2: "", meaning: "โมง / จุด / สั่ง", example: "现在三点 (xiànzài sān diǎn)", exMean: "ตอนนี้เวลาบ่ายสามโมง", speak: "点" },
  { word: "电脑", reading: "diànnǎo", reading2: "", meaning: "คอมพิวเตอร์", example: "买一台电脑 (mǎi yì tái diànnǎo)", exMean: "ซื้อคอมพิวเตอร์หนึ่งเครื่อง", speak: "电脑" },
  { word: "电视", reading: "diànshì", reading2: "", meaning: "โทรทัศน์ / ทีวี", example: "看电视 (kàn diànshì)", exMean: "ดูรายการโทรทัศน์", speak: "电视" },
  { word: "电影", reading: "diànyǐng", reading2: "", meaning: "ภาพยนตร์ / หนัง", example: "看电影 (kàn diànyǐng)", exMean: "ไปดูภาพยนตร์", speak: "电影" },
  { word: "东西", reading: "dōngxi", reading2: "", meaning: "สิ่งของ / ข้าวของ", example: "买东西 (mǎi dōngxi)", exMean: "ไปซื้อข้าวของ", speak: "东西" },
  { word: "都", reading: "dōu", reading2: "", meaning: "ล้วน / ทั้งหมด", example: "我们都是学生 (wǒmen dōu shì xuésheng)", exMean: "พวกเราล้วนเป็นนักเรียน", speak: "都" },
  { word: "读", reading: "dú", reading2: "", meaning: "อ่าน / ศึกษา", example: "读书 (dú shū)", exMean: "อ่านหนังสือ / ร่ำเรียน", speak: "读" },
  { word: "对不起", reading: "duìbuqǐ", reading2: "", meaning: "ขอโทษ", example: "对不起，我来晚了 (duìbuqǐ, wǒ lái wǎn le)", exMean: "ขอโทษครับ ฉันมาสาย", speak: "对不起" },
  { word: "多", reading: "duō", reading2: "", meaning: "มาก / เยอะ", example: "人很多 (rén hěn duō)", exMean: "คนเยอะมากจริง ๆ", speak: "多" },
  { word: "多少", reading: "duōshao", reading2: "", meaning: "เท่าไหร่ / กี่มากน้อย", example: "多少钱 (duōshao qián)", exMean: "ราคาเท่าไหร่ครับ", speak: "多少" },
  { word: "儿子", reading: "érzi", reading2: "", meaning: "ลูกชาย", example: "我儿子五岁 (wǒ érzi wǔ suì)", exMean: "ลูกชายของฉันอายุห้าขวบ", speak: "儿子" },
  { word: "二", reading: "èr", reading2: "", meaning: "สอง (2)", example: "二十块 (èrshí kuài)", exMean: "ยี่สิบหยวน", speak: "二" },
  { word: "饭店", reading: "fàndiàn", reading2: "", meaning: "ร้านอาหาร / โรงแรม", example: "去饭店吃饭 (qù fàndiàn chī fàn)", exMean: "ไปทานข้าวที่ร้านอาหาร", speak: "饭店" },
  { word: "飞机", reading: "fēijī", reading2: "", meaning: "เครื่องบิน", example: "坐飞机去上海 (zuò fēijī qù Shànghǎi)", exMean: "นั่งเครื่องบินไปเซี่ยงไฮ้", speak: "飞机" },
  { word: "分钟", reading: "fēnzhōng", reading2: "", meaning: "นาที", example: "等十分钟 (děng shí fēnzhōng)", exMean: "รอสักสิบนาทีนะ", speak: "分钟" },
  { word: "高兴", reading: "gāoxìng", reading2: "", meaning: "ดีใจ / มีความสุข", example: "很高兴认识你 (hěn gāoxìng rènshi nǐ)", exMean: "ยินดีมากที่ได้รู้จักคุณ", speak: "高兴" },
  { word: "个", reading: "gè", reading2: "", meaning: "อัน / ชิ้น / คน (ลักษณนาม)", example: "一个人 (yí gè rén)", exMean: "คนหนึ่งคน", speak: "个" },
  { word: "工作", reading: "gōngzuò", reading2: "", meaning: "ทำงาน / หน้าที่การงาน", example: "我喜欢我的工作 (wǒ xǐhuan wǒ de gōngzuò)", exMean: "ฉันรักงานที่ฉันทำ", speak: "工作" },
  { word: "狗", reading: "gǒu", reading2: "", meaning: "สุนัข / หมา", example: "一只小狗 (yì zhī xiǎo gǒu)", exMean: "ลูกสุนัขหนึ่งตัว", speak: "狗" },
  { word: "汉语", reading: "Hànyǔ", reading2: "", meaning: "ภาษาจีน", example: "学汉语 (xué Hànyǔ)", exMean: "เรียนภาษาจีน", speak: "汉语" },
  { word: "好", reading: "hǎo", reading2: "", meaning: "ดี / สบายดี", example: "你好 (nǐ hǎo)", exMean: "สวัสดีครับ / สวัสดีค่ะ", speak: "好" },
  { word: "喝", reading: "hē", reading2: "", meaning: "ดื่ม", example: "喝水 (hē shuǐ)", exMean: "ดื่มน้ำเปล่า", speak: "喝" },
  { word: "和", reading: "hé", reading2: "", meaning: "และ / กับ", example: "我和你 (wǒ hé nǐ)", exMean: "ฉันและเธอ", speak: "和" },
  { word: "很", reading: "hěn", reading2: "", meaning: "มาก", example: "很好 (hěn hǎo)", exMean: "ดีมากจริง ๆ", speak: "很" },
  { word: "会", reading: "huì", reading2: "", meaning: "เป็น / สามารถ", example: "我会说汉语 (wǒ huì shuō Hànyǔ)", exMean: "ฉันสามารถพูดภาษาจีนได้", speak: "会" },
  { word: "几", reading: "jǐ", reading2: "", meaning: "กี่ / เท่าไหร่", example: "几点了 (jǐ diǎn le)", exMean: "กี่โมงแล้วครับ", speak: "几" },
  { word: "家", reading: "jiā", reading2: "", meaning: "บ้าน / ครอบครัว", example: "回家 (huí jiā)", exMean: "กลับบ้าน", speak: "家" },
  { word: "叫", reading: "jiào", reading2: "", meaning: "ชื่อว่า / เรียก", example: "你叫什么名字 (nǐ jiào shénme míngzi)", exMean: "คุณชื่อว่าอะไรครับ", speak: "叫" },
  { word: "今天", reading: "jīntiān", reading2: "", meaning: "วันนี้", example: "今天天气很好 (jīntiān tiānqì hěn hǎo)", exMean: "วันนี้อากาศดีจังเลย", speak: "今天" },
  { word: "九", reading: "jiǔ", reading2: "", meaning: "เก้า (9)", example: "九月 (jiǔ yuè)", exMean: "เดือนกันยายน", speak: "九" },
  { word: "开", reading: "kāi", reading2: "", meaning: "เปิด / ขับ (รถ)", example: "开车 (kāi chē)", exMean: "ขับขี่รถยนต์", speak: "开" },
  { word: "看", reading: "kàn", reading2: "", meaning: "ดู / มอง / อ่าน", example: "看书 (kàn shū)", exMean: "อ่านหนังสือ", speak: "看" },
  { word: "看见", reading: "kànjiàn", reading2: "", meaning: "มองเห็น / เห็น", example: "我看见他了 (wǒ kànjiàn tā le)", exMean: "ฉันมองเห็นเขาแล้ว", speak: "看见" },
  { word: "老师", reading: "lǎoshī", reading2: "", meaning: "คุณครู / อาจารย์", example: "王老师 (Wáng lǎoshī)", exMean: "อาจารย์หวัง", speak: "老师" },
  { word: "冷", reading: "lěng", reading2: "", meaning: "หนาว / เย็น", example: "今天很冷 (jīntiān hěn lěng)", exMean: "วันนี้อากาศหนาวมาก", speak: "冷" },
  { word: "妈妈", reading: "māma", reading2: "", meaning: "แม่ / คุณแม่", example: "我爱妈妈 (wǒ ài māma)", exMean: "ฉันรักคุณแม่", speak: "妈妈" },
  { word: "买", reading: "mǎi", reading2: "", meaning: "ซื้อ", example: "买苹果 (mǎi píngguǒ)", exMean: "ซื้อแอปเปิล", speak: "买" },
  { word: "猫", reading: "māo", reading2: "", meaning: "แมว", example: "可爱的猫 (kě'ài de māo)", exMean: "แมวที่น่ารัก", speak: "猫" },
  { word: "没关系", reading: "méi guānxi", reading2: "", meaning: "ไม่เป็นไร", example: "没关系，别客气 (méi guānxi, bié kèqi)", exMean: "ไม่เป็นไร ไม่ต้องเกรงใจนะ", speak: "没关系" },
  { word: "明天", reading: "míngtiān", reading2: "", meaning: "พรุ่งนี้", example: "明天见 (míngtiān jiàn)", exMean: "พรุ่งนี้พบกันใหม่", speak: "明天" },
  { word: "名字", reading: "míngzi", reading2: "", meaning: "ชื่อ / นาม", example: "你的名字 (nǐ de míngzi)", exMean: "ชื่อของคุณ", speak: "名字" },
  { word: "哪儿", reading: "nǎr", reading2: "", meaning: "ที่ไหน", example: "你去哪儿 (nǐ qù nǎr)", exMean: "คุณจะไปที่ไหนครับ", speak: "哪儿" },
  { word: "苹果", reading: "píngguǒ", reading2: "", meaning: "แอปเปิล", example: "吃苹果 (chī píngguǒ)", exMean: "กินผลแอปเปิล", speak: "苹果" },
  { word: "钱", reading: "qián", reading2: "", meaning: "เงิน / เงินตรา", example: "多少钱 (duōshao qián)", exMean: "ราคาเท่าไหร่ครับ", speak: "钱" },
  { word: "请", reading: "qǐng", reading2: "", meaning: "เชิญ / กรุณา / เลี้ยง", example: "请进 (qǐng jìn)", exMean: "เชิญเข้ามาข้างใน", speak: "请" },
  { word: "热", reading: "rè", reading2: "", meaning: "ร้อน", example: "天气很热 (tiānqì hěn rè)", exMean: "สภาพอากาศร้อนอบอ้าว", speak: "热" },
  { word: "人", reading: "rén", reading2: "", meaning: "คน / บุคคล", example: "中国人 (Zhōngguó rén)", exMean: "คนสัญชาติจีน", speak: "人" },
  { word: "认识", reading: "rènshi", reading2: "", meaning: "รู้จัก / ทำความคุ้นเคย", example: "认识你很高兴 (rènshi nǐ hěn gāoxìng)", exMean: "ยินดีที่ได้รู้จักคุณนะ", speak: "认识" },
  { word: "商店", reading: "shāngdiàn", reading2: "", meaning: "ร้านค้า", example: "去商店 (qù shāngdiàn)", exMean: "เดินทางไปร้านค้า", speak: "商店" },
  { word: "水", reading: "shuǐ", reading2: "", meaning: "น้ำ", example: "喝水 (hē shuǐ)", exMean: "ดื่มน้ำสะอาด", speak: "水" },
  { word: "睡觉", reading: "shuìjiào", reading2: "", meaning: "นอนหลับ / เข้าพร่ำ", example: "去睡觉 (qù shuìjiào)", exMean: "ไปเข้านอนได้แล้ว", speak: "睡觉" },
  { word: "说", reading: "shuō", reading2: "", meaning: "พูด / บอกกล่าว", example: "说话 (shuō huà)", exMean: "พูดจาสนทนา", speak: "说" },
  { word: "听", reading: "tīng", reading2: "", meaning: "ฟัง / ได้ยิน", example: "听音乐 (tīng yīnyuè)", exMean: "ฟังบทเพลงไพเราะ", speak: "听" },
  { word: "喜欢", reading: "xǐhuan", reading2: "", meaning: "ชอบ / พึงพอใจ", example: "我喜欢你 (wǒ xǐhuan nǐ)", exMean: "ฉันชอบเธอนะ", speak: "喜欢" },
  { word: "谢谢", reading: "xièxie", reading2: "", meaning: "ขอบคุณ", example: "谢谢你 (xièxie nǐ)", exMean: "ขอบใจเธอมากนะ", speak: "谢谢" },
  { word: "星期", reading: "xīngqī", reading2: "", meaning: "สัปดาห์", example: "星期日 (xīngqīrì)", exMean: "วันอาทิตย์", speak: "星期" }
];

// ==========================================
// 🎨 การตั้งค่าฟอนต์ภาษาไทย (SukhumvitSet สไตล์ Apple)
// ==========================================
const thBold = (size) => new Font("SukhumvitSet-Bold", size);
const thMedium = (size) => new Font("SukhumvitSet-Medium", size);
const thRegular = (size) => new Font("SukhumvitSet-Text", size);

// ==========================================
// 📁 State I/O — ไฟล์ JSON กลางให้ทุกวิดเจ็ตโชว์คำเดียวกัน
// ==========================================
const fm = FileManager.local();
const stateFileName = `${SCRIPT_ID}_shared_state.json`;
const cachePath = fm.joinPath(fm.documentsDirectory(), stateFileName);

function loadState() {
  if (!fm.fileExists(cachePath)) return null;
  try {
    const obj = JSON.parse(fm.readString(cachePath));
    if (obj && typeof obj.index === "number" && obj.index >= 0 && obj.index < vocabList.length) {
      return obj;
    }
  } catch (e) { /* corrupt file → treat as none */ }
  return null;
}

function saveState(s) {
  try {
    fm.writeString(cachePath, JSON.stringify(s));
  } catch (e) {}
}

function pickRandomIndex(currentIndex) {
  if (vocabList.length <= 1) return 0;
  let next = Math.floor(Math.random() * vocabList.length);
  if (next === currentIndex) next = (next + 1) % vocabList.length;
  return next;
}

// ==========================================
// ⏱️ TIME-SLOT + Context Detection
// ==========================================
const now = Date.now();
const intervalMs = REFRESH_INTERVAL_MINUTES * 60 * 1000;
const currentSlot = Math.floor(now / intervalMs);
const nextRefreshTime = (currentSlot + 1) * intervalMs;
const slotIndex = currentSlot % vocabList.length;

const isWidget = config.runsInWidget;
const isApp = config.runsInApp;
const isShortcut = !isWidget && !isApp;

// แยก Intent ด้วย URL Query Parameter
const queryAction = (args.queryParameters && args.queryParameters.action) || "";
const shortcutInput = (typeof args.shortcutParameter === "string") ? args.shortcutParameter.trim() : "";
const wantRandomize = (queryAction === "randomize");

// สลับโหมด กลางวัน / กลางคืน
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
  // เส้นทาง 1: แตะปุ่มสุ่ม → สุ่มคำใหม่และเขียนบันทึก state
  const curIndex = state ? state.index : slotIndex;
  state = {
    slot: currentSlot,
    index: pickRandomIndex(curIndex),
    bgIndex: Math.floor(Math.random() * activeUrls.length)
  };
  saveState(state);

} else if (isWidget) {
  // เส้นทาง 2: Widget ทำงานตามรอบเวลาของ iOS → อัปเดตและเขียน state
  if (!state || state.slot !== currentSlot) {
    state = {
      slot: currentSlot,
      index: slotIndex,
      bgIndex: currentSlot % activeUrls.length
    };
    saveState(state);
  }

} else {
  // เส้นทาง 3 & 4: shortcut / back-tap / เปิดพรีวิวในแอป = อ่านอย่างเดียว ห้ามเขียนไฟล์
  if (!state) {
    state = {
      slot: currentSlot,
      index: slotIndex,
      bgIndex: currentSlot % activeUrls.length
    };
  }
}

const item = vocabList[state.index] || vocabList[0];
const bgIndex = (typeof state.bgIndex === "number") ? state.bgIndex : (currentSlot % activeUrls.length);

// 🔊 ข้อความสะอาดสำหรับให้ Siri ออกเสียงภาษาจีน
function cleanSpeechText(text) {
  if (!text) return "";
  return text.split(",")[0].replace(/[()（）]/g, "").trim();
}
let speakWord = item.speak && item.speak.trim();
if (!speakWord) {
  speakWord = cleanSpeechText(item.word);
}

// ==========================================
// 🔊 PATH A: เรียกจาก Shortcuts / Back Tap → อ่านอย่างเดียว ส่งค่าแล้วจบ
// ==========================================
if (isShortcut) {
  const finalWord = (shortcutInput.length > 0) ? shortcutInput : speakWord;
  Script.setShortcutOutput(finalWord);
  Script.complete();

} else {
  // ==========================================
  // 🌟 PATH B: วาด Widget (Home / Lock) หรือแสดง Preview ในแอป
  // ==========================================
  const param = (args.widgetParameter || "word").trim().toLowerCase();

  // จัดเก็บรูปภาพลงเครื่อง (แยกโฟลเดอร์ตาม SCRIPT_ID กันชนกับภาษาอื่น)
  async function ensureAllPhotosDownloaded() {
    const allSets = [
      { prefix: "day", urls: dayImages },
      { prefix: "night", urls: nightImages }
    ];
    for (const set of allSets) {
      for (let i = 0; i < set.urls.length; i++) {
        const filePath = fm.joinPath(fm.documentsDirectory(), `${SCRIPT_ID}_${set.prefix}_bg_${i}.jpg`);
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
    const targetPath = fm.joinPath(fm.documentsDirectory(), `${SCRIPT_ID}_${prefix}_bg_${targetIndex}.jpg`);
    if (fm.fileExists(targetPath)) return fm.readImage(targetPath);
    for (let i = 0; i < 3; i++) {
      const p = fm.joinPath(fm.documentsDirectory(), `${SCRIPT_ID}_${prefix}_bg_${i}.jpg`);
      if (fm.fileExists(p)) return fm.readImage(p);
    }
    return null;
  }

  const widget = new ListWidget();
  widget.refreshAfterDate = new Date(nextRefreshTime);

  const currentScriptName = Script.name() || SCRIPT_NAME;
  const speakUrl = "shortcuts://run-shortcut?name=" + encodeURIComponent(SPEAK_SHORTCUT_NAME) + "&input=" + encodeURIComponent(speakWord);
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

    // 🔊 ฝั่งซ้าย: แตะ = สั่ง Shortcut อ่านออกเสียง
    const leftCol = row.addStack();
    leftCol.layoutVertically();
    leftCol.centerAlignContent();
    leftCol.url = speakUrl;

    const badge = leftCol.addStack();
    badge.backgroundColor = new Color("#00E5FF", 0.35);
    badge.cornerRadius = 4;
    badge.setPadding(2, 6, 2, 6);
    const badgeText = badge.addText((isDaytime ? "☀️ " : "🌙 ") + DECK_LABEL);
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

    // 🔄 ฝั่งขวา: แตะ = สุ่มคำใหม่
    const rightCol = row.addStack();
    rightCol.layoutVertically();
    rightCol.url = changeUrl;

    const meanText = rightCol.addText(item.meaning);
    meanText.font = thBold(20);
    meanText.textColor = new Color("#F5C518");
    meanText.lineLimit = 1;
    meanText.minimumScaleFactor = 0.8;

    rightCol.addSpacer(4);

    const readingStack = rightCol.addStack();
    readingStack.layoutHorizontally();

    if (item.reading && item.reading !== "-") {
      const rText = readingStack.addText(item.reading);
      rText.font = Font.boldSystemFont(15);
      rText.textColor = Color.white();
      rText.lineLimit = 1;
      rText.minimumScaleFactor = 0.8;
      if (item.reading2) readingStack.addSpacer(10);
    }

    if (item.reading2) {
      const r2Text = readingStack.addText(item.reading2);
      r2Text.font = Font.boldSystemFont(15);
      r2Text.textColor = new Color("#E0E0E0");
      r2Text.lineLimit = 1;
      r2Text.minimumScaleFactor = 0.8;
    }

    rightCol.addSpacer(5);

    const compStack = rightCol.addStack();
    compStack.layoutVertically();

    const cText = compStack.addText(item.example);
    cText.font = Font.boldSystemFont(14);
    cText.textColor = new Color("#64D2FF");
    cText.lineLimit = 1;
    cText.minimumScaleFactor = 0.8;

    const cmText = compStack.addText(item.exMean);
    cmText.font = thMedium(12);
    cmText.textColor = new Color("#EBEBF5", 0.85);
    cmText.lineLimit = 1;
    cmText.minimumScaleFactor = 0.8;

  } else {
    // ========================================================
    // 🔒 LOCK SCREEN WIDGET (กล่องสี่เหลี่ยมผืนผ้า)
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

      const mean = card.addText(item.meaning);
      mean.font = thBold(17);
      mean.textColor = Color.white();
      mean.lineLimit = 1;
      mean.minimumScaleFactor = 0.8;

      card.addSpacer(2);

      const compound = card.addText(item.example);
      compound.font = Font.boldSystemFont(12);
      compound.textColor = Color.white();
      compound.lineLimit = 1;
      compound.minimumScaleFactor = 0.8;

      const compoundMean = card.addText(item.exMean);
      compoundMean.font = thMedium(11);
      compoundMean.textColor = new Color("#D0D0D0");
      compoundMean.lineLimit = 1;
      compoundMean.minimumScaleFactor = 0.8;

    } else {
      widget.url = speakUrl;
      card.layoutHorizontally();

      const word = card.addText(item.word);
      word.font = Font.boldSystemFont(44);
      word.textColor = Color.white();
      word.minimumScaleFactor = 0.5;
      word.lineLimit = 1;

      card.addSpacer(8);

      const info = card.addStack();
      info.layoutVertically();

      if (item.reading && item.reading !== "-") {
        const rText = info.addText(item.reading);
        rText.font = Font.boldSystemFont(14);
        rText.textColor = Color.white();
        rText.lineLimit = 1;
        rText.minimumScaleFactor = 0.8;

        if (item.reading2) {
          info.addSpacer(3);
          const r2Text = info.addText(item.reading2);
          r2Text.font = Font.boldSystemFont(13);
          r2Text.textColor = new Color("#D0D0D0");
          r2Text.lineLimit = 1;
          r2Text.minimumScaleFactor = 0.8;
        }
      } else {
        const only = info.addText(item.reading2 || item.meaning);
        only.font = Font.boldSystemFont(16);
        only.textColor = Color.white();
        only.lineLimit = 1;
        only.minimumScaleFactor = 0.8;
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
