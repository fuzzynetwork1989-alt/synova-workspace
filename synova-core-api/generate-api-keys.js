// 🧠 SYNOVA AI - API Key Generator
// Run with: node generate-api-keys.js <userId> <tier>

const { generateAPIKey, synovaAPIKeys } = require('./synova-api-keys-fixed.js');

// Get command line arguments
const args = process.argv.slice(2);
const userId = args[0] || 'user_' + Date.now();
const tier = args[1] || 'free';

// Validate tier
const validTiers = ['free', 'pro', 'enterprise'];
if (!validTiers.includes(tier)) {
  console.error('❌ Invalid tier. Must be: free, pro, or enterprise');
  process.exit(1);
}

// Generate new API key
console.log('🧠 SYNOVA AI - API KEY GENERATOR');
console.log('================================\n');

const newKey = generateAPIKey(userId, tier);

console.log('✅ API Key Generated Successfully!\n');
console.log('📋 Key Details:');
console.log(`   API Key: ${newKey.apiKey}`);
console.log(`   User ID: ${userId}`);
console.log(`   Tier: ${newKey.tier}`);
console.log(`   Created: ${new Date().toISOString()}\n`);

console.log('📊 Usage Limits:');
console.log(`   Requests: ${newKey.limits.requests}`);
console.log(`   Tokens: ${newKey.limits.tokens}\n`);

console.log('💰 Pricing:');
console.log(`   Monthly Rate: $${newKey.pricing.monthlyRate}`);
console.log(`   Cost Per Request: $${newKey.pricing.costPerRequest}`);
console.log(`   Description: ${newKey.pricing.description}\n`);

console.log('🔑 All Active Keys:');
Object.keys(synovaAPIKeys).forEach(key => {
  const data = synovaAPIKeys[key];
  console.log(`   ${key} (${data.tier}) - ${data.user}`);
});

console.log('\n⚠️  Store this API key securely. It will not be shown again.');
