const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

class DatabaseManager {
    constructor() {
        this.isConnected = false;
        this.connectionString = null;
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    async connect() {
        const config = require('../config/production');
        
        // Try different connection strings
        const connectionStrings = [
            // Original Atlas connection
            config.dbconnection,
            // Alternative format without SRV
            'mongodb://wgdc:DNSzOlW4n6UaaVW8@cluster1bulana-shard-00-00.mv49q.mongodb.net:27017,cluster1bulana-shard-00-01.mv49q.mongodb.net:27017,cluster1bulana-shard-00-02.mv49q.mongodb.net:27017/db?ssl=true&replicaSet=atlas-123abc-shard-0&authSource=admin&retryWrites=true&w=majority',
            // Local MongoDB fallback
            'mongodb://localhost:27017/bullana_local'
        ];

        for (let i = 0; i < connectionStrings.length; i++) {
            const connectionString = connectionStrings[i];
            console.log(`Attempting database connection ${i + 1}/${connectionStrings.length}...`);
            
            try {
                await this.attemptConnection(connectionString);
                this.connectionString = connectionString;
                this.isConnected = true;
                console.log(`✅ Database connected successfully to: ${this.maskConnectionString(connectionString)}`);
                return true;
            } catch (error) {
                console.log(`❌ Connection ${i + 1} failed:`, error.message);
                if (i === connectionStrings.length - 1) {
                    console.log('🔄 All connection attempts failed. Running in offline mode.');
                    return false;
                }
                // Wait before trying next connection
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        
        return false;
    }

    async attemptConnection(connectionString) {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // 5 second timeout
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 2,
            maxIdleTimeMS: 30000,
            waitQueueTimeoutMS: 5000,
            retryWrites: true,
            w: 'majority'
        };

        // Set mongoose settings
        mongoose.set('strictQuery', false);
        
        return mongoose.connect(connectionString, options);
    }

    maskConnectionString(connectionString) {
        // Mask password in connection string for logging
        return connectionString.replace(/:([^:/@]+)@/, ':***@');
    }

    getStatus() {
        const readyState = mongoose.connection.readyState;
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };

        return {
            connected: this.isConnected && readyState === 1,
            state: states[readyState] || 'unknown',
            readyState: readyState,
            connectionString: this.maskConnectionString(this.connectionString || 'none'),
            host: mongoose.connection.host || 'not connected',
            database: mongoose.connection.name || 'not connected'
        };
    }

    // Test raw MongoDB connection (without Mongoose)
    async testRawConnection() {
        const config = require('../config/production');
        const client = new MongoClient(config.dbconnection, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000
        });

        try {
            await client.connect();
            await client.db("admin").command({ ping: 1 });
            console.log("✅ Raw MongoDB connection successful");
            await client.close();
            return true;
        } catch (error) {
            console.log("❌ Raw MongoDB connection failed:", error.message);
            return false;
        }
    }
}

module.exports = new DatabaseManager();
