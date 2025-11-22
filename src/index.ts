import 'dotenv/config';
import 'reflect-metadata';
import fs from 'fs';
import path from 'path';

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { dbCreateConnection } from './orm/dbCreateConnection';

const app = express();

// --- Middleware setup ---
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Also log to console
app.use(morgan('dev'));

const port = process.env.PORT || 4000;

// --- Start server ---
(async () => {
  try {
    await dbCreateConnection();
    console.log('✅ Database connection established.');

    // Import routes only after DB connection is ready
    const parentRoutes = (await import('./routes/parent.routes')).parentRoutes;
    const studentRoutes = (await import('./routes/student.routes')).studentRoutes;
    const registerRoutes = (await import('./routes/register.route')).default;
    const signInRoutes = (await import('./routes/auth.route')).default;
    const userRoutes = (await import('./routes/user.route')).default;
    const groupRoutes = (await import('./routes/group.routes')).default;
    const courseRoutes = (await import('./routes/course.routes')).default;
    const lessonRoutes = (await import('./routes/lesson.routes')).default;
    const attendanceRoutes = (await import('./routes/attendance.routes')).default;
    const gradeRoutes = (await import('./routes/grade.routes')).default;
    const assignmentRoutes = (await import('./routes/assignment.routes')).default;
    const submissionRoutes = (await import('./routes/submission.routes')).default;
    const enrollmentRoutes = (await import('./routes/enrollment.routes')).default;
    const assignmentFeedbackRoutes = (await import('./routes/assignmentFeedback.routes')).default;
    const tuitionFeeRoutes = (await import('./routes/tuitionFee.routes')).default;
    const paymentRoutes = (await import('./routes/payment.routes')).default;

    // Register routes
    app.use('/parents', parentRoutes);
    app.use('/students', studentRoutes);
    app.use('/register', registerRoutes);
    app.use('/signin', signInRoutes);
    app.use('/users', userRoutes);
    app.use('/groups', groupRoutes);
    app.use('/courses', courseRoutes);
    app.use('/lessons', lessonRoutes);
    app.use('/attendances', attendanceRoutes);
    app.use('/grades', gradeRoutes);
    app.use('/assignments', assignmentRoutes);
    app.use('/submissions', submissionRoutes);
    app.use('/enrollments', enrollmentRoutes);
    app.use('/assignmentFeedbacks', assignmentFeedbackRoutes);
    app.use('/tuitionFees', tuitionFeeRoutes);
    app.use('/payments', paymentRoutes);

    // Default route
    app.get('/', (_req, res) => res.send('🚀 API is running'));

    // Global error handler
    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error('❌ Error:', err);

      // Detect TypeORM duplicate key, validation, etc.
      if (err.code === '23505') {
        return res.status(400).json({ message: 'Duplicate value violates unique constraint' });
      }

      // If the error has a message, show it; otherwise fallback
      res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
      });
      return null;
    });

    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
})();
