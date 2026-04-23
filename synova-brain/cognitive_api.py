"""
SYNOVA BRAIN v5.0 - Cognitive API with Dashboard Support
Extended API for real-time cognitive monitoring
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
import uvicorn
import os
from datetime import datetime
import sys
import asyncio
import json

# Add current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# Import the advanced brain
from synova_brain_v5 import create_synova_brain_v5, SynovaBrainV5

# Initialize FastAPI app
app = FastAPI(
    title="Synova Brain API v5.0",
    description="Emergent Cognition Architecture with Real-time Monitoring",
    version="5.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the brain
brain = create_synova_brain_v5()

# Request/Response models
class GenerateRequest(BaseModel):
    prompt: str
    context: Optional[Dict[str, Any]] = None
    domain: Optional[str] = None

class GenerateResponse(BaseModel):
    query_id: str
    response: Dict[str, Any]
    confidence: float
    processing_time: float
    cognitive_layers_used: List[int]
    reasoning_frames: List[Dict[str, Any]]

class CognitiveStatusResponse(BaseModel):
    status: str
    service: str
    version: str
    timestamp: str
    reasoning_frames: List[Dict[str, Any]]
    memory_stats: Dict[str, Any]
    cognitive_dna: Dict[str, Any]
    performance_metrics: Dict[str, Any]

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    timestamp: str
    brain_active: bool
    cognitive_layers: int
    working_minds: int

# Routes
@app.get("/", response_model=Dict[str, Any])
async def root():
    return {
        "service": "Synova Brain API v5.0",
        "status": "active",
        "description": "Emergent Cognition Architecture with Real-time Monitoring",
        "endpoints": {
            "/health": "GET - Health check",
            "/cognitive-status": "GET - Full cognitive status",
            "/generate": "POST - Generate with emergent cognition",
            "/reasoning-transparency": "GET - Complete reasoning transparency",
            "/memory-graph": "GET - Memory graph visualization",
            "/cognitive-dna": "GET - Cognitive DNA patterns",
            "/dashboard": "GET - Cognitive dashboard UI"
        },
        "features": [
            "Emergent cognition",
            "Multi-layer memory",
            "Self-interrogation loops",
            "Working minds",
            "Reasoning transparency",
            "Real-time monitoring"
        ]
    }

@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="healthy",
        service="Synova Brain API v5.0",
        version="5.0.0",
        timestamp=datetime.now().isoformat(),
        brain_active=True,
        cognitive_layers=7,
        working_minds=len(brain.working_minds)
    )

@app.post("/generate", response_model=GenerateResponse)
async def generate_with_emergent_cognition(request: GenerateRequest):
    """Generate response using emergent cognition architecture"""
    try:
        import time
        start_time = time.time()
        
        # Process query with emergent cognition
        result = await brain.process_query(request.prompt, request.context)
        
        processing_time = time.time() - start_time
        
        return GenerateResponse(
            query_id=result["query_id"],
            response=result["response"],
            confidence=result["confidence"],
            processing_time=result["processing_time"],
            cognitive_layers_used=result["cognitive_layers_used"],
            reasoning_frames=result["reasoning_frames"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/cognitive-status", response_model=CognitiveStatusResponse)
async def get_cognitive_status():
    """Get complete cognitive system status"""
    try:
        transparency = brain.get_reasoning_transparency()
        
        return CognitiveStatusResponse(
            status="active",
            service="Synova Brain v5.0",
            version="5.0.0",
            timestamp=datetime.now().isoformat(),
            reasoning_frames=transparency["reasoning_movie"][-50:],  # Last 50 frames
            memory_stats=transparency["memory_stats"],
            cognitive_dna=transparency["cognitive_dna"],
            performance_metrics=transparency["performance_metrics"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/reasoning-transparency")
async def get_reasoning_transparency(query_id: Optional[str] = None):
    """Get complete reasoning transparency"""
    try:
        transparency = brain.get_reasoning_transparency(query_id)
        return {
            "status": "success",
            "transparency": transparency,
            "query_id": query_id,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/memory-graph")
async def get_memory_graph():
    """Get memory graph for visualization"""
    try:
        # Extract graph data
        nodes = []
        edges = []
        
        for node_id, node in brain.memory.nodes.items():
            nodes.append({
                "id": node_id,
                "type": node.type,
                "content": node.content,
                "confidence": node.confidence,
                "access_count": node.access_count,
                "created_at": node.created_at.isoformat()
            })
        
        for edge_id, edge in brain.memory.edges.items():
            edges.append({
                "id": edge_id,
                "source": edge.source,
                "target": edge.target,
                "relationship": edge.relationship,
                "weight": edge.weight,
                "strength": edge.strength
            })
        
        return {
            "status": "success",
            "nodes": nodes,
            "edges": edges,
            "total_nodes": len(nodes),
            "total_edges": len(edges),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/cognitive-dna")
async def get_cognitive_dna():
    """Get cognitive DNA patterns"""
    try:
        dna_patterns = []
        
        for pattern_key, stats in brain.cognitive_dna.items():
            dna_patterns.append({
                "pattern": pattern_key,
                "usage_count": stats["usage_count"],
                "total_confidence": stats["total_confidence"],
                "total_time": stats["total_time"],
                "success_rate": stats["success_rate"],
                "avg_confidence": stats["total_confidence"] / stats["usage_count"],
                "avg_time": stats["total_time"] / stats["usage_count"]
            })
        
        # Sort by usage count
        dna_patterns.sort(key=lambda x: x["usage_count"], reverse=True)
        
        return {
            "status": "success",
            "patterns": dna_patterns,
            "total_patterns": len(dna_patterns),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/dashboard", response_class=HTMLResponse)
async def get_dashboard():
    """Serve the cognitive dashboard"""
    dashboard_html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Synova Brain v5.0 Cognitive Dashboard</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
        <style>
            body { font-family: 'Inter', sans-serif; }
            .glass-effect {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
        </style>
    </head>
    <body class="bg-gray-900 text-white min-h-screen">
        <div class="container mx-auto px-4 py-8">
            <header class="mb-8">
                <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                    Synova Brain v5.0 Cognitive Dashboard
                </h1>
                <p class="text-gray-400 mt-2">Real-time monitoring of emergent cognition architecture</p>
            </header>

            <!-- Key Metrics -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div class="glass-effect p-6 rounded-lg">
                    <h3 class="text-sm text-gray-400 mb-2">Average Confidence</h3>
                    <p class="text-3xl font-bold text-green-400" id="avg-confidence">--%</p>
                </div>
                <div class="glass-effect p-6 rounded-lg">
                    <h3 class="text-sm text-gray-400 mb-2">Processing Time</h3>
                    <p class="text-3xl font-bold text-blue-400" id="avg-time">--s</p>
                </div>
                <div class="glass-effect p-6 rounded-lg">
                    <h3 class="text-sm text-gray-400 mb-2">Memory Nodes</h3>
                    <p class="text-3xl font-bold text-purple-400" id="memory-nodes">--</p>
                </div>
                <div class="glass-effect p-6 rounded-lg">
                    <h3 class="text-sm text-gray-400 mb-2">Reasoning Frames</h3>
                    <p class="text-3xl font-bold text-orange-400" id="reasoning-frames">--</p>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <!-- Confidence Chart -->
                <div class="glass-effect p-6 rounded-lg">
                    <h2 class="text-xl font-semibold mb-4">Confidence Evolution</h2>
                    <canvas id="confidenceChart" width="400" height="200"></canvas>
                </div>

                <!-- Memory Distribution -->
                <div class="glass-effect p-6 rounded-lg">
                    <h2 class="text-xl font-semibold mb-4">Memory Distribution</h2>
                    <canvas id="memoryChart" width="400" height="200"></canvas>
                </div>

                <!-- Cognitive Layers -->
                <div class="glass-effect p-6 rounded-lg">
                    <h2 class="text-xl font-semibold mb-4">Cognitive Layer Activity</h2>
                    <canvas id="layersChart" width="400" height="200"></canvas>
                </div>

                <!-- DNA Patterns -->
                <div class="glass-effect p-6 rounded-lg">
                    <h2 class="text-xl font-semibold mb-4">Cognitive DNA Patterns</h2>
                    <canvas id="dnaChart" width="400" height="200"></canvas>
                </div>
            </div>

            <!-- Reasoning Frames -->
            <div class="glass-effect p-6 rounded-lg">
                <h2 class="text-xl font-semibold mb-4">Recent Reasoning Frames</h2>
                <div id="reasoning-frames-list" class="space-y-4 max-h-96 overflow-y-auto">
                    <!-- Frames will be populated here -->
                </div>
            </div>
        </div>

        <script>
            // Chart instances
            let confidenceChart, memoryChart, layersChart, dnaChart;
            
            // Initialize charts
            function initCharts() {
                // Confidence Chart
                const confidenceCtx = document.getElementById('confidenceChart').getContext('2d');
                confidenceChart = new Chart(confidenceCtx, {
                    type: 'line',
                    data: {
                        labels: [],
                        datasets: [{
                            label: 'Confidence',
                            data: [],
                            borderColor: 'rgb(34, 197, 94)',
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: { beginAtZero: true, max: 1 }
                        }
                    }
                });

                // Memory Chart
                const memoryCtx = document.getElementById('memoryChart').getContext('2d');
                memoryChart = new Chart(memoryCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Working Memory', 'Episodic Log', 'Semantic Vectors', 'Reasoning Graph'],
                        datasets: [{
                            data: [0, 0, 0, 0],
                            backgroundColor: [
                                'rgba(59, 130, 246, 0.8)',
                                'rgba(16, 185, 129, 0.8)',
                                'rgba(251, 146, 60, 0.8)',
                                'rgba(139, 92, 246, 0.8)'
                            ]
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });

                // Layers Chart
                const layersCtx = document.getElementById('layersChart').getContext('2d');
                layersChart = new Chart(layersCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Layer 1', 'Layer 2', 'Layer 3', 'Layer 4', 'Layer 5', 'Layer 6', 'Layer 7'],
                        datasets: [{
                            label: 'Activity',
                            data: [0, 0, 0, 0, 0, 0, 0],
                            backgroundColor: 'rgba(34, 197, 94, 0.8)'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: { beginAtZero: true }
                        }
                    }
                });

                // DNA Chart
                const dnaCtx = document.getElementById('dnaChart').getContext('2d');
                dnaChart = new Chart(dnaCtx, {
                    type: 'radar',
                    data: {
                        labels: ['Reasoning', 'Memory', 'Reflection', 'Adaptation', 'Confidence', 'Speed'],
                        datasets: [{
                            label: 'Cognitive Capabilities',
                            data: [0, 0, 0, 0, 0, 0],
                            borderColor: 'rgba(139, 92, 246, 0.8)',
                            backgroundColor: 'rgba(139, 92, 246, 0.2)'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            r: {
                                beginAtZero: true,
                                max: 100
                            }
                        }
                    }
                });
            }

            // Update dashboard data
            async function updateDashboard() {
                try {
                    const response = await axios.get('/cognitive-status');
                    const data = response.data;

                    // Update metrics
                    document.getElementById('avg-confidence').textContent = 
                        (data.performance_metrics.avg_confidence * 100).toFixed(1) + '%';
                    document.getElementById('avg-time').textContent = 
                        data.performance_metrics.avg_processing_time.toFixed(2) + 's';
                    document.getElementById('memory-nodes').textContent = data.memory_stats.total_nodes;
                    document.getElementById('reasoning-frames').textContent = data.reasoning_frames.length;

                    // Update confidence chart
                    if (data.reasoning_frames.length > 0) {
                        const confidenceData = data.reasoning_frames.map(frame => ({
                            x: new Date(frame.timestamp).toLocaleTimeString(),
                            y: frame.confidence_evolution[frame.confidence_evolution.length - 1] || 0
                        }));

                        confidenceChart.data.labels = confidenceData.map(d => d.x);
                        confidenceChart.data.datasets[0].data = confidenceData.map(d => d.y);
                        confidenceChart.update();
                    }

                    // Update memory chart
                    const memoryData = [
                        data.memory_stats.working_memory_size || 0,
                        data.memory_stats.episodic_entries || 0,
                        Object.keys(data.memory_stats.semantic_vectors || {}).length,
                        data.memory_stats.total_nodes || 0
                    ];
                    memoryChart.data.datasets[0].data = memoryData;
                    memoryChart.update();

                    // Update layers chart
                    const layerCounts = new Array(7).fill(0);
                    data.reasoning_frames.forEach(frame => {
                        if (frame.layer >= 1 && frame.layer <= 7) {
                            layerCounts[frame.layer - 1]++;
                        }
                    });
                    layersChart.data.datasets[0].data = layerCounts;
                    layersChart.update();

                    // Update DNA chart
                    const dnaData = [
                        data.performance_metrics.avg_confidence * 100,
                        Math.min((data.memory_stats.total_nodes / 10), 100),
                        85, // Self-reflection (fixed for now)
                        90, // Adaptation (fixed for now)
                        data.performance_metrics.avg_confidence * 100,
                        Math.max(0, 100 - (data.performance_metrics.avg_processing_time * 10))
                    ];
                    dnaChart.data.datasets[0].data = dnaData;
                    dnaChart.update();

                    // Update reasoning frames list
                    const framesList = document.getElementById('reasoning-frames-list');
                    framesList.innerHTML = '';
                    
                    data.reasoning_frames.slice(-10).reverse().forEach(frame => {
                        const frameDiv = document.createElement('div');
                        frameDiv.className = 'bg-gray-800 p-4 rounded-lg';
                        frameDiv.innerHTML = `
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="font-semibold">Layer ${frame.layer}: ${frame.operation}</h3>
                                <span class="text-sm text-gray-400">
                                    ${new Date(frame.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                            <p class="text-sm text-gray-300 mb-2">
                                Agents: ${frame.agents_involved.join(', ')}
                            </p>
                            <p class="text-sm text-gray-300 mb-2">
                                Tools: ${frame.tools_used.join(', ')}
                            </p>
                            <div class="flex items-center space-x-4">
                                <span class="text-sm">
                                    Confidence: ${((frame.confidence_evolution[frame.confidence_evolution.length - 1] || 0) * 100).toFixed(1)}%
                                </span>
                                ${frame.self_interrogation.length > 0 ? 
                                    '<span class="text-sm bg-blue-600 px-2 py-1 rounded">Self-Reflection Active</span>' : 
                                    ''}
                            </div>
                        `;
                        framesList.appendChild(frameDiv);
                    });

                } catch (error) {
                    console.error('Error updating dashboard:', error);
                }
            }

            // Initialize and start updates
            document.addEventListener('DOMContentLoaded', function() {
                initCharts();
                updateDashboard();
                setInterval(updateDashboard, 2000); // Update every 2 seconds
            });
        </script>
    </body>
    </html>
    """
    return dashboard_html

@app.post("/test- cognition")
async def test_emergent_cognition():
    """Test the emergent cognition system"""
    try:
        test_queries = [
            "How do I design a responsive web layout?",
            "What's the best algorithm for sorting large datasets?",
            "Create a strategy for user engagement optimization"
        ]
        
        results = []
        for query in test_queries:
            result = await brain.process_query(query)
            results.append({
                "query": query,
                "confidence": result["confidence"],
                "processing_time": result["processing_time"],
                "cognitive_layers": result["cognitive_layers_used"],
                "status": result["response"]["status"]
            })
            
        return {
            "status": "success",
            "test_results": results,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run the server
if __name__ == "__main__":
    # Railway-specific port handling
    port = int(os.environ.get("PORT", 8001))
    print("Starting Synova Brain v5.0 Cognitive API...")
    print("Emergent Cognition Architecture Active")
    print("Dashboard available at: http://localhost:8001/dashboard")
    print(f"Server running on port: {port}")
    
    uvicorn.run(app, host="0.0.0.0", port=port)
