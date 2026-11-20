# Upload

Foto diupload langsung dari aplikasi ke Cloudinary, tidak lewat API. API hanya memberi izin upload berupa signature.

> Base URL, header `x-access-token`, format response, dan error umum ada di [README.md](README.md#informasi-umum).

## Alur upload foto profil

1. Kecilkan foto di aplikasi (lebar sekitar 500 px sudah cukup).
2. Panggil [`POST /upload/signature`](#post-uploadsignature).
3. Upload foto ke `upload_url` dari response. Lihat [Upload ke Cloudinary](#upload-ke-cloudinary).
4. Kirim `secure_url` dari Cloudinary ke [`POST /user/update-photo`](user.md#post-userupdate-photo).

## `POST /upload/signature`

✅ Aktif · 🔒 Butuh `x-access-token`

Membuat signature untuk satu kali proses upload. Foto profil setiap user punya lokasi tetap, jadi foto baru otomatis menimpa foto lama.

**Body**

| Field | Tipe | Wajib | Keterangan |
| --- | --- | --- | --- |
| `type` | string | Ya | Saat ini hanya `profile` |

```json
{
  "type": "profile"
}
```

**Response 200**
```json
{
  "code": 200,
  "message": "Signature upload berhasil dibuat.",
  "data": {
    "upload_url": "https://api.cloudinary.com/v1_1/<cloud_name>/image/upload",
    "fields": {
      "allowed_formats": "jpg,jpeg,png,webp",
      "invalidate": "true",
      "overwrite": "true",
      "public_id": "profiles/user_12",
      "timestamp": 1793854028,
      "transformation": "c_limit,w_800",
      "api_key": "<api_key>",
      "signature": "60fa903c44d8d878d46b38041b5e905ddc8fc2f0"
    }
  }
}
```

**Response error**

| HTTP | Kapan | `message` |
| --- | --- | --- |
| 400 | `type` kosong atau tidak dikenal | `Tipe upload tidak valid` |
| 500 | Key Cloudinary belum diisi di server | `Konfigurasi Cloudinary belum lengkap` |

## Upload ke Cloudinary

Kirim request `multipart/form-data` ke `upload_url`. Sertakan **semua** isi `fields` tanpa diubah, ditambah field `file` berisi fotonya.

```bash
curl -X POST "https://api.cloudinary.com/v1_1/<cloud_name>/image/upload" \
  -F "file=@foto.jpg" \
  -F "allowed_formats=jpg,jpeg,png,webp" \
  -F "invalidate=true" \
  -F "overwrite=true" \
  -F "public_id=profiles/user_12" \
  -F "timestamp=1793854028" \
  -F "transformation=c_limit,w_800" \
  -F "api_key=<api_key>" \
  -F "signature=60fa903c44d8d878d46b38041b5e905ddc8fc2f0"
```

Ambil `secure_url` dari response Cloudinary:

```json
{
  "public_id": "profiles/user_12",
  "secure_url": "https://res.cloudinary.com/<cloud_name>/image/upload/v1793854028/profiles/user_12.jpg"
}
```

- Mengubah isi `fields` membuat Cloudinary menolak upload dengan HTTP 401 `Invalid Signature`.
- Signature hanya berlaku sebentar, jadi minta yang baru setiap kali upload.
- Format selain JPG, PNG, dan WebP ditolak, dan foto yang lebih lebar dari 800 px otomatis dikecilkan.

## Menampilkan foto

Sisipkan ukuran setelah `/upload/`. Contoh foto profil kotak 200 px yang fokus ke wajah:

```
https://res.cloudinary.com/<cloud_name>/image/upload/w_200,h_200,c_fill,g_face,q_auto,f_auto/v1793854028/profiles/user_12.jpg
```

URL dengan ukuran seperti ini hanya untuk ditampilkan. Yang dikirim ke `/user/update-photo` harus `secure_url` apa adanya.
