module.exports = {
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
