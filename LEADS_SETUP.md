# ربط طلبات OLLANO بـ Google Sheet (الدفع عند الاستلام)

الموقع بيبعت كل طلب كـ **JSON عبر POST** لرابط **Google Apps Script Web App**، والسكربت بيكتبه في الشيت. كله من جهة المتصفح — فيشتغل على Firebase App Hosting / Hosting من غير أي سيرفر.

---

## الخطوات

### 1) اعمل Google Sheet جديد
- افتح [sheets.new](https://sheets.new) وسمّيه مثلاً `OLLANO Orders`.

### 2) افتح محرر Apps Script
- من داخل الشيت: **Extensions → Apps Script**.
- امسح أي كود موجود، والصق الكود ده:

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Orders') || ss.insertSheet('Orders');

    // صف العناوين (مرة واحدة)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'التاريخ', 'الاسم', 'الهاتف', 'الواتساب', 'العنوان',
        'النوع', 'استخدم قبل', 'يعاني تساقط',
        'العرض', 'الكمية', 'السعر', 'الدفع', 'الصفحة'
      ]);
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.name || '',
      data.phone || '',
      data.whatsapp || '',
      data.address || '',
      data.gender || '',
      data.usedBefore || '',
      data.suffers || '',
      data.offer || '',
      data.qty || '',
      data.price || '',
      data.payment || '',
      data.page || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

- احفظ (💾 أو Ctrl+S).

### 3) انشر كـ Web App
- فوق على اليمين: **Deploy → New deployment**.
- **Select type** (الترس ⚙️) → **Web app**.
- الإعدادات:
  - **Description:** `OLLANO leads`
  - **Execute as:** `Me`
  - **Who has access:** `Anyone`  ← مهم جدًا
- اضغط **Deploy** → وافق على الصلاحيات (Authorize) لحسابك.
- انسخ **Web app URL** (بيكون شكله: `https://script.google.com/macros/s/AKfy.../exec`).

### 4) حط الرابط في الموقع
- افتح [script.js](script.js) ودوّر على السطر:
  ```javascript
  const LEADS_ENDPOINT = '';
  ```
- حط رابطك بين علامتي التنصيص:
  ```javascript
  const LEADS_ENDPOINT = 'https://script.google.com/macros/s/AKfy.../exec';
  ```

### 5) ارفع/انشر الموقع على Firebase
- بعد ما تحط الرابط، اعمل deploy للموقع زي المعتاد.

---

## تجربة سريعة
- افتح الموقع → اضغط زر الطلب → كمّل الكويز وابعت.
- لازم يظهر صف جديد في تبويب **Orders** في الشيت خلال ثوانٍ.

---

## ملاحظات مهمة
- **تعديل السكربت لاحقًا:** أي تعديل في كود Apps Script محتاج **New deployment** (أو Manage deployments → تعديل النسخة) عشان يسري المفعول.
- **النسخة الاحتياطية:** الموقع بيخزّن نسخة من كل طلب في `localStorage` (`ollano_orders`) كأمان إضافي لو النت قطع لحظة الإرسال.
- **CORS:** بنستخدم `mode: 'no-cors'` + `text/plain`، فالطلب بيوصل ويُحفظ بدون مشاكل CORS (الاستجابة بترجع opaque — عادي، الحفظ بيتم).
- **(اختياري) حماية من السبام:** ممكن نضيف توكن سري:
  - في الموقع: ضيف `token: 'سر_طويل'` لكائن `order`.
  - في السكربت: في أول `doPost` تحقق `if (data.token !== 'سر_طويل') return ...;`
  قوللي لو عايز ده وأظبطه.

---

## شكل البيانات اللي بتتبعت (JSON)
```json
{
  "gender": "أنثى",
  "usedBefore": "لا",
  "suffers": "نعم، بشكل واضح",
  "name": "سارة محمد",
  "phone": "010xxxxxxxx",
  "whatsapp": "010xxxxxxxx",
  "address": "القاهرة / مدينة نصر / شارع... / بجوار...",
  "offer": "اشترِ 2 + 2 مجاناً",
  "qty": "4 عبوات",
  "price": "549 ج.م",
  "payment": "الدفع عند الاستلام",
  "page": "https://...",
  "createdAt": "2026-06-01T..."
}
```
