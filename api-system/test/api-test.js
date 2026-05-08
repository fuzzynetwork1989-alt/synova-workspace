/**
 * API Testing Script
 * Tests the free API key management system
 */

const API_BASE = 'http://localhost:3000/api/v1';

class APITester {
  constructor() {
    this.testResults = [];
    this.createdKeys = [];
  }

  async runTest(testName, testFunction) {
    console.log(`\n🧪 Running test: ${testName}`);
    try {
      const result = await testFunction();
      this.testResults.push({ name: testName, status: 'PASS', result });
      console.log(`✅ ${testName} - PASSED`);
      return result;
    } catch (error) {
      this.testResults.push({ name: testName, status: 'FAIL', error: error.message });
      console.log(`❌ ${testName} - FAILED: ${error.message}`);
      throw error;
    }
  }

  async testHealthCheck() {
    const response = await fetch(`${API_BASE.replace('/api/v1', '')}/health`);
    const data = await response.json();
    
    if (!response.ok || data.status !== 'healthy') {
      throw new Error('Health check failed');
    }
    
    return data;
  }

  async testCreateAPIKey() {
    const response = await fetch(`${API_BASE}/keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test API Key',
        permissions: ['read', 'write'],
        rateLimit: 1000,
        expiresIn: '24h'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create API key');
    }

    const data = await response.json();
    this.createdKeys.push(data.data);
    return data.data;
  }

  async testValidateAPIKey(apiKey) {
    const response = await fetch(`${API_BASE}/auth/validate`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API key validation failed');
    }

    return await response.json();
  }

  async testListAPIKeys(apiKey) {
    const response = await fetch(`${API_BASE}/keys`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to list API keys');
    }

    return await response.json();
  }

  async testGetAnalytics(apiKey) {
    const response = await fetch(`${API_BASE}/analytics`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get analytics');
    }

    return await response.json();
  }

  async testBatchKeyCreation() {
    const response = await fetch(`${API_BASE}/keys/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.createdKeys[0].apiKey}`
      },
      body: JSON.stringify({
        count: 3,
        namePrefix: 'Batch Test',
        permissions: ['read'],
        rateLimit: 500
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create batch keys');
    }

    const data = await response.json();
    this.createdKeys.push(...data.data.keys);
    return data.data;
  }

  async testUpdateAPIKey(apiKey, keyId) {
    const response = await fetch(`${API_BASE}/keys/${keyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        name: 'Updated Test Key',
        rateLimit: 2000,
        isActive: true
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update API key');
    }

    return await response.json();
  }

  async testDeleteAPIKey(apiKey, keyId) {
    const response = await fetch(`${API_BASE}/keys/${keyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete API key');
    }

    return { success: true };
  }

  async runAllTests() {
    console.log('🚀 Starting API System Tests\n');
    console.log('=====================================');

    try {
      // Test 1: Health Check
      await this.runTest('Health Check', () => this.testHealthCheck());

      // Test 2: Create API Key
      const createdKey = await this.runTest('Create API Key', () => this.testCreateAPIKey());
      console.log(`   Created key: ${createdKey.keyId}`);

      // Test 3: Validate API Key
      await this.runTest('Validate API Key', () => this.testValidateAPIKey(createdKey.apiKey));

      // Test 4: List API Keys
      await this.runTest('List API Keys', () => this.testListAPIKeys(createdKey.apiKey));

      // Test 5: Get Analytics
      await this.runTest('Get Analytics', () => this.testGetAnalytics(createdKey.apiKey));

      // Test 6: Batch Key Creation
      const batchResult = await this.runTest('Batch Key Creation', () => this.testBatchKeyCreation());
      console.log(`   Created ${batchResult.count} keys in batch`);

      // Test 7: Update API Key
      await this.runTest('Update API Key', () => this.testUpdateAPIKey(createdKey.apiKey, createdKey.keyId));

      // Test 8: Delete API Key
      await this.runTest('Delete API Key', () => this.testDeleteAPIKey(createdKey.apiKey, createdKey.keyId));

      console.log('\n=====================================');
      console.log('🎉 All tests completed successfully!');
      
    } catch (error) {
      console.log('\n=====================================');
      console.log('💥 Tests failed!');
    }

    // Print summary
    this.printSummary();
  }

  printSummary() {
    console.log('\n📊 Test Summary:');
    console.log('=====================================');
    
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    
    console.log(`Total Tests: ${this.testResults.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / this.testResults.length) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults
        .filter(r => r.status === 'FAIL')
        .forEach(test => {
          console.log(`   - ${test.name}: ${test.error}`);
        });
    }

    console.log('\n🔑 Created API Keys:');
    this.createdKeys.forEach(key => {
      console.log(`   - ${key.name}: ${key.keyId}`);
    });
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new APITester();
  tester.runAllTests().catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
  });
}

export default APITester;
