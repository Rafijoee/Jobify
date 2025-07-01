const { body } = require('express-validator');

const userValidation = [
  body('avatar').notEmpty().withMessage('Avatar wajib diisi'),
  body('name')
    .notEmpty().withMessage('Nama wajib diisi')
    .isLength({ min: 3 }).withMessage('Nama minimal 3 karakter'),
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('phoneNumber')
    .optional()
    .isMobilePhone('id-ID').withMessage('Nomor telepon tidak valid'),
];
const changePasswordValidation = [
  body('oldPassword')
    .notEmpty().withMessage('Password lama wajib diisi'),
  body('newPassword')
    .notEmpty().withMessage('Password baru wajib diisi')
    .isLength({ min: 6 }).withMessage('Password baru minimal 6 karakter'),
];
const forgotPasswordValidation = [
  body('email')
    .isEmail().withMessage('Email tidak valid'),
];

module.exports = {
  userValidation,
  changePasswordValidation,
  forgotPasswordValidation,
}