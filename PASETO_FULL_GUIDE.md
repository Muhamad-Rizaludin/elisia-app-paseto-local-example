# PASETO Full Guide

Dokumen ini menjelaskan PASETO secara menyeluruh: konsep dasar, alasan dibuat, sejarah singkat, desain, keamanan, praktik implementasi, dan kapan sebaiknya dipakai.

## 1. Apa Itu PASETO

PASETO adalah singkatan dari **Platform-Agnostic Security Tokens**.

Tujuannya adalah menyediakan format token yang:
- aman secara default,
- lebih sulit salah konfigurasi,
- tetap praktis untuk autentikasi API.

PASETO sering dipakai sebagai alternatif JWT pada sistem yang ingin mengurangi risiko kesalahan implementasi kriptografi.

## 2. Why: Kenapa PASETO Dibuat

Secara historis, banyak tim memakai JWT dengan konfigurasi yang kurang tepat. Masalah umumnya:
- algoritma token terlalu fleksibel sehingga mudah salah pilih/salah verifikasi,
- validasi claim sering tidak lengkap,
- implementasi berbeda-beda antar library dan tim.

PASETO hadir dengan filosofi:
- **minimalkan pilihan berbahaya**,
- **paksa pola aman sebagai default**,
- **sederhanakan keputusan di sisi developer**.

## 3. Sejarah Singkat

PASETO muncul sekitar akhir 2010-an sebagai respons terhadap berbagai isu keamanan implementasi token modern.

Poin penting sejarah:
- lahir dari kebutuhan keamanan praktis, bukan sekadar standar format,
- berkembang lewat komunitas keamanan aplikasi,
- diposisikan sebagai pendekatan yang lebih ketat daripada JWT dalam banyak use case aplikasi internal/custom auth.

## 4. Konsep Inti PASETO

PASETO memiliki dua sumbu utama:
- **Version**: `v1`, `v2`, `v3`, `v4`
- **Purpose**: `local` atau `public`

Contoh bentuk awal token:
- `v3.local....`
- `v4.public....`

Arti purpose:
- `local`: enkripsi simetris (satu key untuk enkripsi/dekripsi).
- `public`: tanda tangan asimetris (private key sign, public key verify).

Inti desainnya: token sudah jelas konteks keamanan dari prefix, bukan dari opsi algoritma bebas.

## 5. Struktur Umum Token PASETO

Secara konseptual, token PASETO berisi:
- version
- purpose
- payload (data utama)
- optional footer

Payload biasanya berisi data seperti:
- `sub` (ID user),
- role/email secukupnya,
- metadata token (`tokenType`, dll),
- data waktu/expiry (tergantung library dan opsi penerbitan token).

## 6. PASETO vs JWT (Konseptual)

| Aspek | PASETO | JWT |
|---|---|---|
| Filosofi | Secure-by-default | Flexible-by-design |
| Pilihan algoritma | Lebih ketat | Lebih bebas |
| Risiko salah konfigurasi | Lebih rendah | Lebih tinggi |
| Ekosistem | Lebih kecil | Sangat besar |
| Interoperabilitas OIDC vendor | Terbatas | Sangat kuat |

Ringkas:
- PASETO unggul pada keamanan default.
- JWT unggul pada interoperabilitas dan dukungan ekosistem.

## 7. Kelebihan PASETO

- Mengurangi kelas error konfigurasi keamanan.
- Lebih mudah menjaga konsistensi lintas tim.
- Cocok untuk sistem internal yang tidak butuh dependensi OIDC vendor besar.
- Memberi boundary yang lebih jelas antara mode enkripsi (`local`) dan signature (`public`).

## 8. Kekurangan PASETO

- Ekosistem library/tooling tidak sebesar JWT.
- Integrasi dengan provider identitas besar biasanya tetap berbasis JWT/OIDC.
- Tim yang sangat bergantung ekosistem enterprise SSO mungkin lebih pragmatis memakai JWT.

## 9. Kapan Harus Pakai PASETO

Gunakan PASETO jika:
- auth Anda dikelola sendiri (custom auth service),
- fokus pada keamanan default dan sederhana,
- tidak wajib kompatibilitas penuh dengan vendor OIDC eksternal.

Contoh:
- API internal perusahaan,
- SaaS dengan auth backend mandiri,
- microservice internal non-federated.

## 10. Kapan Harus Pakai JWT

Gunakan JWT jika:
- butuh integrasi SSO/OIDC lintas vendor,
- sistem Anda heavily integrated dengan identity provider eksternal,
- interoperabilitas lintas platform jadi prioritas utama.

Contoh:
- enterprise SSO,
- produk yang wajib kompatibel Auth0/Cognito/Azure AD/Keycloak via OIDC.

## 11. Aspek Keamanan yang Tetap Wajib (Apa pun Format Token-nya)

PASETO bukan “peluru ajaib”. Tetap perlu:
- manajemen key/secret yang aman,
- rotasi key terencana,
- TTL token yang tepat,
- revocation strategy (logout, blokir sesi, force logout),
- monitoring dan audit log endpoint auth,
- rate limit di login/refresh,
- penyimpanan refresh token yang aman (idealnya hash di DB + rotate).

## 12. Best Practice Implementasi PASETO

Checklist praktis:
1. Access token jangan terlalu panjang umur hidupnya.
2. Refresh token harus di-rotate.
3. Simpan refresh token hash di database.
4. Gunakan HTTP-only cookie jika berbasis browser.
5. Hindari menaruh data sensitif berlebihan di payload.
6. Terapkan absolute session max age untuk hard logout.
7. Audit log event auth: login, refresh, logout, revoke.
8. Handle error token secara konsisten (invalid, expired, revoked).

## 13. Model Sesi yang Disarankan

