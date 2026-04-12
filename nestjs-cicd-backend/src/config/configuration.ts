export default () => ({
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,

  jwt: {
    secret: process.env.JWT_SECRET,
    //accessExpires: '15m',
    //accessExpires: '45m',
    //refreshExpires: '7d',

    accessExpires: '10s',
    refreshExpires: '1m',
  },
  mail: {
    user: process.env.EMAIL, // ✅ FIX
    pass: process.env.EMAIL_PASS, // ✅ FIX
  },
});
