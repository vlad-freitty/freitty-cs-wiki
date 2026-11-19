# Правила побудови розмови (Conversation Rules)

[← Зміст](00_README.md)

> Це не скрипт — це правила, з яких будуються всі скрипти. Кожне правило має три рівні: **Що** — саме правило · **Чому** — логіка за ним · **Як** — приклад.
>
> Документ — першоджерело для чеклістів AI-аналізатора: кожен пункт оцінки посилається на конкретний розділ цих правил.
> Статус оригіналу: v1.0, березень 2026, на затвердженні.
>
> 🔄 **Позначка «Актуально в CAE»** — місця, де правила кваліфікації або оцінки з того часу уточнено. Діє уточнена версія.

---

## Розділ 1 — Філософія

### 1.1 Customer-First: рішення перед збором даних
**Що:** клієнт прийшов за рішенням — дай його одразу. Деталі збирай після.
**Чому:** кожна секунда без відповіді — шанс, що клієнт піде до конкурента. «Дайте мені час перевірити» клієнт чує як «я не знаю, чи можу вам допомогти».
**Як:**
- ✅ *«Absolutely, we can help! The rate is $X per pallet. Now let me get a few details.»*
- ❌ *«Let me collect all the information first and I'll call you back with pricing.»*

**Виняток:** Rework, Local Pickup, Local Delivery, Drayage, Middle Mile — ціна йде через transport team. Тоді одразу кажемо, **коли** буде ціна, і збираємо все з першого разу.

### 1.2 Впевненість — не опція, обов'язок
**Що:** агент завжди звучить так, ніби робить це щодня.
**Чому:** невпевнений тон руйнує довіру — клієнт відчуває сумнів і починає сумніватись сам.
- ✅ *«Perfect!» / «Absolutely!» / «The price is $X»*
- ❌ *«I think we can…» / «Maybe around $X…» / «Let me check if we do that…»*

### 1.3 Мінімум контактів — максимум з першого разу
**Що:** збирай усю інформацію за один дзвінок. Не повертайся за деталями.
**Чому:** кожен додатковий контакт — тертя, а тертя — шанс, що клієнт відмовиться.

| Тип сервісу | Ціль |
|---|---|
| Instant pricing (Cross-Dock, Storage, Overweight) | 1 контакт |
| Delayed pricing (Rework, Pickup, Drayage, Middle Mile) | 2 контакти |
| Складний (Local Delivery) | 3 контакти |

**Перевірка перед закриттям:** чи зібрав усе — freight info, перевізник(и), дата/час, email, оплата?

### 1.4 Чіткі очікування замість невизначеності
**Що:** якщо не можеш дати відповідь одразу — кажи, **коли** вона буде.
**Чому:** клієнт може чекати. Клієнт не може чекати невідомо скільки.
- ✅ *«You'll have the quote within the hour, sometimes faster.»*
- ❌ *«I'll get back to you later.» / «I'll let you know soon.»*

---

## Розділ 2 — Opening

### 2.1 Вхідний дзвінок
> *«Good morning/afternoon, thank you for calling Freitty. This is [NAME]. How can I help you today?»*

Варіанти:
- *«Thanks for calling Freitty, this is [NAME]. What can I do for you?»*
- *«Hi, this is [NAME] with Freitty. How may I assist you?»*

Правила: завжди тепло і впевнено · відкрите питання наприкінці — дай клієнту говорити першим · не поспішай: одна чітка фраза краща за три бурмотіння.

> 🔄 **Актуально в CAE:** для оцінки зараховується **будь-яке** привітання або пропозиція допомоги. Назва Freitty й ім'я бажані, але не обов'язкові — транскрипція часто їх губить.

### 2.2 Вихідний дзвінок — три кроки
1. **Представлення (завжди):** *«Hi, this is [NAME] from Freitty, the cross-docking platform.»*
2. **Підтвердження особи:**
   - є ім'я → *«Am I speaking with [NAME]?»*
   - є компанія → *«Is this [COMPANY]?»*
   - нічого немає → *«Who am I speaking with?»*
