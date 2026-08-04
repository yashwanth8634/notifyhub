import app from './src/app.js';
import { PORT } from './src/config/env.js';

app.listen(PORT, () => {
  console.log(`NotifyHub backend is running on port ${PORT}`);
});

export default app; // Export app for Vercel Serverless compatibility
