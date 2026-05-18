import { createSynovaNexus, SynovaNexusMain } from '../index';

describe('Synova Nexus LLM', () => {
  let nexus: SynovaNexusMain;

  beforeEach(() => {
    nexus = createSynovaNexus({
      components: {
        supanova: { enabled: true },
        astranova: { enabled: true },
        voice: { enabled: true },
        xr: { enabled: true }
      }
    });
  });

  describe('Core LLM Functionality', () => {
    test('should create Synova Nexus instance', () => {
      expect(nexus).toBeDefined();
      expect(nexus.chat).toBeDefined();
      expect(nexus.chatStreaming).toBeDefined();
    });

    test('should generate basic response', async () => {
      const response = await nexus.chat('Hello, world!');
      expect(response).toBeDefined();
      expect(response.text).toBeDefined();
    });

    test('should generate streaming response', async () => {
      const chunks = [];
      for await (const chunk of nexus.chatStreaming('Tell me about AI')) {
        chunks.push(chunk);
      }
      expect(chunks.length).toBeGreaterThan(0);
      expect(chunks[0].text).toBeDefined();
    });

    test('should get system status', () => {
      const status = nexus.getStatus();
      expect(status).toBeDefined();
      expect(status.nexus).toBe('active');
      expect(status.supanova).toBe('active');
      expect(status.astranova).toBe('active');
      expect(status.voice).toBe('active');
      expect(status.xr).toBe('active');
    });

    test('should get configuration', () => {
      const config = nexus.getConfig();
      expect(config).toBeDefined();
      expect(config.model).toBeDefined();
      expect(config.components).toBeDefined();
    });
  });

  describe('Supanova Super-Agent', () => {
    test('should execute search tool', async () => {
      const result = await nexus.useSupanova('search', {
        query: 'artificial intelligence',
        limit: 5
      });
      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
      expect(Array.isArray(result.results)).toBe(true);
    });

    test('should execute summarize tool', async () => {
      const result = await nexus.useSupanova('summarize', {
        content: 'This is a long text about artificial intelligence that needs to be summarized into key points.',
        format: 'bullet_points'
      });
      expect(result).toBeDefined();
      expect(result.summary).toBeDefined();
      expect(result.key_points).toBeDefined();
    });

    test('should execute create tool', async () => {
      const result = await nexus.useSupanova('create', {
        type: 'document',
        content: 'Test document content',
        metadata: { title: 'Test Document' }
      });
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.type).toBe('document');
    });

    test('should execute navigate tool', async () => {
      const result = await nexus.useSupanova('navigate', {
        destination: '/dashboard',
        method: 'direct'
      });
      expect(result).toBeDefined();
      expect(result.destination).toBe('/dashboard');
    });

    test('should execute settings tool', async () => {
      const result = await nexus.useSupanova('settings', {
        action: 'read',
        key: 'theme'
      });
      expect(result).toBeDefined();
      expect(result.action).toBe('read');
    });
  });

  describe('Astranova Browser', () => {
    test('should perform web search', async () => {
      const results = await nexus.browseWeb(query='machine learning');
      expect(results).toBeDefined();
      expect(results.results).toBeDefined();
      expect(results.query).toBe('machine learning');
    });

    test('should navigate to URL', async () => {
      const tab = await nexus.browseWeb(url='https://example.com');
      expect(tab).toBeDefined();
      expect(tab.url).toBe('https://example.com');
      expect(tab.title).toBeDefined();
    });

    test('should get browser session', async () => {
      const session = await nexus.browseWeb();
      expect(session).toBeDefined();
      expect(session.tabs).toBeDefined();
      expect(Array.isArray(session.tabs)).toBe(true);
    });
  });

  describe('Voice Capabilities', () => {
    test('should synthesize speech', async () => {
      const audio = await nexus.speak('Hello, world!', {
        voice: 'neural_en_female',
        emotion: 'neutral'
      });
      expect(audio).toBeDefined();
      expect(audio.audio).toBeDefined();
      expect(audio.text).toBe('Hello, world!');
    });

    test('should recognize speech', async () => {
      const input = await nexus.listen({
        language: 'en',
        continuous: false
      });
      expect(input).toBeDefined();
      expect(input.text).toBeDefined();
      expect(input.language).toBe('en');
    });
  });

  describe('XR Capabilities', () => {
    test('should start XR session', async () => {
      const session = await nexus.enterXR('test_device', 'vr');
      expect(session).toBeDefined();
      expect(session.id).toBeDefined();
      expect(session.type).toBe('vr');
      expect(session.active).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    test('should enhance input with all components', async () => {
      const response = await nexus.chat('Search for latest AI news and summarize the findings');
      expect(response).toBeDefined();
      expect(response.text).toBeDefined();
      // Should include Supanova suggestions
      expect(response.supanova_suggestions).toBeDefined();
      // Should include web results for search query
      expect(response.web_results).toBeDefined();
    });

    test('should handle voice input enhancement', async () => {
      const response = await nexus.chat('[VOICE] Tell me about quantum computing');
      expect(response).toBeDefined();
      expect(response.text).toBeDefined();
    });

    test('should handle XR context enhancement', async () => {
      const response = await nexus.chat('Create a 3D cube in VR space');
      expect(response).toBeDefined();
      expect(response.text).toBeDefined();
    });

    test('should handle streaming with component enhancement', async () => {
      const chunks = [];
      for await (const chunk of nexus.chatStreaming('Browse the web for AI trends')) {
        chunks.push(chunk);
      }
      expect(chunks.length).toBeGreaterThan(0);
      expect(chunks.some(chunk => chunk.web_results)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid tool name', async () => {
      await expect(nexus.useSupanova('invalid_tool', {}))
        .rejects.toThrow('Tool invalid_tool not found');
    });

    test('should handle disabled component', async () => {
      const disabledNexus = createSynovaNexus({
        components: {
          supanova: { enabled: false },
          astranova: { enabled: true },
          voice: { enabled: true },
          xr: { enabled: true }
        }
      });

      await expect(disabledNexus.useSupanova('search', {}))
        .rejects.toThrow('Supanova is not enabled');
    });

    test('should handle invalid XR device', async () => {
      await expect(nexus.enterXR('invalid_device', 'vr'))
        .rejects.toThrow('Device invalid_device not found');
    });
  });

  describe('Performance Tests', () => {
    test('should handle concurrent requests', async () => {
      const promises = Array.from({ length: 5 }, (_, i) => 
        nexus.chat(`Test message ${i}`)
      );
      
      const results = await Promise.all(promises);
      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result.text).toBeDefined();
      });
    });

    test('should handle large context', async () => {
      const largeText = 'A'.repeat(1000);
      const response = await nexus.chat(largeText);
      expect(response).toBeDefined();
      expect(response.text).toBeDefined();
    });
  });

  describe('Configuration Tests', () => {
    test('should accept custom configuration', () => {
      const customNexus = createSynovaNexus({
        model: {
          name: 'Custom Model',
          version: '2.0.0',
          context_window: 4096,
          max_tokens: 2048,
          temperature_range: [0.0, 1.0]
        },
        components: {
          supanova: { enabled: true },
          astranova: { enabled: false },
          voice: { enabled: true },
          xr: { enabled: false }
        }
      });

      const config = customNexus.getConfig();
      expect(config.model.name).toBe('Custom Model');
      expect(config.components.astranova.enabled).toBe(false);
    });

    test('should use default configuration', () => {
      const defaultNexus = createSynovaNexus();
      const config = defaultNexus.getConfig();
      expect(config.model.name).toBe('Synova Nexus');
      expect(config.components.supanova.enabled).toBe(true);
    });
  });
});
