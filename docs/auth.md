# Auth

Login, registrasi, dan verifikasi email via OTP.

> Base URL, header `x-access-token`, format response, dan error umum ada di [README.md](README.md#informasi-umum).

## `POST /login`

✅ Aktif · Rate limit: `authLimiter`

Login dengan email dan password. Kalau berhasil, response berisi data user dan token.

**Body**

| Field | Tipe | Wajib |
| --- | --- | --- |
| `email` | string | Ya |
| `password` | string | Ya |

```json
{
  "email": "budi@example.com",
  "password": "rahasia123"
}
```

**Response 200: berhasil**
```json
{
  "code": 200,
  "message": "Login berhasil",
  "user": {
    "id": 12,
    "name": "Budi",
    "email": "budi@example.com",
    "image_profile": null,
    "is_verified": 1,
    "created_at": "2026-08-27T09:00:00.000Z",
    "updated_at": "2026-08-27T09:00:00.000Z"
  },
  "session": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Data user ada di field `user` dan token di field `session`, bukan di `data`.

**Response error**

| HTTP | Kapan | `message` |
| --- | --- | --- |
| 400 | `email` atau `password` kosong | `Email dan password wajib diisi` |
| 404 | Email tidak terdaftar atau akun sudah dihapus | `Akun tidak ditemukan` |
| 401 | Password salah | `Password salah` |
| 403 | Password benar tapi email belum diverifikasi. OTP baru otomatis dikirim ke email. | `Akun Anda belum diverifikasi. OTP telah dikirim ulang ke email Anda` |
| 500 | Gagal mengirim email OTP | `Gagal mengirim OTP` |
| 429 | Lebih dari 10 percobaan dalam 15 menit | `Terlalu banyak percobaan login. Coba lagi nanti.` |

Saat menerima **403**, arahkan user ke halaman input OTP, lalu panggil [`/verify-email`](#post-verify-email).

---

## `POST /register`

✅ Aktif

Mendaftarkan akun baru. Setelah berhasil, kode OTP 6 digit dikirim ke email user (berlaku 15 menit).

**Body**

| Field | Tipe | Wajib |
| --- | --- | --- |
| `name` | string | Ya |
| `email` | string | Ya |
| `password` | string | Ya |

```json
{
  "name": "Budi",
  "email": "budi@example.com",
  "password": "rahasia123"
}
```

**Response 200**
```json
{
  "code": 200,
  "message": "Registrasi berhasil. Silakan periksa email Anda untuk verifikasi"
}
```

**Response error**

| HTTP | Kapan | `message` |
| --- | --- | --- |
| 400 | Ada field yang kosong | `Semua field wajib diisi` |
| 409 | Email sudah terdaftar | `Email sudah terdaftar` |
| 500 | Gagal mengirim email OTP | `Gagal mengirim OTP` |

Kalau terjadi **500 `Gagal mengirim OTP`**, akun sebenarnya **sudah tersimpan**. Jangan suruh user register ulang (akan kena 409); arahkan ke [`/resend-otp`](#post-resend-otp).

---

## `POST /verify-email`

✅ Aktif

Memverifikasi email dengan kode OTP.

**Body**

| Field | Tipe | Wajib |
| --- | --- | --- |
| `email` | string | Ya |
| `otp` | string | Ya, 6 digit |

```json
{
  "email": "budi@example.com",
  "otp": "482913"
}
```

**Response 200: berhasil diverifikasi**
```json
{
  "code": 200,
  "message": "Email berhasil diverifikasi, silakan login"
}
```

**Response 200: sudah terverifikasi sebelumnya**
```json
{
  "code": 200,
  "message": "Email sudah terverifikasi"
}
```

**Response error**

| HTTP | Kapan | `message` |
| --- | --- | --- |
| 400 | `email` atau `otp` kosong | `Email dan OTP wajib diisi` |
| 404 | Email tidak terdaftar | `User tidak ditemukan` |
| 400 | OTP salah | `OTP tidak valid` |
| 410 | OTP sudah dipakai atau lewat 15 menit | `OTP sudah digunakan atau kadaluarsa` |

---

## `POST /resend-otp`

✅ Aktif

Mengirim ulang kode OTP ke email user yang belum terverifikasi.

**Body**

| Field | Tipe | Wajib |
| --- | --- | --- |
| `email` | string | Ya |

```json
{
  "email": "budi@example.com"
}
```

**Response 200**
```json
{
  "code": 200,
  "message": "OTP berhasil dikirim ulang ke email Anda."
}
```

**Response error**

| HTTP | Kapan | `message` |
| --- | --- | --- |
| 400 | `email` kosong | `Email wajib diisi` |
| 404 | Email tidak terdaftar | `User tidak ditemukan` |
| 410 | Akun sudah terverifikasi | `Akun Anda sudah terverifikasi.` |
| 500 | Gagal mengirim email OTP | `Gagal mengirim OTP` |

---

## Alur yang disarankan untuk client

```
Register ──► (email OTP) ──► Verify Email ──► Login ──► simpan `session`
                                  ▲                │
                                  │                └─ 403 belum verifikasi
                                  └──── Resend OTP ◄──┘ (OTP sudah otomatis dikirim)
```

1. **Register**: user mengisi nama, email, password. OTP dikirim ke email.
2. **Verify email**: user memasukkan OTP. Kalau kedaluwarsa (410), panggil resend OTP.
3. **Login**: simpan `session` dengan aman (misalnya Keychain/Keystore) dan kirim sebagai `x-access-token` di setiap request yang butuh auth.
4. Kalau API mengembalikan **401 `Unauthorized!`**, hapus token dan arahkan user ke halaman login.
