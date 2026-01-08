// Simple script to clear test data from MongoDB
const mongoose = require('mongoose');

// Your MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bullana_db';

async function clearTestData() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get the users collection
    const users = mongoose.connection.db.collection('users');

    // Clear unverified users (status: 0)
    const result1 = await users.deleteMany({ status: 0 });
    console.log(`🗑️  Deleted ${result1.deletedCount} unverified users`);

    // Clear test users by username pattern
    const result2 = await users.deleteMany({ 
      username: { $regex: /^(test|user_|wallet_)/i } 
    });
    console.log(`🗑️  Deleted ${result2.deletedCount} test users`);

    // Show remaining users count
    const remainingCount = await users.countDocuments();
    console.log(`📊 Remaining users: ${remainingCount}`);

    console.log('✅ Database cleanup completed');

  } catch (error) {
    console.error('❌ Error clearing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run the script
clearTestData();