3. **Дозвіл (завжди):** *«Is now a good time?»*

**Чому «Is now a good time?» обов'язковий:** клієнт не чекав дзвінка. Навіть якщо щойно подав заявку, часто каже «I wasn't expecting you to call so fast!» Швидкість — наша перевага, але треба переконатись, що клієнт готовий говорити.

Якщо «не зараз»: *«No problem at all. When would be a good time to call you back?»*

---

## Розділ 2.5 — Активне слухання (вхідні)

### 2.5.1 «Потік свідомості» клієнта — золота жила
Після «How can I help you?» клієнт часто сам дає всю потрібну інформацію. Завдання — не перебивати, а слухати і фіксувати.
- мовчки слухаєш, мовчки відмічаєш у системі;
- короткі сигнали: *«Mhm», «Got it», «Sure»* — не перебиваючи потік;
- не поспішай з питаннями, поки клієнт не зупинився.

### 2.5.2 Що фіксуємо під час слухання
| Категорія | Що шукаємо |
|---|---|
| Тип сервісу | Клієнт може описувати своїми словами або дуже приблизно. Розпізнавай сервіс за контекстом, а не за ключовим словом |
| Freight info | Кількість палет, тип вантажу, розміри — часто дає сам |
| Дата і час | «arriving Monday», «need it picked up Friday» |
| Роль | Назва компанії часто звучить на початку. MC перевіряємо через SAFER — там видно carrier vs broker |
| Carrier info | MC, назва компанії — часто згадується сама |

**Мовний бар'єр:** дивне формулювання — не привід перебивати. Слухай до кінця, уточни одним питанням.

Коли клієнт зупинився — питаємо **тільки те, чого ще немає:**
> *«Perfect, got most of it. Just one thing — what size are the pallets?»*

Якщо клієнт дав усе — коротко повторюємо, перш ніж переходити до ціни:
> *«So just to make sure I got that right — [коротке резюме]. Is that correct?»*

### 2.5.3 Визначення брокера під час слухання
Активне слухання — перший і найприродніший момент для Trojan Horse.

1. **Відсіюємо водія.** «My truck» кажуть і диспетчери, і брокери. Водій зазвичай говорить від першої особи про конкретний рейс, без третіх сторін.
2. **Брокер чи диспетчер:**

| Ознака | Брокер | Диспетчер |
|---|---|---|
| Стиль | Професійніший, знає термінологію | Може бути менш формальним |
| Фрази | «my client», «my shipper», «I need to move freight for…» | «my driver», «my truck», «I dispatch for…» |
| Компанія | «Logistics», «Freight», «Brokerage» у назві | Транспортна компанія або приватна особа |

3. **Фінальна перевірка — SAFER.** MC запитуємо → перевіряємо на SAFER → видно carrier чи broker. Це факт, а не здогадка.

**Дія:** щойно роль зрозуміла — одразу маркуємо в HubSpot (Carrier, Dispatcher, Broker тощо), не чекаючи кінця дзвінка. Розмова триває як звичайно — клієнт нічого не помічає. Детально — [Брокери і Trojan Horse](12_trojan-horse.md).

---

## Розділ 2.7 — Кваліфікація дзвінка
Агент визначає тип дзвінка під час активного слухання — ще до збору інформації. Це визначає подальший флоу.

### 2.7.1 Воронка кваліфікації
```
Вхідний дзвінок
   ↓
Етап 1 — Unqualified?  → швидко і ввічливо закриваємо
   ↓ ні
Етап 2 — MQL?          → фіксуємо, Deal не створюємо
   ↓ є всі 4 критерії
Етап 3 — SQL           → є можливість виконати?
   ↓ так
Етап 4 — DEAL          → створюємо ордер
```

