/**
 * Setup Script for API System
 * Initializes the database and creates demo data
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Database } from '../src/database/database.js';
import { KeyGenerator } from '../src/utils/keyGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SetupManager {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
  }

  async setup() {
    console.log('🚀 Setting up Free API Key Management System...\n');

    try {
      // Create necessary directories
      await this.createDirectories();
      
      // Create environment file
      await this.createEnvFile();
      
      // Initialize database
      await this.initializeDatabase();
      
      // Create demo data
      await this.createDemoData();
      
      console.log('\n✅ Setup completed successfully!');
      console.log('\n📋 Next steps:');
      console.log('1. Install dependencies: npm install');
      console.log('2. Start the server: npm start');
      console.log('3. Open admin dashboard: http://localhost:3000/admin.html');
      console.log('4. Run tests: npm test');
      
    } catch (error) {
      console.error('❌ Setup failed:', error.message);
      process.exit(1);
    }
  }

  async createDirectories() {
    console.log('📁 Creating directories...');
    
    const directories = [
      'data',
      'logs',
      'public',
      'src/utils',
      'src/middleware',
      'src/database',
      'src/routes',
      'test',
      'scripts'
    ];

    for (const dir of directories) {
      const dirPath = path.join(this.projectRoot, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`   Created: ${dirPath}`);
      }
    }
  }

  async createEnvFile() {
    console.log('⚙️ Creating environment file...');
    
    const envPath = path.join(this.projectRoot, '.env');
    const envExamplePath = path.join(this.projectRoot, '.env.example');
    
    if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log('   Created: .env (from .env.example)');
    }
  }

  async initializeDatabase() {
    console.log('🗄️ Initializing database...');
    
    const database = new Database();
    await database.initialize();
    await database.close();
    
    console.log('   Database initialized successfully');
  }

  async createDemoData() {
    console.log('🎯 Creating demo data...');
    
    const database = new Database();
    await database.initialize();

    // Create demo user
    const demoUser = {
      id: 'demo-user',
      email: 'demo@example.com',
      name: 'Demo User',
      passwordHash: 'demo-hash',
      isAdmin: true
    };

    try {
      await database.createUser(demoUser);
      console.log('   Created demo user');
    } catch (error) {
      // User might already exist
      console.log('   Demo user already exists');
    }

    // Create demo API key
    const keyData = KeyGenerator.generateApiKey();
    const hashedKey = KeyGenerator.hashApiKey(keyData.key);

    try {
      const createdKey = await database.createKey({
        keyId: keyData.keyId,
        name: 'Demo API Key',
        apiKeyHash: hashedKey,
        prefix: keyData.prefix,
        userId: 'demo-user',
        permissions: ['read', 'write', 'admin'],
        rateLimit: 10000,
        expiresAt: null
      });

      console.log(`   Created demo API key: ${keyData.key}`);
      
      // Save demo key to file for easy access
      const demoKeyFile = path.join(this.projectRoot, 'demo-key.txt');
      fs.writeFileSync(demoKeyFile, `Demo API Key: ${keyData.key}\nKey ID: ${keyData.keyId}\n\nUse this key to test the API system.`);
      console.log(`   Saved demo key to: demo-key.txt`);
      
    } catch (error) {
      console.log('   Demo API key already exists');
    }

    await database.close();
  }
}

// Run setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new SetupManager();
  setup.setup().catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
}

export default SetupManager;
