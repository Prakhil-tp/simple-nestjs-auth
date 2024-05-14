export default () => ({
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  storage: {
    mongodb: {
      uri: process.env.DB_URI,
    },
  },
});