### 2.7.2 Етап 1 — Unqualified (відсіваємо одразу)
Не логістика, не бізнес → закриваємо швидко і ввічливо. Deal не створюємо, у статистику не тягнемо.

| Тип | Суть |
|---|---|
| Robocall / Silent | Автодзвінок або тиша |
| Wrong Number | Помилилися номером |
| Vendor / Seller | Пропонують купити послуги або товари |
| Looking for Job | Пошук роботи |
| Personal Service | Нерелевантний сервіс (moving, інвентаризація тощо) |
| Internal Communication | Внутрішні дзвінки між компаніями холдингу |

### 2.7.3 Етап 2 — MQL (наша аудиторія, але Deal зараз неможливий)
B2B-контакт з логістики. Є комерційний інтерес, але угода неможлива через зовнішні фактори або брак даних. Фіксуємо в CRM, Deal не створюємо.

| Тип | Суть |
|---|---|
| General Inquiry | Менше 4 критеріїв для ордера |
| Not Our Location | Правильний сервіс, але немає нашої точки в потрібній географії |
| Service Not Supported | Профільний запит, але сервіс недоступний (hazmat-клас, reefer, сертифікати) |
| Scout / Influencer | Не фінансово відповідальна особа, збирає інформацію для когось |
| External Driver | Водій по існуючому ордеру з операційними питаннями |
| Follow Up / Update | Дзвінок по існуючому ордеру — статус, BOL, оплата |
| Partnership | Carrier / Broker / Location — партнерський запит |
| Qualified Interrupted | Розмова обірвалась, але запит був цільовим |

> 🔄 **Актуально в CAE:** External Driver — це **водій на місці по вже існуючому ордеру**, а не «водій без деталей ордера». Без ордера водій, що питає ціну, — Scout або General Inquiry. Див. [Кваліфікації](04_qualifications.md).

### 2.7.4 Етап 3 — SQL
| Тип | Суть |
|---|---|
| Channel Transfer | Клієнт готовий купити, але оформлення переходить в інший канал (email, SMS) — наприклад, треба надіслати фото |

> 🔄 **Актуально в CAE:** Channel Transfer **не** вимагає всіх 4 критеріїв. CT — коли без артефакту (фото, BOL, документи) неможливо домовитись, і цей артефакт уже надсилається або клієнт погодився надіслати, а оператор назвав наступний крок. Дата/час для CT не потрібна. Якщо є всі 4 критерії і бракує лише email / оплати / MC перевізника — це **Deal**, не CT.

### 2.7.5 Етап 4 — Deal (правило 4 критеріїв)
**Є всі чотири → створюємо ордер негайно, незалежно від того, чи клієнт підтвердив чи ще думає.**

| Критерій | Що це |
|---|---|
| Company | Хто платить — назва (+ MC/DOT для перевізника/брокера) |
| Location | Де виконується сервіс |
| Service | Що саме робимо |
| Date/Time | Коли |

Немає хоча б одного → Deal не створюємо → General Inquiry або Scout залежно від того, хто дзвонить.

---

## Розділ 3 — Збір інформації

### 3.1 Тип фрахту
| Тип | Що це | Наслідок |
|---|---|---|
| Standard | На палетах, стандартний розмір (≤ 49"×49") | Instant pricing можливий |
| Non-Standard | На палетах, нестандартний розмір (> 49"×49") | Instant pricing, якщо вага ОК |
| Floor Load | Насипом / без палет | Завжди YELLOW — ручна оцінка |
| Mixed | Частина на палетах, частина насипом | Завжди YELLOW — ручна оцінка |

Клієнт часто не знає термінів — навідні питання:
- *«Is the freight on pallets, or is it loose in the truck?»*
- Якщо на палетах: *«And are they standard size pallets — around 48 by 40 inches — or bigger?»*
- Якщо насипом або частково — це Floor Load / Mixed, про розміри далі не питаємо, переходимо до кількості й дати.

