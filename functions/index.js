const { onRequest } = require('firebase-functions/v2/https');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// معرّف الشيت اللي هتتسجل فيه الطلبات
const SHEET_ID = '1XSGO_b5GkQYqmb4rvWsWQN5eV1bT-XbXgqOJBiMosJI';
const TAB = 'Orders';
const HEADERS = [
  'التاريخ', 'الاسم', 'رقم الهاتف', 'رقم الواتس', 'المحافظة',
  'المنطقة', 'العنوان', 'تفاصيل الطلب', 'الكمية', 'توتال السعر شامل الشحن',
  'اسم المنتج', 'الحالة', 'ملاحظات'
];

exports.lead = onRequest(
  { region: 'us-central1', cors: true },
  async (req, res) => {
    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
    if (req.method !== 'POST') {
      res.status(405).json({ result: 'error', message: 'POST only' });
      return;
    }

    try {
      const data = typeof req.body === 'string'
        ? JSON.parse(req.body || '{}')
        : (req.body || {});

      // مصادقة بالسيرفس أكاونت
      const creds = JSON.parse(fs.readFileSync(path.join(__dirname, 'firebase-key.json'), 'utf8'));
      const auth = new google.auth.JWT({
        email: creds.client_email,
        key: creds.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });
      const sheets = google.sheets({ version: 'v4', auth });

      // الحصول على اسم أول تبويب في الشيت تلقائياً لتفادي أخطاء اختلاف الأسماء (مثل ورقة1 أو Sheet1)
      const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
      const firstSheetName = meta.data.sheets && meta.data.sheets[0] && meta.data.sheets[0].properties
        ? meta.data.sheets[0].properties.title
        : TAB;

      // صف العناوين (مرة واحدة لو التبويب فاضي)
      const head = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${firstSheetName}!A1:M1`
      });
      if (!head.data.values || head.data.values.length === 0) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: `${firstSheetName}!A1`,
          valueInputOption: 'RAW',
          requestBody: { values: [HEADERS] }
        });
      }

      // تقسيم العنوان بالكامل (المحافظة / المدينة / العنوان التفصيلي)
      const addressParts = (data.address || '').split('/').map(s => s.trim());
      const governorate = addressParts[0] || '';
      const region = addressParts[1] || '';
      const streetAddress = addressParts.slice(2).join(' / ') || '';

      // تجميع إجابات الكويز ورابط الصفحة في خانة الملاحظات
      const notes = [
        data.gender ? `النوع: ${data.gender}` : '',
        data.usedBefore ? `استخدم سابقاً: ${data.usedBefore}` : '',
        data.suffers ? `يعاني تساقط: ${data.suffers}` : '',
        data.page ? `الرابط: ${data.page}` : ''
      ].filter(Boolean).join(' | ');

      const row = [
        new Date().toLocaleString('ar-EG'), // 1. التاريخ
        data.name || '',                     // 2. الاسم
        data.phone || '',                    // 3. رقم الهاتف
        data.whatsapp || '',                 // 4. رقم الواتس
        governorate,                         // 5. المحافظة
        region,                              // 6. المنطقة
        streetAddress,                       // 7. العنوان
        data.offer || '',                    // 8. تفاصيل الطلب
        data.qty || '',                      // 9. الكمية
        data.price || '',                    // 10. توتال السعر شامل الشحن
        'لوشن أولانو المضاد لتساقط الشعر',   // 11. اسم المنتج
        data.payment || 'الدفع عند الاستلام', // 12. الحالة
        notes                                // 13. ملاحظات
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: `${firstSheetName}!A1`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [row] }
      });

      res.status(200).json({ result: 'ok' });
    } catch (err) {
      console.error('lead error:', err);
      res.status(500).json({ result: 'error', message: String((err && err.message) || err) });
    }
  }
);
