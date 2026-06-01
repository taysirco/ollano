# دليل صور صفحة OLLANO — بريف التوليد بالذكاء الاصطناعي (Google Gemini / Nano Banana)

> المنتج: **OLLANO – سيرم/لوشن مضاد لتساقط الشعر 125مل** (مجموعة عناية عشبية).
> الهوية: بنفسجي `#3B2A7A` + أخضر `#6CBF4B` + غطاء فضي + عبوة بيضاء. شعار OLLANO + رمزة الورقة الخضراء + Tagline: *THE POWER OF HERBAL INTEGRATION*.
> الصور الخام المرجعية في مجلد `my-product/`:
> - `IMG_0990.jpg` / `IMG_0991.JPG` → عبوة + علبة على خلفية بنفسجية.
> - `IMG_0992.JPG` / `IMG_0993.JPG` / `IMG_0994.JPG` → عبوة + علبة على خلفية رمادية/استوديو نظيفة (الأفضل للقص والعزل).
> - `PHOTO-2026-...-15(.. 2)` → لقطات عرضية (1280×911).
> - `PHOTO-2026-...-16(.. 2)` → لقطات طولية (902×1280).
> - البروشور (به السيروم الذهبي + الشامبوهات) مرجع لأي منتج غير اللوشن.

## قواعد عامة قبل التوليد
1. في Gemini ارفع **الصورة الخام كـ reference image** واطلب: *"keep the exact OLLANO bottle, label text, logo and colors identical to the reference; do not redesign the label."* — هذا يحافظ على ثبات المنتج في كل الصور.
2. ولّد بدقة **2K** ثم صغّر للمقاس النهائي (أوضح وأنقى).
3. استخدم نفس الإضاءة والزاوية لكل صور المنتج حتى تبدو المجموعة متناسقة.
4. صيغة: المنتجات/اللايف ستايل = `.jpg` جودة 90٪. قبل/بعد = `.png`.

---

## جدول الصور المطلوبة (بالضبط كما تستدعيها الصفحة)

### 1) صورة المنتج الرئيسية — `ollano-lotion.jpg`  ★ الأهم (مستخدمة 13 مرة)
- **الموضع:** صورة الهيرو الرئيسية + المصغّرات + بطاقات التسعير + بطاقة "كيف يعمل" + مصغّرة المراجعات + زر السلة العائم.
- **الأبعاد:** مربّع 1:1 — **1600×1600 px** (توليد 2K مربع).
- **الوصف العميق:** العبوة البيضاء بغطاء المضخّة الفضي واقفة وحدها في المنتصف، إضاءة استوديو ناعمة، ظل خفيف أسفلها، خلفية بيضاء نقية أو تدرّج بنفسجي فاتح جدًا، الملصق واضح ومقروء بالكامل، زاوية أمامية ¾.
- **المرجع:** `my-product/IMG_0992.JPG` (الخلفية الرمادية النظيفة).
- **Prompt:**
```
Using the attached OLLANO bottle photo as reference, create a premium e-commerce product shot of the SAME white OLLANO anti-hair-loss bottle with its silver pump cap. Keep the label, logo, purple/green bands and all text identical to the reference. Single bottle centered, three-quarter front angle, soft studio lighting, subtle soft shadow beneath, clean pure-white background with a very faint lilac gradient glow. Ultra sharp, high-end cosmetic advertising look, no extra props, no text overlays. Aspect ratio 1:1.
```

### 2) العبوة + العلبة معًا — `ollano-lotion-box.jpg` (5 مرات)
- **الموضع:** مصغّرة الهيرو، قسم "شاهد النتائج"، قسم المشكلة/الحل، مصغّرة مراجعة.
- **الأبعاد:** مربّع 1:1 — **1600×1600 px**.
- **الوصف:** العبوة والكرتونة جنب بعض، الكرتونة مائلة قليلًا للخلف، نفس إضاءة الصورة 1، خلفية بنفسجية فاتحة راقية.
- **المرجع:** `my-product/IMG_0990.jpg`.
- **Prompt:**
```
Using the attached reference, render the SAME OLLANO white bottle (silver pump) next to its matching white-and-purple carton box, keeping every label detail, logo and color identical. Bottle upright front-left, box slightly tilted back-right. Soft premium studio lighting, gentle reflection on the surface, elegant light-lilac gradient background. Cosmetic advertising quality, sharp focus, no text overlays. Aspect ratio 1:1.
```

