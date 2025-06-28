# 🔥 Setup Firebase untuk Bolt Environment

## 📋 Langkah-Langkah Setup

### 1. **Dapatkan Firebase Config**
1. Buka [Firebase Console](https://console.firebase.google.com)
2. Pilih project `APK-PIS-2025`
3. Klik ⚙️ **Project Settings**
4. Scroll ke **Your apps** → **Web app**
5. Copy semua nilai config

### 2. **Update .env.local**
Ganti nilai di file `.env.local` dengan config dari Firebase Console:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=apk-pis-2025.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=apk-pis-2025
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=apk-pis-2025.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 3. **Update HTTP Referrers**
1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Pilih project `APK-PIS-2025`
3. **APIs & Services** → **Credentials**
4. Edit **Browser key (auto created by Firebase)**
5. Di **Website restrictions**, tambahkan:
   ```
   https://*.bolt.new/*
   https://bolt.new/*
   https://*.stackblitz.com/*
   https://stackblitz.com/*
   ```

### 4. **Test Login**
Gunakan akun yang sudah ada:
- **Email:** masmin@coba.com
- **Password:** [password yang sudah dibuat]

## 🚨 **Troubleshooting**

### Jika masih error "Domain blocked":
1. Tunggu 5-10 menit setelah update HTTP referrers
2. Clear browser cache
3. Coba incognito mode

### Jika error "Invalid API Key":
1. Regenerate API key di Google Cloud Console
2. Update .env.local
3. Restart development server

### Jika user not found:
1. Periksa Firebase Authentication console
2. Pastikan user masmin@coba.com ada
3. Reset password jika perlu