**Порядок питань після визначення типу:**
1. Тип фрахту
2. Кількість + розмір (для Standard / Non-Standard)
3. Hazmat check
4. Ціна одразу (для instant-сервісів)
5. Дата / час
6. Carrier info
7. Admin: email + оплата

### 3.2 Adaptive Questioning — не питай двічі
**Що:** слухай, що клієнт уже сказав, і пропускай питання, на які вже є відповідь.
**Чому:** повторне питання = сигнал, що агент не слухав. Руйнує довіру.
- Клієнт сказав «10 pallets» → не питай кількість, тільки розмір.
- Клієнт сказав «my own truck» → не питай MC знову, якщо вже маєш.
- Клієнт сказав «arriving Tuesday at 2pm» → не питай дату й час окремо.

> *«Got it — so that's 10 pallets arriving Tuesday. And what size are the pallets?»*

### 3.3 Об'єднані питання — не допит
Питай по 1–2 речі за раз, об'єднуй логічно пов'язані.
- ✅ *«What company are you with and your MC number?»*
- ✅ *«How many pallets and what size?»*
- ❌ *«What company?» → пауза → «And your MC?» → пауза → «And DOT?»*

**Межа:** не більше двох речей за раз.

### 3.4 Hazmat — завжди, без винятків
Питання про hazmat обов'язкове в кожній розмові про вантаж незалежно від типу фрахту. Небезпечний вантаж без перевірки = юридична і фізична відповідальність хабу.

- Клієнт не давав сигналів → **відкрите питання:** *«And this is regular freight, correct? Not hazardous materials?»*
- Клієнт сказав сигнальну фразу (FAK, dry goods, general cargo, consumer goods, retail freight) → **підтвердження:** *«You mentioned it's FAK — so nothing hazardous, correct?»*

**Навіть якщо сигнал очевидний — ми не припускаємо, ми підтверджуємо.** Одне коротке питання завжди.

Якщо YES → *«What class is it?»* → перевіряєш клас по локації → рішення на дзвінку. Повний протокол — [Hazmat](09_hazmat.md).

### 3.5 Клієнт дає неповну інформацію
Не зупиняй процес через брак інформації. Фіксуй, що є, озвуч точну ціну на основі відомого, запитай, чого бракує для підтвердження. **Ми не даємо приблизних оцінок.** Якщо тип вантажу і локація відомі — ціна фіксована і звучить одразу.

**Рівень 1 — тригер для створення угоди** (є всі 4 → угода створюється негайно):

| Поле | Примітка |
|---|---|
| Company name + MC/DOT | Хто замовляє |
| Service type | Який сервіс |
| Hub / Location | Де — має бути в нашій мережі |
| Date + time | Коли |

**Рівень 2 — обов'язково для виконання** (збираємо після створення угоди): тип і кількість вантажу · hazmat-статус (завжди).

**Рівень 3 — обов'язково для підтвердження бронювання:** email · спосіб оплати · дані перевізника (для inbound truck).

> *«Based on what you have — standard pallets at [LOCATION] — the rate is $[PRICE] per pallet for cross-dock, and $[PRICE] per pallet per day for storage. That's your confirmed rate once we have [MISSING INFO]. No need to call back — just text or email it over.»*

**Завжди даємо прямий номер:** *«If you'd like to text or call directly, here's the number: [NUMBER].»*
Чому: повторні дзвінки через рекламний канал спотворюють статистику — система рахує їх як нові ліди.

> 🔄 **Актуально в CAE:** брак даних **рівня 3** (email, оплата, MC перевізника) **не скасовує Deal**. Створюй ордер одразу, решту отримай текстом.

