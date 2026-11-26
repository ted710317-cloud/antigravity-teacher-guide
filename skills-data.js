// 教學推廣手冊 - 去敏後之可複製技能資料庫（新進國小 洪偉朕老師 實戰分享）
window.TEACHER_SKILLS = [
  {
    id: "chinese-quiz-generator",
    chapter: "ch3",
    category: "語文評量",
    icon: "📚",
    name: "國小國語隨堂小考考卷自動製作",
    triggers: ["/chinese-quiz", "/國語考卷", "國語小考", "生字考卷"],
    painPoint: "每次自己用 Word 排國小國語直書考卷，田字格、注音格、對齊線調到眼花，還得另做一張解答卷。",
    outcome: "拍課本或貼上詞語後，自動產出「A4 橫式由右至左直書」學生卷＋紅字解答卷（含 HTML/PDF 列印檔與 Word 原生直書 .docx 可編輯檔）。",
    promptExample: "請幫我用 /chinese-quiz 製作六年級國語第七課隨堂小考，挑選 10 個語詞解釋、5 個成語和 3 題課本修辭，產出 A4 單面 PDF 和可編輯 Word 檔。",
    highlights: [
      "支援標準 A4 單面折半作答版，以及 1.5cm×1.5cm 加大國字田字格＋注音欄雙面版。",
      "卷頭資訊保持純淨留白，嚴格禁止底線與多餘框線；題目固定 12pt（修辭放大至 14pt）不折行。",
      "內建 Windows Word 原生直書 (.docx) 引擎，老師開啟 Word 即可微調題目文字。"
    ],
    skillTemplate: `---
name: chinese-quiz-generator
description: 專為中小學教師設計的「各課隨堂小考／單元評量卷」全自動排版與生成技能。依照課本/習作圖片或題庫內容，產出「A4 橫式由右至左直書（vertical-rl / tbRl）」考卷與教師解答卷，支援 PDF/HTML 預覽列印與可編輯 Word (.docx) 檔。當使用者提到「國語小考」、「國語考卷」、「生字考卷」、「出考卷」或輸入 /chinese-quiz 時觸發。
---

# 📚 國小國語各課隨堂小考考卷製作技能 (Chinese Quiz Generator)

## 🌟 核心排版規範
1. **紙張與方向**：A4 Landscape（297mm × 210mm），由右至左直書（\`writing-mode: vertical-rl\`）。
2. **卷頭資訊區**：右側直行顯示標題與「班級、座號、姓名、得分」，不加底線或框線。
3. **三大題配置**：
   - **第一大題（10～12 題語詞理解與國字注音）**：左格國字、右欄注音，字字獨立方格（2字詞2格、3字詞3格、4字詞4格），內附淡灰色「國」「注」對位提示，題目 12pt 精簡至 30 字內不折行。
   - **中間折線**：\`✁ 請向左半頁繼續作答 ✁\`。
   - **第二大題（5～6 題成語積累）**：固定 4 個國字注音格。
   - **第三大題（3 題修辭練習）**：例句放大至 14pt，學生直接圈出關鍵詞；解答卷以紅圈標示。
4. **雙格式交付**：同時輸出可列印 HTML/PDF 預覽檔，以及 Word 原生直書可編輯 \`.docx\`（請於本機建立 \`scripts/quiz_engine.py\` 與 \`word_quiz_engine.py\` 或請 AI 直接協助生成 HTML 列印版與 Python docx 生成腳本）。

## 🚀 標準流程
1. 辨識教師上傳的課本圖片或文字，列出建議語詞、成語與修辭請教師確認。
2. 產出結構化 JSON 題庫，執行排版引擎生成學生卷與教師解答卷。
3. 提醒列印設定：橫向（Landscape）、實際大小（100%）。`
  },
  {
    id: "padlet-composition-publisher",
    chapter: "ch3",
    category: "語文評量",
    icon: "📝",
    name: "Padlet 作文分欄看板與診斷報告發布",
    triggers: ["/發布作文", "/padlet-composition-publisher", "發布作文", "作文看板"],
    painPoint: "發還手寫作文與 Word 診斷報告時，家長用手機打不開 .docx，手動上傳 20 多位學生檔案又容易放錯座號。",
    outcome: "自動建立 1～26 號座號分欄看板、呼叫 Word 轉為高畫質 A4 PDF，將「作文原稿」與「寫作診斷報告書」成對發布，手機平板免下載直接線上翻閱。",
    promptExample: "請使用 /發布作文 建立「校園中的一角」作文看板，將我資料夾裡 01～26 號的手寫 PDF 和 Word 診斷報告轉檔後發布到對應座號。",
    highlights: [
      "自動透過 Padlet API 建立指定題目與 01～26 座號分欄（Stream / Columns）。",
      "呼叫本機 Microsoft Word COM 元件無損轉檔為 A4 PDF，徹底解決手機無法預覽 Word 的困擾。",
      "內建 upload_cache.json 斷點續傳機制，網路中斷後重跑不會重複發卡片。"
    ],
    skillTemplate: `---
name: padlet-composition-publisher
description: 專為中小學教師打造的「發布作文」全自動化發布技能。自動建立 Padlet 作文分欄看板（01~26 欄位）、將 Word 作文診斷報告 (.docx) 轉為 A4 PDF 檔、批次發布學生手寫原稿 PDF 與診斷報告 PDF 至對應欄位，支援斷點續傳快取。當使用者提到「發布作文」、「上傳作文到 Padlet」或輸入 /發布作文 時觸發。
---

# 📝 發布作文 (Padlet Composition Publisher)

## 🔑 前置需求
1. 已於 \`~/.gemini/config/mcp_config.json\` 設定 \`PADLET_API_KEY=<請填入您的_PADLET_API_KEY>\`。
2. Windows 環境需安裝 Microsoft Word（供 COM 轉 PDF）與 Node.js 18+ / Python 3.10+。

## 📂 資料夾檔案命名規範
請將檔案置於教師指定資料夾（例如 \`<您的批改作文資料夾>/<題目名稱>\`）：
- 手寫作文原稿：\`01.pdf\`, \`02.pdf\` ... \`26.pdf\`
- Word 診斷報告：\`<題目名稱>01.docx\`, \`<題目名稱>02.docx\` ...

## 🚀 執行規則
1. 建立或指定目標 Padlet 看板，依座號自動建立獨立分欄（01～26）。
2. 將所有 \`.docx\` 批次轉換為正式 A4 PDF（方便手機/平板免下載直接線上翻閱）。
3. 每個座號依序發布兩張卡片：
   - 卡片 1：\`{座號}.pdf（作文原稿）\`
   - 卡片 2：\`{題目}{座號}（寫作診斷報告書）\`
4. 寫入 \`upload_cache.json\` 快取紀錄，重複執行自動跳過已完成項目。`
  },
  {
    id: "padlet-math-speaking",
    chapter: "ch4",
    category: "影音批改",
    icon: "🎓",
    name: "Padlet「說數學」影音作業多模態批改",
    triggers: ["說數學", "數學錄影", "/padlet-math-speaking"],
    painPoint: "全班 20 多支「說數學」錄影逐支看完要花上 1～2 小時，寫完評語還要一筆一筆複製貼回 Padlet。",
    outcome: "自動下載影片、產出時間軸逐字稿、嚴格把關「無聲 1 顆星重錄」與「口誤降等」，生成 HTML 互動審核表與 Word 總表，經老師確認後一鍵批次留言回填。",
    promptExample: "請幫我批改這個 Padlet 看板的「數重46（2）用分配律方式解題」欄位說數學影片，先產出審核表和 Word 總表讓我確認，不要直接留言。",
    highlights: [
      "支援 iOS .mov、Android/PC .mp4/.webm，自動對位畫面算式筆跡與口語說理。",
      "無聲/麥克風未開一律判定「⭐ 1 顆星（待加強）」；算式口誤或答案唸錯最高僅 3 顆星。",
      "雙軌備援機制：大量影片走批次 API，零星補交或 API 塞車時由 Agent 直接讀取本機影片診斷。",
      "防誤發人機共審：預設只產出本機審核表（HTML/MD/DOCX），老師核可後才回填 Padlet，且嚴禁上傳至公開雲端確保學生隱私。"
    ],
    skillTemplate: `---
name: padlet-math-speaking
description: 中小學「說數學」Padlet 錄影作業全自動多模態批改管線。下載學生影片（MP4/MOV/WebM），產出含時間軸繁體中文逐字稿與算理診斷，產出互動式 HTML 審核表與 A4 橫向 Word (.docx) 評語摘要總表，經教師核可後一鍵批次發布回饋至 Padlet。
---

# 🎓 說數學 (Talking Math) AI 自動化批改技能

## 🔑 前置設定（去敏範本）
- Padlet 金鑰：設定於 \`mcp_config.json\` 之 \`PADLET_API_KEY=<請填入您的_PADLET_API_KEY>\`
- Gemini 金鑰：設定於專案 \`.env\` 之 \`GEMINI_API_KEY=<請填入您的_GEMINI_API_KEY>\`

## 📏 核心評審規準
1. **無聲重錄紅線（⭐ 1 顆星）**：完全無聲、未開麥或聽不清楚，一律判定 1 顆星，評語為：「未錄到清楚聲音（請檢查麥克風），說數學需開口說理，請重新錄製上傳。」
2. **口語嚴謹度降等**：若出現算式讀錯、位值漏唸或答案說錯，即使觀念對，最高僅評 3 顆星並明確點出口誤處。
3. **精準 50 字回饋**：去除客套話，開頭自動標註 \`【評等：🌟🌟🌟🌟 4 顆星】\`，直指亮點與算理修正。

## 🛡️ 防誤發與隱私規範
- **先審後發**：批改完成後先產出本機 HTML 審核表與 Word 總表，待教師確認後才呼叫 Padlet \`create_comment\` 發布。
- **本機留存**：學生影片與評分報告僅存於本機指定目錄（如 \`D:\\padlet\` 與 \`D:\\說數學\`），不自動同步公開雲端。`
  },
  {
    id: "student-presentation-evaluator",
    chapter: "ch4",
    category: "影音批改",
    icon: "🎙️",
    name: "學生上台發表與口頭報告評分專家",
    triggers: ["上台發表", "口頭報告評分", "/student-presentation-evaluator"],
    painPoint: "學生上台發表評分標準容易飄移，AI 聽力又常過度降噪把「蚊子音」誤判成清楚發言。",
    outcome: "落實「現場可聽度」必要前提與天花板懲罰，依五大規準權重精算 1～10 分，產出三明治回饋、HTML 互動審核表與 A4 橫向 Word 總表。",
    promptExample: "請幫我評估這個 Padlet 上台發表看板第 1～5 區段的學生報告影片，特別注意現場音量可聽度，產出三明治回饋和六年級班級 A4 Word 總表。",
    highlights: [
      "可聽度防線：台下聽不清者，口語項只給 1～3 分並啟動總分天花板（最高 4.8 分），防止 AI 過度美化微弱收音。",
      "五大加權指標：內容結構 (30%)、口語表達 (25%)、台風互動 (20%)、簡報輔助 (15%)、即席應對 (10%)。",
      "支援 Padlet 看板、YouTube 網址或本機影片，產出「完整深入版」與「Padlet 80～120 字精簡版」。"
    ],
    skillTemplate: `---
name: student-presentation-evaluator
description: 專為中小學教師設計之「學生上台發表與口頭報告」AI 評審與診斷技能。支援 Padlet 看板、YouTube 網址或本機影片，產出精確時間軸逐字稿、捕捉肢體台風與聽眾反應，嚴格落實「現場可聽度必要前提」與五大規準加權計算 1～10 分，產出三明治回饋、HTML 審核表與 A4 橫向 Word (.docx) 總表。
---

# 🎙️ 學生上台發表評分專家 (Student Presentation Evaluator)

## 📊 五大評分規準與權重
1. **內容結構與邏輯 (30%)**：主題聚焦、具細節摹寫、結尾反思昇華。
2. **口語表達與技巧 (25%)【核心門檻】**：
   - 🚨 聲音過小台下聽不清：本項 1.0～3.0 分，且**總分強制壓制於 5.0 分以下（最高 4.8 分）**。
   - ⚠️ 音量偏小較吃力：本項 3.5～5.5 分，總分上限壓制 6.2 分。
   - ✅ 全班清晰宏亮：依語速抑揚與贅字頻率給 7.0～10.0 分。
3. **台風儀態與肢體互動 (20%)**：面向觀眾脫稿（回頭看螢幕超過 4 次即扣分）、眼神掃視與手勢。
4. **簡報設計與輔助教具 (15%)**：圖片/關鍵字為主，避免滿屏純文字。
5. **即席應對與現場感染力 (10%)**：停頓節奏與師生問答接球。

## 💬 輸出要求
- 產出三明治回饋（亮點肯定＋具體改善建議），同時提供面談深入版與 Padlet 80～120 字精簡版。
- 產出本機 HTML 互動審核表與 Word (.docx) 總表，經教師核可後才發布 Padlet 留言。`
  },
  {
    id: "padlet-video-downloader",
    chapter: "ch4",
    category: "影音批改",
    icon: "📥",
    name: "Padlet 媒體影音批次下載備份器",
    triggers: ["下載 Padlet 影片", "備份 padlet", "/padlet-video-downloader"],
    painPoint: "學期末想備份班級 Padlet 上的學生活動影片與照片，只能一張一張手動右鍵另存新檔。",
    outcome: "輸入 Padlet 看板網址或指定欄位名稱，一鍵把整板或特定分欄的影片、圖片與附件全數打包下載到本機資料夾。",
    promptExample: "請幫我把這張 Padlet 看板中「戶外教育心得」欄位裡的所有影片和照片下載到 D:\\padlet\\戶外教育 資料夾。",
    highlights: [
      "支援依欄位名稱（Section）精準過濾，或全看板一次備份。",
      "支援依媒體類型篩選（--type video / image / all），避免下載多餘檔案。"
    ],
    skillTemplate: `---
name: padlet-video-downloader
description: 從指定的 Padlet 看板或特定分欄/區段中，批次下載影片、相片與附件檔案至本機目錄。當使用者提到「下載 Padlet 影片」、「備份 Padlet」時觸發。
---

# 📥 Padlet 媒體影音批次下載器

## 🔑 前置需求
- Node.js 18+
- Padlet API Key：設定於 \`~/.gemini/config/mcp_config.json\` 或環境變數 \`PADLET_API_KEY=<請填入您的_PADLET_API_KEY>\`

## 🚀 標準作業步驟
1. 確認目標看板網址（或 Board ID）與指定欄位名稱（若未指定則下載全板）。
2. 呼叫 Padlet API 取得所有卡片與附件 URL。
3. 依指定類型（\`video\` / \`image\` / \`all\`）串流下載至本機輸出資料夾，並以座號或貼文標題命名防覆蓋。
4. 驗收檔案數量與大小，向教師回報下載清單與儲存路徑。`
  },
  {
    id: "social-4f-evaluator",
    chapter: "ch5",
    category: "社會與題庫",
    icon: "🌏",
    name: "社會課 4F 動態反思學習心得批改專家",
    triggers: ["/social-4f", "/4f-evaluator", "社會4F評分", "4F批改"],
    painPoint: "學生寫 4F 反思常常變成「抄課文」或「今天好開心、以後當好人」的空泛口號，逐篇挑出漏掉哪一個 F 非常費時。",
    outcome: "自動讀取 Padlet 或貼上文字，嚴格檢核 Facts / Feelings / Findings / Future 四維度，給出「優等/通過/需修改」與溫暖具體修改建議，並可一鍵回填 Padlet。",
    promptExample: "請用 /social-4f 批改這個 Padlet 看板「3-1 4F回饋」欄位的學生心得，產出全班檢核總表和給每位學生的修改建議。",
    highlights: [
      "嚴防空洞口號：Facts 必須含至少一個課本知識點，Future 必須是日常生活可執行的具體動作。",
      "支援 100～150 字字數檢核（容許 90～170 字），自動拆解四項檢核勾選表。",
      "產出「班級批改檢核總表」與可直接複製或回填 Padlet 的「個別溫暖評語小卡」。"
    ],
    skillTemplate: `---
name: social-4f-evaluator
description: 專為中小學社會科設計之「4F 動態反思學習心得（100～150字）」全自動 AI 批改與診斷專家。支援手動貼上或讀取 Padlet 指定欄位，嚴格檢核 Facts、Feelings、Findings、Future 四大要素，判定「優等 🌟」、「通過 ✅」或「需修改 ❌」，產出檢核總表與修訂建議並支援一鍵回填 Padlet。
---

# 🎓 社會課專用 4F 動態反思評分專家 (Social 4F Evaluator)

## 📊 4F 核心檢核門檻
1. **Facts（事實）**：必須明確包含至少一項課本核心知識點（如深偽詐騙、著作權、能源發電困境等），不可只寫「影片很好看」。
2. **Feelings（感受）**：必須「針對所提課本重點」寫出具體情緒體會（如震撼、警惕、擔憂），不可只寫「好酷、沒感覺」。
3. **Findings（反思）**：從事實與感受歸納出核心道理（如科技是雙面刃、經濟與環境須平衡）。
4. **Future（未來）**：提出日常生活「具體可行」的行動（如落實停看查、每天控制螢幕時間 30 分鐘），嚴禁「以後當好人」等空泛口號。

## 📝 輸出規範
1. **班級批改檢核總表（Markdown 表格）**：學生姓名、字數、四個 F 勾選狀態、判定等級。
2. **個別學生回饋小卡**：先肯定優點，再清楚指出缺漏的 F 與「怎麼補寫」範例。
3. 經教師確認後，呼叫 Padlet \`create_comment\` 發布回饋。`
  },
  {
    id: "hanlin-testbank-exporter",
    chapter: "ch5",
    category: "社會與題庫",
    icon: "🗂️",
    name: "翰林雲端命題大師題庫批次匯出",
    triggers: ["/hanlin-testbank-exporter", "匯出翰林題庫", "輸出題庫成 MD 檔"],
    painPoint: "備課想請 AI 協助審題、出變體練習題或分析考點，但題庫都在網頁版命題大師裡，一題一題複製貼上太慢。",
    outcome: "透過 Chrome DevTools MCP 連線教師已登入的桌面 Chrome，依指定學期、科目與課次範圍批次擷取題目，依題型自動分檔整理成 Markdown 審題資料庫。",
    promptExample: "我已在 Chrome 登入翰林雲端命題大師，請用 /hanlin-testbank-exporter 幫我把六年級上學期社會科第 3 單元的題庫依題型匯出成 Markdown 資料庫。",
    highlights: [
      "安全人機協作：由教師在 Chrome 自行輸入帳號密碼登入，AI 不經手也不儲存教師帳密。",
      "透過 chrome-devtools MCP 直接與已開啟的瀏覽器分頁溝通，動態讀取課次與題數。",
      "自動依 itemId 去重並按題型（選擇題、是非題、題組等）分檔輸出，附帶「00_題庫總覽.md」。"
    ],
    skillTemplate: `---
name: hanlin-testbank-exporter
description: 透過 Chrome DevTools MCP 連線桌面 Chrome，從「翰林雲端命題大師」批次擷取指定年級、科目與考試範圍的題庫題目，依題型分檔輸出為 Markdown (.md) 審題參考資料庫。當使用者提到「匯出翰林題庫」、「下載命題大師題庫」或輸入 /hanlin-testbank-exporter 時觸發。
---

# 🗂️ 翰林雲端命題大師題庫匯出技能

## 🔑 前置條件
1. 於 \`mcp_config.json\` 啟用 \`chrome-devtools-mcp@latest --autoConnect\`。
2. 教師於桌面 Chrome 開啟 \`chrome://inspect/#remote-debugging\` 勾選允許偵錯，並**由教師本人手動登入**命題大師（AI 絕不保存帳號密碼）。

## 🚀 標準作業流程
1. 確認瀏覽器已登入並進入選題頁面，依教師指定學制、科目與「手動命題」模式前進。
2. 在範圍選擇頁展開冊次與單元題數清單，**向教師確認實際要匯出的課次範圍**。
3. 透過頁面會話 API 分頁擷取題目資料（不寫死任何帳號資訊）。
4. 呼叫後處理腳本去重並依題型分檔輸出成 \`.md\` 審題資料庫與 \`00_題庫總覽.md\`。`
  },
  {
    id: "claude-gemini-eduweb",
    chapter: "ch6",
    category: "互動教具",
    icon: "🧪",
    name: "雙模型教具網站工坊（互動教材開發）",
    triggers: ["/eduweb", "/claude-gemini-eduweb", "教具網站", "製作教具", "互動教材"],
    painPoint: "想在電子白板或平板上帶學生操作分數切割、時鐘角度或打地鼠練習，但找不到完全符合單元需求的現成教具。",
    outcome: "輸入一句教學需求，自動生成單一 HTML5 互動教具檔案（含合成音效、大按鈕觸控防誤觸設計），並啟動本機預覽伺服器完成除錯，隨身碟帶著走。",
    promptExample: "請用 /eduweb 幫我做一個「國小三年級圓形分數切片比較」的互動教具網站，要適合 iPad 觸控和教室大屏操作，並且有答對音效。",
    highlights: [
      "單一檔案零依賴（HTML5 + CSS + Web Audio API 合成音效），無網路教室也能雙擊打開。",
      "觸控與大屏優先：互動熱區 >= 48px，高對比色彩、隨機出題與一鍵重置按鈕。",
      "支援雙模型協作與自動降級備援，確保產出流暢不中斷。"
    ],
    skillTemplate: `---
name: claude-gemini-eduweb
description: 專為中小學教師打造的互動教具網站工坊。產出符合教育認知心理、觸控與教室電子白板友善的單一 HTML5/JS 互動教具，支援本機伺服器即時預覽、沙盒測試與視覺除錯。當使用者提到「教具網站」、「製作教具」、「互動教材」或輸入 /eduweb 時觸發。
---

# 🎓 互動教具網站工坊 (EduWeb Workshop)

## 🔑 環境金鑰設定（選備/去敏）
- \`GEMINI_API_KEY=<請填入您的_GEMINI_API_KEY>\`（本機腳本呼叫用；若直接在 Antigravity 對話開發則不需額外設定）
- \`ANTHROPIC_API_KEY=<選填_CLAUDE_API_KEY>\`（無金鑰或額度用盡時自動由 Gemini 接手）

## 📋 教具設計黃金規範
1. **純單一檔案（Single-File HTML）**：整合 HTML5 + CSS + 原生 JavaScript + Web Audio API（免外部音檔），方便隨身碟離線帶到教室開啟，也可一鍵部署至 Netlify / Vercel。
2. **觸控與教室大屏友善**：所有點擊按鈕熱區 \`>= 48px\`，文字清晰高對比。
3. **教育互動要素**：頂端明確標註年級與學習目標、提供「引導說明小精靈」、「重新出題 / 重置」按鈕，以及溫和的正向音效回饋。`
  },
  {
    id: "guidance-record-assistant",
    chapter: "ch7",
    category: "導師行政",
    icon: "📋",
    name: "導師輔導紀錄隨筆撰寫與試算表登記",
    triggers: ["/guidance-record-assistant", "寫輔導紀錄", "輔導紀錄", "親師溝通紀錄"],
    painPoint: "下課處理完突發事件或剛通完家長電話，常沒時間整理成客觀專業的文字；等到期末要登錄輔導系統時早已忘記細節。",
    outcome: "把老師口語隨筆轉化為客觀、中立、符合教育專業倫理的 11 欄位正式輔導歷程，並自動追加進本機/雲端「輔導紀錄匯入」Excel 試算表。",
    promptExample: "幫我用 /guidance-record-assistant 記一筆輔導紀錄：今天 19 號下課因為分組意見不合跟同學吵架，我先帶他冷靜並聯絡家長了解近況，請轉成正式紀錄寫進 Excel。",
    highlights: [
      "去除主觀情緒批判（例如將「死不承認」轉化為「因認知不同產生爭執，陳述其個人觀點」）。",
      "自動將西元 8 碼日期（20261119）與民國日期（115/11/19）對齊，座號自動補零防錯植。",
      "支援 `--dry-run` 模擬檢查與防鎖定保護，與「臺南市輔導系統同步技能」無縫接軌。"
    ],
    skillTemplate: `---
name: guidance-record-assistant
description: 國小與國中導師輔導紀錄隨筆撰寫與 Excel 試算表自動登記助手。將教師口語隨筆、事件、親師對話轉化為客觀且符合教育專業倫理的正式輔導歷程，自動追加至「輔導紀錄匯入」Excel (.xls) 試算表，並可銜接線上輔導系統同步。
---

# 📋 導師輔導紀錄隨筆撰寫助手 (Guidance Record Assistant)

## ✍️ 專業客觀撰寫三大原則
1. **客觀事實優先**：記錄可觀察行為與當事人陳述，避免「惡意、說謊、故意」等貼標籤詞彙。
2. **呈現專業介入**：寫明教師採取的輔導措施（情緒同理、事件澄清、行為約定、正向支持）。
3. **後續追蹤與親師合作**：載明後續觀察重點與親師聯繫共識。

## 📂 檔案與隱私設定（請依個人環境修改）
- 本機試算表路徑：\`<您的雲端硬碟本機資料夾>\\輔導紀錄匯入.xls\`
- 班級與名冊對照：由教師自行建立於本機安全目錄，**切勿將學生個資或試算表連結上傳至公開網路**。

## 🚀 作業流程
1. 教師輸入隨筆（座號、日期、對象、事件經過）。
2. AI 核對座號與姓名（避免誤植），產出 100～250 字客觀歷程。
3. 確認後追加寫入 Excel 下一空白列，並詢問是否立即同步至線上輔導系統。`
  },
  {
    id: "tn-guidance-sync",
    chapter: "ch7",
    category: "導師行政",
    icon: "🏫",
    name: "臺南市國小輔導系統智慧比對與線上同步",
    triggers: ["/tn-guidance-sync", "上傳輔導系統", "同步輔導紀錄", "臺南市輔導系統"],
    painPoint: "寫好在 Excel 的輔導紀錄，還是得打開校務/輔導系統一筆一筆複製貼上，還怕重複登錄或日期寫錯西元/民國格式。",
    outcome: "讀取 Excel 待同步紀錄，由教師本人完成 OpenID 與驗證碼登入後，AI 自動連線系統比對「座號＋日期＋對象」過濾已存在紀錄，逐筆安全填入並確認「資料已儲存!」。",
    promptExample: "我已經準備好輔導紀錄 Excel，請用 /tn-guidance-sync 檢查待同步的紀錄，帶我登入臺南市輔導系統並協助安全防重複補登。",
    highlights: [
      "嚴守資安鐵律：絕不破解或繞過圖形驗證碼，由教師親自在 Chrome 完成 OpenID 登入後再交棒給 AI。",
      "智慧防重複機制：比對線上既有清單之「民國日期＋晤談對象」，已入庫者自動跳過。",
      "確認每一筆跳出「資料已儲存!」視窗才換下一筆，網路中斷也能安全續跑。"
    ],
    skillTemplate: `---
name: tn-guidance-system-sync
description: 臺南市國小輔導系統（https://assist.tn.edu.tw）線上登記與自動同步技能（與 guidance-record-assistant 整合）。自動讀取本機「輔導紀錄匯入」Excel，將西元轉為民國日期（YYY/MM/DD），於教師手動完成 OpenID 與驗證碼登入後，自動比對防重複並逐筆安全填報至學生輔導卡。
---

# 🏫 臺南市國小輔導系統 - 線上同步技能

## 🛡️ 資安與人機協作鐵律
- **絕不儲存密碼、絕不破解驗證碼**：官方系統設有 OpenID 與圖形驗證碼（CAPTCHA），必須由教師本人於 Chrome 視窗親手登入，AI 絕不繞過或讀取帳密。
- **人機協作交棒**：
  1. AI 引導開啟 Chrome（遠端偵錯埠 9222）前往 \`https://assist.tn.edu.tw\`。
  2. 教師手動完成 OpenID 與驗證碼登入後，在對話框回覆「已登入」。
  3. AI 進入「導師維護輔導卡」，先核對學生座號與姓名，再依「民國日期＋晤談對象」過濾重複紀錄，僅補登尚未入庫之項目。
  4. 每筆送出皆須確認出現 \`"資料已儲存!"\` 提示方算完成。`
  },
  {
    id: "skills-backup",
    chapter: "ch9",
    category: "系統與分享",
    icon: "🛡️",
    name: "技能庫全自動雙向備份與分享打包",
    triggers: ["/skills-backup", "備份技能", "打包技能", "備份到 GitHub"],
    painPoint: "花了好多心血調教好的教學技能，換新電腦、重灌系統，或是想打包整套送給校內同事時，不知道怎麼完整複製過去。",
    outcome: "一鍵將個人技能資料夾同步備份至個人 GitHub 私有儲存庫與 Google Drive 壓縮包，換電腦或分享同事時秒級還原。",
    promptExample: "我剛修改好新的教學技能，請用 /skills-backup 幫我執行完整備份並打包成 ZIP。",
    highlights: [
      "雙軌保險：GitHub 保留每次修改的版本歷史（Git），Google Drive 保留一鍵解壓 ZIP。",
      "團隊分享安全提醒：公開或跨校分享前，務必排除 .env、mcp_config.json 等含 API Key 的設定檔。"
    ],
    skillTemplate: `---
name: skills-backup
description: 專為 Antigravity 設計的技能雙向備份系統（GitHub + Google Drive）。支援一鍵將自訂技能代碼與 SKILL.md 打包備份，並提供換機還原與團隊複製指南。當使用者提到「備份技能」、「打包技能」或輸入 /skills-backup 時觸發。
---

# 🛡️ 技能全自動雙向備份系統 (Skills Dual-Backup System)

## 📂 備份設定（請填入個人帳號資訊）
- **GitHub 儲存庫**：\`https://github.com/<您的GitHub帳號>/antigravity-skills\`（建議設為 Private 私有庫）
- **Google Drive 目標資料夾**：\`<您的雲端硬碟備份資料夾ID>\`
- **備份來源目錄**：\`%USERPROFILE%\\.gemini\\config\\skills\\\`

## ⚠️ 安全打包檢查清單（分享給同事前必看）
1. **切勿打包個人金鑰**：備份與分享時應只包含 \`skills/\` 資料夾內的 \`SKILL.md\` 與通用腳本，不可夾帶 \`mcp_config.json\` 或 \`.env\`（內含真實 API Key）。
2. **同事還原步驟**：將收到的技能資料夾放入 \`%USERPROFILE%\\.gemini\\config\\skills\\\`，重開 Antigravity 即可於斜線指令選單中看到所有新技能！`
  }
];
