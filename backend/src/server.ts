import { ENV } from './config/env';
import { createApp } from './app';
import { connectDatabase } from './config/database';

const startServer = async () => {
  await connectDatabase();
  const app = createApp();
  app.listen(ENV.PORT, () => {
    console.log(`🚀 Server running on port ${ENV.PORT}`);
  });
};

startServer();
