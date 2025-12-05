import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import workshopRoutes from './routes/workshops.js';
import adminRoutes from './routes/admin.js';
import visionRoutes from './routes/visions.js';
import goalRoutes from './routes/goals.js';
import taskRoutes from './routes/tasks.js';
import todoRoutes from './routes/todos.js';
import mywordRoutes from './routes/mywords.js';
import healthRoutes from './routes/health.js';
import connectDB from './config/db.js';
import { 
  createDailyBackup, 
  listBackups, 
  restoreFromBackup, 
  getBackupStats 
} from './backup.js';
import { 
  createSignoutBackup, 
  createManualBackup, 
  listBackups as listAdminBackups, 
  getBackupStats as getAdminBackupStats 
} from './adminBackup.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize MongoDB connection
(async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB initialization successful');
  } catch (error) {
    console.error('❌ MongoDB initialization failed:', error.message);
  }
})();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Root endpoint for testing
app.get('/', (req, res) => {
  res.json({ message: 'Swar Yoga Backend API - Running on Render', timestamp: new Date().toISOString() });
});

// ⭐ IMPORTANT: Workshop Routes MUST come FIRST before generic routes
// Otherwise the generic routes will catch them!
app.use('/api/admin/workshops', workshopRoutes);

// ===== MONGODB ROUTES =====
app.use('/api/visions', visionRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/mywords', mywordRoutes);
app.use('/api/health', healthRoutes);

// ===== ADMIN SYSTEM ROUTES =====
app.use('/api/admin', adminRoutes);

// ===== BACKUP SYSTEM ENDPOINTS =====
// Create daily backup
app.post('/api/admin/backup/create', async (req, res) => {
  try {
    const result = await createDailyBackup();
    if (result.success) {
      res.json({ success: true, message: 'Daily backup created', ...result });
    } else {
      res.json({ success: false, reason: result.reason });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create backup', message: error.message });
  }
});

// List all backups
app.get('/api/admin/backup/list', async (req, res) => {
  try {
    const backups = await listBackups();
    res.json({ success: true, backups });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list backups', message: error.message });
  }
});

// Get backup statistics
app.get('/api/admin/backup/stats', async (req, res) => {
  try {
    const stats = await getBackupStats();
    res.json({ success: true, ...stats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get backup stats', message: error.message });
  }
});

// Restore from backup
app.post('/api/admin/backup/restore', async (req, res) => {
  try {
    const { backupFilename } = req.body;
    
    if (!backupFilename) {
      return res.status(400).json({ error: 'backupFilename is required' });
    }
    
    const result = await restoreFromBackup(backupFilename);
    
    if (result.success) {
      res.json({ success: true, message: 'Backup restored successfully', ...result });
    } else {
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to restore backup', message: error.message });
  }
});

// ===== PAGE STATE PERSISTENCE ENDPOINTS =====
// Save page state - called when user navigates to a new page
app.post('/api/page-state', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const { pageName, pageData } = req.body;
    if (!pageName || !pageData || !pageData.pathname) {
      return res.status(400).json({ error: 'pageName and pageData.pathname are required' });
    }

    const db = await readData();
    if (!db.pageStates) db.pageStates = [];

    // Find existing page state for this user, or create new
    const existingIdx = db.pageStates.findIndex(ps => ps.userId === userId);
    
    const pageState = {
      userId,
      pageName,
      pathname: pageData.pathname,
      search: pageData.search || '',
      hash: pageData.hash || '',
      savedAt: new Date().toISOString()
    };

    if (existingIdx !== -1) {
      db.pageStates[existingIdx] = pageState;
    } else {
      db.pageStates.push(pageState);
    }

    await writeData(db);
    res.json({ success: true, pageState });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save page state', message: error.message });
  }
});

// Get last page state for user
app.get('/api/page-state', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const db = await readData();
    const pageStates = db.pageStates || [];
    const pageState = pageStates.find(ps => ps.userId === userId);

    if (!pageState) {
      return res.json({ success: true, pageState: null });
    }

    // Return in the format the frontend expects
    const formattedPageState = {
      pageName: pageState.pageName,
      pageData: {
        pathname: pageState.pathname,
        search: pageState.search || '',
        hash: pageState.hash || ''
      },
      savedAt: pageState.savedAt
    };

    res.json({ success: true, pageState: formattedPageState });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get page state', message: error.message });
  }
});

// Clear page state - called on logout
app.delete('/api/page-state', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const db = await readData();
    if (!db.pageStates) db.pageStates = [];

    db.pageStates = db.pageStates.filter(ps => ps.userId !== userId);
    await writeData(db);

    res.json({ success: true, message: 'Page state cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear page state', message: error.message });
  }
});

