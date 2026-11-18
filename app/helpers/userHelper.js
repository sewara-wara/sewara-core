exports.USER_ROLES = ['seeker', 'owner'];

// Normalizes Indonesian mobile numbers (08xx, +628xx, 628xx, with spaces/dashes) to 628xx.
// Returns null when the input is not a valid Indonesian mobile number.
exports.normalizePhone = (input) => {
    if (typeof input !== 'string' && typeof input !== 'number') {
        return null;
    }

    let phone = String(input).replace(/[\s\-().]/g, '');

    if (phone.startsWith('+')) {
        phone = phone.slice(1);
    }
    if (phone.startsWith('0')) {
        phone = '62' + phone.slice(1);
    }

    return /^628\d{7,11}$/.test(phone) ? phone : null;
};

exports.sanitizeUser = (user) => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        image_profile: user.image_profile,
        is_verified: user.is_verified,
        created_at: user.created_at,
        updated_at: user.updated_at
    };
};