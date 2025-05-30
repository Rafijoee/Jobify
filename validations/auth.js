const User = require("../models/auth");

module.exports = {
    headers: (headers) => {
        if (!headers.authorization) {
            throw new Error('Authorization header tidak ditemukan.', 400);
        }
        if (!headers.authorization.startsWith('Bearer ')) {
            throw new Error('Format Authorization header tidak valid. Gunakan format Bearer <token>.', 400);
        }
    },
    register: async (body, file) => {
        if (!body.email) {
            throw new Error('Email tidak boleh kosong.', 400);
        }
        if (!body.password) {
            throw new Error('Password tidak boleh kosong.', 400);
        }
        if (!body.name) {
            throw new Error('Nama tidak boleh kosong.', 400);
        }
        if (!file) {
            throw new Error('Avatar tidak boleh kosong.', 400);
        }
        if (!body.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            throw new Error("Format email tidak valid. Pastikan Anda memasukkan email dengan format yang benar.", 400);
        }
        const existEmail = await User.findByEmail(body.email);

        if (existEmail) {
            throw new Error('Email sudah terdaftar.', 400);
        }
        if (body.password.length < 8) {
            throw new Error('Password minimal 8 karakter.', 400);
        }
    },
    login: ({ email, password }) => {
        if (!email || !password) {
            throw new Error('Email dan password harus diisi.', 400);
        }

        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            throw new Error('Format email tidak valid.', 400);
        }

        if (password.length < 8 || password.length > 70) {
            throw new Error('Password harus memiliki panjang 8 hingga 70 karakter.', 400);
        }
    },
    changePassword: async ({ oldPassword, newPassword }) => {
        if (!oldPassword || !newPassword) {
            throw new Error('Password lama dan password baru harus diisi.', 400);
        }

        if (newPassword.length < 8 || newPassword.length > 70) {
            throw new Error('Password baru harus memiliki panjang 8 hingga 70 karakter.', 400);
        }

        if (oldPassword.length < 8 || oldPassword.length > 70) {
            throw new Error('Password lama harus memiliki panjang 8 hingga 70 karakter.', 400);
        }
    },
    changeProfile: async (file) => {
        if (!file) {
            throw new Error('Avatar tidak boleh kosong.', 400);
        }
    },
}