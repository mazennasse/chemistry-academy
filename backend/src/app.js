import express from 'express';
import levelRoutes from './routes/level.routes.js';
import subjectRoutes from './routes/subject.routes.js';
import morgan from 'morgan';
import { security } from './middleware/security.js';
import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/student.routes.js';
import lectureRoutes from './routes/lecture.routes.js';
import progressRoutes from './routes/progress.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import adminRoutes from './routes/admin.routes.js';
import catalogRoutes from './routes/catalog.routes.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();
app.set('trust proxy', 1);
security.forEach((middleware) => app.use(middleware));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ success: true, message: 'Chemistry Academy API is running.' }));
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/levels', levelRoutes);
app.use('/api/subjects', subjectRoutes);

app.use(notFound);
app.use(errorHandler);
export default app;
