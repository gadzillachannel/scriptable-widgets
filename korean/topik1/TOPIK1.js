// ==========================================================
// 🇰🇷 SCRIPTABLE WIDGET — ภาษาเกาหลี TOPIK I พื้นฐาน (TOPIK1.js)
// ----------------------------------------------------------
// วิดเจ็ตท่องศัพท์ภาษาเกาหลี TOPIK I (ระดับต้น) บน iOS Home & Lock Screen
// ดีไซน์มินิมอลสวยคมระดับ Apple UI สลับภาพวิวเกาหลีกลางวัน/กลางคืนอัตโนมัติ
//
// 📌 คำแนะนำและวิธีติดตั้ง (3 ขั้นตอน):
// ----------------------------------------------------------
// 1. [Scriptable]:
//    - กดปุ่ม + สร้างสคริปต์ใหม่ในแอป Scriptable
//    - นำโค้ดทั้งหมดในไฟล์นี้ไปวาง
//    - **สำคัญมาก**: ตั้งชื่อสคริปต์ว่า "TOPIK1" (เพื่อให้ปุ่มสุ่มสคริปต์ทำงานได้ถูกต้อง)
//
// 2. [Shortcuts (คำสั่งลัด)]:
//    - เปิดแอป Shortcuts (คำสั่งลัด) บน iPhone/iPad แล้วกดสร้าง Shortcut ใหม่
//    - ตั้งชื่อ Shortcut ว่า "SpeakKR" (ให้ตรงกับค่า SPEAK_SHORTCUT_NAME)
//    - เพิ่ม Action:
//        1) "Get Text from Input" (หรือรับค่า Shortcut Input)
//        2) "Speak Text" (อ่านออกเสียงข้อความ)
//    - กดลูกศรขยายใน "Speak Text" เลือก:
//        • Language (ภาษา): Korean (South Korea) / เกาหลี (เกาหลีใต้) [ko-KR]
//        • Voice (เสียง): Siri หรือเสียงเกาหลีที่คุณชอบ เช่น Yuna / Sora
//
// 3. [เพิ่ม Widget]:
//    - Home Screen:
//        • กดค้างที่หน้าจอว่าง > กด + มุมซ้ายบน > เลือก Scriptable
//        • เลือกขนาด Medium > แตะที่วิดเจ็ตเพื่อตั้งค่า > เลือก Script เป็น "TOPIK1"
//        • ปฏิสัมพันธ์: แตะฝั่งซ้าย (ตัวอักษรเกาหลี) = ฟังเสียงอ่าน, แตะฝั่งขวา = สุ่มคำใหม่
//    - Lock Screen (หน้าจอล็อค):
//        • เพิ่ม Widget สี่เหลี่ยมผืนผ้า (Accessory Rectangular) ของ Scriptable
//        • แตะตั้งค่า เลือก Script เป็น "TOPIK1"
//        • ในช่อง Parameter ใส่:
//            - "word"    : โชว์คำศัพท์ฮันกึล + คำอ่านโรมันไนซ์ (แตะ = ฟังเสียงอ่าน)
//            - "meaning" : โชว์คำแปลไทย + ตัวอย่างประโยค (แตะ = สุ่มคำใหม่)
// ==========================================================

// ==========================================
// ⚙️ การตั้งค่าระบบ (Configuration)
// ==========================================
const SCRIPT_NAME = "TOPIK1";
const SCRIPT_ID = "topik1";
const REFRESH_INTERVAL_MINUTES = 30; // ⏱️ แนะนำโดย Apple: 30 นาทีต่อคำ (กำลังพอดีกับการจำ ไม่เปลืองแบตเตอรี่)
const SPEAK_SHORTCUT_NAME = "SpeakKR"; // 🔊 ชื่อ Shortcut สำหรับอ่านออกเสียงภาษาเกาหลี (ko-KR)
const DECK_LABEL = "TOPIK1"; // 🏷️ ป้ายกำกับบน Badge

