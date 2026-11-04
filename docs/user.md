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

| Field | Tipe | Wajib |
| --- | --- | --- |
| `name` | string | Ya |
| `email` | string | Ya |

```json
{
  "name": "Budi Santoso",
  "email": "budi@example.com"
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
