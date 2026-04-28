import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const CognitiveDashboard = () => {
  const [brainData, setBrainData] = useState(null);
  const [reasoningFrames, setReasoningFrames] = useState([]);
  const [memoryStats, setMemoryStats] = useState({});
  const [cognitiveDNA, setCognitiveDNA] = useState({});
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [realTimeData, setRealTimeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // API endpoint
  const API_URL = 'http://localhost:8001';

  // Fetch brain data
  const fetchBrainData = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/cognitive-status`);
      const data = await response.json();
      
      setBrainData(data);
      setReasoningFrames(data.reasoning_frames || []);
      setMemoryStats(data.memory_stats || {});
      setCognitiveDNA(data.cognitive_dna || {});
      
      // Update real-time data
      setRealTimeData(prev => {
        const newData = [...prev, {
          timestamp: new Date().toLocaleTimeString(),
          confidence: data.performance_metrics?.avg_confidence || 0,
          processing_time: data.performance_metrics?.avg_processing_time || 0,
          memory_nodes: data.memory_stats?.total_nodes || 0
        }];
        return newData.slice(-20); // Keep last 20 data points
      });
      
    } catch (error) {
      console.error('Error fetching brain data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data fetch and real-time updates
  useEffect(() => {
    fetchBrainData();
    const interval = setInterval(fetchBrainData, 2000); // Update every 2 seconds
    return () => clearInterval(interval);
  }, [fetchBrainData]);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Prepare data for cognitive layer distribution
  const prepareLayerData = () => {
    const layerCounts = {};
    reasoningFrames.forEach(frame => {
      const layerName = `Layer ${frame.layer}`;
      layerCounts[layerName] = (layerCounts[layerName] || 0) + 1;
    });
    
    return Object.entries(layerCounts).map(([name, value]) => ({
      name,
      value
    }));
  };

  // Prepare confidence evolution data
  const prepareConfidenceData = () => {
    return reasoningFrames.map(frame => ({
      timestamp: new Date(frame.timestamp).toLocaleTimeString(),
      confidence: frame.confidence_evolution[frame.confidence_evolution.length - 1] || 0,
      layer: frame.layer
    }));
  };

  // Prepare cognitive DNA data
  const prepareDNAData = () => {
    return Object.entries(cognitiveDNA).map(([pattern, stats]) => ({
      pattern: pattern.substring(0, 20) + '...',
      usage: stats.usage_count,
      success: stats.success_rate,
      avg_time: stats.total_time / stats.usage_count
    }));
  };

  // Prepare memory graph data
  const prepareMemoryData = () => {
    return [
      { name: 'Working Memory', value: memoryStats.working_memory_size || 0 },
      { name: 'Episodic Log', value: memoryStats.episodic_entries || 0 },
      { name: 'Semantic Vectors', value: Object.keys(memoryStats.semantic_vectors || {}).length },
      { name: 'Reasoning Graph', value: memoryStats.total_nodes || 0 }
    ];
  };

  // Prepare radar chart data for cognitive capabilities
  const prepareRadarData = () => {
    return [
      { capability: 'Reasoning', value: brainData?.performance_metrics?.avg_confidence * 100 || 0 },
      { capability: 'Memory', value: (memoryStats.total_nodes / 10) || 0 },
      { capability: 'Self-Reflection', value: 85 },
      { capability: 'Adaptation', value: 90 },
      { capability: 'Confidence', value: brainData?.performance_metrics?.avg_confidence * 100 || 0 },
      { capability: 'Processing Speed', value: 100 - (brainData?.performance_metrics?.avg_processing_time * 10) || 0 }
    ];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl">Loading Cognitive Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Synova Brain v5.0 Cognitive Dashboard</h1>
          <p className="text-gray-400">Real-time monitoring of emergent cognition architecture</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm text-gray-400 mb-1">Average Confidence</h3>
            <p className="text-2xl font-bold text-green-400">
              {((brainData?.performance_metrics?.avg_confidence || 0) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm text-gray-400 mb-1">Processing Time</h3>
            <p className="text-2xl font-bold text-blue-400">
              {(brainData?.performance_metrics?.avg_processing_time || 0).toFixed(2)}s
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm text-gray-400 mb-1">Memory Nodes</h3>
            <p className="text-2xl font-bold text-purple-400">
              {memoryStats.total_nodes || 0}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm text-gray-400 mb-1">Reasoning Frames</h3>
            <p className="text-2xl font-bold text-orange-400">
              {reasoningFrames.length}
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Confidence Evolution */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Confidence Evolution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={prepareConfidenceData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="timestamp" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                <Legend />
                <Line type="monotone" dataKey="confidence" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Cognitive Layer Distribution */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Cognitive Layer Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={prepareLayerData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {prepareLayerData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Memory System Overview */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Memory System Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={prepareMemoryData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                <Bar dataKey="value" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cognitive Capabilities Radar */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Cognitive Capabilities</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={prepareRadarData()}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="capability" stroke="#9CA3AF" />
                <PolarRadiusAxis stroke="#9CA3AF" />
                <Radar name="Current" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cognitive DNA Patterns */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Cognitive DNA Patterns</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="pb-2">Pattern</th>
                  <th className="pb-2">Usage</th>
                  <th className="pb-2">Success Rate</th>
                  <th className="pb-2">Avg Time</th>
                </tr>
              </thead>
              <tbody>
                {prepareDNAData().map((pattern, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="py-2">{pattern.pattern}</td>
                    <td className="py-2">{pattern.usage}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded ${
                        pattern.success > 0.8 ? 'bg-green-600' : 
                        pattern.success > 0.6 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}>
                        {(pattern.success * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2">{pattern.avg_time.toFixed(2)}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time Processing */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Real-time Processing</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={realTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="timestamp" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
              <Legend />
              <Line type="monotone" dataKey="confidence" stroke="#10B981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="processing_time" stroke="#F59E0B" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="memory_nodes" stroke="#8B5CF6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Reasoning Frames Detail */}
        <div className="bg-gray-800 p-6 rounded-lg mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Reasoning Frames</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {reasoningFrames.slice(-10).reverse().map((frame, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">Layer {frame.layer}: {frame.operation}</h3>
                  <span className="text-sm text-gray-400">
                    {new Date(frame.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-2">
                  Agents: {frame.agents_involved.join(', ')}
                </p>
                <p className="text-sm text-gray-300 mb-2">
                  Tools: {frame.tools_used.join(', ')}
                </p>
                <div className="flex items-center space-x-4">
                  <span className="text-sm">
                    Confidence: {(frame.confidence_evolution[frame.confidence_evolution.length - 1] * 100).toFixed(1)}%
                  </span>
                  {frame.self_interrogation.length > 0 && (
                    <span className="text-sm bg-blue-600 px-2 py-1 rounded">
                      Self-Reflection Active
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CognitiveDashboard;