// ==========================================
// ☀️ คลังรูปภาพวิวเมืองและวัฒนธรรมเกาหลี เซ็ตกลางวัน (06:00 - 17:59)
// ==========================================
const dayImages = [
  "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=600&h=300&q=75", // พระราชวังเคียงบกกุง Gyeongbokgung Palace
  "https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=600&h=300&q=75", // หมู่บ้านโบราณบุกชอนฮันอก Bukchon Hanok
  "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=600&h=300&q=75"  // สวนและศาลาเกาหลีดั้งเดิมในฤดูใบไม้ร่วง
];

// ==========================================
// 🌙 คลังรูปภาพวิวเมืองและวัฒนธรรมเกาหลี เซ็ตกลางคืน (18:00 - 05:59)
// ==========================================
const nightImages = [
  "https://images.unsplash.com/photo-1546874177-9e664107314e?auto=format&fit=crop&w=600&h=300&q=75", // เอ็นโซลทาวเวอร์ N Seoul Tower แสงสียามราตรี
  "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=600&h=300&q=75", // ย่านช้อปปิ้งและแสงไฟนีออนใจกลางกรุงโซล
  "https://images.unsplash.com/photo-1549221347-84219158bb9d?auto=format&fit=crop&w=600&h=300&q=75"  // วิวแม่น้ำฮันและสะพานข้ามเมืองหลวงยามค่ำคืน
];

