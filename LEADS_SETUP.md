# ربط طلبات OLLANO بـ Google Sheet — عبر Cloud Function آمنة

الموقع يبعت كل طلب كـ **JSON** إلى `/api/lead` (نفس الدومين عبر Hosting rewrite) →
**Cloud Function** تمسك مفتاح السيرفس أكاونت من **Secret Manager** وتكتب الصف في الشيت بالـ Sheets API.
**المفتاح لا يلمس المتصفح إطلاقًا.**

- الشيت: `1XSGO_b5GkQYqmb4rvWsWQN5eV1bT-XbXgqOJBiMosJI`
- كود الفنكشن: [functions/index.js](functions/index.js)

---

## مرة واحدة — قبل النشر

### 1) جدّد مفتاح السيرفس أكاونت (لأن القديم اتكشف)
Firebase Console → ⚙️ Project Settings → **Service accounts** → **Generate new private key** → نزّل ملف JSON الجديد. (الإيميل يفضل نفسه: `firebase-adminsdk-fbsvc@ollano-eg.iam.gserviceaccount.com`)

### 2) شارك الشيت مع السيرفس أكاونت
افتح الشيت → **Share** → ضيف الإيميل ده **كـ Editor**:
```
firebase-adminsdk-fbsvc@ollano-eg.iam.gserviceaccount.com
```

### 3) جهّز تبويب الطلبات
في الشيت، سمّي التبويب الأول **`Orders`** (الفنكشن هتضيف صف العناوين تلقائيًا أول طلب).

### 4) فعّل خطة Blaze
Cloud Functions تحتاج خطة **Blaze** (الدفع حسب الاستخدام — مجانية عمليًا للأحجام الصغيرة).

---

## النشر (من تيرمنال داخل مجلد المشروع)

```bash
# تثبيت أدوات فايربيز (مرة واحدة)
npm install -g firebase-tools
firebase login

# تثبيت اعتماديات الفنكشن
cd functions && npm install && cd ..

# خزّن مفتاح السيرفس أكاونت في Secret Manager (هيطلب تلصق محتوى ملف JSON كامل)
firebase functions:secrets:set GOOGLE_SA_KEY
# الصق كل محتوى ملف الـ JSON ثم Enter ثم Ctrl+D

# انشر الفنكشن + الموقع
firebase deploy --only functions,hosting
```

> **تلصق إيه في `GOOGLE_SA_KEY`؟** كل محتوى ملف الـ service account JSON الجديد (من `{` لـ `}`).

---

## تجربة
افتح الموقع المنشور → زر الطلب → كمّل الكويز وابعت → لازم يظهر صف جديد في تبويب **Orders** خلال ثوانٍ.

اختبار مباشر للـ endpoint:
```bash
curl -X POST https://ollano-eg.web.app/api/lead \
  -H "Content-Type: application/json" \
  -d '{"name":"تجربة","phone":"01000000000","whatsapp":"01000000000","address":"القاهرة / مدينة نصر / شارع"}'
```

---

## ملاحظات
- **أمان:** المفتاح في Secret Manager فقط؛ الموقع يكلّم `/api/lead` بنفس الدومين (مفيش CORS، ومفيش أي مفتاح في الواجهة).
- **نسخة احتياطية:** الموقع يخزّن نسخة من كل طلب في `localStorage` (`ollano_orders`) كأمان لو الشبكة قطعت.
- **تعديل الفنكشن لاحقًا:** أعد `firebase deploy --only functions`.
- **تغيير الشيت:** عدّل `SHEET_ID` في [functions/index.js](functions/index.js) ثم انشر.
- **بديل بدون مفتاح (أأمن):** بدل المفتاح، الفنكشن ممكن تستخدم السيرفس أكاونت بتاع التشغيل مباشرة (ADC) — قوللي لو عايز أحوّلها لده.