### 3) لقطة لايف ستايل / موديل — `ollano-hero-banner.jpg` (5 مرات)
- **الموضع:** مصغّرة الهيرو، فيديو "شاهد النتائج"، صورة قسم "لماذا يختار الآلاف"، صورة المراجعات.
- **الأبعاد:** طولي 4:5 — **1280×1600 px** (أنسب نسبة للايف ستايل المتكرر).
- **الوصف العميق:** امرأة/رجل (٢٥–٣٥ سنة، ملامح شرق أوسطية) بشعر كثيف لامع صحي، تمسك عبوة OLLANO قرب الكتف وتبتسم، حمام/طاولة زينة بإضاءة طبيعية دافئة، لمسات بنفسجية في الخلفية.
- **المرجع:** `my-product/IMG_0992.JPG` (للعبوة) + وصف الموديل.
- **Prompt:**
```
Lifestyle beauty photo: a Middle-Eastern woman, 28, with thick glossy healthy hair, smiling and holding the attached OLLANO bottle near her shoulder. Keep the bottle label, logo and colors identical to the reference. Bright airy bathroom / vanity setting, soft natural window light, subtle lilac and white tones, shallow depth of field. Authentic, aspirational skincare-brand style, photorealistic. Aspect ratio 4:5.
```

### 4) السيروم الزيتي — `ollano-serum.jpg` (مرتان)
- **الموضع:** قسم "شاهد النتائج"، بطاقة "تغذية مستمرة 24 ساعة".
- **الأبعاد:** مربّع 1:1 — **1600×1600 px**.
- **الوصف:** عبوة السيروم الزيتي الذهبية/الكهرمانية الصغيرة (Hair Oil Serum) بنفس هوية OLLANO، قطرات زيت ذهبية حولها.
- **المرجع:** قصّ السيروم الذهبي من البروشور `my-product/PHOTO-2026-...-15.jpg`.
- **Prompt:**
```
Using the gold OLLANO "Hair Oil Serum" from the attached brochure as reference, create a clean product shot of that same amber/gold serum bottle, label and logo identical. Centered, three-quarter angle, a few glossy golden oil droplets near the base, soft studio light, warm white background with faint gold glow. Premium cosmetic look, sharp, no text overlay. Aspect ratio 1:1.
```

### 5) الشامبو — `ollano-shampoo.jpg` (مرة)
- **الموضع:** بطاقة "حماية من هرمون DHT".
- **الأبعاد:** مربّع 1:1 — **1600×1600 px**.
- **الوصف:** أنبوب/عبوة شامبو OLLANO المضاد لتساقط الشعر (بنفسجي) أو المضاد للقشرة (أخضر) + علبته.
- **المرجع:** `my-product/IMG_0991.JPG` (شامبو القشرة الأخضر) أو قصّة الشامبو من البروشور.
- **Prompt:**
```
Using the attached OLLANO shampoo as reference, render the same OLLANO shampoo tube next to its matching box, labels/logo/colors identical to the reference. Upright, three-quarter angle, soft studio lighting, light neutral background with a subtle green-and-white tone. Clean cosmetic advertising quality, sharp focus, no text overlay. Aspect ratio 1:1.
```

### 6) فلات-لاي المكوّنات — `ollano-brochure.jpg` (مرتان، مصغّرة "تفاصيل المنتج")
- **الأبعاد:** مربّع 1:1 — **1600×1600 px**.
- **الوصف العميق:** العبوة في المنتصف محاطة بمكوّناتها الطبيعية: أغصان إكليل الجبل (روزماري) الخضراء، حبوب البن (الكافيين)، ثمرة أرغان وقطرات زيت أرغان ذهبية، كبسولات بيوتين — فلات-لاي من أعلى على سطح فاتح.
- **المرجع:** `my-product/IMG_0992.JPG`.
- **Prompt:**
```
Top-down flat-lay: the attached OLLANO bottle (label/logo identical to reference) lying centered, surrounded by its natural ingredients — fresh rosemary sprigs, coffee beans, an argan fruit with golden argan-oil droplets, and a few biotin capsules — arranged neatly on a soft off-white marble surface. Bright natural light, airy premium herbal-cosmetic editorial style, photorealistic. Aspect ratio 1:1.
```

