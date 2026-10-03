// ==========================================================
// 🇬🇧 SCRIPTABLE WIDGET — ภาษาอังกฤษ TOEIC พื้นฐาน (TOEIC.js)
// ----------------------------------------------------------
// วิดเจ็ตท่องศัพท์ภาษาอังกฤษ TOEIC สำหรับการทำงานและธุรกิจ บน iOS
// สวยงาม คมชัด สไตล์ Apple UI สลับภาพพื้นหลังวิวเมืองกลางวัน/กลางคืนอัตโนมัติ
//
// 📌 คำแนะนำและวิธีติดตั้ง (3 ขั้นตอน):
// ----------------------------------------------------------
// 1. [Scriptable]:
//    - กดปุ่ม + สร้างสคริปต์ใหม่ในแอป Scriptable
//    - วางโค้ดทั้งหมดในไฟล์นี้
//    - **สำคัญมาก**: ตั้งชื่อสคริปต์ว่า "TOEIC" (เพื่อให้ปุ่มสุ่มสคริปต์ทำงานได้ถูกต้อง)
//
// 2. [Shortcuts (คำสั่งลัด)]:
//    - เปิดแอป Shortcuts (คำสั่งลัด) บน iPhone/iPad แล้วกดสร้าง Shortcut ใหม่
//    - ตั้งชื่อ Shortcut ว่า "SpeakEN" (ให้ตรงกับค่า SPEAK_SHORTCUT_NAME)
//    - เพิ่ม Action:
//        1) "Get Text from Input" (หรือรับค่า Shortcut Input)
//        2) "Speak Text" (อ่านออกเสียงข้อความ)
//    - กดลูกศรขยายใน "Speak Text" เลือก:
//        • Language (ภาษา): English (United States) / ภาษาอังกฤษ (สหรัฐอเมริกา) [en-US]
//        • Voice (เสียง): Siri หรือเสียงอังกฤษที่คุณชอบ เช่น Samantha / Alex
//
// 3. [เพิ่ม Widget]:
//    - Home Screen:
//        • กดค้างที่หน้าจอว่าง > กด + มุมซ้ายบน > เลือก Scriptable
//        • เลือกขนาด Medium > แตะที่วิดเจ็ตเพื่อตั้งค่า > เลือก Script เป็น "TOEIC"
//        • ปฏิสัมพันธ์: แตะฝั่งซ้าย (คำศัพท์) = ฟังเสียงอ่านสำเนียงอเมริกัน, แตะฝั่งขวา = สุ่มคำใหม่
//    - Lock Screen (หน้าจอล็อค):
//        • เพิ่ม Widget สี่เหลี่ยมผืนผ้า (Accessory Rectangular) ของ Scriptable
//        • แตะตั้งค่า เลือก Script เป็น "TOEIC"
//        • ในช่อง Parameter ใส่:
//            - "word"    : โชว์คำศัพท์ภาษาอังกฤษ + สัทอักษร IPA (แตะ = ฟังเสียงอ่าน)
//            - "meaning" : โชว์คำแปลไทย + ตัวอย่างการใช้ในที่ทำงาน (แตะ = สุ่มคำใหม่)
// ==========================================================

// ==========================================
// ⚙️ การตั้งค่าระบบ (Configuration)
// ==========================================
const SCRIPT_NAME = "TOEIC";
const SCRIPT_ID = "toeic";
const REFRESH_INTERVAL_MINUTES = 30; // ⏱️ แนะนำโดย Apple: 30 นาทีต่อคำ (กำลังพอดีกับการจำ ไม่เปลืองแบตเตอรี่)
const SPEAK_SHORTCUT_NAME = "SpeakEN"; // 🔊 ชื่อ Shortcut สำหรับอ่านออกเสียงภาษาอังกฤษ (en-US)
const DECK_LABEL = "TOEIC"; // 🏷️ ป้ายกำกับบน Badge

