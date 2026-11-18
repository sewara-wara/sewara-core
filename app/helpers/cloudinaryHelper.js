const crypto = require('crypto');

const ALLOWED_FORMATS = 'jpg,jpeg,png,webp';

// Cloudinary signature: SHA-1 of the params sorted by name, followed by the API secret
const sign = (params, apiSecret) => {
    const payload = Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join('&');

    return crypto.createHash('sha1').update(payload + apiSecret).digest('hex');
};

const getCredentials = () => {
    const {
        CLOUDINARY_CLOUD_NAME: cloudName,
        CLOUDINARY_API_KEY: apiKey,
        CLOUDINARY_API_SECRET: apiSecret
    } = process.env;

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error('Konfigurasi Cloudinary belum lengkap');
    }

    return { cloudName, apiKey, apiSecret };
};

const profilePublicId = (userId) => `profiles/user_${userId}`;

// Everything the client needs to upload a profile photo directly to Cloudinary.
// The public_id is fixed per user, so a new photo overwrites the previous one.
exports.createProfileUploadParams = (userId) => {
    const { cloudName, apiKey, apiSecret } = getCredentials();

    const params = {
        allowed_formats: ALLOWED_FORMATS,
        invalidate: 'true',
        overwrite: 'true',
        public_id: profilePublicId(userId),
        timestamp: Math.floor(Date.now() / 1000),
        transformation: 'c_limit,w_800'
    };

    return {
        upload_url: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        fields: {
            ...params,
            api_key: apiKey,
            signature: sign(params, apiSecret)
        }
    };
};

// Accepts only an untransformed delivery URL of this user's own photo on our account
exports.isOwnProfilePhotoUrl = (url, userId) => {
    if (typeof url !== 'string') {
        return false;
    }

    const { cloudName } = getCredentials();
    const prefix = `https://res.cloudinary.com/${cloudName}/image/upload/`;

    if (!url.startsWith(prefix)) {
        return false;
    }

    const path = url.slice(prefix.length);
    return new RegExp(`^(v\\d+/)?${profilePublicId(userId)}\\.(jpg|jpeg|png|webp)$`).test(path);
};