// ==========================================
// 📚 คลังคำศัพท์ TOPIK I (คำศัพท์พื้นฐานระดับต้น 1-2)
// ==========================================
const vocabList = [
  { word: "사과", reading: "sa-gwa", reading2: "ซากวา [n.]", meaning: "แอปเปิล / การขอโทษ", example: "사과를 먹어요 (sa-gwa-reul meo-geo-yo)", exMean: "รับประทานแอปเปิล", speak: "사과" },
  { word: "학교", reading: "hak-gyo", reading2: "ฮักกโย [n.]", meaning: "โรงเรียน", example: "학교에 가요 (hak-gyo-e ga-yo)", exMean: "เดินทางไปโรงเรียน", speak: "학교" },
  { word: "선생님", reading: "seon-saeng-nim", reading2: "ซอนแซงนิม [n.]", meaning: "คุณครู / อาจารย์", example: "한국어 선생님 (han-guk-eo seon-saeng-nim)", exMean: "คุณครูสอนภาษาเกาหลี", speak: "선생님" },
  { word: "친구", reading: "chin-gu", reading2: "ชินกู [n.]", meaning: "เพื่อนสนิท / มิตรสหาย", example: "좋은 친구 (jo-eun chin-gu)", exMean: "เพื่อนที่ดีต่อกัน", speak: "친구" },
  { word: "공부하다", reading: "gong-bu-ha-da", reading2: "กงบูฮาดา [v.]", meaning: "เรียน / ศึกษาเล่าเรียน", example: "한국어를 공부해요 (han-guk-eo-reul gong-bu-hae-yo)", exMean: "เรียนภาษาเกาหลี", speak: "공부하다" },
  { word: "가다", reading: "ga-da", reading2: "คาดา [v.]", meaning: "ไป", example: "집에 가요 (jib-e ga-yo)", exMean: "เดินทางกลับบ้าน", speak: "가다" },
  { word: "오다", reading: "o-da", reading2: "โอดา [v.]", meaning: "มา", example: "비가 와요 (bi-ga wa-yo)", exMean: "ฝนตกลงมาแล้ว", speak: "오다" },
  { word: "먹다", reading: "meok-da", reading2: "ม็อกตา [v.]", meaning: "กิน / รับประทาน", example: "밥을 먹어요 (bab-eul meo-geo-yo)", exMean: "รับประทานอาหาร", speak: "먹다" },
  { word: "마시다", reading: "ma-si-da", reading2: "มาชิดา [v.]", meaning: "ดื่ม", example: "물을 마셔요 (mul-eul ma-syeo-yo)", exMean: "ดื่มน้ำเปล่า", speak: "마시다" },
  { word: "책", reading: "chaek", reading2: "แช็ก [n.]", meaning: "หนังสือ", example: "책을 읽어요 (chaek-eul ilg-eo-yo)", exMean: "เปิดอ่านหนังสือ", speak: "책" },
  { word: "물", reading: "mul", reading2: "มุล [n.]", meaning: "น้ำ / น้ำดื่ม", example: "따뜻한 물 (tta-tteut-han mul)", exMean: "น้ำอุ่นสะอาด", speak: "물" },
  { word: "밥", reading: "bap", reading2: "พับ [n.]", meaning: "ข้าว / มื้ออาหาร", example: "아침 밥 (a-chim bap)", exMean: "มื้ออาหารเช้า", speak: "밥" },
  { word: "집", reading: "jip", reading2: "ชิบ [n.]", meaning: "บ้าน / ที่พักอาศัย", example: "우리 집 (u-ri jip)", exMean: "บ้านของเรา", speak: "집" },
  { word: "사람", reading: "sa-ram", reading2: "ซารัม [n.]", meaning: "คน / มนุษย์", example: "한국 사람 (han-guk sa-ram)", exMean: "คนสัญชาติเกาหลี", speak: "사람" },
  { word: "나라", reading: "na-ra", reading2: "นารา [n.]", meaning: "ประเทศ / แผ่นดิน", example: "우리나라 (u-ri na-ra)", exMean: "ประเทศของเรา", speak: "나라" },
  { word: "오늘", reading: "o-neul", reading2: "โอนึล [n.]", meaning: "วันนี้", example: "오늘 날씨 (o-neul nal-ssi)", exMean: "สภาพอากาศวันนี้", speak: "오늘" },
  { word: "내일", reading: "nae-il", reading2: "แนอิล [n.]", meaning: "วันพรุ่งนี้", example: "내일 만나요 (nae-il man-na-yo)", exMean: "พรุ่งนี้พบกันนะ", speak: "내일" },
  { word: "어제", reading: "eo-je", reading2: "ออเจ [n.]", meaning: "เมื่อวานนี้", example: "어제 저녁 (eo-je jeo-nyeok)", exMean: "เมื่อช่วงเย็นวานนี้", speak: "어제" },
  { word: "시간", reading: "si-gan", reading2: "ชิกัน [n.]", meaning: "เวลา / ชั่วโมง", example: "시간 있어요? (si-gan iss-eo-yo?)", exMean: "พอจะมีเวลาไหมครับ", speak: "시간" },
  { word: "돈", reading: "don", reading2: "ทน [n.]", meaning: "เงิน / เงินทอง", example: "돈을 모아요 (don-eul mo-a-yo)", exMean: "ออมเงิน / เก็บเงิน", speak: "돈" },
  { word: "만나다", reading: "man-na-da", reading2: "มันนาดา [v.]", meaning: "พบ / พบเจอ", example: "친구를 만나요 (chin-gu-reul man-na-yo)", exMean: "นัดพบปะกับเพื่อน", speak: "만나다" },
  { word: "보다", reading: "bo-da", reading2: "โพดา [v.]", meaning: "ดู / มอง / ชม", example: "영화를 봐요 (yeong-hwa-reul bwa-yo)", exMean: "ชมภาพยนตร์", speak: "보다" },
  { word: "듣다", reading: "deut-da", reading2: "ทึดตา [v.]", meaning: "ฟัง / ได้ยิน", example: "음악을 들어요 (eum-ak-eul deul-eo-yo)", exMean: "รับฟังดนตรี", speak: "듣다" },
  { word: "읽다", reading: "ik-da", reading2: "อิกตา [v.]", meaning: "อ่าน", example: "신문을 읽어요 (sin-mun-eul ilg-eo-yo)", exMean: "อ่านหนังสือพิมพ์", speak: "읽다" },
  { word: "쓰다", reading: "sseu-da", reading2: "ซือดา [v.]", meaning: "เขียน / ใช้ / สวม", example: "편지를 써요 (pyeon-ji-reul sseo-yo)", exMean: "เขียนจดหมายส่ง", speak: "쓰다" },
  { word: "말하다", reading: "mal-ha-da", reading2: "มัลฮาดา [v.]", meaning: "พูด / บอกกล่าว", example: "한국말로 말해요 (han-guk-mal-ro mal-hae-yo)", exMean: "พูดด้วยภาษาเกาหลี", speak: "말하다" },
  { word: "사다", reading: "sa-da", reading2: "ซาดา [v.]", meaning: "ซื้อ", example: "옷을 사요 (ot-eul sa-yo)", exMean: "ซื้อเสื้อผ้าใหม่", speak: "사다" },
  { word: "좋아하다", reading: "jo-a-ha-da", reading2: "โชอาฮาดา [v.]", meaning: "ชอบ / ชื่นชอบ", example: "사과를 좋아해요 (sa-gwa-reul jo-a-hae-yo)", exMean: "ชอบรับประทานแอปเปิล", speak: "좋아하다" },
  { word: "사랑하다", reading: "sa-rang-ha-da", reading2: "ซารังฮาดา [v.]", meaning: "รัก", example: "가족을 사랑해요 (ga-jok-eul sa-rang-hae-yo)", exMean: "ฉันรักครอบครัว", speak: "사랑하다" },
  { word: "자다", reading: "ja-da", reading2: "ชาดา [v.]", meaning: "นอน / หลับ", example: "일찍 자요 (il-jjik ja-yo)", exMean: "เข้านอนแต่หัวค่ำ", speak: "자다" },
  { word: "크다", reading: "keu-da", reading2: "คือดา [adj.]", meaning: "ใหญ่ / โต / สูง", example: "키가 커요 (ki-ga keo-yo)", exMean: "มีรูปร่างตัวสูง", speak: "크다" },
  { word: "작다", reading: "jak-da", reading2: "ชักตา [adj.]", meaning: "เล็ก", example: "가방이 작아요 (ga-bang-i jag-a-yo)", exMean: "กระเป๋าใบเล็ก", speak: "작다" },
  { word: "많다", reading: "man-ta", reading2: "มันทา [adj.]", meaning: "มาก / มีเยอะ", example: "사람이 많아요 (sa-ram-i man-a-yo)", exMean: "มีผู้คนเป็นจำนวนมาก", speak: "많다" },
  { word: "적다", reading: "jeok-da", reading2: "ช็อกตา [adj.]", meaning: "น้อย / เล็กน้อย", example: "비가 적게 와요 (bi-ga jeok-ge wa-yo)", exMean: "ฝนตกปรอยๆ เพียงเล็กน้อย", speak: "적다" },
  { word: "좋다", reading: "jo-ta", reading2: "โชทา [adj.]", meaning: "ดี / ยอดเยี่ยม", example: "기분이 좋아요 (gi-bun-i jo-a-yo)", exMean: "อารมณ์ดีเบิกบาน", speak: "좋다" },
  { word: "나쁘다", reading: "na-ppeu-da", reading2: "นาปือดา [adj.]", meaning: "เลว / ไม่ดี / แย่", example: "날씨가 나빠요 (nal-ssi-ga na-ppa-yo)", exMean: "สภาพอากาศไม่ดี", speak: "나쁘다" },
  { word: "맛있다", reading: "mas-it-da", reading2: "มาชิดตา [adj.]", meaning: "อร่อย", example: "음식이 맛있어요 (eum-sik-i mas-iss-eo-yo)", exMean: "อาหารรสชาติอร่อยมาก", speak: "맛있다" },
  { word: "비싸다", reading: "bi-ssa-da", reading2: "พีซาดา [adj.]", meaning: "แพง / ราคาสูง", example: "너무 비싸요 (neo-mu bi-ssa-yo)", exMean: "ราคาแพงเกินไป", speak: "비싸다" },
  { word: "싸다", reading: "ssa-da", reading2: "ซาดา [adj.]", meaning: "ถูก / ราคาประหยัด", example: "가격이 싸요 (ga-gyeok-i ssa-yo)", exMean: "ราคาย่อมเยาสบายกระเป๋า", speak: "싸다" },
  { word: "어렵다", reading: "eo-ryeop-da", reading2: "ออรย็อบตา [adj.]", meaning: "ยาก / ลำบาก", example: "시험이 어려워요 (si-heom-i eo-ryeo-wo-yo)", exMean: "ข้อสอบมีความยาก", speak: "어렵다" },
  { word: "쉽다", reading: "swip-da", reading2: "ชวิบตา [adj.]", meaning: "ง่าย / ไม่ซับซ้อน", example: "한국어가 쉬워요 (han-guk-eo-ga swi-wo-yo)", exMean: "ภาษาเกาหลีเข้าใจง่าย", speak: "쉽다" },
  { word: "덥다", reading: "deop-da", reading2: "ท็อบตา [adj.]", meaning: "ร้อน (สภาพอากาศ)", example: "여름은 더워요 (yeo-reum-eun deo-wo-yo)", exMean: "ฤดูร้อนมีอากาศอบอ้าว", speak: "덥다" },
  { word: "춥다", reading: "chup-da", reading2: "ชุบตา [adj.]", meaning: "หนาว / เย็นยะเยือก", example: "겨울은 추워요 (gyeo-ul-eun chu-wo-yo)", exMean: "ฤดูหนาวอากาศเย็นจัด", speak: "춥다" },
  { word: "의사", reading: "ui-sa", reading2: "อีซา [n.]", meaning: "แพทย์ / คุณหมอ", example: "친절한 의사 (chin-jeol-han ui-sa)", exMean: "แพทย์ที่ใจดี", speak: "의사" },
  { word: "병원", reading: "byeong-won", reading2: "พย็องวอน [n.]", meaning: "โรงพยาบาล", example: "병원에 가요 (byeong-won-e ga-yo)", exMean: "เดินทางไปโรงพยาบาล", speak: "병원" },
  { word: "회사", reading: "hoe-sa", reading2: "ฮเวซา [n.]", meaning: "บริษัท / ที่ทำงาน", example: "회사에 다녀요 (hoe-sa-e da-nyeo-yo)", exMean: "ไปทำงานที่บริษัท", speak: "회사" },
  { word: "회사원", reading: "hoe-sa-won", reading2: "ฮเวซาวอน [n.]", meaning: "พนักงานบริษัท", example: "저는 회사원이에요 (jeo-neun hoe-sa-won-i-e-yo)", exMean: "ฉันเป็นพนักงานออฟฟิศ", speak: "회사원" },
  { word: "학생", reading: "hak-saeng", reading2: "ฮักแซง [n.]", meaning: "นักเรียน / นักศึกษา", example: "대학교 학생 (dae-hak-gyo hak-saeng)", exMean: "นักศึกษามหาวิทยาลัย", speak: "학생" },
  { word: "시장", reading: "si-jang", reading2: "ชีจัง [n.]", meaning: "ตลาด", example: "동대문 시장 (dong-dae-mun si-jang)", exMean: "ตลาดทงแดมุน", speak: "시장" },
  { word: "가게", reading: "ga-ge", reading2: "คาเก [n.]", meaning: "ร้านค้า", example: "빵 가게 (ppang ga-ge)", exMean: "ร้านจำหน่ายเบเกอรี่", speak: "가게" },
  { word: "방", reading: "bang", reading2: "พัง [n.]", meaning: "ห้อง", example: "내 방 (nae bang)", exMean: "ห้องส่วนตัวของฉัน", speak: "방" },
  { word: "문", reading: "mun", reading2: "มุน [n.]", meaning: "ประตู", example: "문을 열어요 (mun-eul yeol-eo-yo)", exMean: "ผลักเปิดประตู", speak: "문" },
  { word: "창문", reading: "chang-mun", reading2: "ชังมุน [n.]", meaning: "หน้าต่าง", example: "창문을 닫아요 (chang-mun-eul dad-a-yo)", exMean: "ดึงปิดหน้าต่าง", speak: "창문" },
  { word: "길", reading: "gil", reading2: "คิล [n.]", meaning: "ถนน / ทางเดิน", example: "길을 물어봐요 (gil-eul mul-eo-bwa-yo)", exMean: "สอบถามเส้นทาง", speak: "길" },
  { word: "지하철", reading: "ji-ha-cheol", reading2: "ชีฮาชอล [n.]", meaning: "รถไฟใต้ดิน", example: "지하철을 타요 (ji-ha-cheol-eul ta-yo)", exMean: "โดยสารรถไฟใต้ดิน", speak: "지하철" },
  { word: "버스", reading: "beo-seu", reading2: "พอซือ [n.]", meaning: "รถประจำทาง / รถบัส", example: "버스 정류장 (beo-seu jeong-ryu-jang)", exMean: "ป้ายรถประจำทาง", speak: "버스" },
  { word: "비행기", reading: "bi-haeng-gi", reading2: "พีแฮงกี [n.]", meaning: "เครื่องบิน", example: "비행기를 타요 (bi-haeng-gi-reul ta-yo)", exMean: "โดยสารขึ้นเครื่องบิน", speak: "비행기" },
  { word: "여행", reading: "yeo-haeng", reading2: "ยอแฮง [n.]", meaning: "การท่องเที่ยว / ทริปเดินทาง", example: "제주도 여행 (je-ju-do yeo-haeng)", exMean: "ทริปท่องเที่ยวเกาะเชจู", speak: "여행" },
  { word: "이름", reading: "i-reum", reading2: "อีรึม [n.]", meaning: "ชื่อ / นาม", example: "이름이 뭐예요? (i-reum-i mwo-ye-yo?)", exMean: "คุณชื่ออะไรครับ", speak: "이름" },
  { word: "고양이", reading: "go-yang-i", reading2: "โฮยังอี [n.]", meaning: "แมว", example: "귀여운 고양이 (gwi-yeo-un go-yang-i)", exMean: "น้องแมวน่ารัก", speak: "고양이" },
  { word: "강아지", reading: "gang-a-ji", reading2: "คังอาจี [n.]", meaning: "ลูกสุนัข / สุนัขตัวเล็ก", example: "강아지를 키워요 (gang-a-ji-reul ki-wo-yo)", exMean: "เลี้ยงดูลูกสุนัข", speak: "강아지" },
  { word: "날씨", reading: "nal-ssi", reading2: "นัลซี [n.]", meaning: "สภาพอากาศ", example: "날씨가 맑아요 (nal-ssi-ga malg-a-yo)", exMean: "ท้องฟ้าโปร่งสดใส", speak: "날씨" },
  { word: "노래", reading: "no-rae", reading2: "โนแร [n.]", meaning: "บทเพลง / เสียงร้อง", example: "노래를 불러요 (no-rae-reul bul-leo-yo)", exMean: "ขับขานร้องบทเพลง", speak: "노래" },
  { word: "운동", reading: "un-dong", reading2: "อุนดง [n.]", meaning: "การออกกำลังกาย / กีฬา", example: "매일 운동해요 (mae-il un-dong-hae-yo)", exMean: "ออกกำลังกายสม่ำเสมอทุกวัน", speak: "운동" },
  { word: "가족", reading: "ga-jok", reading2: "คาจก [n.]", meaning: "ครอบครัว / คนในบ้าน", example: "화목한 가족 (hwa-mok-han ga-jok)", exMean: "ครอบครัวที่อบอุ่น", speak: "가족" }
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
  // เส้นทาง 1: แตะปุ่มสุ่ม → สุ่มคำใหม่และบันทึก state
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

// 🔊 ข้อความสะอาดสำหรับให้ Siri ออกเสียงภาษาเกาหลี
function cleanSpeechText(text) {
  if (!text) return "";
  return text.split(",")[0].replace(/[()]/g, "").trim();
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

  // จัดเก็บรูปภาพลงเครื่อง (แยกชื่อไฟล์ตาม SCRIPT_ID ป้องกันการชนกัน)
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

    // 🔊 ฝั่งซ้าย: แตะ = สั่ง Shortcut อ่านออกเสียงภาษาเกาหลี
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
