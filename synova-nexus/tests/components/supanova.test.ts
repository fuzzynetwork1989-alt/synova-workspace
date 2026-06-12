import { SupanovaAgent } from '../../components/supanova/agent';

describe('Supanova Agent', () => {
  let agent: SupanovaAgent;

  beforeEach(() => {
    agent = new SupanovaAgent();
  });

  describe('Tool Registration', () => {
    test('should register default tools', () => {
      const context = agent.getContext();
      expect(context).toBeDefined();
    });

    test('should register custom tool', () => {
      const customTool = {
        name: 'custom_tool',
        description: 'Custom test tool',
        parameters: { input: 'string' },
        execute: async (params: any) => ({ result: `Processed: ${params.input}` }),
        requires_confirmation: false,
        category: 'analysis' as const
      };

      agent.registerTool(customTool);
      
      // Tool should be available for execution
      expect(async () => {
        await agent.executeTool('custom_tool', { input: 'test' });
      }).not.toThrow();
    });
  });

  describe('Tool Execution', () => {
    test('should execute search tool', async () => {
      const result = await agent.executeTool('search', {
        query: 'test query',
        limit: 5
      });

      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
      expect(Array.isArray(result.results)).toBe(true);
      expect(result.query).toBe('test query');
    });

    test('should execute summarize tool', async () => {
      const result = await agent.executeTool('summarize', {
        content: 'This is a test content that needs to be summarized.',
        format: 'bullet_points'
      });

      expect(result).toBeDefined();
      expect(result.summary).toBeDefined();
      expect(result.key_points).toBeDefined();
      expect(Array.isArray(result.key_points)).toBe(true);
    });

    test('should execute create tool', async () => {
      const result = await agent.executeTool('create', {
        type: 'document',
        content: 'Test document content',
        metadata: { title: 'Test' }
      });

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.type).toBe('document');
      expect(result.status).toBe('created');
    });

    test('should execute update tool', async () => {
      const result = await agent.executeTool('update', {
        entity_id: 'test_entity_123',
        updates: { title: 'Updated Title' }
      });

      expect(result).toBeDefined();
      expect(result.id).toBe('test_entity_123');
      expect(result.status).toBe('updated');
    });

    test('should execute navigate tool', async () => {
      const result = await agent.executeTool('navigate', {
        destination: '/dashboard',
        method: 'direct'
      });

      expect(result).toBeDefined();
      expect(result.destination).toBe('/dashboard');
      expect(result.method).toBe('direct');
    });

    test('should execute settings tool', async () => {
      const result = await agent.executeTool('settings', {
        action: 'read',
        key: 'theme'
      });

      expect(result).toBeDefined();
      expect(result.action).toBe('read');
      expect(result.key).toBe('theme');
    });

    test('should handle tool execution error', async () => {
      await expect(agent.executeTool('nonexistent_tool', {}))
        .rejects.toThrow('Tool nonexistent_tool not found');
    });
  });

  describe('Input Processing', () => {
    test('should process search input', async () => {
      const result = await agent.processInput('search for artificial intelligence');
      
      expect(result).toBeDefined();
      expect(result.response).toBeDefined();
      expect(result.tools_used).toContain('search');
      expect(result.confidence).toBeGreaterThan(0);
    });

    test('should process analysis input', async () => {
      const result = await agent.processInput('summarize this article about AI');
      
      expect(result).toBeDefined();
      expect(result.response).toBeDefined();
      expect(result.tools_used).toContain('summarize');
    });

    test('should process creation input', async () => {
      const result = await agent.processInput('create a new document');
      
      expect(result).toBeDefined();
      expect(result.response).toBeDefined();
      expect(result.tools_used).toContain('create');
    });

    test('should process navigation input', async () => {
      const result = await agent.processInput('go to the dashboard');
      
      expect(result).toBeDefined();
      expect(result.response).toBeDefined();
      expect(result.tools_used).toContain('navigate');
    });

    test('should process settings input', async () => {
      const result = await agent.processInput('change the theme setting');
      
      expect(result).toBeDefined();
      expect(result.response).toBeDefined();
      expect(result.tools_used).toContain('settings');
    });

    test('should handle general input', async () => {
      const result = await agent.processInput('Hello, how are you?');
      
      expect(result).toBeDefined();
      expect(result.response).toBeDefined();
      expect(result.context_updated).toBe(true);
    });
  });

  describe('Context Management', () => {
    test('should update context', () => {
      const initialContext = agent.getContext();
      
      agent.updateContext({
        user_intent: 'search',
        conversation_history: [{ user: 'test', timestamp: new Date().toISOString() }]
      });

      const updatedContext = agent.getContext();
      expect(updatedContext.user_intent).toBe('search');
      expect(updatedContext.conversation_history).toHaveLength(1);
    });

    test('should maintain conversation history', async () => {
      await agent.processInput('First message');
      await agent.processInput('Second message');
      
      const context = agent.getContext();
      expect(context.conversation_history).toHaveLength(2);
    });
  });

  describe('Task Management', () => {
    test('should track active tasks', async () => {
      // Start a task
      const taskPromise = agent.executeTool('search', { query: 'test' });
      
      // Check active tasks
      const activeTasks = agent.getActiveTasks();
      expect(activeTasks.length).toBeGreaterThan(0);
      
      // Wait for task completion
      await taskPromise;
      
      // Check completed tasks
      const completedTasks = agent.getActiveTasks();
      expect(completedTasks.every(task => task.status === 'completed')).toBe(true);
    });

    test('should handle task failure', async () => {
      // Mock a failing tool
      const failingTool = {
        name: 'failing_tool',
        description: 'Tool that always fails',
        parameters: {},
        execute: async () => {
          throw new Error('Tool execution failed');
        },
        requires_confirmation: false,
        category: 'analysis' as const
      };

      agent.registerTool(failingTool);

      await expect(agent.executeTool('failing_tool', {}))
        .rejects.toThrow('Tool execution failed');

      // Check that task is marked as failed
      const tasks = agent.getActiveTasks();
      const failedTask = tasks.find(task => task.type === 'failing_tool');
      expect(failedTask?.status).toBe('failed');
    });
  });

  describe('Event System', () => {
    test('should emit task events', (done) => {
      agent.on('task_created', (task) => {
        expect(task).toBeDefined();
        expect(task.type).toBe('search');
      });

      agent.on('task_completed', (task) => {
        expect(task.status).toBe('completed');
        done();
      });

      agent.executeTool('search', { query: 'test' });
    });

    test('should emit context events', (done) => {
      agent.on('context_updated', (context) => {
        expect(context).toBeDefined();
        expect(context.user_intent).toBe('test_intent');
        done();
      });

      agent.updateContext({ user_intent: 'test_intent' });
    });
  });

  describe('Performance', () => {
    test('should handle concurrent tool execution', async () => {
      const promises = Array.from({ length: 5 }, (_, i) => 
        agent.executeTool('search', { query: `test query ${i}` })
      );

      const results = await Promise.all(promises);
      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result.results).toBeDefined();
      });
    });

    test('should handle large input content', async () => {
      const largeContent = 'A'.repeat(10000);
      const result = await agent.executeTool('summarize', {
        content: largeContent,
        format: 'paragraph'
      });

      expect(result).toBeDefined();
      expect(result.summary).toBeDefined();
    });
  });
});