#### Угода ≠ гарантія сервісу
Створена угода і навіть підтверджене бронювання — не безумовна гарантія. Freitty може відмовити або змінити умови, якщо фактична інформація при прибутті не збігається з поданою:
- тип або кількість вантажу не відповідає заявленому;
- вага перевищує допустиму для хабу без попереднього узгодження;
- hazmat-клас не збігається або не погоджений для хабу;
- стан вантажу потребує додаткової оцінки;
- параметр вантажу виходить за межі можливостей локації (обладнання, тип вантажу, сертифікації);
- **прибуває трак під знаками іншої компанії, ніж заявлено — червоний прапор**, перевірка перед обслуговуванням.

У CRM такі випадки закриваються статусом **Rejected By Us** з обов'язковою причиною.

#### Обов'язкова контактна інформація — на кожному дзвінку
Незалежно від результату — бронювання, відмова чи просто запит — фіксуємо повний контакт. Записи типу «хтось дзвонив, щось хотів» неприйнятні.

| Поле | Примітка |
|---|---|
| Ім'я | Хто саме телефонував, не «хтось з компанії» |
| Компанія | Назва організації |
| Суть запиту | Конкретно, одним реченням |
| Телефон | Прямий номер того, хто дзвонив |
| Extension | Якщо є — обов'язково |
| Email | Для зворотного зв'язку |

Не представився → *«Can I get your name and the best way to reach you back?»*
Дзвонять «для менеджера / власника» → *«Of course. Can I get your name and number so they can reach you directly?»*

**Правило:** якщо ти не можеш відповісти «хто, з якої компанії, з яким питанням і як передзвонити» — дзвінок зафіксований неправильно.

### 3.6 Клієнт з багатьма перевізниками (5+)
Переводь на email: *«That's quite a few carriers. To make sure we don't miss anyone, can you email me the list with their MC numbers? Much faster that way.»*

---

## Розділ 4 — Ціна
Детально з прикладами — [Ціна по сервісах](10_pricing.md).

### 4.1 Instant pricing — одразу після freight info
Ціна звучить одразу після інформації про вантаж — **до** питань про дату, перевізника, email.
> *«Great! The rate is [PRICE] per pallet. Sound good?»* → *«Wonderful!»* → продовжуємо

Сервіси: Cross-Dock, Storage, Overweight Help, Cross-Dock Deconsolidation.

### 4.2 Delayed pricing — чіткі очікування
> *«Our transport team is already working on your quote — you'll have it within the hour, sometimes faster.»*
> *«Once you get it, just reply 'confirm' — that's all we need.»*

Сервіси: Local Pickup, Local Delivery, Middle Mile, Drayage.

### 4.3 Rework — попередня ціна
Ціна після фото, і клієнт має розуміти, що вона попередня:
> *«The quote I'll give you based on photos will be preliminary — the final price is confirmed when freight arrives. But it's usually very close.»*

Сказати один раз, не повторювати в закритті.

### 4.4 Клієнт порівнює ціни (shopping around)
Не тисни. Дай ціну, запропонуй забронювати, залиш вибір.
> *«That's [PRICE] for [DATE]. Would you like me to book that now, or would you like some time to think about it?»*
> Хоче подумати: *«No problem. Just reach out when you're ready — we'll be here.»*

> 🔄 «Shopping around» — це поведінка клієнта, а не окрема кваліфікація. Тип дзвінка — General Inquiry (або Deal, якщо є всі 4 критерії).

---

## Розділ 5 — Admin-блок («By the way»)

### 5.1 Email і оплата — невимушено
Admin-питання подаємо як технічну необхідність, не формальність.
- Email: *«Perfect. And can I grab your email? Our system sends the confirmation and invoice there.»*
- Оплата: *«Excellent. And how will you be paying for this?»*

Email і оплату збираємо **після** ціни, не до.

⚠️ **Email — обов'язковий.** Без нього контакт у CRM неповний. Закриття без email = незавершений дзвінок. Не переходь до підсумку, поки email не зафіксований.

