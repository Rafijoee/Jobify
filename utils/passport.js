// src/utils/passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const prisma = require("./prismaClient");

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
        const user = await prisma.user.upsert({
          where: { email },
          update: {
            googleId: id,
            name,
            isVerified: true,
          },
          create: {
            googleId: id,
            email,
            name,
            isVerified: true,
            // role: "Buyer",
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


