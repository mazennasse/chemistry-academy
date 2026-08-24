import helmet from 'helmet';
import cors from 'cors';
import { env } from '../config/env.js';

export const security = [
  helmet(),
  cors({ origin: env.clientUrl.split(',').map((x) => x.trim()), methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] })
];