### 5.2 Передоплата (transport-сервіси)
> *«Just so you know — we require prepayment for transport services. Once you confirm the quote, we'll send the invoice. Pickup is scheduled after payment.»*

Існуючий клієнт з умовами оплати: *«Perfect. We'll continue with your usual payment terms.»*
Не кажемо, що передоплата «для нових клієнтів» — це відкриває зайве питання. Просто озвучуємо як стандарт.

---

## Розділ 6 — Закриття

### 6.1 Підсумок (recap)
Обов'язково: **тип сервісу · дата і час · кількість**.
- Instant pricing — з ціною: *«So just to recap: cross-dock on Tuesday, 8 pallets coming in. You'll get the confirmation email in a few minutes.»*
- Delayed pricing — без ціни, з очікуваннями: *«So we've got [FREIGHT] pickup from [LOCATION] on [DATE]. Quote coming within the hour — just reply to confirm.»*

Не включати: зайві деталі, назви перевізників (якщо не критично), спосіб оплати.

### 6.2 Фрази закриття
> *«Is there anything else I can help you with today?»*
> *«By the way — next time you can book directly online at freitty.com. Takes less than a minute.»*
> *«Thank you for choosing Freitty. Have a great day!»*

Варіанти платформи: *«Next time feel free to book online — same pricing, instant confirmation.»* · *«You can also place your next order on our website — no need to call.»*

Правила:
- завжди питай про додаткові потреби перед прощанням — іноді є ще одне замовлення;
- **платформу згадуємо тільки після вдало закритих розмов**, не при відмові чи складних кейсах;
- кожен клієнт, переведений на самообслуговування, = менше навантаження на КС.

---

## Розділ 7 — Вихідні дзвінки

### 7.1 Ти телефонуєш — ти береш ініціативу
Після «Is now a good time?»: *«I'm calling about [причина]. I just have a couple of quick questions for you.»*

### 7.2 YELLOW callback — клієнт подав заявку онлайн
Клієнт подав заявку через Instant Book і отримав YELLOW. Тон — проактивний і позитивний: ми дзвонимо швидко, це добре.
> *«I'm calling about your booking request, order FR[NUMBER]. I have a couple of quick questions to get you confirmed.»*
> Не впізнає: *«It's your [SERVICE] request at our [LOCATION] facility for [DATE].»*

**Не кажи** «your request was flagged» чи «there's an issue» — клієнт не має відчувати тривогу.

### 7.3 Передзвон на пропущений
> *«We had a missed call from this number. Were you trying to reach Freitty, the cross-docking platform?»*
> Так → стандартний вхідний флоу. Ні → *«No problem at all. If you ever need us, we're here. Have a great day!»*

### 7.4 Follow-up по існуючому замовленню
- **А — ми обіцяли щось уточнити:** *«Hi, this is [NAME] from Freitty. I'm calling back about your order FR[NUMBER] — I have an update for you.»* Одразу до суті.
- **Б — підтвердження, що все в силі:** *«Hi, this is [NAME] from Freitty. Just wanted to confirm everything is still on track for [DATE] at [TIME].»* Є зміни → новий ETA, оновлюємо ордер.
- **В — клієнт не прибув / запізнюється:** *«Hi, this is [NAME] from Freitty. We have you scheduled for [TIME] — just checking if you're on your way or if we need to adjust the appointment.»* Не починай з «you're late» — звучить як претензія. Новий ETA → оновлюємо. Немає відповіді після 2 follow-up → Declined (No show).

---

## Розділ 8 — Trojan Horse (визначення брокерів)
Фоновий процес на кожному дзвінку: мовчки перевіряєш сигнали брокера, поки ведеш звичайну розмову. Жодних додаткових питань клієнту.
**Мета:** знайти брокерів серед клієнтів → позначка в HubSpot → менеджер партнерств підхоплює. Агент не конвертує брокера сам — тільки визначає і передає.
Повністю — [Брокери і Trojan Horse](12_trojan-horse.md).

