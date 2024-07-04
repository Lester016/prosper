export default () => ({
  host: process.env.HOST || 'localhost',
  port: parseInt(process.env.PORT, 10) || 8080,
  database: {
    mongo: {
      uri: process.env.MONGO_URI,
    },
    mysql: {
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT, 10),
      name: process.env.MYSQL_DATABASE,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
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
