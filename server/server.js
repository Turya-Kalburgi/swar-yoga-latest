import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import workshopRoutes from './routes/workshops.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Try to dynamically load a Supabase client wrapper if available.
// This file is optional and will only be used when SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY are provided in the environment.
let SUPABASE_AVAILABLE = false;
let supabaseClient = null;
try {
  // top-level await is supported in ESM modules
  const mod = await import('./supabaseClient.js');
  if (mod && mod.SUPABASE_AVAILABLE) {
    SUPABASE_AVAILABLE = true;
    supabaseClient = mod;
    console.log('Supabase client loaded — using Supabase for visions resource');
  }
} catch (e) {
  // If import fails, we silently fall back to JSON-file persistence.
}

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

// Workshop Routes - mounted at /api/admin/workshops
app.use('/api/admin/workshops', workshopRoutes);

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
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const db = await readData();
  const exists = db.users.find(u => u.email === email);
  if (exists) return res.status(400).json({ error: 'User already exists' });

  const user = { id: String(nextId()), email, password, name: name || email.split('@')[0], isNewUser: true };
  db.users.push(user);
  await writeData(db);

  const { password: _p, ...publicUser } = user;
  res.json(publicUser);
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const db = await readData();
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const { password: _p, ...publicUser } = user;
  res.json(publicUser);
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
  // list
  app.get(`/api/${route}`, async (req, res) => {
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
    const items = db[key] || [];
    // optional year or date filtering
    const { year, date } = req.query;
    let out = items;
    if (year) out = out.filter(it => it.year === Number(year));
    if (date) out = out.filter(it => it.date === date);
    res.json(out);
  });

  // create
  app.post(`/api/${route}`, async (req, res) => {
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
    const item = { id: nextId(), ...req.body };
    db[key] = db[key] || [];
    db[key].push(item);
    await writeData(db);
    res.json(item);
  });

  // update
  app.put(`/api/${route}/:id`, async (req, res) => {
    const id = Number(req.params.id);
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
    list[idx] = { ...list[idx], ...req.body };
    await writeData(db);
    res.json(list[idx]);
  });

  // delete
  app.delete(`/api/${route}/:id`, async (req, res) => {
    const id = Number(req.params.id);
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
    db[key] = (db[key] || []).filter(i => Number(i.id) !== id);
    await writeData(db);
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Dev API server running on http://localhost:${PORT}`);
  console.log(`Data file: ${DATA_FILE}`);
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
