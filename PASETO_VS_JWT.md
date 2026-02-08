# PASETO vs JWT (Versi Mudah)

Dokumen ini dibuat supaya cepat dipahami tim non-security juga.

## 1. Intinya Apa?

- **JWT**: token yang sangat populer dan dipakai di banyak platform.
- **PASETO**: token yang didesain supaya lebih aman secara default.

Sederhananya:
- Kalau butuh integrasi luas dengan banyak vendor: biasanya **JWT**.
- Kalau sistem internal dan ingin aman-by-default: biasanya **PASETO**.

## 2. Bedanya Access Token dan Refresh Token

- **Access token**
  - Dipakai untuk akses API.
  - Umurnya lebih pendek.

- **Refresh token**
  - Dipakai untuk minta access token baru.
  - Lebih sensitif, harus dijaga lebih ketat.

## 3. PASETO vs JWT (Ringkas)

| Hal | PASETO | JWT |
|---|---|---|
| Keamanan default | Lebih aman default | Aman kalau implementasi benar |
| Risiko salah konfigurasi | Lebih rendah | Lebih tinggi |
| Dukungan ekosistem | Lebih kecil | Sangat besar |
| Cocok untuk OIDC/SSO vendor | Tidak selalu | Sangat cocok |

## 4. Kapan Pakai PASETO?

Pilih **PASETO** kalau:
- Sistem Anda mostly internal.
- Tidak terlalu butuh integrasi OIDC vendor eksternal.
- Ingin mengurangi risiko salah konfigurasi keamanan.

## 5. Kapan Pakai JWT?

Pilih **JWT** kalau:
- Butuh integrasi dengan Auth0/Cognito/Azure AD/Keycloak, dll.
- Butuh interoperability lintas sistem besar.
- Ekosistem standar (OIDC/OAuth2) jadi prioritas.

## 6. Implementasi di Project Ini (Versi Praktis)

Project ini memakai **PASETO**.

### Endpoint auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

### Aturan sesi saat ini
- `ACCESS_TOKEN_TTL=8h`
- `REFRESH_TOKEN_TTL=8h`
- `SESSION_MAX_AGE=8h`

Artinya:
- Maksimal sesi 8 jam.
- Lewat 8 jam harus login ulang.

### Response login (contoh)
```json
{
  "user": {
    "id": 1,
    "name": "System Admin",
    "email": "admin@example.com",
    "role": "admin"
  },
  "token": "v3.local....",
  "refreshToken": "v3.local....",
  "expiredToken": 28800
}
```

Keterangan:
- `token` = access token
- `refreshToken` = refresh token
- `expiredToken` = detik (28800 = 8 jam)

## 7. Checklist Aman (Yang Penting Saja)

- Access token tidak terlalu lama.
- Refresh token di-rotate.
- Refresh token disimpan hash di DB.
- Login dan refresh pakai rate limit.
- Logout merevoke token.

## 8. Kalau Nanti Tambah Login Google/Apple

Gunakan pola ini:
1. Frontend login ke Google/Apple.
2. Frontend kirim `id_token` ke backend Anda.
3. Backend verifikasi token provider.
4. Backend buat/cari user lokal.
5. Backend keluarkan token internal Anda sendiri (`token` + `refreshToken` PASETO).

Catatan penting:
- API internal tetap pakai PASETO internal.
- Jangan pakai token mentah Google/Apple langsung untuk semua endpoint internal.
- Dengan cara ini role, revoke, session limit tetap konsisten.

---

## Kesimpulan Cepat

- Mau aman default dan sistem internal? **PASETO** cocok.
- Mau integrasi luas standar industri? **JWT** biasanya lebih cocok.
