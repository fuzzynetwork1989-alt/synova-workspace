"""
Brain Observability System - Peak Brain Component
Comprehensive monitoring, metrics, and tracing for Brain systems
"""

from typing import Dict, List, Optional, Union, Any, Callable
from dataclasses import dataclass, field
from enum import Enum
from datetime import datetime, timedelta
import asyncio
import json
import time
import uuid
from collections import defaultdict, deque
import statistics

class MetricType(Enum):
    COUNTER = "counter"
    GAUGE = "gauge"
    HISTOGRAM = "histogram"
    TIMER = "timer"

class AlertSeverity(Enum):
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"

class SystemComponent(Enum):
    MODEL_ROUTER = "model_router"
    MEMORY_SYSTEM = "memory_system"
    AGENT_RUNTIME = "agent_runtime"
    TOOL_REGISTRY = "tool_registry"
    REASONING_ENGINE = "reasoning_engine"
    RETRIEVAL_SYSTEM = "retrieval_system"

@dataclass
class MetricPoint:
    name: str
    value: float
    metric_type: MetricType
    timestamp: datetime = field(default_factory=datetime.now)
    labels: Dict[str, str] = field(default_factory=dict)
    component: Optional[SystemComponent] = None

@dataclass
class TraceEvent:
    trace_id: str
    span_id: str
    parent_span_id: Optional[str]
    operation_name: str
    component: SystemComponent
    start_time: datetime
    end_time: Optional[datetime] = None
    duration_ms: Optional[float] = None
    tags: Dict[str, Any] = field(default_factory=dict)
    logs: List[Dict[str, Any]] = field(default_factory=list)
    status: str = "ok"  # ok, error, timeout

@dataclass
class Alert:
    alert_id: str
    name: str
    severity: AlertSeverity
    message: str
    component: SystemComponent
    timestamp: datetime = field(default_factory=datetime.now)
    resolved: bool = False
    resolved_at: Optional[datetime] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

class MetricsCollector:
    """Collects and manages metrics"""
    
    def __init__(self):
        self.metrics: Dict[str, List[MetricPoint]] = defaultdict(list)
        self.counters: Dict[str, float] = defaultdict(float)
        self.gauges: Dict[str, float] = defaultdict(float)
        self.histograms: Dict[str, deque] = defaultdict(lambda: deque(maxlen=1000))
        self.timers: Dict[str, deque] = defaultdict(lambda: deque(maxlen=1000))
    
    def increment_counter(self, name: str, value: float = 1.0, labels: Dict[str, str] = None, component: SystemComponent = None):
        """Increment a counter metric"""
        self.counters[name] += value
        metric = MetricPoint(
            name=name,
            value=self.counters[name],
            metric_type=MetricType.COUNTER,
            labels=labels or {},
            component=component
        )
        self.metrics[name].append(metric)
    
    def set_gauge(self, name: str, value: float, labels: Dict[str, str] = None, component: SystemComponent = None):
        """Set a gauge metric"""
        self.gauges[name] = value
        metric = MetricPoint(
            name=name,
            value=value,
            metric_type=MetricType.GAUGE,
            labels=labels or {},
            component=component
        )
        self.metrics[name].append(metric)
    
    def record_histogram(self, name: str, value: float, labels: Dict[str, str] = None, component: SystemComponent = None):
        """Record a histogram value"""
        self.histograms[name].append(value)
        metric = MetricPoint(
            name=name,
            value=value,
            metric_type=MetricType.HISTOGRAM,
            labels=labels or {},
            component=component
        )
        self.metrics[name].append(metric)
    
    def record_timer(self, name: str, duration_ms: float, labels: Dict[str, str] = None, component: SystemComponent = None):
        """Record a timer value"""
        self.timers[name].append(duration_ms)
        metric = MetricPoint(
            name=name,
            value=duration_ms,
            metric_type=MetricType.TIMER,
            labels=labels or {},
            component=component
        )
        self.metrics[name].append(metric)
    
    def get_metric_summary(self, name: str, since: Optional[datetime] = None) -> Dict[str, Any]:
        """Get summary statistics for a metric"""
        if name not in self.metrics:
            return {}
        
        points = self.metrics[name]
        if since:
            points = [p for p in points if p.timestamp >= since]
        
        if not points:
            return {}
        
        values = [p.value for p in points]
        metric_type = points[0].metric_type
        
        summary = {
            'name': name,
            'type': metric_type.value,
            'count': len(values),
            'latest': values[-1],
            'timestamp': points[-1].timestamp
        }
        
        if metric_type == MetricType.COUNTER:
            summary['total'] = values[-1]
        elif metric_type == MetricType.GAUGE:
            summary['current'] = values[-1]
        else:
            summary.update({
                'min': min(values),
                'max': max(values),
                'avg': statistics.mean(values),
                'median': statistics.median(values)
            })
            
            if len(values) > 1:
                summary['p95'] = values[int(len(values) * 0.95)]
                summary['p99'] = values[int(len(values) * 0.99)]
        
        return summary
    
    def get_all_metrics(self) -> Dict[str, Any]:
        """Get all current metrics"""
        result = {}
        
        for name in set(list(self.counters.keys()) + list(self.gauges.keys())):
            summary = self.get_metric_summary(name)
            if summary:
                result[name] = summary
        
        return result

