window.MEDICAL_LIBRARY={
  "updated": "2026-10-20T12:28:44+08:00",
  "books": [
    {
      "id": "welcome",
      "title": "書房使用指南",
      "subtitle": "A PLACE TO BEGIN",
      "category": "使用指南",
      "color": "#355a4b",
      "tags": [
        "入門",
        "操作",
        "書架"
      ],
      "sections": [
        {
          "id": "start",
          "title": "歡迎來到醫學加油站",
          "html": "<p>這是 Eric Yang 的個人醫學學習書房。點選首頁書籍可進入閱讀分頁，並使用章節目錄快速跳轉。</p><p>使用指南集中於右上角入口，不列入學習書架。</p>"
        },
        {
          "id": "read",
          "title": "像逛圖書館一樣學習",
          "html": "<ol><li>在首頁點選書籍，開啟該書的專屬閱讀分頁。</li><li>透過搜尋欄搜尋書名、分類或關鍵字。</li><li>在閱讀頁使用目錄快速跳轉，或點選「返回學習書架」。</li></ol>"
        },
        {
          "id": "link",
          "title": "把進度留在這一頁",
          "html": "<p>每一本書都有獨立網址，可以加入瀏覽器書籤。重新整理頁面仍會回到同一本書；瀏覽器的上一頁也能回到書架。</p>"
        }
      ]
    },
    {
      "id": "add-material",
      "title": "新教材上架",
      "subtitle": "FROM FILE TO BOOK",
      "category": "使用指南",
      "color": "#ae8057",
      "tags": [
        "上傳",
        "檔案",
        "教材",
        "新增"
      ],
      "sections": [
        {
          "id": "upload",
          "title": "從一份教材，開始一本書",
          "html": "<p>在 ChatGPT 對話中上傳 PDF、簡報、圖片或筆記，並告訴我：「請整理成醫學加油站的新分頁，並更新 GitHub。」網站本身沒有檔案上傳或自動 AI 整理功能。</p>"
        },
        {
          "id": "organize",
          "title": "告訴我你想怎麼讀",
          "html": "<p>可以指定書名、科別與整理形式，例如重點摘要、比較表、臨床推理步驟，或保留原圖。整理完成後，會新增一張書籍封面與對應的閱讀分頁。</p><p>目前書架與分類皆為空白，日後依上傳教材再新增。</p>"
        },
        {
          "id": "publish",
          "title": "上架後，隨時回來翻閱",
          "html": "<p>整理後的內容會隨網站程式碼保存到 GitHub。啟用 GitHub Pages 後，每次更新主分支，GitHub 會重新發布網站；部署完成後重新整理即可看到新版。</p>"
        }
      ]
    },
    {
      "id": "learning-notes",
      "title": "學習筆記提案",
      "subtitle": "MAKE KNOWLEDGE YOURS",
      "category": "使用指南",
      "color": "#77816a",
      "tags": [
        "筆記",
        "整理",
        "閱讀",
        "模板"
      ],
      "sections": [
        {
          "id": "question",
          "title": "先留下一個問題",
          "html": "<p>開始閱讀前，寫下這次最想回答的問題。讓每份教材都對應一個明確的學習目標。</p>"
        },
        {
          "id": "structure",
          "title": "讓筆記有一致的結構",
          "html": "<ul><li>核心概念：用自己的話說明主題。</li><li>重點整理：保留關鍵定義、比較與流程。</li><li>臨床連結：記錄與問診、檢查或臨床推理的關係。</li><li>待查問題：留下尚未釐清的疑問。</li><li>資料來源：記錄教材名稱、版本與日期。</li></ul>"
        },
        {
          "id": "review",
          "title": "讀完，再回頭看一次",
          "html": "<p>用三句話整理本次收穫，並檢查是否回答了最初的問題。下次回到書架時，就能快速找回這次學習的脈絡。</p>"
        }
      ]
    },
    {
      "id": "lab-interpretation",
      "title": "實驗數據判讀",
      "subtitle": "LAB DATA INTERPRETATION",
      "category": "臨床判讀",
      "color": "#355a4b",
      "tags": [
        "實驗數據",
        "檢驗",
        "血液",
        "CBC",
        "肝功能",
        "腎功能",
        "電解質",
        "血氣",
        "尿液",
        "lab"
      ],
      "sections": [
        {
          "id": "overview",
          "title": "閱讀前：先看病人，再看數字",
          "html": "<p class=\"source-note\">原手冊 pp. 1–2</p><p>依黃品叡醫師《常用實驗數據判讀手冊》2026 年版整理，原檔更新日期為 2026/08/19。本頁是重點摘要，不是原文逐字轉載；以判讀邏輯、常見陷阱與公式為主。</p><ol><li><strong>比對基準與趨勢：</strong>新發異常、慢性偏離與快速變化的意義不同。</li><li><strong>核對症狀與檢體：</strong>生命徵象、藥物、輸液污染、溶血與採檢時間都會影響判讀。</li><li><strong>確認單位與院內區間：</strong>下列區間是手冊中的常見參考，不是所有儀器共用的診斷線。</li><li><strong>區分診斷與處置：</strong>警戒值提示進一步評估，不能只依單一數字給藥或輸血。</li></ol><div class=\"clinical-note\">本頁供學習複習。藥物劑量、輸注速度與處置門檻須依病況、院內流程及最新指引確認。標示「校核補充」的段落，表示對原手冊文字做了限縮或更新。</div>"
        },
        {
          "id": "cbc",
          "title": "01 血液常規與白血球分類",
          "html": "<p class=\"source-note\">原手冊 pp. 3–4</p><div class=\"table-wrap\" tabindex=\"0\"><table class=\"cbc-table\"><thead><tr><th>項目</th><th>常見區間</th><th>判讀方向</th><th>重點提醒</th></tr></thead><tbody><tr><td>WBC</td><td>4,000–10,000 /µL</td><td>升高：感染、壓力、類固醇、抽菸、脫水；降低：藥物、病毒、骨髓或免疫問題。</td><td>同看 differential count 與絕對數；極高值或 blast 應評估血液疾病。</td></tr><tr><td>ANC</td><td>1,500–8,000 /µL</td><td>1,000–1,500 輕度；500–1,000 中度；&lt;500 重度；&lt;100 極重度。</td><td>ANC = WBC × (Seg% + Band%) ÷ 100。WBC 2,000、Seg 30%、Band 5% → ANC 700 /µL。</td></tr><tr><td>Seg／Band</td><td>Seg：40–75%<br>Band：0–5%</td><td>中性球增加與左移可見於感染或壓力。</td><td>百分比受其他細胞數影響，不能取代 ANC。</td></tr><tr><td>Hb</td><td>男：13.5–17.5 g/dL<br>女：12.0–15.5 g/dL</td><td>貧血先看 MCV、reticulocyte、出血與溶血線索。</td><td>輸血須考慮循環、症狀、失血及共病。穩定成人常採 Hb &lt;7 g/dL 的限制性策略；心血管情境另議。</td></tr><tr><td>PLT</td><td>150–400 ×10³/µL</td><td>升高先找感染、缺鐵、術後或慢性發炎；降低需查藥物、消耗、骨髓與脾臟因素。</td><td>手冊列化療／異體移植無出血 &lt;10k、大型非神經軸手術 &lt;50k、腰椎穿刺 &lt;20k 等輸注情境；不可當成所有病人的通則。</td></tr><tr><td>NLR／PLR</td><td>NLR：約 1–3<br>PLR：原手冊未列正常區間</td><td>NLR = ANC ÷ 絕對淋巴球數；PLR = 血小板數 ÷ 絕對淋巴球數。</td><td>僅為輔助發炎訊號，受壓力與類固醇影響，無法單獨診斷感染。</td></tr></tbody></table></div><div class=\"clinical-note\"><strong>校核補充：</strong>WBC &lt;1,000 並不直接等於發燒性嗜中性球低下（FN）。應看 ANC；癌症相關常用定義為 ANC &lt;500 /µL，或預期 48 小時內降至此值，合併單次口溫 ≥38.3°C，或 ≥38.0°C 持續一小時。疑似 FN 需緊急評估與及時經驗性抗感染治療。見頁末校核來源 C1。</div>"
        },
        {
          "id": "liver",
          "title": "02 肝膽功能",
          "html": "<p class=\"source-note\">原手冊 pp. 5</p><p><strong>先分損傷與功能：</strong>AST、ALT、ALP 主要反映損傷型態；bilirubin 反映排泄，albumin 與 INR 可協助評估合成能力，但也有非肝臟干擾因素。</p><div class=\"table-wrap\" tabindex=\"0\"><table><thead><tr><th>項目</th><th>判讀重點</th></tr></thead><tbody><tr><td>AST／ALT</td><td>AST 也來自肌肉與紅血球。AST/ALT &gt;2 可支持酒精相關肝病，但不是確診；極高轉氨酶需考慮缺血、藥物毒性、急性病毒或自體免疫肝炎。</td></tr><tr><td>ALP + GGT</td><td>兩者一起升高支持肝膽來源；ALP 高但 GGT 不高時考慮骨來源。</td></tr><tr><td>Total／Direct bilirubin</td><td>Total 常見區間 0.2–1.2 mg/dL。直接型為主考慮肝細胞排泄或膽道問題；間接型為主考慮溶血、Gilbert syndrome 或血腫吸收。</td></tr><tr><td>Albumin：3.5–5.0 g/dL</td><td>降低可見於發炎、合成不足、營養問題或流失；不能單獨當營養指標。影響總鈣、anion gap 與藥物游離濃度。</td></tr><tr><td>Ammonia</td><td>肝腦病變以臨床評估為主，數值不與嚴重度一一對應，也不適合單獨追蹤治療效果。</td></tr></tbody></table></div>"
        },
        {
          "id": "renal",
          "title": "03 腎功能與 AKI",
          "html": "<p class=\"source-note\">原手冊 pp. 6</p><p>Creatinine 需與既往值及尿量一起看；肌肉量少者即使 creatinine 落在參考範圍，也可能已有腎功能下降。</p><div class=\"table-wrap\" tabindex=\"0\"><table><thead><tr><th>AKI 定義：任一符合</th><th>門檻</th></tr></thead><tbody><tr><td>Creatinine 短期變化</td><td>48 小時內增加 ≥0.3 mg/dL</td></tr><tr><td>相對基準變化</td><td>7 天內達基準值 ≥1.5 倍</td></tr><tr><td>尿量</td><td>&lt;0.5 mL/kg/h，持續 ≥6 小時</td></tr></tbody></table></div><div class=\"table-wrap\" tabindex=\"0\"><table><thead><tr><th>分期</th><th>Creatinine／替代治療</th><th>尿量條件</th></tr></thead><tbody><tr><td>1</td><td>1.5–1.9 倍基準或增加 ≥0.3 mg/dL</td><td>&lt;0.5 mL/kg/h，6–12 小時</td></tr><tr><td>2</td><td>2.0–2.9 倍基準</td><td>&lt;0.5 mL/kg/h，≥12 小時</td></tr><tr><td>3</td><td>≥3 倍基準、增加至 ≥4.0 mg/dL，或開始腎臟替代治療</td><td>&lt;0.3 mL/kg/h ≥24 小時，或無尿 ≥12 小時</td></tr></tbody></table></div><ul><li><strong>Pre-renal：</strong>脫水、出血或有效循環不足；BUN/Cr &gt;20 可支持，但消化道出血、類固醇等也會升高。</li><li><strong>Intrinsic renal：</strong>ATN、AIN、GN、毒物、橫紋肌溶解等，搭配尿液與臨床情境。</li><li><strong>Post-renal：</strong>檢查導尿管通暢、尿滯留與阻塞；依需要做 bladder scan、腎臟超音波。</li><li><strong>CKD：</strong>eGFR 與白蛋白尿分級一起評估，須確認慢性持續性，不能靠一次 eGFR 判定。</li></ul><div class=\"clinical-note\">FENa &lt;1%、FEUrea &lt;35% 僅支持低灌流等可能，並非絕對分界；利尿劑、敗血症、CKD 等會干擾。手冊引用的 KDIGO 2026 AKI/AKD 為草案，本頁不把草案新增項目當成正式準則。</div>"
        },
        {
          "id": "infection",
          "title": "04 發炎與感染指標",
          "html": "<p class=\"source-note\">原手冊 pp. 7</p><div class=\"table-wrap\" tabindex=\"0\"><table><thead><tr><th>指標</th><th>判讀</th><th>常見陷阱</th></tr></thead><tbody><tr><td>CRP：&lt;0.5 mg/dL（&lt;5 mg/L）</td><td>反映發炎；趨勢通常比單點更有用。</td><td>手術、創傷、自體免疫與腫瘤都會升高。</td></tr><tr><td>PCT</td><td>高值可支持細菌感染；在適當情境可輔助評估停藥。</td><td>低值不能排除早期或局部感染；不能單獨決定不開始抗生素。腎功能不全、大手術、燒傷可干擾。</td></tr><tr><td>Lactate：0.5–2.0 mmol/L</td><td>升高應評估灌流、代謝與清除；需結合趨勢。</td><td>腎上腺素、β₂ agonist、癲癇後、肝功能異常等可升高。懷疑檢體問題可複驗，但不延誤處理不穩定病人。</td></tr></tbody></table></div><p><strong>Septic shock：</strong>在感染／敗血症情境，充分容量復甦後仍需升壓藥維持 MAP ≥65 mmHg，且 lactate &gt;2 mmol/L。單一乳酸升高不等於 septic shock。</p>"
        },
        {
          "id": "cardiac",
          "title": "05 心臟指標與 D-dimer",
          "html": "<p class=\"source-note\">原手冊 pp. 8–9</p><div class=\"table-wrap\" tabindex=\"0\"><table><thead><tr><th>項目</th><th>判讀方式</th></tr></thead><tbody><tr><td>hs-cTn</td><td>先確認試劑、單位與第 99 百分位上限。1 ng/mL = 1,000 ng/L；不同品牌不可共用切點。依院內驗證流程使用 0/1 h 或 0/2 h 序列。</td></tr><tr><td>心肌損傷 vs 心肌梗塞</td><td>Troponin 升高代表心肌損傷；急性上升／下降還需結合缺血症狀、ECG 或影像證據才能判定 MI。CKD、心衰、心肌炎、敗血症等亦可升高。</td></tr><tr><td>BNP／NT-proBNP</td><td>急性呼吸困難時 BNP &lt;100、NT-proBNP &lt;300 pg/mL 有助降低急性心衰可能；高值須結合影像與臨床，不可單憑數字確診。</td></tr><tr><td>NT-proBNP 年齡切點</td><td>手冊列急性情境支持心衰的切點：&lt;50 歲 &gt;450；50–75 歲 &gt;900；&gt;75 歲 &gt;1,800 pg/mL。腎功能、AF、高齡使值偏高；肥胖可使值偏低。</td></tr><tr><td>CK／CK-MB</td><td>CK 不具心臟專一性；明顯升高、肌肉症狀與茶色尿時考慮橫紋肌溶解。ACS 判讀以 hs-cTn 為主。</td></tr><tr><td>D-dimer</td><td>先做臨床機率評估。低／中度機率時陰性可協助排除 VTE；陽性不等於 PE/DVT。&gt;50 歲可依驗證流程使用年齡 ×10 µg/L FEU，勿混用 DDU。</td></tr></tbody></table></div>"
        },
        {
          "id": "sodium",
          "title": "06A 鈉：先分滲透壓與容量",
          "html": "<p class=\"source-note\">原手冊 pp. 10</p><p>常見區間：Na 135–145 mmol/L。<strong>低血鈉依序看 serum osmolality → volume status → urine osmolality 與 urine Na。</strong></p><div class=\"table-wrap\" tabindex=\"0\"><table><thead><tr><th>異常</th><th>原因與判讀</th><th>處理原則</th></tr></thead><tbody><tr><td>高血鈉</td><td>自由水不足、無法飲水、DI、滲透性利尿、腸胃流失或鈉負荷。</td><td>評估循環後補充適當液體；用自由水缺乏公式作估計，納入持續流失並反覆追蹤。</td></tr><tr><td>低血鈉</td><td>先辨別低張性、高血糖相關高張性及假性低血鈉；考慮 SIADH、thiazide、心衰、肝硬化、腎上腺問題。</td><td>依病因處理；限水不是所有低血鈉的通用治療，低血容量者需評估補充容量。</td></tr><tr><td>嚴重症狀</td><td>抽搐、明顯意識變化等提示緊急處理。</td><td>依急救流程使用高張鹽水並密集追蹤；初期以症狀改善及有限升鈉為目標。</td></tr></tbody></table></div><div class=\"clinical-note\">手冊列一般低血鈉矯正上限 ≤10 mmol/L/24 h，高 ODS 風險者 ≤8 mmol/L/24 h；這是上限而非必須達成的目標。酒癮、營養不良、低血鉀、嚴重肝病與極低初始 Na 應特別保守。高血鈉速率也須依急慢性與病況決定，不能把固定速率套用所有人。</div>"
        },
        {
          "id": "potassium",
          "title": "06B 鉀：先看 ECG，再辨別機轉",
          "html": "<p class=\"source-note\">原手冊 pp. 10–11</p><p>常見區間：K 3.5–5.0 mmol/L。血鉀是細胞外濃度，不等於體內總鉀量。</p><div class=\"table-wrap\" tabindex=\"0\"><table><thead><tr><th>高血鉀</th><th>低血鉀</th></tr></thead><tbody><tr><td>先排除溶血等假性升高；不穩定或有 ECG 變化時，不等待重抽才處理。</td><td>先分腸胃流失、腎流失與細胞內移動。</td></tr><tr><td>原因：腎排泄下降、RAASi/MRA、鉀補充、細胞破壞或酸鹼異常。</td><td>原因：嘔吐、腹瀉、利尿劑、醛固酮過多、RTA、insulin、β₂ agonist。</td></tr><tr><td>三個方向：鈣劑穩定心肌、促鉀移入細胞、將鉀排出體外。鈣劑本身不降鉀。</td><td>能口服時通常優先口服；嚴重低鉀、心律不整或無法口服者考慮靜脈補充與監測。</td></tr><tr><td>Insulin 治療後需持續監測低血糖；鉀結合劑不能取代急救。</td><td>補鉀不升時查 Mg；低鎂會持續造成腎臟漏鉀。</td></tr></tbody></table></div><div class=\"clinical-note\">ECG 正常不能排除危險高血鉀。補鉀量不能由血鉀下降幅度直接精算；依腎功能、尿量、持續流失與序列檢驗調整。靜脈鉀不可直接推注。</div>"
        },
        {
          "id": "calcium",
          "title": "06C 鈣、鎂、磷",
          "html": "<p class=\"source-note\">原手冊 pp. 11–12</p><div class=\"table-wrap\" tabindex=\"0\"><table><thead><tr><th>項目／區間</th><th>異常重點</th><th>一起看</th></tr></thead><tbody><tr><td>總 Ca 8.5–10.5 mg/dL；iCa 1.1–1.35 mmol/L</td><td>高鈣：副甲狀腺亢進、惡性腫瘤、Vit D、藥物。低鈣：低 Mg、PTH/Vit D 異常、輸血 citrate 等。</td><td>重症或低白蛋白時優先看 iCa；校正總鈣公式可能不準。</td></tr><tr><td>Mg 1.7–2.4 mg/dL</td><td>低 Mg 可造成難治低 K、低 Ca、QT 延長與心律不整；高 Mg 常與腎功能不全及補充過量有關。</td><td>腎功能、鉀、鈣、ECG；高鎂可出現深部肌腱反射下降。</td></tr><tr><td>P 2.5–4.5 mg/dL</td><td>&lt;1.0 mg/dL 可造成呼吸肌無力、溶血與心肌功能下降；高磷見於 CKD、TLS、橫紋肌溶解。</td><td>注意 refeeding、DKA 治療、酒精使用與腎功能。</td></tr></tbody></table></div><p>高鈣的容量補充須依心腎功能調整；低鈣有抽搐、心律或 QT 異常時需緊急評估。補鈣／補鎂／補磷依院內規範與反覆檢驗調整。</p>"
        },
        {
          "id": "coagulation",
          "title": "07 凝血功能",
          "html": "<p class=\"source-note\">原手冊 pp. 13</p><div class=\"table-wrap\" tabindex=\"0\"><table><thead><tr><th>檢查</th><th>判讀</th></tr></thead><tbody><tr><td>PT／INR（約 0.8–1.2）</td><td>外在與共同凝血途徑。肝病、維生素 K、warfarin 等影響數值；不要為了把數字變正常就例行輸 FFP。</td></tr><tr><td>aPTT（約 25–35 秒）</td><td>內在與共同途徑。延長可能是 heparin、凝血因子缺乏或抑制物；lupus anticoagulant、factor XII 缺乏不一定造成出血。</td></tr><tr><td>Fibrinogen（200–400 mg/dL）</td><td>低值見於消耗、出血或合成不足；也是急性期蛋白，敗血症相關 DIC 早期未必降低。</td></tr><tr><td>DIC</td><td>在合適的基礎疾病背景下，整合 PLT、PT、D-dimer／纖維蛋白分解指標與 fibrinogen；ISTH overt DIC score ≥5 支持診斷，並追蹤動態。</td></tr></tbody></table></div><p>處置前同時評估實際出血、血小板、藥物與處置風險；不同情境不能共用單一 INR 或 fibrinogen 門檻。</p>"
        },
        {
          "id": "endocrine",
          "title": "08 血糖與內分泌",
          "html": "<p class=\"source-note\">原手冊 pp. 14</p><div class=\"table-wrap\" tabindex=\"0\"><table><thead><tr><th>檢查</th><th>學習重點</th></tr></thead><tbody><tr><td>Glucose</td><td>&lt;70 mg/dL 為低血糖警戒；&lt;54 mg/dL 為臨床顯著低血糖。急性期需留意攝食、腎功能、insulin 與其他降糖藥。</td></tr><tr><td>HbA1c</td><td>≥6.5% 為糖尿病診斷標準之一，依症狀與其他檢驗決定是否需重複確認。溶血、近期輸血、部分貧血、CKD 與血紅素變異會影響可信度。</td></tr><tr><td>TSH／Free T4</td><td>重症可能有 nonthyroidal illness syndrome；依懷疑的病因選擇檢查，不把急性期異常直接當成原發甲狀腺病。</td></tr><tr><td>Cortisol</td><td>需看採血時間、檢驗方法、類固醇使用與臨床情境；必要時用 ACTH stimulation test。原手冊隨機值切點不可當所有患者通用的排除標準。</td></tr></tbody></table></div><div class=\"clinical-note\"><strong>校核補充：</strong>ADA 2026 區分多數重症患者目標 140–180 mg/dL；非重症住院患者在不造成顯著低血糖下，目標 100–180 mg/dL。原手冊將一般住院一律列 140–180，於此補充分層。見 C2。</div>"
        },
        {
          "id": "pancreas",
          "title": "09 胰臟酵素與其他生化",
          "html": "<p class=\"source-note\">原手冊 pp. 15</p><p><strong>急性胰臟炎三取二：</strong>典型腹痛、lipase/amylase &gt;3 倍正常上限、相符影像。Lipase 較具胰臟專一性，但仍有非胰臟炎的升高原因。</p><ul><li>酵素高度不等於嚴重度，也不宜只以數字下降評估病情。</li><li>尿酸需結合腎功能、藥物與代謝背景；尿酸結石與低尿液 pH 有關，不能只關注血尿酸。</li><li><strong>TLS 組合：</strong>尿酸↑、K↑、P↑、Ca↓，可能合併 AKI。</li><li><strong>橫紋肌溶解：</strong>CK 升高、肌肉症狀、深色尿；同時追蹤腎功能與電解質。</li></ul>"
        },
        {
          "id": "abg",
          "title": "10 血液氣體與酸鹼判讀",
          "html": "<p class=\"source-note\">原手冊 pp. 16</p><p>常見參考：pH 7.35–7.45、PaCO₂ 35–45 mmHg、HCO₃⁻ 22–26 mmol/L。PaO₂ 還需依年齡、FiO₂ 與海拔判讀。</p><div class=\"table-wrap\" tabindex=\"0\"><table><thead><tr><th>步驟</th><th>如何思考</th></tr></thead><tbody><tr><td>1 看 pH</td><td>&lt;7.35 acidemia；&gt;7.45 alkalemia。正常 pH 不代表沒有混合障礙。</td></tr><tr><td>2 找主要變化</td><td>PaCO₂ 是呼吸性方向，HCO₃⁻ 是代謝性方向；再看是否符合 pH 的變化。</td></tr><tr><td>3 算預期代償</td><td>代謝性酸中毒：預期 PaCO₂ = 1.5 × HCO₃⁻ + 8 ±2。實測更高提示合併呼吸性酸中毒；更低提示合併呼吸性鹼中毒。</td></tr><tr><td>4 看 AG 與混合障礙</td><td>AG = Na − (Cl + HCO₃⁻)；低白蛋白須校正。AG 增高後再比較 ΔAG 與 HCO₃⁻ 下降量。</td></tr></tbody></table></div><p><strong>High AG：GOLD MARK</strong> — Glycols、Oxoproline、L-lactate、D-lactate、Methanol、Aspirin、Renal failure、Ketoacidosis。</p><div class=\"clinical-note\">Winter 公式只用於代謝性酸中毒。Delta ratio = (AG − 正常 AG) ÷ (24 − HCO₃⁻)，只在適當情境下使用；低比值提示併正常 AG 酸中毒，高比值提示併代謝性鹼中毒等可能，不能機械式套用。</div>"
        },
        {
          "id": "urine",
          "title": "11 尿液分析",
          "html": "<p class=\"source-note\">原手冊 pp. 17</p><div class=\"table-wrap\" tabindex=\"0\"><table><thead><tr><th>項目</th><th>判讀與陷阱</th></tr></thead><tbody><tr><td>Nitrite</td><td>陽性支持有可將 nitrate 還原的細菌；陰性不能排除感染，受菌種、膀胱停留時間等影響。不能由單一 nitrite 推定菌種。</td></tr><tr><td>Leukocyte esterase／WBC</td><td>支持膿尿，但膿尿不等於有症狀 UTI，也不等於必須用抗生素。</td></tr><tr><td>RBC</td><td>以正確採集的尿液鏡檢判定；dipstick blood 不能代替 RBC 計數。血尿須評估持續性、感染、腎病與泌尿道惡性風險。</td></tr><tr><td>Dipstick blood(+) 但少／無 RBC</td><td>考慮 myoglobin 或 hemoglobin，搭配 CK、溶血指標與腎功能。</td></tr><tr><td>Protein</td><td>Dipstick 主要偵測 albumin；定量用 UACR 或 UPCR，陰性也不能排除所有非白蛋白尿。</td></tr></tbody></table></div><div class=\"clinical-note\"><strong>校核補充：</strong>AUA/SUFU 2025 以 ≥3 RBC/HPF 作為 microscopic hematuria 定義。無症狀菌尿常見需要篩檢／治療的情境為懷孕，以及會造成黏膜損傷的內視鏡泌尿道處置前；不是所有手術前都需要治療。單靠膿尿或 nitrite 也不足以定義 ASB，須結合培養與臨床。見 C3、C4。</div>"
        },
        {
          "id": "panels",
          "title": "12 情境式檢查整理",
          "html": "<p class=\"source-note\">原手冊 pp. 18</p><p>以下是選檢方向，依臨床假設挑選，並非每次都整套開立。</p><div class=\"table-wrap\" tabindex=\"0\"><table><thead><tr><th>情境</th><th>可考慮項目</th></tr></thead><tbody><tr><td>貧血</td><td>CBC／MCV、reticulocyte；缺鐵方向查 ferritin、Fe、TIBC；大球性查 B12/folate；疑溶血查 LDH、haptoglobin、bilirubin。</td></tr><tr><td>AKI／少尿</td><td>Creatinine、K、尿液；確認導尿管、餘尿與是否需腎超音波。</td></tr><tr><td>低血壓</td><td>灌流評估、lactate；依感染或心臟線索選培養、ECG、echo；懷疑內分泌病因再選 cortisol／甲狀腺檢查。</td></tr><tr><td>急性肝損傷</td><td>肝膽檢驗、INR、完整藥物／草藥史、肝炎血清檢驗與超音波；按疑似病因擴充。</td></tr><tr><td>血鈉異常</td><td>Serum osm、urine osm、urine Na；依情境查腎上腺或甲狀腺。</td></tr><tr><td>高血鈣</td><td>確認 iCa 或總鈣可信度，先以 PTH 分流；再依結果選 PTHrP、Vit D、SPEP 等。</td></tr><tr><td>橫紋肌溶解</td><td>CK、K、P、Ca、creatinine、尿液 blood 與鏡檢。</td></tr><tr><td>疑心肌損傷／心衰</td><td>ECG、序列 hs-cTn；依症狀選 BNP/NT-proBNP、echo。</td></tr><tr><td>疑自體免疫病</td><td>依臨床表現選 ANA、anti-dsDNA、C3/C4、ANCA、RF/anti-CCP 等，避免無差別篩檢。</td></tr></tbody></table></div>"
        },
        {
          "id": "formulas",
          "title": "13 公式速查",
          "html": "<div id=\"lab-calculator\" class=\"lab-calculator\"></div><p class=\"source-note\">原手冊 pp. 19</p><div class=\"table-wrap\" tabindex=\"0\"><table><thead><tr><th>公式</th><th>單位與限制</th></tr></thead><tbody><tr><td>ANC = WBC × (Seg% + Band%) ÷100</td><td>WBC 與 ANC：/µL</td></tr><tr><td>Corrected Ca = Ca + 0.8 × (4 − Albumin)</td><td>Ca：mg/dL；albumin：g/dL。重症優先測 iCa。</td></tr><tr><td>Corrected Na ≈ Na + 1.6 × (Glucose −100) ÷100</td><td>Na：mmol/L；glucose：mg/dL。係數為近似值，嚴重高血糖時可有偏差。</td></tr><tr><td>自由水缺乏量 = TBW × (Na/140 −1)</td><td>TBW 以 L 計；手冊估體重 ×0.6（男）／0.5（女），年齡與體組成會改變估值，尚需計入持續流失。</td></tr><tr><td>Na deficit = TBW × (目標 Na −現有 Na)</td><td>估計值，不是直接輸液處方；3% NaCl 約含 513 mEq/L Na。</td></tr><tr><td>AG = Na − (Cl + HCO₃⁻)</td><td>常見正常值約 8–12 mmol/L，依實驗室而異。</td></tr><tr><td>Corrected AG = AG + 2.5 × (4 −Albumin)</td><td>Albumin：g/dL</td></tr><tr><td>Winter：預期 PaCO₂ = 1.5 × HCO₃⁻ +8 ±2</td><td>PaCO₂：mmHg；用於代謝性酸中毒。</td></tr><tr><td>估計 Osm = 2 × Na + Glucose/18 + BUN/2.8</td><td>Glucose、BUN：mg/dL；估計結果約 mOsm/kg。</td></tr><tr><td>FENa = (U_Na × P_Cr)/(P_Na × U_Cr) ×100%</td><td>尿與血的相同分析物須使用一致單位；&lt;1% 是線索，不是確診。</td></tr><tr><td>FEUrea = (U_urea × P_Cr)/(P_urea × U_Cr) ×100%</td><td>尿血 urea 或尿血 urea nitrogen 須一致，不可混用。&lt;35% 僅輔助。</td></tr><tr><td>BUN/Cr = BUN ÷ Creatinine</td><td>兩者用 mg/dL；&gt;20 可支持腎前性，也受其他因素影響。</td></tr><tr><td>年齡校正 D-dimer = 年齡 ×10 µg/L FEU</td><td>限 &gt;50 歲與適當臨床機率／驗證流程。</td></tr></tbody></table></div>"
        },
        {
          "id": "references",
          "title": "Reference｜參考資料",
          "html": "<h3>主要整理來源</h3><p>黃品叡醫師，PGY 職前加油站。《常用實驗數據判讀手冊：Lab Data 判讀臨床速查手冊》，2026 年版，更新日期 2026/08/19，共 20 頁。上傳檔名：22 -【PGY職前加油站】臨床常用實驗數據判讀手冊.pdf。</p><h3>本次校核來源</h3><ul><li><strong>C1.</strong> <a href=\"https://doi.org/10.1093/cid/cir073\" target=\"_blank\" rel=\"noopener noreferrer\">Freifeld AG, et al. IDSA guideline: antimicrobial agents in neutropenic patients with cancer. 2010 update. Clin Infect Dis. 2011;52:e56–e93.</a></li><li><strong>C2.</strong> <a href=\"https://doi.org/10.2337/dc26-S016\" target=\"_blank\" rel=\"noopener noreferrer\">American Diabetes Association. Diabetes Care in the Hospital: Standards of Care in Diabetes—2026.</a></li><li><strong>C3.</strong> <a href=\"https://academic.oup.com/cid/article/68/10/e83/5407612\" target=\"_blank\" rel=\"noopener noreferrer\">IDSA. Clinical Practice Guideline for the Management of Asymptomatic Bacteriuria: 2019 Update.</a></li><li><strong>C4.</strong> <a href=\"https://www.auanet.org/documents/Guidelines/PDF/2025%20Guidelines/MH%20Unabridged%2002.2025FINAL4.pdf\" target=\"_blank\" rel=\"noopener noreferrer\">AUA/SUFU. Microhematuria Guideline (2020, Amended 2025).</a></li></ul><h3>原手冊所列參考文獻（20 筆）</h3><p>以下依原手冊第 20 頁轉錄，未逐筆驗證書目與最新版本；不代表本頁直接閱讀過全部原始文獻。第 11 筆為公開審查草案；第 20 筆原載「2023 amendment」，本次另以 C4 的 2025 官方版本校核。</p><ol class=\"references\"><li>Carson JL, Stanworth SJ, Guyatt G, et al. Red Blood Cell Transfusion: 2023 AABB International Guidelines. JAMA. 2023;330(19):1892-1902.</li><li>Metcalf RA, Nahirniak S, Guyatt G, et al. Platelet Transfusion: 2025 AABB and ICTMG International Clinical Practice Guidelines. JAMA. 2025;334(7):606-617.</li><li>Rao SV, O&#x27;Donoghue ML, Ruel M, et al. 2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes. Circulation. 2025;151(13):e771-e862.</li><li>Byrne RA, Rossello X, Coughlan JJ, et al. 2023 ESC Guidelines for the management of acute coronary syndromes. Eur Heart J. 2023;44(38): 3720-3826.</li><li>Heidenreich PA, Bozkurt B, Aguilar D, et al. 2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure. Circulation. 2022;145(18):e895-e1032.</li><li>Bayes-Genis A, Docherty KF, Petrie MC, et al. Practical algorithms for early diagnosis of heart failure and heart stress using NT-proBNP: a clinical consensus statement from the Heart Failure Association of the ESC. Eur J Heart Fail. 2023;25(11):1891-1898.</li><li>Evans L, Rhodes A, Alhazzani W, et al. Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2021. Crit Care Med. 2021;49(11):e1063-e1143.</li><li>Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2026. Crit Care Med. Published online March 23, 2026. doi:10.1097/CCM.0000000000007075</li><li>Singer M, Deutschman CS, Seymour CW, et al. The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3). JAMA. 2016;315(8):801-810.</li><li>KDIGO CKD Work Group. KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease. Kidney Int. 2024;105(4S):S117-S314.</li><li>KDIGO. KDIGO 2026 Clinical Practice Guideline for Acute Kidney Injury and Acute Kidney Disease — Public Review Draft. March 2026.（草 案，正式版發布後請更新）</li><li>Inker LA, Eneanya ND, Coresh J, et al. New Creatinine- and Cystatin C-Based Equations to Estimate GFR without Race. N Engl J Med. 2021;385(19):1737-1749.</li><li>Kwo PY, Cohen SM, Lim JK. ACG Clinical Guideline: Evaluation of Abnormal Liver Chemistries. Am J Gastroenterol. 2017;112(1):18-35.</li><li>Sterns RH, et al. Hyponatraemia — treatment standard 2024. Nephrol Dial Transplant. 2024;39(11):1768-1778.</li><li>Spasovski G, Vanholder R, Allolio B, et al. Clinical practice guideline on diagnosis and treatment of hyponatraemia. Eur J Endocrinol. 2014;170(3):G1-G47.</li><li>Verbalis JG, Goldsmith SR, Greenberg A, et al. Diagnosis, evaluation, and treatment of hyponatremia: expert panel recommendations. Am J Med. 2013;126(10 Suppl 1):S1-S42.</li><li>Gyawali B, Bohlke K, Dickter JK, et al. White Blood Cell Growth Factors: ASCO Guideline Update. J Clin Oncol. Published online February 25, 2026.</li><li>Lindner G, Burdmann EA, Clase CM, et al. Acute hyperkalemia in the emergency department: a summary from a Kidney Disease: Improving Global Outcomes conference. Eur J Emerg Med. 2020;27(5):329-337.</li><li>Thygesen K, Alpert JS, Jaffe AS, et al. Fourth Universal Definition of Myocardial Infarction (2018). Circulation. 2018;138(20):e618-e651.</li><li>Barrett B, Gordon C, et al. AUA/SUFU Guideline: Microhematuria. J Urol. 2020;204(4):778-786.（2023 amendment）</li></ol>"
        }
      ]
    }
  ]
};
