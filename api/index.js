import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from '../server/dist/config/db.js';

dotenv.config();

const app = express();

// ===== GLOBAL MIDDLEWARE =====
// CORS - Allow all origins with proper headers
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-User-ID', 'X-Admin-ID', 'Authorization', 'X-Requested-With'],
  credentials: false,
  maxAge: 86400,
}));

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📤 [${req.method}] ${req.path}`);
  const userId = req.headers['x-user-id'];
  if (userId) console.log(`   👤 User ID: ${userId}`);
  next();
});

// ===== INITIALIZE DATABASE =====
let dbConnected = false;

async function ensureDBConnection() {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
      console.log('✅ MongoDB connected');
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error instanceof Error ? error.message : 'Unknown error');
      dbConnected = false;
    }
  }
  return dbConnected;
}

// ===== IMPORT ALL ROUTES =====
import workshopRoutes from '../server/dist/routes/workshops.js';
import adminRoutes from '../server/dist/routes/admin.js';
import authRoutes from '../server/dist/routes/auth.js';
import visionRoutes from '../server/dist/routes/visions.js';
import goalRoutes from '../server/dist/routes/goals.js';
import taskRoutes from '../server/dist/routes/tasks.js';
import todoRoutes from '../server/dist/routes/todos.js';
import mywordRoutes from '../server/dist/routes/mywords.js';
import healthRoutes from '../server/dist/routes/health.js';
import userRoutes from '../server/dist/routes/users.js';
import cartRoutes from '../server/dist/routes/carts.js';
import adminMongoRoutes from '../server/dist/routes/adminMongo.js';
import contactRoutes from '../server/dist/routes/contact.js';
import milestoneRoutes from '../server/dist/routes/milestones.js';
import reminderRoutes from '../server/dist/routes/reminders.js';
import dailyPlanRoutes from '../server/dist/routes/dailyplans.js';
import accountingRoutes from '../server/dist/routes/accounting.js';
import checkoutRoutes from '../server/dist/routes/checkout.js';
import pageStateRoutes from '../server/dist/routes/pagestate.js';

// ===== WORKSHOP PLATFORM ROUTES =====
import enrollmentRoutes from '../server/dist/routes/enrollment.js';
import studentProgressRoutes from '../server/dist/routes/student-progress.js';
import assignmentRoutes from '../server/dist/routes/assignment.js';
import zoomMeetingRoutes from '../server/dist/routes/zoom-meeting.js';
import paymentRoutes from '../server/dist/routes/payment.js';
import chatRoutes from '../server/dist/routes/chat.js';

// ===== HEALTH CHECK ENDPOINT =====
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend API is running - Deployment Dec 9 2025',
    timestamp: new Date().toISOString(),
    dbConnected,
    version: '2.0',
  });
});

// ===== DB CONNECTION MIDDLEWARE =====
app.use(async (req, res, next) => {
  const connected = await ensureDBConnection();
  if (!connected && req.path !== '/api/health') {
    return res.status(503).json({
      error: 'Service Unavailable',
      message: 'Database connection failed',
    });
  }
  next();
});

// ===== API ROUTES =====
app.use('/api/workshops', workshopRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/visions', visionRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/mywords', mywordRoutes);
app.use('/api/health-data', healthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/admin-mongo', adminMongoRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/dailyplans', dailyPlanRoutes);
app.use('/api/accounting', accountingRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/page-state', pageStateRoutes);

// ===== WORKSHOP PLATFORM ROUTES =====
app.use('/api/enrollment', enrollmentRoutes);
app.use('/api/student-progress', studentProgressRoutes);
app.use('/api/assignment', assignmentRoutes);
app.use('/api/zoom-meeting', zoomMeetingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/chat', chatRoutes);

// ===== 404 HANDLER =====
app.use((req, res) => {
  console.warn(`⚠️ 404: ${req.method} ${req.path}`);
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
    message: 'The requested endpoint does not exist. Check the API documentation.',
  });
});

// ===== GLOBAL ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: message,
    status,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

export default app;
