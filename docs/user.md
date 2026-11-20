# User

Data akun user yang sedang login. Semua endpoint butuh header `x-access-token` (didapat dari [login](auth.md#post-login)).

> Base URL, header `x-access-token`, format response, dan error umum ada di [README.md](README.md#informasi-umum).

## `GET /user`

✅ Aktif · 🔒 Butuh `x-access-token` · Rate limit: `getLimiter`

Mengambil semua user (format tiap item: [objek `user`](README.md#objek-user)), termasuk yang sudah dihapus.

Endpoint ini bisa diakses oleh **semua user yang sudah login**, bukan hanya admin, karena belum ada sistem role. Artinya setiap user bisa melihat nama dan email user lain.

**Response 200**
```json
{
  "code": 200,
  "message": "Mengambil data user berhasil.",
  "data": [
    {
      "id": 12,
      "name": "Budi",
      "email": "budi@example.com",
      "phone": "6281234567890",
      "role": "seeker",
      "image_profile": null,
      "is_verified": 1,
      "created_at": "2026-08-27T09:00:00.000Z",
      "updated_at": "2026-08-27T09:00:00.000Z"
    }
  ]
}
```

---

## `GET /user/detail`

✅ Aktif · 🔒 Butuh `x-access-token`

Mengambil data user yang sedang login. User ditentukan dari token, tidak perlu mengirim ID.

**Response 200**
```json
{
  "code": 200,
  "message": "Mengambil detail user berhasil.",
  "data": {
    "id": 12,
    "name": "Budi",
    "email": "budi@example.com",
    "phone": "6281234567890",
    "role": "seeker",
    "image_profile": null,
    "is_verified": 1,
    "created_at": "2026-08-27T09:00:00.000Z",
    "updated_at": "2026-08-27T09:00:00.000Z"
  }
}
```

**Response error**

| HTTP | Kapan | `message` |
| --- | --- | --- |
| 404 | User tidak ditemukan | `User tidak ditemukan.` |

Response 404 ini juga menyertakan `"data": null`.

---

## `POST /user/update`

✅ Aktif · 🔒 Butuh `x-access-token`

Mengubah nama dan email user yang sedang login. Kedua field wajib dikirim walaupun hanya salah satu yang berubah.

**Body**

| Field | Tipe | Wajib | Keterangan |
| --- | --- | --- | --- |
| `name` | string | Ya | |
| `email` | string | Ya | |
| `phone` | string \| null | Tidak | Nomor WhatsApp, lihat [format nomor HP](README.md#format-nomor-hp). Tidak dikirim = nomor lama tetap. `null` atau `""` = nomor dihapus |

```json
{
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "phone": "081234567890"
}
```

**Response 200**
```json
{
  "code": 200,
  "message": "Data user berhasil diperbarui.",
  "data": {
    "id": 12,
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "phone": "6281234567890",
    "role": "seeker",
    "image_profile": null,
    "is_verified": 1,
    "created_at": "2026-08-27T09:00:00.000Z",
    "updated_at": "2026-11-04T10:15:00.000Z"
  }
}
```

**Response error**

| HTTP | Kapan | `message` |
| --- | --- | --- |
| 400 | `name` atau `email` kosong | `Nama dan email wajib diisi` |
| 400 | `phone` bukan nomor HP Indonesia | `Nomor HP tidak valid` |
| 404 | User tidak ditemukan | `User tidak ditemukan` |

Endpoint ini belum mengecek apakah email baru sudah dipakai user lain, dan tidak meminta verifikasi ulang untuk email baru.

---

## `POST /user/update-password`

✅ Aktif · 🔒 Butuh `x-access-token`

Mengganti password user yang sedang login.

**Body**

| Field | Tipe | Wajib |
| --- | --- | --- |
| `old_password` | string | Ya |
| `new_password` | string | Ya |

```json
{
  "old_password": "rahasia123",
  "new_password": "rahasiaBaru456"
}
```

**Response 200**
```json
{
  "code": 200,
  "message": "Kata sandi berhasil diperbarui."
}
```

**Response error**

| HTTP | Kapan | `message` |
| --- | --- | --- |
| 400 | Ada field yang kosong | `Kata sandi lama dan kata sandi baru wajib diisi` |
| 404 | User tidak ditemukan | `User tidak ditemukan` |
| 401 | Password lama salah | `Kata sandi lama tidak cocok` |

---

## `POST /user/update-photo`

✅ Aktif · 🔒 Butuh `x-access-token`

Menyimpan foto profil user yang sedang login. Fotonya harus sudah diupload ke Cloudinary dulu, lihat [alur upload](upload.md#alur-upload-foto-profil).

**Body**

| Field | Tipe | Wajib | Keterangan |
| --- | --- | --- | --- |
| `image_profile` | string | Ya | `secure_url` dari Cloudinary, apa adanya |

```json
{
  "image_profile": "https://res.cloudinary.com/<cloud_name>/image/upload/v1793854028/profiles/user_12.jpg"
}
```

**Response 200**
```json
{
  "code": 200,
  "message": "Foto profil berhasil diperbarui.",
  "data": {
    "id": 12,
    "name": "Budi",
    "email": "budi@example.com",
    "phone": "6281234567890",
    "role": "seeker",
    "image_profile": "https://res.cloudinary.com/<cloud_name>/image/upload/v1793854028/profiles/user_12.jpg",
    "is_verified": 1,
    "created_at": "2026-08-27T09:00:00.000Z",
    "updated_at": "2026-11-05T10:15:00.000Z"
  }
}
```

**Response error**

| HTTP | Kapan | `message` |
| --- | --- | --- |
| 400 | `image_profile` kosong | `URL foto wajib diisi` |
| 400 | URL bukan foto profil milik user ini di akun Cloudinary Sewara | `URL foto tidak valid` |
| 404 | User tidak ditemukan | `User tidak ditemukan` |

---

## `POST /user/update-role`

✅ Aktif · 🔒 Butuh `x-access-token`

Mengganti tipe user yang sedang login, misalnya dari pencari menjadi pemilik.

**Body**

| Field | Tipe | Wajib | Keterangan |
| --- | --- | --- | --- |
| `role` | string | Ya | `seeker` (pencari) atau `owner` (pemilik) |

```json
{
  "role": "owner"
}
```

**Response 200**
```json
{
  "code": 200,
  "message": "Tipe user berhasil diperbarui.",
  "data": {
    "id": 12,
    "name": "Budi",
    "email": "budi@example.com",
    "phone": "6281234567890",
    "role": "owner",
    "image_profile": null,
    "is_verified": 1,
    "created_at": "2026-08-27T09:00:00.000Z",
    "updated_at": "2026-11-05T10:15:00.000Z"
  }
}
```

**Response error**

| HTTP | Kapan | `message` |
| --- | --- | --- |
| 400 | `role` kosong atau selain `seeker` / `owner` | `Role harus seeker atau owner` |
| 404 | User tidak ditemukan | `User tidak ditemukan` |

---

## `DELETE /user/delete`

✅ Aktif · 🔒 Butuh `x-access-token`

Menghapus akun user yang sedang login. Ini soft delete: data tetap di database dengan `status = 0`, dan user tidak bisa login lagi.

**Response 200**
```json
{
  "code": 200,
  "message": "Akun Anda telah berhasil dihapus dari sistem kami. Terima kasih telah menggunakan layanan kami."
}
```

Token yang sudah ada **tetap valid** setelah akun dihapus, karena middleware auth hanya memeriksa tanda tangan JWT. Client sebaiknya langsung membuang token setelah memanggil endpoint ini.
