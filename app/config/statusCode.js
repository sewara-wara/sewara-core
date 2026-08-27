module.exports = {
    success: 200,                 // OK
    bad_request: 400,             // Bad Request – input tidak valid
    unauthorized: 401,            // Unauthorized – belum login / token invalid
    forbidden: 403,               // Forbidden – akun belum verifikasi / akses ditolak
    not_found: 404,               // Not Found – data tidak ditemukan
    conflict: 409,                // Conflict – data sudah ada (misal: email sudah terdaftar)
    gone: 410,                    // Gone – data kadaluarsa (misal: OTP expired)

    token_unprovide: 400,         // Token tidak diberikan – masuk Bad Request
    wrong_password: 400,          // Password salah – input valid tapi salah
    empty_data: 400,              // Data kosong – Bad Request
    otp_not_valid: 400,           // OTP salah – Bad Request
    otp_expired: 410,             // OTP expired – Gone
    already_exists: 409,          // Sudah ada – Conflict
    already_verify: 410,          // Sudah verifikasi – Gone

    internal_server_error: 500,   // Internal Server Error
    service_not_available: 503,   // Service Unavailable – maintenance
    gateway_timeout: 504,         // Gateway Timeout
    update_application: 426       // Upgrade Required – force user update aplikasi
};