// Resolve data file path. decodeURIComponent fixes percent-encoded spaces (e.g. 'project%2013')
const serverDir = decodeURIComponent(new URL('.', import.meta.url).pathname);
const DATA_FILE = path.resolve(serverDir, '../server-data.json');

async function readData() {
  try {
    const txt = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(txt);
  } catch (err) {
    const initial = { users: [], visions: [], goals: [], tasks: [], todos: [], dailyWords: [], health: [], routines: [], people: [], affirmations: [], blogPosts: [] };
    await writeData(initial);
    return initial;
  }
}

async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function nextId() {
  return Date.now();
}

// Health / test endpoint
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: Date.now() });
});

// Simple auth: register & login (dev only - not for production)
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, phone, countryCode, country, state, gender, age, profession } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const db = await readData();
  const exists = db.users.find(u => u.email === email);
  if (exists) return res.status(400).json({ error: 'User already exists' });

  const user = { 
    id: String(nextId()), 
    email, 
    password, 
    name: name || email.split('@')[0], 
    phone,
    countryCode,
    country,
    state,
    gender,
    age,
    profession,
    isNewUser: true,
    registrationDate: new Date().toISOString()
  };
  
  db.users.push(user);
  
  // Also save to signupData for admin tracking
  if (!db.signupData) db.signupData = [];
  db.signupData.push({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    countryCode: user.countryCode,
    country: user.country,
    state: user.state,
    gender: user.gender,
    age: user.age,
    profession: user.profession,
    registrationDate: user.registrationDate,
    status: 'active',
    source: 'signup'
  });
  
  await writeData(db);

  const { password: _p, ...publicUser } = user;
  res.json(publicUser);
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const db = await readData();
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) {
    // Record failed login attempt
    if (!db.signinData) db.signinData = [];
    db.signinData.push({
      id: String(nextId()),
      email: email,
      timestamp: new Date().toISOString(),
      status: 'failed',
      ip: 'unknown',
      device: req.headers['user-agent'] || 'unknown'
    });
    await writeData(db);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Record successful login
  if (!db.signinData) db.signinData = [];
  db.signinData.push({
    id: String(nextId()),
    email: user.email,
    name: user.name,
    timestamp: new Date().toISOString(),
    status: 'success',
    ip: 'unknown',
    device: req.headers['user-agent'] || 'unknown'
  });
  
  await writeData(db);

  const { password: _p, ...publicUser } = user;
  res.json(publicUser);
});