---

## Розділ 9 — Мовні правила

### 9.1 Завжди говоримо
| Фраза | Коли |
|---|---|
| «Absolutely!» / «Perfect!» | Підтвердження, що почули і готові |
| «Got it.» | Після отримання інформації |
| «No problem at all.» | Коли клієнт чогось не знає або вибачається |
| «Just to recap…» | Перед закриттям |
| «Is now a good time?» | На кожному вихідному |
| «By the way…» | Для admin-питань (email, оплата) |
| «You'll receive a confirmation email shortly.» | У закритті після бронювання |

### 9.2 Ніколи не говоримо
| Фраза | Замінити на |
|---|---|
| «I think we can…» / «Maybe…» | «Absolutely, we can!» |
| «I'll call you back later.» | «You'll hear from us within the hour.» |
| «Let me check if we do that.» | «Absolutely, we handle that all the time.» |
| «I don't know.» | «Let me find out for you right away.» |
| «That's not my department.» | «Let me connect you with the right person.» |
| «You should have…» / «You need to…» | «What works best is…» / «We recommend…» |
| «Actually, that's not how it works.» | М'яко направляй без виправлення |

> 🔄 **Актуально в CAE:** «maybe» в ввічливому проханні («Maybe you can send me your email») — нормально. Передзвон із часом або подією («once the photos come in») — нормально. Деталі — [Банк фраз](11_phrase-bank.md).

### 9.3 Тон: professional but human
Не робот, не друг — колега, який знає свою справу.
- варіюй формулювання — той самий скрипт звучить щоразу по-різному;
- possessive-мова: *«your freight», «your truck», «your booking»* — клієнт відчуває, що це його;
- емпатія без втрати структури: клієнт поспішає → *«I'll move fast on this for you»* → але все одно збирай усе;
- агресивний клієнт → той самий рівний тон. Не приймай на особистий рахунок.

### 9.4 Причина пошкодження вантажу — категорична відмова (тільки Rework)
Клієнт привозить пошкоджений вантаж — ми **не коментуємо**, чому він пошкоджений, і не даємо висновків про причину.
> *«I understand you're looking for that. But we're not able to make any statements about the cause — we're a service platform, not an expert bureau. What we can do is fix the issue and document the current condition.»*

Ніколи не звинувачуй жодну сторону, не давай навіть неофіційної думки. Юридичний ризик. (Претензії по пошкодженнях під час нашого обслуговування — окремий протокол.)

---

## Розділ 10 — Hazmat-протокол
Однаковий для всіх сервісів. Вирішується під час дзвінка — без передзвону.
1. **Клас:** *«What class is it?»*
2. **Перевірка в системі** (мовчки, секунда): які класи приймає обрана локація.
3. **а)** Приймає → продовжуємо як звичайно. **б)** Не приймає → *«Unfortunately, our facility doesn't accept that hazmat class. I apologize we couldn't help with this one. Is there anything else I can assist you with?»*

Оператор знає відповідь одразу. Жодної сірої зони, жодного «перевіримо і передзвонимо».

---

## Підсумок: 10 правил, які завжди
1. **Рішення перед даними** — ціна одразу, деталі після (де можливо)
2. **Впевнено завжди** — «Absolutely!», а не «I think maybe…»
3. **Не питай двічі** — слухай, запам'ятовуй, адаптуй
4. **Об'єднуй питання** — максимум 2 речі за раз
5. **Hazmat = клас, не UN** — питаємо клас, перевіряємо локацію одразу, відповідь на дзвінку
6. **Чіткі очікування** — кажи «коли», а не «пізніше»
7. **«Is now a good time?»** — на кожному вихідному
8. **Підсумок перед закриттям** — дата, сервіс, кількість
9. **Trojan Horse мовчки** — на кожному дзвінку, ніколи вголос
10. **Ніколи про причину пошкодження** — категорично, завжди
