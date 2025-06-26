const jwt = require('jsonwebtoken');

const signToken = (payload, expiresIn = '1d') => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            throw new Error('Token tidak valid atau telah kedaluwarsa. Silakan login kembali untuk mendapatkan token baru', 401);
        }
        return decoded;
    });
};

const signOut = () => {
    return signToken({}, '1ms');
};

module.exports = {
    signToken,
    verifyToken,
    signOut,
};
