# Wajib Support Server

سيرفر صغير بيستقبل رسائل فورم الدعم من موقع wajib.ai ويبعتها كإيميل على info@wajib.ai

---

## ⚠️ تنبيه مهم
متحطّش الملفات دي في نفس repo بتاع الـ AI proxy — ده سيرفر مستقل لوحده.
ارفعه في repo جديد واعمل Web Service جديد على Render.

---

## الخطوات

### 1) ارفع على GitHub
- اعمل repo جديد فاضي على GitHub.
- ارفع فيه الملفات دي كلها (`server.js`، `package.json`، `.gitignore`).
- **مترفعش** فولدر `node_modules` (الـ .gitignore بيمنعه تلقائيًا).

### 2) جهّز Google App Password
1. ادخل حساب info@wajib.ai على Google.
2. فعّل 2-Step Verification الأول.
3. Google Account → Security → App passwords.
4. اعمل واحد جديد، سمّيه "Wajib Render".
5. انسخ الكود (16 حرف) واحتفظ بيه.

### 3) انشر على Render
1. render.com → New → Web Service.
2. اربطه بالـ repo الجديد.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. تحت Environment ضيف:
   - `SMTP_USER` = `info@wajib.ai`
   - `SMTP_APP_PASSWORD` = الكود 16 حرف
6. Deploy وانتظر لحد ما يبقى Live، وانسخ الرابط.

### 4) اختبر إنه شغّال
افتح رابط Render في المتصفح — لازم تشوف:
`Wajib support server is running.`

### 5) وصّل الصفحة
في `support.html` غيّر السطر:
```js
const API_ENDPOINT = "https://YOUR-RENDER-APP.onrender.com/api/support";
```
لرابط Render بتاعك + `/api/support` في الآخر.

### 6) ارفع support.html
في cPanel → public_html → ارفع `support.html`.
الرابط النهائي: https://wajib.ai/support.html

---

## مميزات أمان مدمجة
- CORS: بيقبل الطلبات من wajib.ai بس.
- Rate limit: أقصى 5 رسائل من نفس الـ IP كل 10 دقايق.
- Honeypot: خانة مخفية بتصطاد البوتات وترفض السبام.
