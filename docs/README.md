# Sewara Core: Dokumentasi API

Dokumentasi endpoint REST API Sewara Core: payload yang dikirim dan bentuk response yang diterima.

## Daftar fitur

| Fitur | Dokumen | Isi |
| --- | --- | --- |
| Auth | [auth.md](auth.md) | Login, register, verifikasi email, kirim ulang OTP |
| User | [user.md](user.md) | Profil, ubah data, ganti password, hapus akun |

Baca dulu [Informasi umum](#informasi-umum) di bawah (base URL, header auth, format response, error umum) sebelum masuk ke dokumen per fitur.

## Status endpoint

Semua endpoint auth dan user sudah aktif di [app/routers/router.js](../app/routers/router.js).

| Method | Endpoint | Auth | Status |
| --- | --- | --- | --- |
| POST | [`/login`](auth.md#post-login) | Tidak | ✅ Aktif |
| POST | [`/register`](auth.md#post-register) | Tidak | ✅ Aktif |
| POST | [`/verify-email`](auth.md#post-verify-email) | Tidak | ✅ Aktif |
| POST | [`/resend-otp`](auth.md#post-resend-otp) | Tidak | ✅ Aktif |
| GET | [`/user`](user.md#get-user) | Ya | ✅ Aktif |
| GET | [`/user/detail`](user.md#get-userdetail) | Ya | ✅ Aktif |
| POST | [`/user/update`](user.md#post-userupdate) | Ya | ✅ Aktif |
| POST | [`/user/update-password`](user.md#post-userupdate-password) | Ya | ✅ Aktif |
| DELETE | [`/user/delete`](user.md#delete-userdelete) | Ya | ✅ Aktif |

Route untuk post, comment, dan upload masih dikomentari di router. Controller post dan comment sudah dihapus dari repo (bisa dikembalikan dari git history), jadi belum didokumentasikan di sini.

---

## Informasi umum

### Base URL

| Environment | URL |
| --- | --- |
| Production | `https://<nama-site>.netlify.app/.netlify/functions/api` |
| Lokal (`npm run serve`) | `http://localhost:9999/.netlify/functions/api` |

Contoh: login di production → `POST https://<nama-site>.netlify.app/.netlify/functions/api/login`

### Request

- Body dikirim dalam format **JSON** dengan header `Content-Type: application/json`.
- Endpoint yang butuh login wajib mengirim token di header **`x-access-token`** (bukan `Authorization: Bearer`).

```http
x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token didapat dari field `session` di response login dan berlaku **1 tahun**.

### Format response

Setiap response punya `code` (sama dengan HTTP status) dan `message`.

**Sukses**
```json
{
  "code": 200,
  "message": "Pesan sukses",
  "data": {}
}
```

**Error**
```json
{
  "code": 400,
  "message": "Pesan error"
}
```

Di luar production (`NODE_ENV` bukan `production`), response error juga menyertakan field `stack` untuk keperluan debugging.

### Error umum

Error berikut bisa muncul di endpoint mana pun yang relevan:

| HTTP | Kapan | `message` |
| --- | --- | --- |
| 400 | Header `x-access-token` tidak dikirim | `No token provided!` |
| 401 | Token tidak valid / kedaluwarsa | `Unauthorized!` |
| 404 | Route tidak ada | `Route tidak ditemukan` |
| 429 | Kena rate limit | Lihat [Rate limit](#rate-limit) |
| 500 | Kesalahan server / database | `Internal Server Error` atau pesan error terkait |

### Rate limit

Dihitung per IP.

| Limiter | Dipakai di | Batas | `message` saat terlampaui |
| --- | --- | --- | --- |
| `authLimiter` | `/login` | 10 request / 15 menit | `Terlalu banyak percobaan login. Coba lagi nanti.` |
| `getLimiter` | `GET /user` | 20 request / menit | `Terlalu banyak permintaan. Coba lagi nanti.` |

### Objek `user`

Data user yang dikembalikan API selalu dalam bentuk ini. Password dan token tidak pernah ikut dikirim.

| Field | Tipe | Keterangan |
| --- | --- | --- |
| `id` | number | ID user |
| `name` | string | Nama |
| `email` | string | Email |
| `image_profile` | string \| null | Foto profil |
| `is_verified` | number | `1` = email sudah diverifikasi, `0` = belum |
| `created_at` | string (ISO 8601) | Waktu dibuat |
| `updated_at` | string (ISO 8601) | Waktu terakhir diubah |
