# Кваліфікації дзвінків — усі 22

[← Зміст](00_README.md)

Кваліфікація — поле `freitty_qualification` у HubSpot. Її ставить оператор **протягом 30 хвилин** після дзвінка. AI визначає її незалежно і порівнює.

## Головні принципи

1. **Кваліфікацію ставимо за суттю дзвінка** — про що дзвонила людина. Не за тим, що оператор зробив (переведення на колегу — не кваліфікація).
2. **Правило 4 критеріїв.** Компанія · Локація · Сервіс · Дата/час — є всі чотири → **Deal**, ордер створюємо одразу, навіть якщо клієнт «ще думає». Фінансове підтвердження **не** є критерієм.
3. **MQL не понижується.** Якщо запит був з логістики з конкретним вантажем — він лишається MQL навіть після заперечень про ціну чи терміни. Не ставимо через це Wrong Number чи інше «сміття».
4. **Неоднозначність — нормально.** Перший дзвінок інколи легітимно читається як кілька типів. Для таких «родин» близька кваліфікація дає половину балу, а не нуль (див. [нижче](#родини-близьких-кваліфікацій)).
5. **Дані з HubSpot рахуються.** Якщо компанія вже є в CRM — критерій «компанія» виконаний, навіть якщо в розмові її не називали.
6. **Регістр, тире, аліаси не важливі.** «Shopping Around» = «General Inquiry», «FU/U» = «Follow Up / Update».

## Критерії Deal — коли виконано

| Критерій | ✅ Виконано | ❌ Не виконано |
|---|---|---|
| **Company** | Компанія вже є в HubSpot **або** названа в розмові. Для shipper MC/DOT не потрібен | Відоме тільки ім'я людини, компанії немає ні в CRM, ні в розмові |
| **Location** | Конкретний хаб мережі названий або підтверджений | «somewhere in California», локація не звучала |
| **Service** | Сервіс з меню зрозумілий — **можна з контексту**, дослівна назва не обов'язкова | «I need help with freight» без жодної ознаки сервісу |
| **Date/Time** | (а) тільки година — «at 3 PM», «in two hours» (= сьогодні) · (б) вже прибули — «we're already at the yard», «my truck is pulling in» · (в) інший день — «Tuesday», «tomorrow», дата | «next week», «sometime soon», «TBD», «I'll let you know» |

---

## Короткий довідник: яку кваліфікацію ставити

| Ситуація | Кваліфікація |
|---|---|
| Є компанія, локація, сервіс і дата — навіть якщо клієнт «ще думає» або MC перевізника, email чи оплату донесе пізніше | **Deal** |
| Без фото чи документів неможливо назвати ціну / домовитись: клієнт надсилає їх email чи SMS, ціна буде після них | **Channel Transfer** |
| Є інтерес, але бракує компанії, локації, сервісу або дати; дзвонить для себе | **General Inquiry** |
| Людина збирає ціни для когось іншого («my boss asked me») | **Scout** |
| Водій **на місці** по існуючому ордеру: ворота, док, черга, gate code | **External Driver** |
| Клієнт або диспетчер **дистанційно** по існуючому ордеру: статус, BOL, оплата, оновлення | **Follow Up / Update** |
| Цільова розмова обірвалась (зв'язок, drop) | **Qualified Interrupted** |
| Немає нашої точки в потрібному місті | **Not Our Location** |
| Хоче сервіс у себе (склад, магазин, truck stop) і не погоджується привезти до нас — навіть якщо дзвонить за когось | **Service Out of Facility** |
| Сервіс у мережі не підтримується: reefer, hazmat-клас, food-grade | **Service is Not Supported** |
| Брокер хоче постійну співпрацю | **Partnership - Broker** |
| Перевізник / owner-operator зі своїм транспортом пропонує capacity — навіть якщо питає «are you hiring?» | **Partnership - Carrier** |
| Склад / 3PL хоче в нашу мережу | **Partnership - Location** |
| Поліція, федеральна агенція, адвокат, держорган | **Legal And Government** |
| Шукає роботу на нашій техніці / в офісі / на складі | **Looking For Job** |
| Продає нам свої послуги | **Vendor / Seller** |
| Особистий сервіс: переїзд, особисті речі | **Personal Service / Product** |
| Помилились номером | **Wrong Number** |
| Вхідний автодзвінок або тиша | **Robocalls / Silent** |
| Ми набрали — ніхто не взяв, навіть автовідповідач | **No Answer** |
| Ми не взяли вхідний | **Missed Call** |
| Свої (холдинг, колеги) | **Internal Communication** |

---

## Дерево рішень

Іди згори вниз і зупиняйся на першій відповіді «так».

```
1. Розмови не було (ми не взяли / нам не взяли / тиша)?
     вхідний не взяли                     → Missed Call
     вихідний, клієнт не говорив          → No Answer (навіть якщо автовідповідач)
     вхідний, автодзвінок або тиша        → Robocalls / Silent

2. Це не B2B-логістика?
     → Wrong Number / Vendor / Looking For Job / Personal Service / Internal
     ⚠️ Має власний транспорт і пропонує capacity → Partnership - Carrier, НЕ Looking For Job

3. Дзвінок про ВЖЕ ІСНУЮЧИЙ ордер чи запит?
     водій на місці (ворота, док, черга)  → External Driver
     клієнт / диспетчер дистанційно       → Follow Up / Update

4. Поліція / адвокат / держорган?         → Legal And Government

5. Партнерський запит (без конкретного вантажу зараз)?
     → Partnership - Broker / Carrier / Location

6. Без фото / BOL / документів не домовитись,
   артефакт уже йде або клієнт погодився надіслати,
   оператор назвав наступний крок?        → Channel Transfer

7. Немає нашої локації в цьому місті?      → Not Our Location
8. Сервіс у мережі не підтримується?       → Service is Not Supported
9. Хоче сервіс поза нашим ярдом і не везе до нас? → Service Out of Facility
   (навіть якщо дзвонить за третю особу)

10. Збирає інформацію для третьої особи?   → Scout

11. Розмова обірвалась, а запит був цільовий? → Qualified Interrupted

12. Є всі 4 критерії?
      так  → Deal
      ні   → General Inquiry (для себе) / Scout (для когось)
```

**Пріоритети при конфлікті:** Legal And Government > External Driver > Follow Up зі зміною/скасуванням ордера > Deal (4 критерії, навіть якщо є ознаки партнерства) > Channel Transfer > General Inquiry.

---

## Повний довідник 22 кваліфікацій

### Група «Продажі» — оцінюється повний чекліст

#### Deal
**Визначення:** запит з усіма 4 критеріями (Company [+ MC/DOT для перевізника/брокера], Location, Service, Date/Time). Створюємо ордер у Freitty Hub одразу, незалежно від того, чи клієнт підтвердив.
**Дані рівня 3 не скасовують Deal.** Бракує лише email, способу оплати або MC/DOT **перевізника** → все одно Deal. Решта дозбирується потім: текстом, листом, наступним дзвінком.
**Приклади ✅**
- «ABC Logistics MC#123456, 22 pallets cross-dock at Markham tomorrow 10 AM»
- «Restack 18 pallets at Stockton Tuesday 2 PM, I'm John from Sunshine Trucking»
- «Storage 7 days for 12 pallets at Reno starting today, Megacorp Logistics»

**Не Deal ❌**
- «Cross-dock somewhere, sometime next week» → **General Inquiry** (немає локації, «next week» — не дата)
- «I want to book restack at Markham tomorrow» від компанії, якої немає ні в CRM, ні в розмові → **General Inquiry**

#### Channel Transfer
**Визначення:** потреба зрозуміла, і **обмін артефактом уже запущений в іншому каналі** — фото, BOL, документи — а оператор узяв конкретний наступний крок з ним. Три умови, усі обов'язкові:
1. **Потреба ідентифікована** — сервіс або проблема зрозумілі («rejected load needs restacking»).
2. **Канал для того, без чого бронювання не завершити**, встановлений: артефакт уже в русі («I'm emailing you the photos right now», «just sent the BOL») **або** оператор назвав канал і клієнт погодився («send the photos to this number» → «okay»).
3. **Оператор назвав наступний крок** — ціна, перевірка можливості, підтвердження.

**Дата/час для CT не потрібна** — для Rework запис на час відбувається після котирування. Для компанії достатньо ідентифікувати того, хто дзвонить (назва, MC/DOT або контакт уже в CRM).
**Приклади ✅**
- Перевізник: rejected load у Denver, потрібен restack, «I'm emailing you right now, the pictures» → оператор: «we assess the picture and provide you with the price and our capacity»
- «Cross-dock 22 pallets, but I need to send you the BOL via email»

**Не CT ❌**
- «Maybe I'll send you photos sometime» — гіпотетично → **General Inquiry**
- Клієнт хоче «переслати інформацію на email» без наступного кроку від оператора → **General Inquiry**
- Усе вирішено на дзвінку → **Deal**
- Надсилаємо check-in номер, номер ордера чи підтвердження вже оформленого бронювання → це **Deal**, не CT
- Переведення дзвінка на колегу → **не CT** (CT — передача *оформлення*, а не дзвінка)

**У CRM:** угода зі статусом «Pending – Channel Transfer».

#### General Inquiry
Аліаси: General Inquiry / Shopping Around · Shopping Around · GI.
**Визначення:** менше 4 критеріїв для Deal, і дзвонить **фінансово відповідальна особа** (для себе / своєї компанії).
**Також сюди:** запит на after-hours або при повному capacity, коли інший час не узгодили (якщо оформлення йде в інший канал — CT). Клієнт свідомо сказав «I'll call back later» — теж GI, не Qualified Interrupted.
**Приклади:** «What are your rates for cross-dock in general?» · «I'm just calling around to compare» · «We might have some freight next month».
**Тайбрейкер з Scout:** для себе → GI; для третьої особи → Scout.

#### Scout
Аліас: Scout / Influencer.
**Визначення:** збирає ціни, умови, можливості **для третьої особи**. Не фінансово відповідальний, не може підтвердити оплату. Ордера немає.
**Приклади:** «My boss asked me to call and check rates in Reno» · «I'm a driver, just gathering info for my dispatcher» · «I'm an assistant — owner wants to know your pricing».

| Ситуація | Тип |
|---|---|
| Збирає для третьої особи | Scout |
| Збирає для себе | General Inquiry |
| Водій по **існуючому** ордеру, операційні питання | External Driver |
| Водій **без** ордера питає ціну для диспетчера, навіть якщо вже їде до нас | Scout |

**Що робити:** залишити гарне враження, дати ціну, взяти ім'я і контакт того, хто приймає рішення.

#### Follow Up / Update
Аліас: FU/U.
**Визначення:** дзвінок по **вже існуючому** ордеру чи запиту — статус, BOL, документи, оплата, ETA, зміни. Хтось **адмініструє** замовлення дистанційно.
**Сильніший за Channel Transfer:** якщо дзвінок про існуючий ордер — це Follow Up, навіть якщо в розмові є «would you like me to text or call you?».
**Ознаки існуючого ордера:** FR# у розмові · угода в HubSpot, прив'язана до контакту · наш вихідний з оновленням по раніше обговореному запиту · «I sent you a message in the orders», «we talked about…», «calling back about your request».
**Також сюди:** другий дзвінок у Rework, коли оператор передзвонює з ціною після фото; повторний дзвінок клієнта з MC перевізника після створеного Deal.
**Не FU ❌:** новий вантаж від існуючого клієнта → Deal або GI · водій на місці → External Driver.

#### Qualified Interrupted
Аліас: QI.
**Визначення:** розмова **була цільовим запитом** (рівня Deal / Scout / CT), але обірвалась з технічних причин — зв'язок, drop.
**Не QI ❌:** загальне питання, що обірвалось → General Inquiry · клієнт свідомо сказав «I'll call back later» → General Inquiry.
**Що робити:** передзвонити одразу, якщо номер є.

### Група «Пояснення / відмова» — 5 пунктів

#### Not Our Location
Аліас: NOL.
**Визначення:** правильний сервіс і профіль клієнта, але нашого хабу в потрібній географії немає.
**Приклади:** cross-dock у Houston · storage у Seattle · restack у Miami.
**Не NOL ❌:** клієнт назвав неправильну адресу, але йому потрібен наш реальний хаб → уточнюємо · локація є, але сервіс поза ярдом → SOF.
**Що робити:** ввічлива відмова + найближчий хаб, якщо є.

#### Service Out of Facility
Аліас: SOF.
**Визначення:** сервіс ми надаємо і локація є, але клієнт хоче виконання **поза нашим ярдом** — на truck stop, у себе на складі, у магазині, на стоянці перевізника — і **не погодився** привезти до нас.
**Сильніший за Scout і General Inquiry:** SOF, навіть якщо дзвонить за третю особу і навіть якщо обговорювали розміри й кількість. Погодився привезти до нас → звичайна логіка (Deal / CT / GI / Scout).
**Приклади:** «overweight help at a truck stop off I-80» · «restack, but at my own warehouse — can your crew come out?» · вітрину треба спакувати в магазині клієнта.
**Не SOF ❌:** сервіс не підтримується в мережі → SNS · немає точки → NOL · **after-hours або повний capacity → General Inquiry** (раніше помилково ставили SOF).
**Що робити:** пояснити, що сервіс виконується на нашій території, запропонувати привезти до хабу.

#### Service is Not Supported
Аліаси: Service Not Supported · SNS.
**Визначення:** профільний запит, але сервіс **взагалі недоступний у мережі** — reefer / cold storage, hazmat-клас, який не приймаємо, food-grade, FDA/USDA-сертифікації.
**Приклади:** «Reefer storage 7 days in Stockton» · «Hazmat class 1.1 cross-dock» · «Food-grade certified warehouse».
**Hazmat:** якщо відмова через клас — це SNS, і hazmat-протокол має бути виконаний (питання → клас → відповідь на дзвінку).

#### External Driver
Аліас: ED.
**Визначення:** водій, який фізично виконує рейс по **вже існуючому** ордеру, дзвонить з операційними питаннями — куди заїжджати, який док, скільки чекати, gate code.
**Приклади:** «I'm at the gate at Markham — which dock?» · «I'm picking up today, my dispatcher didn't give me the order number» · «How long is the wait? I've been here 40 minutes».

| | External Driver | Follow Up / Update |
|---|---|---|
| **Хто** | сам за кермом на цьому вантажі | клієнт / диспетчер / офіс |
| **Звідки** | на локації або в дорозі до неї | дистанційно |
| **Про що** | док, ворота, черга, «я привіз» | статус, BOL, оплата, ETA, зміна дати |

Check-in номер є **в обох** — він нічого не вирішує. Вирішує **хто і звідки** дзвонить.
**Немає ордера → це не External Driver.** Питає ціну → Scout або General Inquiry.
**Протокол:** не надавати деталі вантажу без верифікації — див. [Спецситуації](13_special-protocols.md#водій-external-driver).

### Група «Партнерство» — 3 пункти
Підтип (Broker / Carrier / Location) система бере з того, що ти поставив у HubSpot. AI підтверджує з розмови тільки, що це партнерство. Розбіжність у підтипі не знижує бал.

#### Partnership - Broker
Брокер хоче постійно працювати з нами: «I'm a broker, I want to use your network for my clients regularly», «Can we set up a master rate agreement?»
**Не Partnership ❌:** брокер з конкретним вантажем зараз → **Deal**.
**Що робити:** зібрати дані і передати менеджеру партнерств (Андрій Чернявський / partnerships@).

#### Partnership - Carrier
Перевізник хоче працювати з нами як capacity provider або підключитись до мережі: «20 trucks weekly into Chicago», «Carrier looking to onboard for repeat lanes».
**Owner-operator зі своїм транспортом** — Partnership - Carrier, навіть якщо каже «are you hiring independent contractors with sprinter vans?» Розмір флоту не важливий.
Сигнальні слова: independent contractor · owner operator · my own truck/van · sprinter van · box truck · my authority · MC number · my fleet.
**Не Partnership ❌:** перевізник з вантажем зараз → Deal · шукає найману посаду водія на нашій техніці → Looking For Job.

#### Partnership - Location
Сторонній склад / 3PL хоче в мережу: «I own a warehouse in Phoenix, want to partner with Freitty», «Have 50K sq ft in Salt Lake City».

### Група «Технічні та нецільові» — скрипт не оцінюється

#### Robocalls / Silent
**Тільки вхідні.** Автодзвінок без живої людини (тиша, запис, IVR) або тиша понад 10 секунд після нашого привітання.
- Клієнт мовчить 5 секунд, бо думає — **не** Robocall.
- Поганий зв'язок посеред цільової розмови → Qualified Interrupted.
- Будь-який вихідний без відповіді → **No Answer**.
- Жива людина помилилась номером → **Wrong Number**.

#### Wrong Number
Людина не мала на меті дзвонити у Freitty: «Is this Domino's Pizza?», переїзд дивана, муніципальна скарга. Можливий в обидва боки (ми набрали не той номер, людина відповіла).
**Не WN ❌:** «Do you do residential deliveries?» → може бути SNS · «I called before but forgot what services you offer» → General Inquiry.

#### Vendor / Seller
Нам щось продають: страхування, клінінг, обладнання, маркетинг.
**Не Vendor ❌:** брокерська компанія шукає capacity → Partnership - Broker.

#### Looking For Job
Шукає **найману посаду**: диспетчер, склад, офіс, водій **на техніці компанії**. «I saw your job posting on Indeed».
**Не LFJ ❌:** має власний транспорт / authority / MC і пропонує capacity → **Partnership - Carrier**. Підказка: якщо ти ведеш людину на онбординг перевізника («send your information to our email») — це Partnership - Carrier.

#### Personal Service / Product
Нелогістичний особистий сервіс: переїзд квартири, інвентаризація гаража, особисте зберігання. Обсяг менше палети, побутові речі.
**Не Personal ❌:** малий бізнес з 5–10 палетами → GI або Deal · «Storage for my freight» → наш сервіс.

#### Internal Communication
Дзвінки між компаніями холдингу (Octopos / Netqor / YBIS / Freitty) або між співробітниками. Скрипт не оцінюється з міркувань приватності.
**Не Internal ❌:** зовнішній брокер, який «знає Андрія» → Partnership - Broker · колишній співробітник як клієнт → Deal / GI.

#### Legal And Government
Поліція, FBI, федеральні агенції, адвокат, урядова установа. Запит про вантаж, клієнта або операції.
**Єдиний «нецільовий» тип, де контакт і організація в HubSpot обов'язкові.** Керівник отримує сигнал одразу. Протокол — [Спецситуації](13_special-protocols.md#поліція-юристи-держоргани-legal-and-government).

#### Missed Call
Вхідний дзвінок, який ми не прийняли: ніхто не взяв, клієнт поклав до відповіді (включно з виходом з IVR-меню), відхилено. Не оцінюється — рахується тільки, чи передзвонили (10 хвилин).

#### No Answer
Наш вихідний, на який не відповіли. **Запис і тривалість не важливі:** гудки й автовідповідач теж дають запис на 40–90 секунд. Вирішує одне — чи говорив клієнт. Залишили голосове повідомлення → все одно No Answer.

---

## Родини близьких кваліфікацій
Усередині родини розбіжність з AI дає **50% балу за кваліфікацію** (а не 0) і **не** піднімає термінового сигналу керівнику.

| Родина | Типи | Чому |
|---|---|---|
| Продажі першого дзвінка | Deal · Channel Transfer · General Inquiry · Scout | Перший дзвінок легітимно буває неоднозначним |
| Існуючий ордер | External Driver · Follow Up / Update | Обидва про існуючий ордер, різниця — хто дзвонить |
| Відмова | Not Our Location · Service Out of Facility · Service is Not Supported | Усі три — «ми не можемо», різниця в причині |
| Нецільові | усі технічні та нецільові, **крім Legal And Government** | Скрипт однаково не оцінюється |

## Аліаси — рівнозначні назви
| Канонічна | Рівнозначні |
|---|---|
| General Inquiry | General Inquiry / Shopping Around · Shopping Around · GI |
| Scout | Scout / Influencer · Influencer |
| Service is Not Supported | Service Not Supported · SNS |
| Service Out of Facility | SOF |
| Follow Up / Update | FU/U · Follow-Up / Update |
| Not Our Location | NOL |
| Channel Transfer | CT |
| Qualified Interrupted | QI |
| External Driver | ED |
| Looking For Job | LFJ |
| Legal And Government | Legal & Government · Legal/Gov |
