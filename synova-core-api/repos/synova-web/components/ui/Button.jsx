// 🧠 SYNOVA AI - PURE KNOWLEDGE BUTTON COMPONENT
// Revolutionary button embodying "Knowledge > Money" philosophy

import React from 'react';
import { Brain, Zap, Infinity, Sparkles, ChevronRight } from 'lucide-react';

const PureKnowledgeButton = ({
  children,
  variant = 'primary',
  size = 'md',
  icon = null,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) => {
  const baseClasses = `
    pk-button
    pk-button-${variant}
    pk-button-${size}
    ${disabled ? 'pk-button-disabled' : ''}
    ${loading ? 'pk-button-loading' : ''}
    ${icon ? 'pk-button-with-icon' : ''}
    ${className}
  `.trim();

  const iconClasses = `
    pk-button-icon
    pk-button-icon-${iconPosition}
    ${loading ? 'pk-button-icon-loading' : ''}
  `.trim();

  return (
    <button
      className={baseClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className={iconClasses}>
          {loading ? (
            <div className="pk-button-spinner" />
          ) : (
            icon
          )}
        </span>
      )}
      
      <span className="pk-button-text">
        {loading ? 'Processing...' : children}
      </span>
      
      {icon && iconPosition === 'right' && (
        <span className={iconClasses}>
          {loading ? (
            <div className="pk-button-spinner" />
          ) : (
            icon
          )}
        </span>
      )}
      
      {loading && (
        <div className="pk-button-loading-overlay">
          <div className="pk-button-loading-spinner" />
        </div>
      )}
    </button>
  );
};

// Revolutionary Button Variants
export const RevolutionaryButton = ({ children, ...props }) => (
  <PureKnowledgeButton
    variant="revolutionary"
    size="lg"
    className="pk-glow-primary pk-float"
    {...props}
  >
    {children}
  </PureKnowledgeButton>
);

export const InnovationButton = ({ children, ...props }) => (
  <PureKnowledgeButton
    variant="innovation"
    size="md"
    icon={<Brain size={16} />}
    {...props}
  >
    {children}
  </PureKnowledgeButton>
);

export const OptimizationButton = ({ children, ...props }) => (
  <PureKnowledgeButton
    variant="optimization"
    size="md"
    icon={<Zap size={16} />}
    {...props}
  >
    {children}
  </PureKnowledgeButton>
);

export const LearningButton = ({ children, ...props }) => (
  <PureKnowledgeButton
    variant="learning"
    size="md"
    icon={<Infinity size={16} />}
    {...props}
  >
    {children}
  </PureKnowledgeButton>
);

export const CreationButton = ({ children, ...props }) => (
  <PureKnowledgeButton
    variant="creation"
    size="lg"
    icon={<Sparkles size={16} />}
    {...props}
  >
    {children}
  </PureKnowledgeButton>
);

// Action Buttons with Philosophy
export const KnowledgeOverMoneyButton = ({ children, ...props }) => (
  <PureKnowledgeButton
    variant="philosophy"
    size="lg"
    className="pk-gradient-bg pk-glow-primary"
    icon={<Brain size={20} />}
    {...props}
  >
    Knowledge > Money
  </PureKnowledgeButton>
);

export const CreateWithoutSpendingButton = ({ children, ...props }) => (
  <PureKnowledgeButton
    variant="philosophy"
    size="lg"
    className="pk-gradient-bg-secondary pk-glow-secondary"
    icon={<Zap size={20} />}
    {...props}
  >
    Create Without Spending
  </PureKnowledgeButton>
);

export const IntelligenceOverInvestmentButton = ({ children, ...props }) => (
  <PureKnowledgeButton
    variant="philosophy"
    size="lg"
    className="pk-gradient-bg pk-glow-accent"
    icon={<Infinity size={20} />}
    {...props}
  >
    Intelligence > Investment
  </PureKnowledgeButton>
);

export default PureKnowledgeButton;
