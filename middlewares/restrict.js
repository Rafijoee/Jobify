const jwt = require('jsonwebtoken');
const AuthValidation = require('../validators/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { JWT_SECRET } = process.env;

module.exports = {
    allUser : async (req, res, next) => {
        try {
            AuthValidation.headers(req.headers);
            const token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, JWT_SECRET);

            if (decoded.role !== 'user' && decoded.role !== 'admin') {
                throw new Error('Akses ditolak. Anda tidak memiliki izin untuk mengakses endpoint ini.', 403);
            }

            req.user = decoded;
            next();
        } catch (err) {
            res.status(err.statusCode || 401).json({
                status: 'Failed',
                statusCode: err.statusCode || 401,
                message: err.message || 'Token tidak valid atau telah kedaluwarsa.',
            });
        }
    },
    admin : async (req, res, next) => {
        try {
            AuthValidation.headers(req.headers);

            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);

            if (decoded.role !== 'admin') {
                throw new Error('Akses ditolak. Anda tidak memiliki izin untuk mengakses endpoint ini.', 403);
            }

            req.user = decoded;
            next();
        } catch (err) {
            res.status(err.statusCode || 401).json({
                status: 'Failed',
                statusCode: err.statusCode || 401,
                message: err.message || 'Token tidak valid atau telah kedaluwarsa.',
            });
        }
    },
    user : async (req, res, next) => {
        try {
            AuthValidation.headers(req.headers);

            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);

            if (decoded.role !== 'user') {
                throw new Error('Akses ditolak. Anda tidak memiliki izin untuk mengakses endpoint ini.', 403);
            }

            req.user = decoded;
            next();
        } catch (err) {
            res.status(err.statusCode || 401).json({
                status: 'Failed',
                statusCode: err.statusCode || 401,
                message: err.message || 'Token tidak valid atau telah kedaluwarsa.',
            });
        }
    },

}