const { body } = require('express-validator');

const userValidation = [
  body('avatar').notEmpty().withMessage('Avatar wajib diisi'),
  body('name')
    .notEmpty().withMessage('Nama wajib diisi')
    .isLength({ min: 3 }).withMessage('Nama minimal 3 karakter'),
  body('email')
    .isEmail().withMessage('Email tidak valid'),
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('phoneNumber')
    .optional()
    .isMobilePhone('id-ID').withMessage('Nomor telepon tidak valid'),
];

module.exports = {
  userValidation,
}