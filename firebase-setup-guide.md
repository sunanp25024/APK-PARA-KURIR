# 🔥 Panduan Setup Firebase untuk Bolt

## ✅ **Status Konfigurasi Anda**
Config Firebase Anda sudah benar! Sekarang tinggal update HTTP referrers.

## 🎯 **Langkah Perbaikan**

### **1. Update HTTP Referrers di Google Cloud Console**

1. **Buka Google Cloud Console:**
   - Kunjungi: https://console.cloud.google.com
   - Pilih project: `APK-PIS-2025`

2. **Navigasi ke Credentials:**
   - Klik **APIs & Services** di sidebar kiri
   - Klik **Credentials**

3. **Edit Browser Key:**
   - Cari **"Browser key (auto created by Firebase)"**
   - Klik ikon **Edit** (pensil)

4. **Update Website Restrictions:**
   Tambahkan domain Bolt ke daftar HTTP referrers:
   ```
   https://*.bolt.new/*
   https://bolt.new/*
   https://*.stackblitz.com/*
   https://stackblitz.com/*
   https://*.webcontainer.io/*
   https://webcontainer.io/*
   ```

5. **Save Changes:**
   - Klik **Save**
   - Tunggu 5-10 menit untuk propagasi

### **2. Test Login**
Gunakan akun yang sudah ada di Firebase Auth:
- **Email:** `masmin@coba.com`
- **Password:** [password yang sudah Anda buat]

## 🔍 **Verifikasi Setup**

### **Cek Firebase Auth Console:**
1. Buka: https://console.firebase.google.com
2. Pilih project `APK-PIS-2025`
3. Klik **Authentication** → **Users**
4. Pastikan user `masmin@coba.com` ada dan aktif

### **Cek API Key Status:**
1. Di Google Cloud Console
2. **APIs & Services** → **Credentials**
3. Pastikan Browser key tidak disabled

## 🚨 **Troubleshooting**

### **Jika masih error "Domain blocked":**
```bash
# 1. Clear browser cache
# 2. Coba incognito mode
# 3. Tunggu 10 menit setelah update HTTP referrers
# 4. Restart development server
```

### **Jika error "User not found":**
1. Periksa email di Firebase Auth console
2. Reset password user jika perlu
3. Pastikan user tidak disabled

### **Jika error "Invalid credential":**
1. Coba password yang benar
2. Periksa caps lock
3. Reset password jika lupa

## 📞 **Next Steps**
1. ✅ Update HTTP referrers (PENTING!)
2. ✅ Tunggu 5-10 menit
3. ✅ Test login dengan masmin@coba.com
4. ✅ Jika berhasil, aplikasi siap digunakan!