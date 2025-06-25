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
};