class TraceCollector:
    """Collects and manages distributed traces"""
    
    def __init__(self):
        self.active_traces: Dict[str, List[TraceEvent]] = defaultdict(list)
        self.completed_traces: Dict[str, List[TraceEvent]] = defaultdict(list)
        self.trace_hierarchy: Dict[str, str] = {}  # span_id -> trace_id
    
    def start_span(self, trace_id: str, operation_name: str, component: SystemComponent,
                   parent_span_id: Optional[str] = None, tags: Dict[str, Any] = None) -> str:
        """Start a new span"""
        span_id = str(uuid.uuid4())
        
        span = TraceEvent(
            trace_id=trace_id,
            span_id=span_id,
            parent_span_id=parent_span_id,
            operation_name=operation_name,
            component=component,
            start_time=datetime.now(),
            tags=tags or {}
        )
        
        self.active_traces[trace_id].append(span)
        self.trace_hierarchy[span_id] = trace_id
        
        return span_id
    
    def finish_span(self, span_id: str, status: str = "ok", logs: List[Dict[str, Any]] = None):
        """Finish a span"""
        if span_id not in self.trace_hierarchy:
            return
        
        trace_id = self.trace_hierarchy[span_id]
        
        # Find the span in active traces
        for i, span in enumerate(self.active_traces[trace_id]):
            if span.span_id == span_id:
                span.end_time = datetime.now()
                span.duration_ms = (span.end_time - span.start_time).total_seconds() * 1000
                span.status = status
                if logs:
                    span.logs.extend(logs)
                
                # Move to completed traces
                completed_span = self.active_traces[trace_id].pop(i)
                self.completed_traces[trace_id].append(completed_span)
                break
    
    def add_span_log(self, span_id: str, log_data: Dict[str, Any]):
        """Add log to a span"""
        if span_id not in self.trace_hierarchy:
            return
        
        trace_id = self.trace_hierarchy[span_id]
        
        for span in self.active_traces[trace_id]:
            if span.span_id == span_id:
                span.logs.append({
                    'timestamp': datetime.now().isoformat(),
                    **log_data
                })
                break
    
    def get_trace_summary(self, trace_id: str) -> Dict[str, Any]:
        """Get summary of a trace"""
        spans = self.completed_traces.get(trace_id, [])
        
        if not spans:
            return {}
        
        total_duration = max(s.duration_ms for s in spans if s.duration_ms) - min(s.start_time.timestamp() for s in spans) * 1000
        
        return {
            'trace_id': trace_id,
            'span_count': len(spans),
            'total_duration_ms': total_duration,
            'components': list(set(s.component.value for s in spans)),
            'status': 'error' if any(s.status == 'error' for s in spans) else 'ok',
            'start_time': min(s.start_time for s in spans),
            'end_time': max(s.end_time for s in spans if s.end_time)
        }
    
    def get_recent_traces(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get recent completed traces"""
        recent_traces = []
        
        for trace_id, spans in self.completed_traces.items():
            if spans:
                summary = self.get_trace_summary(trace_id)
                recent_traces.append(summary)
        
        # Sort by start time and limit
        recent_traces.sort(key=lambda x: x['start_time'], reverse=True)
        return recent_traces[:limit]

class AlertManager:
    """Manages alerts and notifications"""
    
    def __init__(self):
        self.alerts: Dict[str, Alert] = {}
        self.alert_rules: List[Dict[str, Any]] = []
        self.alert_handlers: List[Callable] = []
    
    def add_alert_rule(self, name: str, condition: Callable[[Dict[str, Any]], bool],
                      severity: AlertSeverity, message_template: str, component: SystemComponent):
        """Add an alert rule"""
        rule = {
            'name': name,
            'condition': condition,
            'severity': severity,
            'message_template': message_template,
            'component': component,
            'enabled': True
        }
        self.alert_rules.append(rule)
    
    def check_alerts(self, metrics: Dict[str, Any]):
        """Check all alert rules against current metrics"""
        for rule in self.alert_rules:
            if not rule['enabled']:
                continue
            
            try:
                if rule['condition'](metrics):
                    self._trigger_alert(rule, metrics)
                else:
                    self._resolve_alert(rule['name'])
            except Exception as e:
                print(f"Error checking alert rule {rule['name']}: {e}")
    
    def _trigger_alert(self, rule: Dict[str, Any], metrics: Dict[str, Any]):
        """Trigger an alert"""
        alert_id = rule['name']
        
        if alert_id in self.alerts and not self.alerts[alert_id].resolved:
            return  # Alert already active
        
        # Format message
        try:
            message = rule['message_template'].format(**metrics)
        except KeyError:
            message = rule['message_template']
        
        alert = Alert(
            alert_id=alert_id,
            name=rule['name'],
            severity=rule['severity'],
            message=message,
            component=rule['component'],
            metadata={'metrics': metrics}
        )
        
        self.alerts[alert_id] = alert
        
        # Notify handlers
        for handler in self.alert_handlers:
            try:
                handler(alert)
            except Exception as e:
                print(f"Error in alert handler: {e}")
    
    def _resolve_alert(self, alert_id: str):
        """Resolve an alert"""
        if alert_id in self.alerts:
            self.alerts[alert_id].resolved = True
            self.alerts[alert_id].resolved_at = datetime.now()
    
    def get_active_alerts(self) -> List[Alert]:
        """Get all active alerts"""
        return [alert for alert in self.alerts.values() if not alert.resolved]
    
    def add_alert_handler(self, handler: Callable[[Alert], None]):
        """Add alert notification handler"""
        self.alert_handlers.append(handler)

class BrainObservability:
    """Main observability system for Brain components"""
    
    def __init__(self):
        self.metrics_collector = MetricsCollector()
        self.trace_collector = TraceCollector()
        self.alert_manager = AlertManager()
        self.component_health: Dict[SystemComponent, bool] = {}
        
        # Setup default alert rules
        self._setup_default_alerts()
    
    def _setup_default_alerts(self):
        """Setup default alert rules"""
        # High latency alert
        self.alert_manager.add_alert_rule(
            name="high_latency",
            condition=lambda m: any(
                metric.get('p95', 0) > 5000 for metric in m.values()
                if metric.get('type') == 'timer'
            ),
            severity=AlertSeverity.WARNING,
            message_template="High latency detected: {latency_ms}ms",
            component=SystemComponent.MODEL_ROUTER
        )
        
        # Error rate alert
        self.alert_manager.add_alert_rule(
            name="high_error_rate",
            condition=lambda m: any(
                metric.get('error_rate', 0) > 0.1 for metric in m.values()
                if 'error_rate' in str(metric)
            ),
            severity=AlertSeverity.ERROR,
            message_template="High error rate: {error_rate:.2%}",
            component=SystemComponent.AGENT_RUNTIME
        )
        
        # Memory usage alert
        self.alert_manager.add_alert_rule(
            name="high_memory_usage",
            condition=lambda m: any(
                metric.get('current', 0) > 0.8 for metric in m.values()
                if 'memory_usage' in metric.get('name', '')
            ),
            severity=AlertSeverity.WARNING,
            message_template="High memory usage: {memory_usage:.1%}",
            component=SystemComponent.MEMORY_SYSTEM
        )
    
    def record_request(self, trace_id: str, operation: str, component: SystemComponent,
                       duration_ms: float, success: bool, tags: Dict[str, Any] = None):
        """Record a request with tracing"""
        
        # Start and finish span
        span_id = self.trace_collector.start_span(
            trace_id=trace_id,
            operation_name=operation,
            component=component,
            tags=tags
        )
        
        status = "ok" if success else "error"
        self.trace_collector.finish_span(span_id, status=status)
        
        # Record metrics
        self.metrics_collector.record_timer(
            f"{component.value}_request_duration",
            duration_ms,
            labels={'operation': operation, 'status': status},
            component=component
        )
        
        self.metrics_collector.increment_counter(
            f"{component.value}_requests_total",
            labels={'operation': operation, 'status': status},
            component=component
        )
        
        # Update component health
        if success:
            self.component_health[component] = True
        else:
            self.component_health[component] = False
    
    def record_memory_usage(self, component: SystemComponent, used_mb: float, total_mb: float):
        """Record memory usage"""
        usage_ratio = used_mb / total_mb if total_mb > 0 else 0
        
        self.metrics_collector.set_gauge(
            f"{component.value}_memory_usage",
            usage_ratio,
            labels={'used_mb': str(used_mb), 'total_mb': str(total_mb)},
            component=component
        )
    
    def record_model_usage(self, model_name: str, tokens_used: int, cost: float, latency_ms: float):
        """Record model usage metrics"""
        self.metrics_collector.increment_counter(
            "model_tokens_used",
            tokens_used,
            labels={'model': model_name},
            component=SystemComponent.MODEL_ROUTER
        )
        
        self.metrics_collector.increment_counter(
            "model_cost",
            cost,
            labels={'model': model_name},
            component=SystemComponent.MODEL_ROUTER
        )
        
        self.metrics_collector.record_timer(
            "model_latency",
            latency_ms,
            labels={'model': model_name},
            component=SystemComponent.MODEL_ROUTER
        )
    
    def record_agent_execution(self, agent_type: str, task_complexity: str, 
                             duration_ms: float, success: bool, cost: float):
        """Record agent execution metrics"""
        self.metrics_collector.record_timer(
            "agent_execution_duration",
            duration_ms,
            labels={'agent_type': agent_type, 'complexity': task_complexity, 'status': 'success' if success else 'error'},
            component=SystemComponent.AGENT_RUNTIME
        )
        
        self.metrics_collector.increment_counter(
            "agent_executions_total",
            labels={'agent_type': agent_type, 'complexity': task_complexity, 'status': 'success' if success else 'error'},
            component=SystemComponent.AGENT_RUNTIME
        )
        
        self.metrics_collector.increment_counter(
            "agent_execution_cost",
            cost,
            labels={'agent_type': agent_type},
            component=SystemComponent.AGENT_RUNTIME
        )
    
    def record_memory_operation(self, operation: str, layer: str, duration_ms: float, success: bool):
        """Record memory system operations"""
        self.metrics_collector.record_timer(
            "memory_operation_duration",
            duration_ms,
            labels={'operation': operation, 'layer': layer, 'status': 'success' if success else 'error'},
            component=SystemComponent.MEMORY_SYSTEM
        )
        
        self.metrics_collector.increment_counter(
            "memory_operations_total",
            labels={'operation': operation, 'layer': layer, 'status': 'success' if success else 'error'},
            component=SystemComponent.MEMORY_SYSTEM
        )
    
    def get_dashboard_data(self) -> Dict[str, Any]:
        """Get data for observability dashboard"""
        metrics = self.metrics_collector.get_all_metrics()
        active_alerts = self.alert_manager.get_active_alerts()
        recent_traces = self.trace_collector.get_recent_traces(50)
        
        # Check alerts
        self.alert_manager.check_alerts(metrics)
        
        return {
            'timestamp': datetime.now().isoformat(),
            'metrics': metrics,
            'active_alerts': [
                {
                    'id': alert.alert_id,
                    'name': alert.name,
                    'severity': alert.severity.value,
                    'message': alert.message,
                    'component': alert.component.value,
                    'timestamp': alert.timestamp.isoformat()
                }
                for alert in active_alerts
            ],
            'recent_traces': recent_traces[:10],
            'component_health': {
                component.value: health for component, health in self.component_health.items()
            },
            'summary': {
                'total_requests': sum(
                    metric.get('count', 0) for metric in metrics.values()
                    if 'requests_total' in metric.get('name', '')
                ),
                'avg_latency': statistics.mean([
                    metric.get('avg', 0) for metric in metrics.values()
                    if 'request_duration' in metric.get('name', '') and 'avg' in metric
                ]) if any('request_duration' in metric.get('name', '') for metric in metrics.values()) else 0,
                'error_rate': self._calculate_error_rate(metrics),
                'total_cost': sum(
                    metric.get('total', 0) for metric in metrics.values()
                    if 'cost' in metric.get('name', '')
                )
            }
        }
    
    def _calculate_error_rate(self, metrics: Dict[str, Any]) -> float:
        """Calculate overall error rate"""
        total_requests = 0
        error_requests = 0
        
        for metric in metrics.values():
            if 'requests_total' in metric.get('name', ''):
                labels = metric.get('labels', {})
                if labels.get('status') == 'error':
                    error_requests += metric.get('count', 0)
                else:
                    total_requests += metric.get('count', 0)
        
        if total_requests + error_requests == 0:
            return 0.0
        
        return error_requests / (total_requests + error_requests)
    
    def get_health_status(self) -> Dict[str, Any]:
        """Get overall system health status"""
        active_alerts = self.alert_manager.get_active_alerts()
        
        # Determine overall health
        if any(alert.severity == AlertSeverity.CRITICAL for alert in active_alerts):
            overall_status = "critical"
        elif any(alert.severity == AlertSeverity.ERROR for alert in active_alerts):
            overall_status = "error"
        elif any(alert.severity == AlertSeverity.WARNING for alert in active_alerts):
            overall_status = "warning"
        else:
            overall_status = "healthy"
        
        return {
            'status': overall_status,
            'timestamp': datetime.now().isoformat(),
            'components': {
                component.value: {
                    'healthy': self.component_health.get(component, True),
                    'last_check': datetime.now().isoformat()
                }
                for component in SystemComponent
            },
            'active_alerts': len(active_alerts),
            'alert_summary': {
                'critical': len([a for a in active_alerts if a.severity == AlertSeverity.CRITICAL]),
                'error': len([a for a in active_alerts if a.severity == AlertSeverity.ERROR]),
                'warning': len([a for a in active_alerts if a.severity == AlertSeverity.WARNING]),
                'info': len([a for a in active_alerts if a.severity == AlertSeverity.INFO])
            }
        }
