var admin = require('./model/admin');
const dbManager = require('./utils/database');
dbManager.connect().then(connected => {
  if (connected) {
    console.log('🎉 Database ready for seed');
    admin.insertMany([{
        username: "admin", 
        ownermail: "admin@gmail.com",
        ownerkey: "admin_password",
        pattern: "123",
        profileimg: null,
        reset_code: "admin"
    }]).then(results => console.log("Successful"));
    return;
  } else {
    console.log('⚠️  Running in offline mode - some features may be limited');
  }
}).catch(err => {
  console.error('Database initialization error:', err);
});