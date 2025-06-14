exports.sanitizeUser = (user) => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        image_profile: user.image_profile,
        is_verified: user.is_verified,
        created_at: user.created_at,
        updated_at: user.updated_at
    };
};