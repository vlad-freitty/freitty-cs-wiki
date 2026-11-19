# Hazmat — нульова толерантність

[← Зміст](00_README.md)

> **Hazmat питаємо на кожному дзвінку, де йдеться про вантаж. Без винятків. І це має бути питання.**

## Чому так суворо
Небезпечний вантаж без перевірки — юридична і фізична відповідальність хабу (49 CFR). Запис дзвінка, де клієнт **відповів** на питання про hazmat, захищає компанію. Тому:

- пункт «Hazmat» — найважчий у чеклісті продажу: **15%**;
- **PARTIAL не буває** — або питання прозвучало, або ні;
- якщо питання не прозвучало, **керівник отримує сигнал одразу**, незалежно від решти оцінки.

## Як питати

**Клієнт нічого не казав про характер вантажу → відкрите питання:**
> *«And this is regular freight, correct? Not hazardous materials?»*

**Клієнт сказав сигнальну фразу → підтверджуюче питання:**
| Сигнальна фраза | Що означає |
|---|---|
| FAK (Freight All Kinds) | Змішаний звичайний вантаж |
| dry goods | Сухий непродовольчий вантаж |
| general cargo | Загальний вантаж |
| consumer goods | Споживчі товари |
| retail freight | Роздрібний вантаж |

> *«You mentioned FAK — just to confirm, no hazardous materials?»*
> *«You said dry goods — just to confirm, no hazardous materials?»*

Навіть якщо сигнал очевидний — **ми не припускаємо, ми підтверджуємо.**

## ⚠️ Твердження ≠ питання
Найчастіша помилка в КС:

| ❌ Не зараховується | ✅ Зараховується |
|---|---|
| «Five pallets of frozen food, so it's not hazmat» | «Five pallets of frozen food, so it's not hazmat, **correct?**» |
| «One display, it means that it's not hazmat» | «One display — so nothing hazardous, **right?**» |
| «We don't take hazmat» (без питання) | «Is it something dangerous?» |
| Hazmat згадав тільки клієнт, оператор не відреагував | «Just to double-check it's not hazmat, correct?» |

Різниця — в одному слові. Клієнт має **підтвердити**.

## Які формулювання зараховуються
Слово «hazmat» не обов'язкове. Зараховується будь-яке питання з цих груп:

| Група | Формулювання |
|---|---|
| Пряма | hazmat · hazardous · hazardous materials · hazmat freight |
| Через небезпеку | anything dangerous · is it something dangerous · anything hazardous · nothing dangerous, right · dangerous goods |
| Через властивість | anything flammable · explosive · corrosive · any chemicals · toxic |
| Через регуляторику | DOT regulated · placarded · restricted materials · restricted commodities |
| Зворотне підтвердження | regular freight, correct? · just regular freight · standard freight, right? · nothing hazardous · it's all general merchandise, correct? · no hazmat, right? |
| Через клас / UN | згадка class 3, class 8, UN number — розмова про hazmat відбулась |

«Is it something dangerous?» — нормальний варіант, якщо клієнт може не знати слова «hazmat».

**Дзвінок українською / російською:** формулювання оцінюються за змістом. «Це ж не небезпечний вантаж, правильно?» = питання про hazmat.

## Якщо hazmat є — протокол
1. **Клас:** *«What class is it?»* — саме клас (1–9), а не UN-номер.
2. **Перевірка в системі** (мовчки, секунда): які класи приймає обрана локація.
3. **Рішення на дзвінку:**
   - приймає → продовжуємо як звичайно, hazmat не змінює флоу;
   - не приймає → *«Unfortunately, our facility doesn't accept that hazmat class. I apologize we couldn't help with this one. Is there anything else I can assist you with?»* → кваліфікація **Service is Not Supported**.

**Жодного «перевіримо і передзвонимо».** Це FAIL так само, як і не запитати.

| Ситуація | Результат |
|---|---|
| Питання не прозвучало | FAIL + сигнал керівнику одразу |
| «Yes, hazmat», а клас не уточнено | FAIL + сигнал |
| Клас уточнено, рішення на дзвінку (так або ні) | PASS |
| «Let me check and call you back» | FAIL |

## Коли hazmat не перевіряється
| Ситуація | Чому |
|---|---|
| **Follow Up / Update** | Ордер уже існує, hazmat з'ясовували на першому дзвінку |
| Дзвінок-підтвердження вже оформленого онлайн-бронювання | Вантаж уже заброньований |
| **Qualified Interrupted**, обірваний у перші 45 секунд (клієнт поклав або зв'язок пропав) | Оператор фізично не встиг. Усі три умови мають бути разом |
| Групи «Пояснення / відмова», «Партнерство», нецільові | Пункту hazmat у їхньому чеклісті немає. Але факт питання все одно фіксується |

> Перепитати hazmat **не** вважається повторним питанням. Краще двічі, ніж жодного.

## Як система перевіряє (щоб не було хибних тривог)
Після випадку, коли система пропустила правильне питання «just to double-check it's not hazmat, correct?», hazmat перевіряється **двома незалежними способами**:
1. пошук слів із довідника в репліках оператора;
2. якщо знайдено — AI зобов'язаний розібрати саме цю репліку: це питання клієнту чи ні.

FAIL і сигнал керівнику — **тільки якщо обидва способи кажуть «не питали»**.

Якщо ти питала, а система поставила FAIL — надішли ID дзвінка Оксані.