// ==========================================
// ☀️ คลังรูปภาพวิวเมืองและมหานคร เซ็ตกลางวัน (06:00 - 17:59)
// ==========================================
const dayImages = [
  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&h=300&q=75", // บิ๊กเบนและสะพานเวสต์มินสเตอร์ ลอนดอน
  "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=600&h=300&q=75", // ทาวเวอร์บริดจ์ ลอนดอนริมแม่น้ำเทมส์
  "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&h=300&q=75"  // ตึกระฟ้าแมนฮัตตัน นครนิวยอร์ก
];

// ==========================================
// 🌙 คลังรูปภาพวิวเมืองและมหานคร เซ็ตกลางคืน (18:00 - 05:59)
// ==========================================
const nightImages = [
  "https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=600&h=300&q=75", // เส้นขอบฟ้ายามค่ำคืนของมหานครนิวยอร์ก
  "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=600&h=300&q=75", // ลอนดอนอายและแสงไฟยามราตรีริมแม่น้ำ
  "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&h=300&q=75"  // แสงสีนีออนใจกลางไทม์สแควร์ นิวยอร์ก
];

// ==========================================
// 📚 คลังคำศัพท์ TOEIC พื้นฐาน (หมวดธุรกิจ การทำงาน และออฟฟิศ)
// ==========================================
const vocabList = [
  { word: "agenda", reading: "/əˈdʒen.də/", reading2: "n.", meaning: "วาระการประชุม / กำหนดการ", example: "set the agenda", exMean: "กำหนดวาระการประชุม", speak: "agenda" },
  { word: "negotiate", reading: "/nɪˈɡoʊ.ʃi.eɪt/", reading2: "v.", meaning: "เจรจาต่อรอง", example: "negotiate a contract", exMean: "เจรจาต่อรองสัญญาธุรกิจ", speak: "negotiate" },
  { word: "deadline", reading: "/ˈded.laɪn/", reading2: "n.", meaning: "กำหนดส่งงาน / วันครบกำหนด", example: "meet the deadline", exMean: "ส่งงานทันตามกำหนดเวลา", speak: "deadline" },
  { word: "budget", reading: "/ˈbʌdʒ.ɪt/", reading2: "n.", meaning: "งบประมาณ", example: "annual budget", exMean: "งบประมาณประจำปี", speak: "budget" },
  { word: "revenue", reading: "/ˈrev.ə.nuː/", reading2: "n.", meaning: "รายได้ / รายรับของบริษัท", example: "increase annual revenue", exMean: "เพิ่มรายได้ประจำปีของบริษัท", speak: "revenue" },
  { word: "colleague", reading: "/ˈkɑː.liːɡ/", reading2: "n.", meaning: "เพื่อนร่วมงาน", example: "work with colleagues", exMean: "ทำงานร่วมกับเพื่อนร่วมงาน", speak: "colleague" },
  { word: "proposal", reading: "/prəˈpoʊ.zəl/", reading2: "n.", meaning: "ข้อเสนอ / แผนโครงการ", example: "submit a project proposal", exMean: "ยื่นเสนอแผนงานโครงการ", speak: "proposal" },
  { word: "contract", reading: "/ˈkɑːn.trækt/", reading2: "n.", meaning: "สัญญา / ข้อตกลง", example: "sign a business contract", exMean: "ลงนามในสัญญาทางธุรกิจ", speak: "contract" },
  { word: "applicant", reading: "/ˈæp.lɪ.kənt/", reading2: "n.", meaning: "ผู้สมัครงาน", example: "qualified applicant", exMean: "ผู้สมัครที่มีคุณสมบัติครบถ้วน", speak: "applicant" },
  { word: "invoice", reading: "/ˈɪn.vɔɪs/", reading2: "n.", meaning: "ใบแจ้งหนี้ / ใบเรียกเก็บเงิน", example: "issue an official invoice", exMean: "ออกใบแจ้งหนี้อย่างเป็นทางการ", speak: "invoice" },
  { word: "client", reading: "/ˈklaɪ.ənt/", reading2: "n.", meaning: "ลูกค้า / ผู้ว่าจ้าง", example: "meet with key clients", exMean: "ประชุมร่วมกับลูกค้ารายสำคัญ", speak: "client" },
  { word: "strategy", reading: "/ˈstrætʃ.ə.dʒi/", reading2: "n.", meaning: "กลยุทธ์ / แผนยุทธศาสตร์", example: "marketing strategy", exMean: "กลยุทธ์การทำตลาด", speak: "strategy" },
  { word: "presentation", reading: "/ˌprez.ənˈteɪ.ʃən/", reading2: "n.", meaning: "การนำเสนอผลงาน", example: "give a presentation", exMean: "นำเสนอผลงานในที่ประชุม", speak: "presentation" },
  { word: "executive", reading: "/ɪɡˈzek.jə.tɪv/", reading2: "n.", meaning: "ผู้บริหารระดับสูง", example: "chief executive officer", exMean: "ประธานเจ้าหน้าที่บริหาร (CEO)", speak: "executive" },
  { word: "policy", reading: "/ˈpɑː.lə.si/", reading2: "n.", meaning: "นโยบาย / ข้อกำหนด", example: "company safety policy", exMean: "นโยบายความปลอดภัยของบริษัท", speak: "policy" },
  { word: "candidate", reading: "/ˈkæn.dɪ.dət/", reading2: "n.", meaning: "ผู้สมัคร / ผู้ได้รับการเสนอชื่อ", example: "ideal candidate for the job", exMean: "ผู้สมัครที่เหมาะสมที่สุดกับตำแหน่ง", speak: "candidate" },
  { word: "quarterly", reading: "/ˈkwɔːr.tɚ.li/", reading2: "adj.", meaning: "ประจำไตรมาส (ทุก 3 เดือน)", example: "quarterly financial report", exMean: "รายงานทางการเงินประจำไตรมาส", speak: "quarterly" },
  { word: "feedback", reading: "/ˈfiːd.bæk/", reading2: "n.", meaning: "ข้อเสนอแนะ / ความเห็นติชม", example: "valuable client feedback", exMean: "ข้อเสนอแนะอันมีค่าจากลูกค้า", speak: "feedback" },
  { word: "implement", reading: "/ˈɪm.plə.ment/", reading2: "v.", meaning: "ดำเนินการ / นำไปปฏิบัติจริง", example: "implement a new system", exMean: "นำระบบการทำงานใหม่มาใช้จริง", speak: "implement" },
  { word: "performance", reading: "/pɚˈfɔːr.məns/", reading2: "n.", meaning: "ผลการปฏิบัติงาน / ประสิทธิภาพ", example: "annual performance review", exMean: "การประเมินผลการทำงานประจำปี", speak: "performance" },
  { word: "confirm", reading: "/kənˈfɝːm/ ", reading2: "v.", meaning: "ยืนยัน / รับรอง", example: "confirm the flight booking", exMean: "ยืนยันการจองตั๋วเที่ยวบิน", speak: "confirm" },
  { word: "postpone", reading: "/poʊstˈpoʊn/", reading2: "v.", meaning: "เลื่อนเวลาออกไป", example: "postpone the meeting", exMean: "เลื่อนกำหนดการประชุมออกไป", speak: "postpone" },
  { word: "department", reading: "/dɪˈpɑːrt.mənt/", reading2: "n.", meaning: "แผนก / ฝ่ายในองค์กร", example: "human resources department", exMean: "ฝ่ายบริหารทรัพยากรบุคคล (HR)", speak: "department" },
  { word: "schedule", reading: "/ˈskedʒ.uːl/", reading2: "n.", meaning: "ตารางเวลา / กำหนดการ", example: "ahead of schedule", exMean: "เสร็จก่อนกำหนดการที่วางไว้", speak: "schedule" },
  { word: "warranty", reading: "/ˈwɔːr.ən.ti/", reading2: "n.", meaning: "การรับประกันคุณภาพสินค้า", example: "under one-year warranty", exMean: "อยู่ภายใต้การรับประกัน 1 ปี", speak: "warranty" },
  { word: "refund", reading: "/ˈriː.fʌnd/", reading2: "n.", meaning: "การคืนเงิน / เงินที่คืนให้", example: "request a full refund", exMean: "ขอรับเงินคืนเต็มจำนวน", speak: "refund" },
  { word: "inventory", reading: "/ˈɪn.vən.tɔːr.i/", reading2: "n.", meaning: "สินค้าคงคลัง / สต็อกสินค้า", example: "check warehouse inventory", exMean: "ตรวจเช็กสินค้าคงคลังในโกดัง", speak: "inventory" },
  { word: "promotion", reading: "/prəˈmoʊ.ʃən/", reading2: "n.", meaning: "การเลื่อนตำแหน่ง / ส่งเสริมการขาย", example: "deserve a job promotion", exMean: "สมควรได้รับการเลื่อนตำแหน่ง", speak: "promotion" },
  { word: "supervise", reading: "/ˈsuː.pɚ.vaɪz/", reading2: "v.", meaning: "ควบคุมดูแล / ตรวจตรา", example: "supervise the project team", exMean: "ควบคุมดูแลทีมงานโครงการ", speak: "supervise" },
  { word: "transaction", reading: "/trænˈzæk.ʃən/", reading2: "n.", meaning: "ธุรกรรมทางการเงิน", example: "secure online transaction", exMean: "การทำธุรกรรมออนไลน์ที่ปลอดภัย", speak: "transaction" },
  { word: "brochure", reading: "/broʊˈʃʊr/", reading2: "n.", meaning: "แผ่นพับโฆษณาแนะนำสินค้า", example: "distribute product brochures", exMean: "แจกจ่ายแผ่นพับแนะนำสินค้า", speak: "brochure" },
  { word: "seminar", reading: "/ˈsem.ə.nɑːr/", reading2: "n.", meaning: "การสัมมนา / อบรมเชิงปฏิบัติการ", example: "attend a leadership seminar", exMean: "เข้าร่วมการสัมมนาภาวะผู้นำ", speak: "seminar" },
  { word: "branch", reading: "/bræntʃ/", reading2: "n.", meaning: "สาขา (บริษัทหรือธนาคาร)", example: "open a new branch office", exMean: "เปิดสำนักงานสาขาแห่งใหม่", speak: "branch" },
  { word: "compensation", reading: "/ˌkɑːm.penˈseɪ.ʃən/", reading2: "n.", meaning: "ค่าตอบแทน / เงินชดเชย", example: "competitive compensation", exMean: "ผลตอบแทนที่จูงใจในการทำงาน", speak: "compensation" },
  { word: "evaluate", reading: "/ɪˈvæl.ju.eɪt/", reading2: "v.", meaning: "ประเมินผล / ตีราคา", example: "evaluate sales performance", exMean: "ประเมินผลงานยอดขาย", speak: "evaluate" },
  { word: "expansion", reading: "/ɪkˈspæn.ʃən/", reading2: "n.", meaning: "การขยายตัวทางธุรกิจ", example: "global market expansion", exMean: "การขยายตลาดสู่ระดับสากล", speak: "expansion" },
  { word: "facility", reading: "/fəˈsɪl.ə.t̬i/", reading2: "n.", meaning: "อาคารสถานที่ / สิ่งอำนวยความสะดวก", example: "modern research facility", exMean: "ศูนย์วิจัยที่ทันสมัย", speak: "facility" },
  { word: "guideline", reading: "/ˈɡaɪd.laɪn/", reading2: "n.", meaning: "แนวทางปฏิบัติ / ข้อแนะนำ", example: "follow security guidelines", exMean: "ปฏิบัติตามแนวทางความปลอดภัย", speak: "guideline" },
  { word: "inquiry", reading: "/ˈɪn.kwɚ.i/", reading2: "n.", meaning: "การสอบถามข้อมูล / ข้อสงสัย", example: "respond to customer inquiry", exMean: "ตอบข้อซักถามของลูกค้า", speak: "inquiry" },
  { word: "maintenance", reading: "/ˈmeɪn.tən.əns/", reading2: "n.", meaning: "การบำรุงรักษาอุปกรณ์", example: "routine equipment maintenance", exMean: "การบำรุงรักษาอุปกรณ์ตามรอบ", speak: "maintenance" },
  { word: "notify", reading: "/ˈnoʊ.t̬ə.faɪ/", reading2: "v.", meaning: "แจ้งให้ทราบเป็นทางการ", example: "notify staff of changes", exMean: "แจ้งให้พนักงานทราบการเปลี่ยนแปลง", speak: "notify" },
  { word: "partition", reading: "/pɑːrˈtɪʃ.ən/", reading2: "n.", meaning: "ฉากกั้นห้องทำงาน", example: "install office partitions", exMean: "ติดตั้งฉากกั้นพื้นที่ในออฟฟิศ", speak: "partition" },
  { word: "purchase", reading: "/ˈpɝː.tʃəs/", reading2: "v.", meaning: "จัดซื้อ / สั่งซื้อสินค้า", example: "purchase office supplies", exMean: "จัดซื้ออุปกรณ์เครื่องใช้สำนักงาน", speak: "purchase" },
  { word: "reception", reading: "/rɪˈsep.ʃən/", reading2: "n.", meaning: "แผนกต้อนรับ / งานเลี้ยงต้อนรับ", example: "check in at the reception", exMean: "ติดต่อที่เคาน์เตอร์แผนกต้อนรับ", speak: "reception" },
  { word: "regulation", reading: "/ˌreɡ.jəˈleɪ.ʃən/", reading2: "n.", meaning: "กฎระเบียบ / ข้อบังคับ", example: "strict safety regulations", exMean: "กฎระเบียบความปลอดภัยที่เคร่งครัด", speak: "regulation" },
  { word: "reputation", reading: "/ˌrep.jəˈteɪ.ʃən/", reading2: "n.", meaning: "ชื่อเสียงและความน่าเชื่อถือ", example: "build an excellent reputation", exMean: "สร้างชื่อเสียงอันยอดเยี่ยมแก่องค์กร", speak: "reputation" },
  { word: "resign", reading: "/rɪˈzaɪn/", reading2: "v.", meaning: "ลาออกจากตำแหน่งหน้าที่", example: "resign from the position", exMean: "ลาออกจากตำแหน่งหน้าที่การงาน", speak: "resign" },
  { word: "restructuring", reading: "/ˌriːˈstrʌk.tʃɚ.ɪŋ/", reading2: "n.", meaning: "การปรับโครงสร้างองค์กร", example: "company-wide restructuring", exMean: "การปรับโครงสร้างองค์กรทั้งระบบ", speak: "restructuring" },
  { word: "shipment", reading: "/ˈʃɪp.mənt/", reading2: "n.", meaning: "การจัดส่งสินค้า / พัสดุที่ส่ง", example: "track the overseas shipment", exMean: "ติดตามสถานะการจัดส่งข้ามประเทศ", speak: "shipment" },
  { word: "specification", reading: "/ˌspes.ə.fəˈkeɪ.ʃən/", reading2: "n.", meaning: "คุณลักษณะเฉพาะ / รายละเอียดสเปก", example: "meet product specifications", exMean: "ตรงตามคุณลักษณะเฉพาะของสินค้า", speak: "specification" },
  { word: "supplier", reading: "/səˈplaɪ.ɚ/", reading2: "n.", meaning: "ผู้จัดหาสินค้า / ซัพพลายเออร์", example: "reliable parts supplier", exMean: "ซัพพลายเออร์ชิ้นส่วนที่ไว้วางใจได้", speak: "supplier" },
  { word: "survey", reading: "/ˈsɝː.veɪ/", reading2: "n.", meaning: "การสำรวจ / แบบสอบถาม", example: "conduct a customer survey", exMean: "จัดทำแบบสำรวจความเห็นลูกค้า", speak: "survey" },
  { word: "tenant", reading: "/ˈten.ənt/", reading2: "n.", meaning: "ผู้เช่าอาคารสำนักงาน", example: "commercial building tenant", exMean: "ผู้เช่าพื้นที่อาคารพาณิชย์", speak: "tenant" },
  { word: "urgent", reading: "/ˈɝː.dʒənt/", reading2: "adj.", meaning: "ด่วน / เร่งด่วนเป็นพิเศษ", example: "urgent business matter", exMean: "ธุระด่วนทางธุรกิจที่ต้องรีบจัดการ", speak: "urgent" },
  { word: "vacancy", reading: "/ˈveɪ.kən.si/", reading2: "n.", meaning: "ตำแหน่งงานว่าง", example: "fill an executive vacancy", exMean: "รับคนเข้าทำงานในตำแหน่งว่าง", speak: "vacancy" },
  { word: "vendor", reading: "/ˈven.dɚ/", reading2: "n.", meaning: "ผู้จัดจำหน่าย / ผู้ขาย", example: "select an approved vendor", exMean: "คัดเลือกผู้ขายที่ผ่านการรับรอง", speak: "vendor" },
  { word: "yield", reading: "/jiːld/", reading2: "n.", meaning: "ผลผลิต / ผลตอบแทนการลงทุน", example: "high investment yield", exMean: "อัตราผลตอบแทนจากการลงทุนสูง", speak: "yield" },
  { word: "accomplish", reading: "/əˈkɑːm.plɪʃ/", reading2: "v.", meaning: "ทำสำเร็จ / บรรลุเป้าหมาย", example: "accomplish sales goals", exMean: "บรรลุเป้าหมายยอดขายที่วางไว้", speak: "accomplish" },
  { word: "allocate", reading: "/ˈæl.ə.keɪt/", reading2: "v.", meaning: "จัดสรรงบประมาณหรือทรัพยากร", example: "allocate financial resources", exMean: "จัดสรรทรัพยากรทางการเงิน", speak: "allocate" },
  { word: "collaborate", reading: "/kəˈlæb.ə.reɪt/", reading2: "v.", meaning: "ร่วมมือกัน / ทำงานเป็นทีม", example: "collaborate on a new project", exMean: "ร่วมมือกันในโปรเจกต์งานใหม่", speak: "collaborate" },
  { word: "comply", reading: "/kəmˈplaɪ/", reading2: "v.", meaning: "ปฏิบัติตามกฎเกณฑ์ข้อบังคับ", example: "comply with company policies", exMean: "ปฏิบัติตามนโยบายขององค์กร", speak: "comply" },
  { word: "delegate", reading: "/ˈdel.ə.ɡeɪt/", reading2: "v.", meaning: "มอบหมายงาน / กระจายหน้าที่", example: "delegate tasks to teammates", exMean: "มอบหมายหน้าที่ให้เพื่อนร่วมทีม", speak: "delegate" },
  { word: "duplicate", reading: "/ˈduː.plə.keɪt/", reading2: "v.", meaning: "ทำสำเนา / ทำซ้ำเอกสาร", example: "duplicate the contract file", exMean: "ทำสำเนาเอกสารสัญญา", speak: "duplicate" },
  { word: "facilitate", reading: "/fəˈsɪl.ə.teɪt/", reading2: "v.", meaning: "อำนวยความสะดวกให้ราบรื่น", example: "facilitate the discussion", exMean: "อำนวยความสะดวกให้การหารือราบรื่น", speak: "facilitate" },
  { word: "streamline", reading: "/ˈstriːm.laɪn/", reading2: "v.", meaning: "ปรับปรุงกระบวนการให้คล่องตัว", example: "streamline business workflow", exMean: "ปรับลดขั้นตอนการทำงานให้รวดเร็ว", speak: "streamline" }
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

// 🔊 ข้อความสะอาดสำหรับให้ Siri ออกเสียงภาษาอังกฤษ
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

    // 🔊 ฝั่งซ้าย: แตะ = สั่ง Shortcut อ่านออกเสียงภาษาอังกฤษ
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
    wordText.minimumScaleFactor = 0.4;
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
      word.minimumScaleFactor = 0.4;
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
