const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  const uri = process.env.MONGODB_URI;
  const useInMemory = process.env.USE_IN_MEMORY_DB === 'true';

  if (useInMemory) {
    console.log('⚡ [Database] Initializing In-Memory MongoDB for zero-configuration development...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memoryUri = mongodInstance.getUri();
      await mongoose.connect(memoryUri);
      console.log(`✅ [Database] In-Memory MongoDB connected: ${memoryUri}`);
      return;
    } catch (err) {
      console.error('❌ [Database] Failed to start In-Memory MongoDB:', err.message);
    }
  }

  // Attempt standard connection to MONGODB_URI
  try {
    const conn = await mongoose.connect(uri || 'mongodb://localhost:27017/liferpg', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ [Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ [Database] Could not connect to primary MongoDB URI: ${error.message}`);

    // In development, automatically fallback to MongoMemoryServer so the app runs without user setup
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('⚡ [Database] Falling back to In-Memory MongoDB Server...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongodInstance = await MongoMemoryServer.create();
        const fallbackUri = mongodInstance.getUri();
        await mongoose.connect(fallbackUri);
        console.log(`✅ [Database] Development In-Memory MongoDB successfully connected: ${fallbackUri}`);
      } catch (fallbackError) {
        console.error('❌ [Database] In-Memory fallback failed:', fallbackError.message);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};

// Graceful disconnection
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
    console.log('🔌 [Database] MongoDB connection closed');
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
  }
};

module.exports = { connectDB, disconnectDB };
