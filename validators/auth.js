// src/validators/authValidator.js
const { body } = require('express-validator');

const registerValidation = [
  body('email').isEmail().withMessage('Email tidak valid'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('name').notEmpty().withMessage('Nama wajib diisi'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Email tidak valid'),
  body('password').notEmpty().withMessage('Password wajib diisi'),
];

module.exports = {
  registerValidation,
  loginValidation,
  headers: (headers) => {
    if (!headers.authorization) {
      throw new Error("Authorization header tidak ditemukan.", 400);
    }
    if (!headers.authorization.startsWith("Bearer ")) {
      throw new Error(
        "Format Authorization header tidak valid. Gunakan format Bearer <token>.",
        400
      );
    }
  },
};