// Admin endpoints for viewing signup data
app.get('/api/admin/signup-data', async (req, res) => {
  try {
    const db = await readData();
    const signupData = db.signupData || [];
    res.json(signupData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch signup data' });
  }
});

// Admin endpoints for viewing signin data
app.get('/api/admin/signin-data', async (req, res) => {
  try {
    const db = await readData();
    const signinData = db.signinData || [];
    res.json(signinData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch signin data' });
  }
});

// Record signup data (called from frontend after registration)
app.post('/api/auth/record-signup', async (req, res) => {
  try {
    const db = await readData();
    if (!db.signupData) db.signupData = [];
    
    const signupRecord = {
      id: String(nextId()),
      ...req.body,
      registrationDate: new Date().toISOString(),
      status: 'active',
      source: 'signup'
    };
    
    db.signupData.push(signupRecord);
    await writeData(db);
    
    res.json(signupRecord);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record signup' });
  }
});

// Record signin data (called from frontend after login)
app.post('/api/auth/record-signin', async (req, res) => {
  try {
    const db = await readData();
    if (!db.signinData) db.signinData = [];
    
    const signinRecord = {
      id: String(nextId()),
      email: req.body.email,
      name: req.body.name || '',
      timestamp: new Date().toISOString(),
      status: req.body.success ? 'success' : 'failed',
      ip: req.ip || 'unknown',
      device: req.body.device || req.headers['user-agent'] || 'unknown'
    };
    
    db.signinData.push(signinRecord);
    await writeData(db);
    
    res.json(signinRecord);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record signin' });
  }
});

// Generic CRUD for resources: visions, goals, tasks, todos, daily-words
const resources = {
  visions: 'visions',
  goals: 'goals',
  tasks: 'tasks',
  todos: 'todos',
  'daily-words': 'dailyWords',
  affirmations: 'affirmations',
  health: 'health',
  routines: 'routines',
  people: 'people',
  'blog-posts': 'blogPosts'
};

Object.entries(resources).forEach(([route, key]) => {
  // list - filter by userId
  app.get(`/api/${route}`, async (req, res) => {
    // Get userId from header or query params
    const userId = req.headers['x-user-id'] || req.query.userId;
    
    // If Supabase is available and this resource is supported, use it.
    const supabaseResources = new Set(['visions','goals','tasks','todos','people','affirmations']);
    if (SUPABASE_AVAILABLE && supabaseResources.has(route)) {
      try {
        const items = await supabaseClient.getResource(key, req.query);
        return res.json(items);
      } catch (err) {
        console.error(`Supabase getResource(${key}) error:`, err.message || err);
        // fall through to JSON fallback
      }
    }

    const db = await readData();
    let items = db[key] || [];
    
    // Filter by userId if provided
    if (userId) {
      items = items.filter(it => it.userId === userId);
    }
    
    // optional year or date filtering
    const { year, date } = req.query;
    if (year) items = items.filter(it => it.year === Number(year));
    if (date) items = items.filter(it => it.date === date);
    
    res.json(items);
  });

  // create - add userId to item
  app.post(`/api/${route}`, async (req, res) => {
    // Get userId from header or body
    const userId = req.headers['x-user-id'] || req.body.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    // Prefer Supabase for supported resources when available.
    const supabaseCreateResources = new Set(['visions','goals','tasks','todos','people','affirmations']);
    if (SUPABASE_AVAILABLE && supabaseCreateResources.has(route)) {
      try {
        const created = await supabaseClient.createResource(key, req.body);
        return res.json(created);
      } catch (err) {
        console.error(`Supabase createResource(${key}) error:`, err.message || err);
        // fall through to JSON fallback
      }
    }

    const db = await readData();
    const item = { id: nextId(), ...req.body, userId };
    db[key] = db[key] || [];
    db[key].push(item);
    await writeData(db);
    res.json(item);
  });

  // update - verify userId ownership
  app.put(`/api/${route}/:id`, async (req, res) => {
    const id = Number(req.params.id);
    const userId = req.headers['x-user-id'] || req.body.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    // Supabase path for supported resources
    const supabaseUpdateResources = new Set(['visions','goals','tasks','todos','people','affirmations']);
    if (SUPABASE_AVAILABLE && supabaseUpdateResources.has(route)) {
      try {
        const updated = await supabaseClient.updateResource(key, id, req.body);
        return res.json(updated);
      } catch (err) {
        console.error(`Supabase updateResource(${key}) error:`, err.message || err);
        // fall through to JSON fallback
      }
    }

    const db = await readData();
    const list = db[key] || [];
    const idx = list.findIndex(i => Number(i.id) === id);
    
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    
    // Verify userId ownership
    if (list[idx].userId && list[idx].userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    list[idx] = { ...list[idx], ...req.body, userId };
    await writeData(db);
    res.json(list[idx]);
  });

  // delete - verify userId ownership
  app.delete(`/api/${route}/:id`, async (req, res) => {
    const id = Number(req.params.id);
    const userId = req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    // Supabase path for supported resources
    const supabaseDeleteResources = new Set(['visions','goals','tasks','todos','people','affirmations']);
    if (SUPABASE_AVAILABLE && supabaseDeleteResources.has(route)) {
      try {
        const result = await supabaseClient.deleteResource(key, id);
        return res.json(result);
      } catch (err) {
        console.error(`Supabase deleteResource(${key}) error:`, err.message || err);
        // fall through to JSON fallback
      }
    }

    const db = await readData();
    const list = db[key] || [];
    const idx = list.findIndex(i => Number(i.id) === id);
    
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    
    // Verify userId ownership
    if (list[idx].userId && list[idx].userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    db[key] = list.filter(i => Number(i.id) !== id);
    await writeData(db);
    res.json({ success: true });
  });
});

app.listen(PORT, async () => {
  console.log(`Dev API server running on http://localhost:${PORT}`);
  console.log(`Data file: ${DATA_FILE}`);
  
  // Create daily backup on server startup
  console.log('\n🔄 Attempting to create daily backup...');
  const backupResult = await createDailyBackup();
  if (backupResult.success) {
    console.log('✅ Daily backup created:', backupResult.filename);
  } else if (backupResult.reason === 'Already backed up today') {
    console.log('ℹ️  Backup already exists for today');
  } else {
    console.log('⚠️  Backup status:', backupResult.reason || backupResult.error);
  }
  console.log('');
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path, method: req.method });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});
