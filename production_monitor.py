#!/usr/bin/env python3
"""
Production Monitoring Dashboard for Enhanced Synova Brain
Real-time observability and health monitoring
"""

import asyncio
import aiohttp
import json
import time
from datetime import datetime, timedelta
from typing import Dict, List, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ProductionMonitor:
    def __init__(self, api_url: str = "https://synova-ai-production.up.railway.app"):
        self.api_url = api_url
        self.metrics_history = []
        self.alerts = []
        self.health_status = "unknown"
        
    async def collect_health_metrics(self) -> Dict[str, Any]:
        """Collect comprehensive health metrics"""
        try:
            async with aiohttp.ClientSession() as session:
                # Basic health check
                async with session.get(f"{self.api_url}/health", timeout=5) as response:
                    basic_health = response.status == 200
                    basic_data = await response.json() if response.status == 200 else {}
                
                # Detailed health check
                async with session.get(f"{self.api_url}/health/detailed", timeout=10) as response:
                    detailed_health = response.status == 200
                    detailed_data = await response.json() if response.status == 200 else {}
                
                return {
                    "timestamp": datetime.now().isoformat(),
                    "basic_health": basic_health,
                    "detailed_health": detailed_health,
                    "basic_metrics": basic_data,
                    "detailed_metrics": detailed_data,
                    "api_response_time": detailed_data.get("response_time", 0),
                    "uptime": detailed_data.get("uptime", 0),
                    "memory_usage": detailed_data.get("memory_usage", {}),
                    "cpu_usage": detailed_data.get("cpu_usage", {}),
                    "active_sessions": detailed_data.get("active_sessions", 0)
                }
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return {
                "timestamp": datetime.now().isoformat(),
                "basic_health": False,
                "detailed_health": False,
                "error": str(e)
            }
    
    async def test_api_endpoints(self) -> Dict[str, Any]:
        """Test all critical API endpoints"""
        endpoints = {
            "health": f"{self.api_url}/health",
            "detailed_health": f"{self.api_url}/health/detailed",
            "generate": f"{self.api_url}/ai/generate",
            "stream": f"{self.api_url}/ai/generate/stream",
            "function_call": f"{self.api_url}/ai/function-call",
            "blueprint": f"{self.api_url}/ai/blueprint",
            "code": f"{self.api_url}/ai/code",
            "reasoning": f"{self.api_url}/ai/reasoning",
            "memory": f"{self.api_url}/ai/memory"
        }
        
        results = {}
        
        async with aiohttp.ClientSession() as session:
            for name, url in endpoints.items():
                start_time = time.time()
                try:
                    if name in ["generate", "stream", "function_call", "blueprint", "code", "reasoning", "memory"]:
                        # POST endpoints with test payload
                        payload = {
                            "prompt": "Test request",
                            "tier": "synova-brain-v3.2",
                            "session_id": f"monitor_{int(time.time())}"
                        }
                        
                        if name == "blueprint":
                            payload = {
                                "blueprint_type": "modern",
                                "parameters": {"test": True}
                            }
                        elif name == "code":
                            payload = {
                                "prompt": "Test function",
                                "language": "javascript"
                            }
                        
                        async with session.post(url, json=payload, timeout=10) as response:
                            response_time = (time.time() - start_time) * 1000
                            results[name] = {
                                "status": response.status,
                                "response_time": response_time,
                                "healthy": 200 <= response.status < 300
                            }
                    else:
                        # GET endpoints
                        async with session.get(url, timeout=10) as response:
                            response_time = (time.time() - start_time) * 1000
                            results[name] = {
                                "status": response.status,
                                "response_time": response_time,
                                "healthy": 200 <= response.status < 300
                            }
                except Exception as e:
                    results[name] = {
                        "status": "error",
                        "response_time": 0,
                        "healthy": False,
                        "error": str(e)
                    }
        
        return results
    
    async def collect_ai_metrics(self) -> Dict[str, Any]:
        """Collect AI-specific metrics"""
        try:
            async with aiohttp.ClientSession() as session:
                # Test generation latency
                start_time = time.time()
                payload = {
                    "prompt": "Quick test for metrics",
                    "tier": "synova-brain-v3.2",
                    "session_id": f"metrics_{int(time.time())}"
                }
                
                async with session.post(f"{self.api_url}/ai/generate", json=payload, timeout=30) as response:
                    if response.status == 200:
                        data = await response.json()
                        generation_time = (time.time() - start_time) * 1000
                        
                        return {
                            "generation_latency": generation_time,
                            "tokens_generated": len(data.get("response", "").split()),
                            "tokens_per_second": len(data.get("response", "").split()) / (generation_time / 1000) if generation_time > 0 else 0,
                            "model_loaded": True,
                            "cache_hit_rate": data.get("cache_hit", False)
                        }
                    else:
                        return {
                            "generation_latency": 0,
                            "tokens_generated": 0,
                            "tokens_per_second": 0,
                            "model_loaded": False,
                            "error": f"HTTP {response.status}"
                        }
        except Exception as e:
            return {
                "generation_latency": 0,
                "tokens_generated": 0,
                "tokens_per_second": 0,
                "model_loaded": False,
                "error": str(e)
            }
    
    def check_alerts(self, metrics: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Check for alerts based on metrics"""
        alerts = []
        
        # Health alerts
        if not metrics.get("health", {}).get("basic_health", False):
            alerts.append({
                "severity": "critical",
                "type": "health",
                "message": "Basic health check failed",
                "timestamp": datetime.now().isoformat()
            })
        
        # Response time alerts
        api_tests = metrics.get("api_tests", {})
        for endpoint, test in api_tests.items():
            if test.get("response_time", 0) > 5000:  # 5 seconds
                alerts.append({
                    "severity": "warning",
                    "type": "performance",
                    "message": f"High response time for {endpoint}: {test['response_time']:.0f}ms",
                    "timestamp": datetime.now().isoformat()
                })
        
        # AI metrics alerts
        ai_metrics = metrics.get("ai_metrics", {})
        if ai_metrics.get("generation_latency", 0) > 10000:  # 10 seconds
            alerts.append({
                "severity": "warning",
                "type": "ai_performance",
                "message": f"High generation latency: {ai_metrics['generation_latency']:.0f}ms",
                "timestamp": datetime.now().isoformat()
            })
        
        if not ai_metrics.get("model_loaded", False):
            alerts.append({
                "severity": "critical",
                "type": "model",
                "message": "AI model not loaded",
                "timestamp": datetime.now().isoformat()
            })
        
        return alerts
    
    async def generate_dashboard_data(self) -> Dict[str, Any]:
        """Generate complete dashboard data"""
        # Collect all metrics
        health_metrics = await self.collect_health_metrics()
        api_tests = await self.test_api_endpoints()
        ai_metrics = await self.collect_ai_metrics()
        
        # Combine metrics
        current_metrics = {
            "timestamp": datetime.now().isoformat(),
            "health": health_metrics,
            "api_tests": api_tests,
            "ai_metrics": ai_metrics
        }
        
        # Check for alerts
        alerts = self.check_alerts(current_metrics)
        self.alerts.extend(alerts)
        
        # Keep only recent alerts (last hour)
        one_hour_ago = datetime.now() - timedelta(hours=1)
        self.alerts = [
            alert for alert in self.alerts 
            if datetime.fromisoformat(alert["timestamp"]) > one_hour_ago
        ]
        
        # Store metrics history (keep last 100 entries)
        self.metrics_history.append(current_metrics)
        if len(self.metrics_history) > 100:
            self.metrics_history.pop(0)
        
        # Calculate overall health status
        overall_health = (
            health_metrics.get("basic_health", False) and
            health_metrics.get("detailed_health", False) and
            ai_metrics.get("model_loaded", False) and
            all(test.get("healthy", False) for test in api_tests.values())
        )
        
        self.health_status = "healthy" if overall_health else "unhealthy"
        
        return {
            "status": self.health_status,
            "timestamp": datetime.now().isoformat(),
            "metrics": current_metrics,
            "alerts": alerts,
            "history": self.metrics_history[-10:],  # Last 10 entries
            "summary": {
                "total_endpoints": len(api_tests),
                "healthy_endpoints": sum(1 for test in api_tests.values() if test.get("healthy", False)),
                "avg_response_time": sum(test.get("response_time", 0) for test in api_tests.values()) / len(api_tests) if api_tests else 0,
                "generation_latency": ai_metrics.get("generation_latency", 0),
                "tokens_per_second": ai_metrics.get("tokens_per_second", 0),
                "uptime": health_metrics.get("detailed_metrics", {}).get("uptime", 0)
            }
        }
    
    async def start_monitoring(self, interval: int = 30):
        """Start continuous monitoring"""
        logger.info(f"Starting production monitoring for {self.api_url}")
        logger.info(f"Monitoring interval: {interval} seconds")
        
        while True:
            try:
                dashboard_data = await self.generate_dashboard_data()
                
                # Log summary
                summary = dashboard_data["summary"]
                logger.info(f"Status: {dashboard_data['status'].upper()}")
                logger.info(f"Endpoints: {summary['healthy_endpoints']}/{summary['total_endpoints']} healthy")
                logger.info(f"Avg Response Time: {summary['avg_response_time']:.0f}ms")
                logger.info(f"Generation Latency: {summary['generation_latency']:.0f}ms")
                
                # Log alerts
                for alert in dashboard_data["alerts"]:
                    logger.warning(f"ALERT [{alert['severity'].upper()}] {alert['message']}")
                
                await asyncio.sleep(interval)
                
            except Exception as e:
                logger.error(f"Monitoring error: {e}")
                await asyncio.sleep(interval)
    
    def get_dashboard_html(self) -> str:
        """Generate HTML dashboard"""
        return f"""
<!DOCTYPE html>
<html>
<head>
    <title>Enhanced Synova Brain - Production Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        @keyframes pulse {{
            0%, 100% {{ opacity: 1; }}
            50% {{ opacity: .5; }}
        }}
        .animate-pulse {{
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }}
    </style>
</head>
<body class="bg-gray-100">
    <div class="container mx-auto p-6">
        <header class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">Enhanced Synova Brain</h1>
            <p class="text-gray-600">Production Monitoring Dashboard</p>
        </header>
        
        <!-- Status Overview -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-sm font-medium text-gray-500">System Status</h3>
                <div class="mt-2 flex items-center">
                    <div id="status-indicator" class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span id="status-text" class="text-lg font-semibold">Checking...</span>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-sm font-medium text-gray-500">Healthy Endpoints</h3>
                <div class="mt-2">
                    <span id="healthy-endpoints" class="text-2xl font-bold">-</span>
                    <span class="text-gray-500">/</span>
                    <span id="total-endpoints" class="text-lg">-</span>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-sm font-medium text-gray-500">Avg Response Time</h3>
                <div class="mt-2">
                    <span id="avg-response-time" class="text-2xl font-bold">-</span>
                    <span class="text-gray-500">ms</span>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-sm font-medium text-gray-500">Generation Latency</h3>
                <div class="mt-2">
                    <span id="generation-latency" class="text-2xl font-bold">-</span>
                    <span class="text-gray-500">ms</span>
                </div>
            </div>
        </div>
        
        <!-- Alerts -->
        <div id="alerts-container" class="mb-8">
            <!-- Alerts will be inserted here -->
        </div>
        
        <!-- Charts -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold mb-4">Response Time Trends</h3>
                <canvas id="response-time-chart"></canvas>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold mb-4">AI Performance</h3>
                <canvas id="ai-performance-chart"></canvas>
            </div>
        </div>
        
        <!-- Endpoint Status -->
        <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Endpoint Status</h3>
            <div id="endpoint-status" class="space-y-2">
                <!-- Endpoint status will be inserted here -->
            </div>
        </div>
    </div>
    
    <script>
        let charts = {{}};
        
        async function updateDashboard() {{
            try {{
                const response = await fetch('/dashboard-data');
                const data = await response.json();
                
                // Update status
                const statusIndicator = document.getElementById('status-indicator');
                const statusText = document.getElementById('status-text');
                
                if (data.status === 'healthy') {{
                    statusIndicator.className = 'w-3 h-3 rounded-full bg-green-500 mr-2';
                    statusText.textContent = 'Healthy';
                }} else {{
                    statusIndicator.className = 'w-3 h-3 rounded-full bg-red-500 mr-2 animate-pulse';
                    statusText.textContent = 'Unhealthy';
                }}
                
                // Update summary
                document.getElementById('healthy-endpoints').textContent = data.summary.healthy_endpoints;
                document.getElementById('total-endpoints').textContent = data.summary.total_endpoints;
                document.getElementById('avg-response-time').textContent = Math.round(data.summary.avg_response_time);
                document.getElementById('generation-latency').textContent = Math.round(data.summary.generation_latency);
                
                // Update alerts
                const alertsContainer = document.getElementById('alerts-container');
                if (data.alerts.length > 0) {{
                    alertsContainer.innerHTML = data.alerts.map(alert => `
                        <div class="bg-${{alert.severity === 'critical' ? 'red' : 'yellow'}}-50 border-l-4 border-${{alert.severity === 'critical' ? 'red' : 'yellow'}}-500 p-4 mb-4">
                            <div class="flex">
                                <div class="ml-3">
                                    <p class="text-sm text-${{alert.severity === 'critical' ? 'red' : 'yellow'}}-700">
                                        ${{alert.message}}
                                    </p>
                                </div>
                            </div>
                        </div>
                    `).join('');
                }} else {{
                    alertsContainer.innerHTML = '';
                }}
                
                // Update endpoint status
                const endpointStatus = document.getElementById('endpoint-status');
                endpointStatus.innerHTML = Object.entries(data.metrics.api_tests).map(([name, test]) => `
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div class="flex items-center">
                            <div class="w-2 h-2 rounded-full ${{test.healthy ? 'bg-green-500' : 'bg-red-500'}} mr-3"></div>
                            <span class="font-medium">${{name}}</span>
                        </div>
                        <div class="text-sm text-gray-500">
                            ${{test.status}} - ${{Math.round(test.response_time)}}ms
                        </div>
                    </div>
                `).join('');
                
                // Update charts
                updateCharts(data.history);
                
            }} catch (error) {{
                console.error('Dashboard update failed:', error);
            }}
        }}
        
        function updateCharts(history) {{
            // Response time chart
            const responseTimeCtx = document.getElementById('response-time-chart').getContext('2d');
            if (charts.responseTime) {{
                charts.responseTime.destroy();
            }}
            
            charts.responseTime = new Chart(responseTimeCtx, {{
                type: 'line',
                data: {{
                    labels: history.map(h => new Date(h.timestamp).toLocaleTimeString()),
                    datasets: [{{
                        label: 'Response Time (ms)',
                        data: history.map(h => h.summary.avg_response_time),
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.1
                    }}]
                }},
                options: {{
                    responsive: true,
                    scales: {{
                        y: {{
                            beginAtZero: true
                        }}
                    }}
                }}
            }});
            
            // AI performance chart
            const aiPerformanceCtx = document.getElementById('ai-performance-chart').getContext('2d');
            if (charts.aiPerformance) {{
                charts.aiPerformance.destroy();
            }}
            
            charts.aiPerformance = new Chart(aiPerformanceCtx, {{
                type: 'line',
                data: {{
                    labels: history.map(h => new Date(h.timestamp).toLocaleTimeString()),
                    datasets: [{{
                        label: 'Generation Latency (ms)',
                        data: history.map(h => h.summary.generation_latency),
                        borderColor: 'rgb(16, 185, 129)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.1
                    }}, {{
                        label: 'Tokens/Second',
                        data: history.map(h => h.summary.tokens_per_second),
                        borderColor: 'rgb(245, 158, 11)',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        tension: 0.1,
                        yAxisID: 'y1'
                    }}]
                }},
                options: {{
                    responsive: true,
                    scales: {{
                        y: {{
                            beginAtZero: true,
                            position: 'left'
                        }},
                        y1: {{
                            beginAtZero: true,
                            position: 'right',
                            grid: {{
                                drawOnChartArea: false
                            }}
                        }}
                    }}
                }}
            }});
        }}
        
        // Auto-refresh every 30 seconds
        updateDashboard();
        setInterval(updateDashboard, 30000);
    </script>
</body>
</html>
        """

# FastAPI endpoint for dashboard data
async def get_dashboard_data(request):
    """API endpoint for dashboard data"""
    monitor = ProductionMonitor()
    data = await monitor.generate_dashboard_data()
    return data

# Start monitoring in background
async def start_production_monitoring():
    """Start production monitoring in background"""
    monitor = ProductionMonitor()
    await monitor.start_monitoring()

if __name__ == "__main__":
    # Run monitoring
    asyncio.run(start_production_monitoring())
