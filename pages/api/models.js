/**
 * Model Management API
 * Handles Ollama model operations for Synova Brain
 */

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action, model_name } = req.body;

  try {
    switch (action) {
      case 'list':
        return await listModels(req, res);
      case 'pull':
        return await pullModel(req, res, model_name);
      case 'delete':
        return await deleteModel(req, res, model_name);
      case 'health':
        return await checkHealth(req, res);
      case 'stats':
        return await getStats(req, res);
      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (error) {
    console.error('Model management error:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function listModels(req, res) {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    const data = await response.json();
    
    return res.status(200).json({
      models: data.models || [],
      total: data.models?.length || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to list models' });
  }
}

async function pullModel(req, res, modelName) {
  if (!modelName) {
    return res.status(400).json({ error: 'Model name is required' });
  }

  try {
    // Start the pull process
    const response = await fetch('http://localhost:11434/api/pull', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: modelName })
    });

    if (!response.ok) {
      throw new Error(`Pull failed: ${response.statusText}`);
    }

    // Stream the progress
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked'
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          const progress = {
            status: data.status,
            digest: data.digest,
            total: data.total,
            completed: data.completed
          };
          res.write(`data: ${JSON.stringify(progress)}\n\n`);
        } catch (e) {
          // Skip invalid JSON lines
        }
      }
    }

    res.write('data: {"status": "success"}\n\n');
    res.end();
  } catch (error) {
    return res.status(500).json({ error: `Failed to pull model: ${error.message}` });
  }
}

async function deleteModel(req, res, modelName) {
  if (!modelName) {
    return res.status(400).json({ error: 'Model name is required' });
  }

  try {
    const response = await fetch('http://localhost:11434/api/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: modelName })
    });

    if (response.ok) {
      return res.status(200).json({
        action: 'delete',
        model: modelName,
        success: true,
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error(`Delete failed: ${response.statusText}`);
    }
  } catch (error) {
    return res.status(500).json({ error: `Failed to delete model: ${error.message}` });
  }
}

async function checkHealth(req, res) {
  try {
    const [versionResponse, modelsResponse] = await Promise.all([
      fetch('http://localhost:11434/api/version'),
      fetch('http://localhost:11434/api/tags')
    ]);

    const version = versionResponse.ok ? await versionResponse.json() : null;
    const models = modelsResponse.ok ? await modelsResponse.json() : null;

    return res.status(200).json({
      status: version ? 'healthy' : 'unhealthy',
      ollama_version: version?.version || 'unknown',
      models_available: models?.models?.length || 0,
      models: models?.models || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ 
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

async function getStats(req, res) {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    const data = await response.json();
    
    const stats = {
      total_models: data.models?.length || 0,
      total_size: data.models?.reduce((sum, model) => sum + (model.size || 0), 0) || 0,
      models: data.models?.map(model => ({
        name: model.name,
        size: model.size,
        digest: model.digest,
        modified_at: model.modified_at
      })) || [],
      timestamp: new Date().toISOString()
    };

    return res.status(200).json(stats);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get stats' });
  }
}
