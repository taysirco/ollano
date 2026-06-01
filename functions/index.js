const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const { google } = require('googleapis');

// معرّف الشيت اللي هتتسجل فيه الطلبات
const SHEET_ID = '1XSGO_b5GkQYqmb4rvWsWQN5eV1bT-XbXgqOJBiMosJI';
const TAB = 'Orders';
const HEADERS = [
  'التاريخ', 'الاسم', 'الهاتف', 'الواتساب', 'العنوان',
  'النوع', 'استخدم قبل', 'يعاني تساقط',
  'العرض', 'الكمية', 'السعر', 'الدفع', 'الصفحة'
];

// مفتاح السيرفس أكاونت (JSON كامل) — مخزّن في Secret Manager، مش في الكود
const GOOGLE_SA_KEY = defineSecret('GOOGLE_SA_KEY');

exports.lead = onRequest(
  { region: 'us-central1', cors: true, secrets: [GOOGLE_SA_KEY] },
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
      const creds = JSON.parse(GOOGLE_SA_KEY.value());
      const auth = new google.auth.JWT({
        email: creds.client_email,
        key: creds.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });
      const sheets = google.sheets({ version: 'v4', auth });

      // صف العناوين (مرة واحدة لو التبويب فاضي)
      const head = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${TAB}!A1:M1`
      });
      if (!head.data.values || head.data.values.length === 0) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID,
          range: `${TAB}!A1`,
          valueInputOption: 'RAW',
          requestBody: { values: [HEADERS] }
        });
      }

      const row = [
        new Date().toLocaleString('ar-EG'),
        data.name || '', data.phone || '', data.whatsapp || '', data.address || '',
        data.gender || '', data.usedBefore || '', data.suffers || '',
        data.offer || '', data.qty || '', data.price || '', data.payment || '', data.page || ''
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: `${TAB}!A1`,
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
