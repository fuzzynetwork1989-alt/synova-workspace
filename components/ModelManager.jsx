/**
 * Model Manager Component
 * React component for managing Ollama models
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  HardDrive,
  Zap
} from 'lucide-react';

const ModelManager = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [pullProgress, setPullProgress] = useState({});
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [newModelName, setNewModelName] = useState('');

  useEffect(() => {
    fetchModels();
    fetchStats();
    const interval = setInterval(fetchModels, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchModels = async () => {
    try {
      const response = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list' })
      });
      const data = await response.json();
      setModels(data.models || []);
    } catch (err) {
      setError('Failed to fetch models');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stats' })
      });
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const pullModel = async (modelName) => {
    if (!modelName.trim()) return;
    
    setPulling(true);
    setPullProgress({});
    setError(null);

    try {
      const response = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'pull', 
          model_name: modelName.trim() 
        })
      });

      if (!response.ok) {
        throw new Error('Pull request failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.startsWith('data: '));
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line.substring(6));
            setPullProgress(prev => ({
              ...prev,
              [modelName]: data
            }));
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }

      setNewModelName('');
      await fetchModels();
      await fetchStats();
    } catch (err) {
      setError(`Failed to pull ${modelName}: ${err.message}`);
    } finally {
      setPulling(false);
      setPullProgress({});
    }
  };

  const deleteModel = async (modelName) => {
    if (!confirm(`Are you sure you want to delete ${modelName}?`)) return;

    try {
      const response = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'delete', 
          model_name: modelName 
        })
      });

      if (response.ok) {
        await fetchModels();
        await fetchStats();
      } else {
        throw new Error('Delete request failed');
      }
    } catch (err) {
      setError(`Failed to delete ${modelName}: ${err.message}`);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusBadge = (model) => {
    const progress = pullProgress[model.name];
    if (progress) {
      return <Badge variant="secondary">Pulling...</Badge>;
    }
    return <Badge variant="default" className="bg-green-500">Available</Badge>;
  };

  const renderPullProgress = (modelName) => {
    const progress = pullProgress[modelName];
    if (!progress) return null;

    const percentage = progress.total ? (progress.completed / progress.total) * 100 : 0;
    
    return (
      <div className="mt-2">
        <div className="flex justify-between text-sm mb-1">
          <span>{progress.status}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <Progress value={percentage} className="w-full" />
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Model Manager</h1>
        <p className="text-muted-foreground">
          Manage Ollama models for Synova Brain
        </p>
      </div>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="models" className="space-y-6">
        <TabsList>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="pull">Pull Model</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="models">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {models.map((model) => (
              <Card key={model.name}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    {getStatusBadge(model)}
                  </div>
                  <CardDescription>
                    {formatSize(model.size)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {renderPullProgress(model.name)}
                    
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <HardDrive className="h-3 w-3" />
                        {formatSize(model.size)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(model.modified_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => pullModel(model.name)}
                        disabled={pulling}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Refresh
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteModel(model.name)}
                        disabled={pulling}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pull">
          <Card>
            <CardHeader>
              <CardTitle>Pull New Model</CardTitle>
              <CardDescription>
                Download a new model from the Ollama registry
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter model name (e.g., llama3.1:8b)"
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && pullModel(newModelName)}
                  disabled={pulling}
                />
                <Button 
                  onClick={() => pullModel(newModelName)}
                  disabled={pulling || !newModelName.trim()}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Pull Model
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-2">Popular models:</p>
                <div className="grid gap-1 text-xs">
                  <div>• deepseek-r1:8b</div>
                  <div>• llama3.1:8b</div>
                  <div>• qwen2.5:7b</div>
                  <div>• codellama:7b</div>
                  <div>• mistral:7b</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Storage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Models:</span>
                    <span className="font-medium">{stats?.total_models || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Size:</span>
                    <span className="font-medium">{formatSize(stats?.total_size || 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Available Models:</span>
                    <span className="font-medium text-green-600">
                      {models.filter(m => !pullProgress[m.name]).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Downloading:</span>
                    <span className="font-medium text-blue-600">
                      {Object.keys(pullProgress).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModelManager;
