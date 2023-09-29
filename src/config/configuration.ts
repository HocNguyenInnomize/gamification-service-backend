export const configFileName = () => (process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env');

export const configuration = () => ({
  env: process.env.NODE_ENV,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
  jwtSecret: process.env.JWT_SECRET,
});
