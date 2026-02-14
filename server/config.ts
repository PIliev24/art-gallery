export const config = {
  databaseUrl: process.env.DATABASE_URL || 'postgresql://localhost:5432/art_gallery',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'changeme',
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
};
