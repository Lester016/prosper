export default () => ({
  host: process.env.HOST || 'localhost',
  port: parseInt(process.env.PORT, 10) || 8080,
  database: {
    mongo: {
      uri: process.env.MONGO_URI,
    },
  },
  origin: {
    allowed: process.env.ALLOWED_ORIGINS,
    // methods: process.env.ALLOWED_METHODS,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  },
  facebook: {
    clientId: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    redirectUri: process.env.FACEBOOK_REDIRECT_URI,
  },
});