Model umum yang aman:
- Access token: pendek (untuk request harian).
- Refresh token: untuk re-issue access token.
- Absolute session limit: misalnya 8 jam, setelah itu wajib login ulang.

Keuntungan model ini:
- UX tetap baik (tidak sering login),
- risiko sesi tidak berjalan tanpa batas,
- kontrol keamanan lebih kuat.

## 14. Implementasi PASETO di Project Ini

Supaya lebih konkret, ini implementasi PASETO yang dipakai di codebase ini:

### 1) Jenis PASETO yang dipakai
- Project ini memakai `v3.local` (simetris) untuk access token dan refresh token.
- Implementasi ada di util token (`encrypt/decrypt`) dengan pemisahan tipe token lewat claim `tokenType`.

### 2) Claim penting yang dipakai
- `sub`: id user.
- `email`, `role`: data user minimum untuk kebutuhan auth.
- `tokenType`: pembeda `access` vs `refresh`.
- Refresh token juga punya `jti` untuk identitas token yang disimpan di DB.

### 3) Alur issue token
- Endpoint `register` dan `login` memanggil service yang membuat access + refresh token.
- Endpoint `refresh` memverifikasi refresh token lama, revoke token lama, lalu issue pasangan token baru (rotation).
- Response body auth berisi:
  - `token` (access token),
  - `refreshToken`,
  - `expiredToken` (detik).

### 4) Session policy (hard-stop)
- Konfigurasi sesi:
  - `ACCESS_TOKEN_TTL=8h`
  - `REFRESH_TOKEN_TTL=8h`
  - `SESSION_MAX_AGE=8h`
- Artinya sesi maksimal 8 jam dari awal login.
- Walaupun refresh dilakukan berkali-kali, sesi tidak berjalan tanpa batas.

### 5) Penyimpanan dan keamanan refresh token
- Refresh token disimpan sebagai **hash** di database, bukan plaintext.
- Saat refresh:
  - token dicek valid/expired/revoked,
  - hash dibandingkan,
  - token lama direvoke,
  - token baru disimpan.

### 6) Transport token
- Token dikirim lewat 2 jalur:
  - body response (untuk integrasi client),
  - HTTP-only cookie `at` dan `rt` (untuk browser flow yang lebih aman).

### 7) Validasi token di endpoint protected
- Route protected menggunakan middleware auth untuk membaca cookie access token dan memverifikasi PASETO.
- Endpoint users juga menambah role check (contoh admin-only).

## 15. FAQ Singkat

### Apa itu "keamanan default + sistem auth mandiri"?
Maksudnya:
- **Keamanan default**: dari awal sudah pakai pola aman, tanpa banyak konfigurasi tambahan yang rawan salah.
- **Sistem auth mandiri**: login, token, refresh, revoke, dan session Anda kelola sendiri di backend Anda, tidak bergantung penuh ke provider login eksternal.

### Apa itu integrasi OIDC/SSO vendor besar?
Maksudnya aplikasi Anda terhubung ke provider identitas eksternal yang umum dipakai perusahaan, misalnya:
- Auth0
- AWS Cognito
- Azure AD / Microsoft Entra ID
- Keycloak

Biasanya alur ini memakai standar **OIDC/OAuth2** dan token JWT sebagai format utama interoperabilitas.

### Apa itu sistem auth mandiri?
Sistem auth mandiri adalah ketika:
- endpoint login/logout/refresh dibuat sendiri,
- database user dan session dikelola sendiri,
- aturan token, session timeout, revoke token ditentukan sendiri.

Contoh:
- aplikasi internal perusahaan dengan backend auth sendiri,
- SaaS yang tidak ingin login bergantung provider eksternal.

### Apakah PASETO selalu lebih aman dari JWT?
Tidak absolut. PASETO biasanya lebih aman **secara default**, tapi implementasi buruk tetap bisa berisiko.

### Apakah PASETO bisa menggantikan JWT di semua kasus?
Tidak selalu. Untuk ekosistem OIDC/SSO vendor besar, JWT sering lebih cocok.

### Kalau sistem saya internal, mana yang lebih praktis?
Sering kali PASETO lebih praktis karena guardrail keamanan lebih kuat.

## 16. Tambahan: Jika Menambah Login Google, Apple ID, dll

Jika nanti Anda menambah social login, pola yang disarankan:
1. User login lewat Google/Apple di frontend.
2. Frontend kirim `id_token` (dari provider) ke backend Anda.
3. Backend memverifikasi token provider ke public key/JWKS provider.
4. Backend cari atau buat user lokal berdasarkan `provider_user_id`/email.
5. Backend **tetap menerbitkan token internal Anda sendiri** (PASETO access + refresh).
6. API internal Anda hanya percaya token internal (PASETO), bukan token mentah dari provider.

Kenapa pola ini penting:
- Aturan auth tetap satu pintu (role, revoke, session limit, logging).
- Mudah gabung banyak metode login (password, Google, Apple) tanpa ubah mekanisme auth internal.
- Kontrol keamanan tetap di backend Anda.

Hal yang wajib diperhatikan:
- Simpan mapping akun provider ke user lokal (`provider`, `provider_user_id`).
- Validasi `iss`, `aud`, `exp`, dan signature token provider.
- Tangani kasus email sama tapi provider berbeda.
- Tetapkan kebijakan account linking (manual/otomatis).

## 17. Ringkasan Akhir

- PASETO dibuat untuk mengurangi risiko kesalahan implementasi token.
- JWT tetap sangat relevan karena ekosistem dan interoperabilitasnya besar.
- Pilihan terbaik ditentukan oleh konteks:
  - **PASETO**: keamanan default + sistem auth mandiri.
  - **JWT**: integrasi OIDC/SSO lintas vendor.

