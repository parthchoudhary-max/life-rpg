require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const shopRoutes = require('./routes/shopRoutes');
const characterRoutes = require('./routes/characterRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Auto-seed helper
const ShopItem = require('./models/ShopItem');
const { initialShopCatalog } = require('./seeds/seedData');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Utility Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('CORS policy violation'));
    },
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Life RPG Engine',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/character', characterRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Start Server & Connect Database
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed catalog if empty
    try {
      const shopCount = await ShopItem.countDocuments({ isCustomReward: false });
      if (shopCount === 0) {
        console.log('📦 Shop catalog empty - auto-seeding starter 16-bit items...');
        for (const item of initialShopCatalog) {
          await ShopItem.findOneAndUpdate(
            { itemId: item.itemId },
            { ...item, isCustomReward: false },
            { upsert: true }
          );
        }
        console.log('✅ Starter shop catalog seeded successfully.');
      }
    } catch (seedErr) {
      console.warn('⚠️ Auto-seed check notice:', seedErr.message);
    }

    app.listen(PORT, () => {
      console.log(`
      ⚔️ ======================================================== ⚔️
         LIFE RPG SERVER RUNNING ON PORT ${PORT}
         Dungeon Gateway: http://localhost:${PORT}
         Environment:     ${process.env.NODE_ENV || 'development'}
      ⚔️ ======================================================== ⚔️
      `);
    });
  } catch (err) {
    console.error('Failed to start Life RPG server:', err);
    process.exit(1);
  }
};

startServer();

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});

module.exports = app;
