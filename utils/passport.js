// src/utils/passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const prisma = require("./prismaClient");
const bcrypt = require("bcrypt");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, displayName, emails } = profile;
        const email = emails?.[0]?.value || null;
        const name = displayName || "No Name";
        const hashedPassword = await bcrypt.hash("password", 10);

        const user = await prisma.user.upsert({
          where: { email },
          update: {
            googleId: id,
            name: name,
            isVerified: true,
          },
          create: {
            googleId: id,
            email,
            name: name,
            isVerified: true,
            password: hashedPassword, // Set default password for Google login
          },
        });
        // Kembalikan objek user
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
