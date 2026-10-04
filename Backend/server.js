import 'dotenv/config';
import app from './src/app.js';
import { validateEnv } from './src/utils/validateEnv.js';
import connectDB from './src/config/db.js';

validateEnv();

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

try {
  await connectDB();
  console.log('MongoDB Connected');
  app.listen(PORT, HOST, () => {
    console.log(`G71 BACKEND API running on http://${HOST}:${PORT}`);
    console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL || 'not set'}`);
  });
} catch (err) {
  console.error('DB failed:', err.message);
  process.exit(1);
}
