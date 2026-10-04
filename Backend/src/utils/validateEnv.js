export const validateEnv = () => {
  const required = ['MONGO_DB_URI', 'JWT_SECRET'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`❌ Missing env: ${missing.join(', ')}`);
    process.exit(1);
  }
  if (process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET too short, min 32 chars');
    process.exit(1);
  }
};
