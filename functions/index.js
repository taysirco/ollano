const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const { google } = require('googleapis');
const crypto = require('crypto');
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

// TikTok Pixel + Events API
const TIKTOK_PIXEL_ID = 'D8F9O9JC77UANKFS89I0';
const TIKTOK_API_URL = 'https://business-api.tiktok.com/open_api/v1.3/event/track/';
const tiktokToken = defineSecret('TIKTOK_ACCESS_TOKEN');

// SHA-256 hash for PII (TikTok requires lowercase + trimmed before hashing)
const sha256 = (s) => crypto.createHash('sha256').update(String(s).trim().toLowerCase()).digest('hex');

// Normalize Egyptian phone to E.164 (e.g. 01012345678 → +201012345678)
function toE164(p) {
  const d = String(p || '').replace(/\D/g, '');
  if (!d) return '';
  if (d.startsWith('01') && d.length === 11) return '+2' + d;
  if (d.startsWith('20') && d.length === 12) return '+' + d;
  if (d.startsWith('2') && d.length === 12) return '+' + d;
  return '+' + d;
}

// Extract client IP from common reverse-proxy headers
function getClientIp(req) {
  const xf = req.headers['x-forwarded-for'];
  if (xf) return String(xf).split(',')[0].trim();
  return (req.socket && req.socket.remoteAddress) || (req.connection && req.connection.remoteAddress) || '';
}

async function sendTikTokLead(data, req, token) {
  if (!token) {
    console.warn('TikTok token not configured; skipping Events API');
    return;
  }
  const ip = getClientIp(req);
  const ua = req.headers['user-agent'] || data.userAgent || '';
  const phoneE164 = toE164(data.phone);
  const waE164 = toE164(data.whatsapp);
  const value = parseInt(String(data.price || '').replace(/[^\d]/g, ''), 10) || 0;
  const offerName = data.offer || 'OLLANO Lotion';

  const user = {};
  if (phoneE164) user.phone = sha256(phoneE164);
  else if (waE164) user.phone = sha256(waE164);
  if (data.orderNumber) user.external_id = sha256(data.orderNumber);
  if (ip) user.ip = ip;
  if (ua) user.user_agent = ua;
  if (data.ttclid) user.ttclid = data.ttclid;
  if (data.ttp) user.ttp = data.ttp;

  const payload = {
    event_source: 'web',
    event_source_id: TIKTOK_PIXEL_ID,
    data: [{
      event: 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      event_id: data.eventId || data.orderNumber || String(Date.now()),
      user,
      properties: {
        currency: 'EGP',
        value: value,
        content_type: 'product',
        content_id: 'ollano-offer-' + (data.offerVal || '1'),
        content_name: offerName,
        quantity: 1,
        contents: [{
          content_id: 'ollano-offer-' + (data.offerVal || '1'),
          content_type: 'product',
          content_name: offerName,
          quantity: 1,
          price: value
        }]
      },
      page: {
        url: data.page || '',
        referrer: data.referrer || ''
      }
    }]
  };

  try {
    const r = await fetch(TIKTOK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': token
      },
      body: JSON.stringify(payload)
    });
    const json = await r.json().catch(() => ({}));
    if (json.code !== 0) {
      console.error('TikTok Events API error:', JSON.stringify(json));
    } else {
      console.log('TikTok Lead sent OK:', json.request_id, 'event_id=', payload.data[0].event_id);
    }
  } catch (e) {
    console.error('TikTok Events API fetch failed:', String(e && e.message || e));
  }
}

exports.lead = onRequest(
  { region: 'us-central1', cors: true, secrets: [tiktokToken] },
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
        data.orderNumber ? `رقم الطلب: ${data.orderNumber}` : '',
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

      // Fire TikTok server-side Lead event (non-blocking — never fail the user's order)
      sendTikTokLead(data, req, tiktokToken.value())
        .catch(e => console.error('TikTok sendLead unexpected:', e));

      res.status(200).json({ result: 'ok' });
    } catch (err) {
      console.error('lead error:', err);
      res.status(500).json({ result: 'error', message: String((err && err.message) || err) });
    }
  }
);
