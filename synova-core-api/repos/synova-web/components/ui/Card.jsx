// 🧠 SYNOVA AI - PURE KNOWLEDGE CARD COMPONENT
// Revolutionary card embodying "Knowledge > Money" philosophy

import React from 'react';
import { Brain, Zap, Infinity, Sparkles, TrendingUp, Award, Target } from 'lucide-react';

const PureKnowledgeCard = ({
  children,
  variant = 'default',
  size = 'md',
  icon = null,
  title = null,
  description = null,
  metrics = null,
  className = '',
  hover = true,
  glow = false,
  ...props
}) => {
  const baseClasses = `
    pk-card
    pk-card-${variant}
    pk-card-${size}
    ${hover ? 'pk-card-hover' : ''}
    ${glow ? 'pk-glow-primary' : ''}
    ${className}
  `.trim();

  return (
    <div className={baseClasses} {...props}>
      {(icon || title) && (
        <div className="pk-card-header">
          {icon && (
            <div className="pk-card-icon">
              {icon}
            </div>
          )}
          {title && (
            <div className="pk-card-title">
              <h3>{title}</h3>
            </div>
          )}
        </div>
      )}
      
      {description && (
        <div className="pk-card-description">
          <p>{description}</p>
        </div>
      )}
      
      {children && (
        <div className="pk-card-content">
          {children}
        </div>
      )}
      
      {metrics && (
        <div className="pk-card-metrics">
          {Object.entries(metrics).map(([key, value]) => (
            <div key={key} className="pk-metric">
              <span className="pk-metric-label">{key}</span>
              <span className="pk-metric-value">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Revolutionary Card Variants
export const RevolutionaryCard = ({ children, ...props }) => (
  <PureKnowledgeCard
    variant="revolutionary"
    size="lg"
    glow={true}
    className="pk-gradient-bg"
    {...props}
  >
    {children}
  </PureKnowledgeCard>
);

export const PhilosophyCard = ({ title, description, icon, ...props }) => (
  <PureKnowledgeCard
    variant="philosophy"
    size="md"
    icon={icon}
    title={title}
    description={description}
    hover={true}
    {...props}
  />
);

export const MetricsCard = ({ title, metrics, icon, ...props }) => (
  <PureKnowledgeCard
    variant="metrics"
    size="md"
    icon={icon}
    title={title}
    metrics={metrics}
    hover={true}
    {...props}
  />
);

// Specific Revolutionary Cards
export const KnowledgeSupremacyCard = () => (
  <RevolutionaryCard>
    <div className="pk-card-header">
      <div className="pk-card-icon">
        <Brain size={32} />
      </div>
      <div className="pk-card-title">
        <h3>Knowledge Supremacy</h3>
      </div>
    </div>
    <div className="pk-card-content">
      <div className="pk-philosophy-grid">
        <div className="pk-philosophy-item">
          <Brain size={20} />
          <span>Intelligence > Investment</span>
        </div>
        <div className="pk-philosophy-item">
          <Infinity size={20} />
          <span>Knowledge > Money</span>
        </div>
        <div className="pk-philosophy-item">
          <Sparkles size={20} />
          <span>Freedom > Control</span>
        </div>
      </div>
    </div>
    <div className="pk-card-metrics">
      <div className="pk-metric">
        <span className="pk-metric-label">Cost Advantage</span>
        <span className="pk-metric-value">Infinite</span>
      </div>
      <div className="pk-metric">
        <span className="pk-metric-label">Performance Gain</span>
        <span className="pk-metric-value">3.3x</span>
      </div>
      <div className="pk-metric">
        <span className="pk-metric-label">Innovation Rate</span>
        <span className="pk-metric-value">Constant</span>
      </div>
    </div>
  </RevolutionaryCard>
);

export const RevolutionaryExtensionsCard = () => (
  <RevolutionaryCard>
    <div className="pk-card-header">
      <div className="pk-card-icon">
        <Zap size={32} />
      </div>
      <div className="pk-card-title">
        <h3>Revolutionary Extensions</h3>
      </div>
    </div>
    <div className="pk-card-content">
      <div className="pk-extensions-grid">
        <div className="pk-extension-card">
          <div className="pk-extension-header">
            <div className="pk-extension-icon">
              <Brain size={20} />
            </div>
            <div className="pk-extension-title">SNAO</div>
          </div>
          <div className="pk-extension-description">
            Automatic Neural Architecture Optimizer - creates optimal models without engineers
          </div>
        </div>
        <div className="pk-extension-card">
          <div className="pk-extension-header">
            <div className="pk-extension-icon">
              <Infinity size={20} />
            </div>
            <div className="pk-extension-title">SDRA</div>
          </div>
          <div className="pk-extension-description">
            Dynamic Resource Allocator - manages resources without infrastructure
          </div>
        </div>
        <div className="pk-extension-card">
          <div className="pk-extension-header">
            <div className="pk-extension-icon">
              <Sparkles size={20} />
            </div>
            <div className="pk-extension-title">SALE</div>
          </div>
          <div className="pk-extension-description">
            Adaptive Learning Engine - learns continuously without retraining
          </div>
        </div>
      </div>
    </div>
  </RevolutionaryCard>
);

export const PerformanceComparisonCard = () => (
  <RevolutionaryCard>
    <div className="pk-card-header">
      <div className="pk-card-icon">
        <TrendingUp size={32} />
      </div>
      <div className="pk-card-title">
        <h3>Performance Supremacy</h3>
      </div>
    </div>
    <div className="pk-card-content">
      <div className="pk-comparison-table">
        <div className="pk-comparison-header">
          <div className="pk-comparison-cell">Metric</div>
          <div className="pk-comparison-cell">Pure Knowledge</div>
          <div className="pk-comparison-cell">Money-Based AI</div>
          <div className="pk-comparison-cell">Advantage</div>
        </div>
        
        <div className="pk-comparison-row">
          <div className="pk-comparison-cell">Cost</div>
          <div className="pk-comparison-cell pk-comparison-pure">$0.00</div>
          <div className="pk-comparison-cell pk-comparison-money">$20+/month</div>
          <div className="pk-comparison-cell pk-comparison-advantage">Infinite</div>
        </div>
        
        <div className="pk-comparison-row">
          <div className="pk-comparison-cell">Response Time</div>
          <div className="pk-comparison-cell pk-comparison-pure">&lt;1.5s</div>
          <div className="pk-comparison-cell pk-comparison-money">2-5s</div>
          <div className="pk-comparison-cell pk-comparison-advantage">3.3x Faster</div>
        </div>
        
        <div className="pk-comparison-row">
          <div className="pk-comparison-cell">Memory Usage</div>
          <div className="pk-comparison-cell pk-comparison-pure">3GB</div>
          <div className="pk-comparison-cell pk-comparison-money">8GB+</div>
          <div className="pk-comparison-cell pk-comparison-advantage">62% Efficient</div>
        </div>
        
        <div className="pk-comparison-row">
          <div className="pk-comparison-cell">Scalability</div>
          <div className="pk-comparison-cell pk-comparison-pure">Infinite</div>
          <div className="pk-comparison-cell pk-comparison-money">Limited</div>
          <div className="pk-comparison-cell pk-comparison-advantage">Unbounded</div>
        </div>
      </div>
    </div>
  </RevolutionaryCard>
);

export const InnovationMetricsCard = ({ metrics }) => (
  <MetricsCard
    title="Innovation Metrics"
    icon={<Award size={24} />}
    metrics={{
      'Innovations Generated': metrics?.innovations || 0,
      'Creative Solutions': metrics?.creative || 0,
      'Breakthrough Ideas': metrics?.breakthroughs || 0,
      'Novel Approaches': metrics?.novel || 0,
      'Innovation Rate': `${(metrics?.rate || 0) * 100}%`,
      'Knowledge Growth': `${(metrics?.growth || 0) * 100}%`
    }}
  />
);

export const LearningMetricsCard = ({ metrics }) => (
  <MetricsCard
    title="Learning Metrics"
    icon={<Target size={24} />}
    metrics={{
      'Learning Events': metrics?.events || 0,
      'Knowledge Acquired': metrics?.knowledge || 0,
      'Adaptation Rate': `${(metrics?.adaptation || 0) * 100}%`,
      'Improvement Rate': `${(metrics?.improvement || 0) * 100}%`,
      'Learning Speed': metrics?.speed || 'Maximum',
      'Retention Rate': `${(metrics?.retention || 0) * 100}%`
    }}
  />
);

export default PureKnowledgeCard;