### 7) ماكرو القوام/المكوّنات — `ollano-product-details.jpg` (مرتان، مصغّرة)
- **الأبعاد:** مربّع 1:1 — **1600×1600 px**.
- **الوصف:** لقطة قريبة جدًا لقوام السيرم الشفاف وهو ينساب من غطاء المضخة، أو قطرة على فروة رأس/شعر، إبراز اللمعان والترطيب.
- **المرجع:** `my-product/IMG_0993.JPG`.
- **Prompt:**
```
Extreme macro close-up of the attached OLLANO product's silver pump dispensing a clear glossy serum drop, with the bottle softly blurred behind (label still recognizable). Water-like droplets, dewy reflective texture, soft lilac studio lighting, luxurious skincare macro photography, photorealistic, no text. Aspect ratio 1:1.
```

### 8) قبل — `hair-before.png`  &  9) بعد — `hair-after.png`
- **الموضع:** سلايدر "قبل/بعد" (يتراكبان — لازم **نفس الشخص، نفس الزاوية، نفس الكادر، نفس الإضاءة** بالضبط).
- **الأبعاد:** مربّع 1:1 — **1200×1200 px** لكل منهما (متطابقة تمامًا). صيغة PNG.
- **الوصف:**
  - *قبل:* مقدمة رأس/فرق شعر لرجل أو امرأة بشعر خفيف وفراغات واضحة وفروة ظاهرة.
  - *بعد:* نفس الشخص ونفس الزاوية بشعر أكثف وأقوى وفراغات ممتلئة.
- **المرجع:** لا يحتاج المنتج — ولّد الاثنين في طلب واحد لضمان التطابق.
- **Prompt (قبل):**
```
Realistic top-of-head close-up of a person's scalp showing noticeable hair thinning and visible scalp gaps along the part line, neutral soft lighting, plain light background, documentary "before" style, photorealistic. Aspect ratio 1:1.
```
- **Prompt (بعد):**
```
Same person, exact same camera angle, framing, lighting and background as the previous image, but now with visibly thicker, fuller, denser hair and the gaps filled in, healthy shine, "after" result style, photorealistic. Aspect ratio 1:1.
```
> نصيحة: ولّد "قبل" أولًا ثم استخدمها كـ reference لتوليد "بعد" حتى يتطابق الكادر تمامًا داخل السلايدر.

### 10) صور العملاء (UGC) — 6 صور — `assets/images/ugc-models/ugc-1.jpg … ugc-6.jpg`
- **الموضع:** المثالي لقسمي "شاهد النتائج" (فيديوهات) و"التقييمات" بدل صور المنتج المكررة.
- **الأبعاد:** طولي 4:5 — **1280×1600 px** لكل صورة.
- **الوصف:** أشخاص حقيقيون متنوّعون (رجال ونساء، ٢٥–٤٥) بملامح شرق أوسطية، سيلفي طبيعي بإضاءة منزلية، يمسكون عبوة OLLANO ويبتسمون، شعر صحي — يبدون كعملاء حقيقيين لا كموديلات إعلانية.
- **المرجع:** `my-product/IMG_0992.JPG` (للعبوة).
- **Prompt (كرّره بتنويع الشخص):**
```
Authentic UGC-style selfie of a real-looking Middle-Eastern [man 35 / woman 29], casual home lighting, holding the attached OLLANO bottle (label identical to reference) toward the camera, genuine happy smile, healthy thick hair, slightly imperfect phone-photo look, photorealistic, not a studio ad. Aspect ratio 4:5.
```

---

## ملخص المقاسات
| النوع | الملفات | النسبة | المقاس النهائي |
|------|---------|--------|----------------|
| منتج مفرد/مع علبة | ollano-lotion, ollano-lotion-box, ollano-serum, ollano-shampoo, ollano-brochure, ollano-product-details | 1:1 | 1600×1600 |
| لايف ستايل | ollano-hero-banner | 4:5 | 1280×1600 |
| قبل/بعد | hair-before.png, hair-after.png | 1:1 | 1200×1200 |
| UGC عملاء | ugc-1 … ugc-6 | 4:5 | 1280×1600 |

> كل الملفات تُحفظ في `assets/images/` (وصور UGC في `assets/images/ugc-models/`) بنفس الأسماء أعلاه حتى تعمل مباشرة دون تعديل الكود.
