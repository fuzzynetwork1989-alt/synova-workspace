/**
 * Synova UI System v4.1 - Glassmorphism Components
 * Production-ready UI components for XR/VR/AR applications
 */

import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for combining classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Glassmorphism Button Component
export const GlassButton = ({
  children,
  variant = 'primary',
  size = 'md',
  glow = false,
  floating = false,
  className,
  ...props
}) => {
  const variants = {
    primary: 'glass holo-border hover:holo-glow',
    secondary: 'glass-dark hover:holo-glow',
    outline: 'border border-synova-400/30 hover:border-synova-400/60',
    ghost: 'hover:bg-glass-white/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  return (
    <motion.button
      className={cn(
        'relative overflow-hidden rounded-xl font-synova font-medium transition-all duration-300',
        'hover:scale-105 active:scale-95',
        variants[variant],
        sizes[size],
        glow && 'holo-glow',
        floating && 'animate-float',
        className
      )}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      <div className="absolute inset-0 bg-shimmer opacity-0 hover:opacity-100 transition-opacity duration-500" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

// Glassmorphism Card Component
export const GlassCard = ({
  children,
  variant = 'default',
  glow = false,
  floating = false,
  className,
  ...props
}) => {
  const variants = {
    default: 'glass',
    dark: 'glass-dark',
      holo: 'holo-border holo-glow',
  };

  return (
    <motion.div
      className={cn(
        'rounded-2xl p-6 transition-all duration-300',
        'hover:shadow-glass-lg',
        variants[variant],
        glow && 'holo-glow-lg',
        floating && 'animate-float',
        className
      )}
      whileHover={{ y: -4 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Holo Input Component
export const HoloInput = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-synova-200 holo-text">
          {label}
        </label>
      )}
      <motion.input
        className={cn(
          'w-full rounded-xl border border-glass bg-glass-white/10 px-4 py-3',
          'backdrop-blur-md text-white placeholder:text-synova-400',
          'focus:border-synova-400 focus:outline-none focus:ring-2 focus:ring-synova-400/20',
          'transition-all duration-200',
          error && 'border-red-400/50 focus:border-red-400 focus:ring-red-400/20',
          className
        )}
        whileFocus={{ scale: 1.02 }}
        {...props}
      />
      {error && (
        <motion.p
          className="text-sm text-red-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

// XR Navigation Component
export const XRNavigation = ({ items, activeItem, onItemClick }) => {
  return (
    <motion.nav
      className="glass rounded-2xl p-2 backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex space-x-2">
        {items.map((item, index) => (
          <motion.button
            key={item.id}
            className={cn(
              'px-4 py-2 rounded-xl font-medium transition-all duration-200',
              'hover:bg-glass-white/20 hover:scale-105',
              activeItem === item.id
                ? 'bg-synova-500/20 text-synova-100 holo-glow'
                : 'text-synova-300'
            )}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onItemClick?.(item)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <span className="flex items-center space-x-2">
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </span>
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
};

// Blueprint Card Component
export const BlueprintCard = ({
  blueprint,
  onSelect,
  isSelected,
  className,
  ...props
}) => {
  return (
    <motion.div
      className={cn(
        'glass rounded-2xl overflow-hidden cursor-pointer transition-all duration-300',
        'hover:shadow-glass-lg hover:scale-105',
        isSelected && 'holo-border holo-glow',
        className
      )}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect?.(blueprint)}
      {...props}
    >
      <div className="relative h-48 bg-gradient-to-br from-synova-600/20 to-synova-800/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-xl bg-glass-white/10 backdrop-blur-md flex items-center justify-center">
            <blueprint.icon className="w-8 h-8 text-synova-300" />
          </div>
        </div>
        {isSelected && (
          <motion.div
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-synova-500 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <span className="text-xs text-white">✓</span>
          </motion.div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2">
          {blueprint.name}
        </h3>
        <p className="text-sm text-synova-300 line-clamp-2">
          {blueprint.description}
        </p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {blueprint.features?.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-glass-white/10 text-synova-200"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Loading Spinner Component
export const HoloSpinner = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <motion.div
        className={cn(
          'rounded-full border-2 border-synova-400/30 border-t-synova-400',
          sizes[size]
        )}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

// Voice Command Indicator
export const VoiceIndicator = ({ isActive, onToggle }) => {
  return (
    <motion.button
      onClick={onToggle}
      className={cn(
        'relative w-16 h-16 rounded-full transition-all duration-300',
        'hover:scale-110 active:scale-95',
        isActive
          ? 'bg-gradient-to-r from-synova-500 to-purple-500 holo-glow'
          : 'glass border border-glass'
      )}
      whileHover={{ rotate: 10 }}
      whileTap={{ scale: 0.9 }}
    >
      <div className="absolute inset-0 rounded-full bg-shimmer opacity-0 hover:opacity-100 transition-opacity" />
      
      <motion.div
        className="relative z-10 flex items-center justify-center"
        animate={{ scale: isActive ? [1, 1.2, 1] : 1 }}
        transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
      >
        <span className="text-2xl">
          {isActive ? '🎤' : '🎤'}
        </span>
      </motion.div>
      
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-synova-400"
          animate={{ scale: [1, 1.5, 2], opacity: [1, 0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
};

// XR Mode Switcher
export const XRModeSwitcher = ({ mode, onModeChange }) => {
  const modes = [
    { id: 'AR', label: 'AR', icon: '🥽' },
    { id: 'VR', label: 'VR', icon: '🥾' },
    { id: '360', label: '360°', icon: '🌐' },
  ];

  return (
    <div className="glass rounded-2xl p-1 backdrop-blur-xl">
      <div className="flex space-x-1">
        {modes.map((modeOption) => (
          <motion.button
            key={modeOption.id}
            className={cn(
              'px-4 py-2 rounded-xl font-medium transition-all duration-200',
              'hover:bg-glass-white/20',
              mode === modeOption.id
                ? 'bg-synova-500/30 text-synova-100 holo-glow'
                : 'text-synova-300'
            )}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onModeChange?.(modeOption.id)}
          >
            <span className="flex items-center space-x-2">
              <span>{modeOption.icon}</span>
              <span>{modeOption.label}</span>
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Export all components
export {
  GlassButton as Button,
  GlassCard as Card,
  HoloInput as Input,
  XRNavigation as Navigation,
  BlueprintCard,
  HoloSpinner as Spinner,
  VoiceIndicator,
  XRModeSwitcher as ModeSwitcher,
};

export default {
  Button: GlassButton,
  Card: GlassCard,
  Input: HoloInput,
  Navigation: XRNavigation,
  BlueprintCard,
  Spinner: HoloSpinner,
  VoiceIndicator,
  ModeSwitcher: XRModeSwitcher,
};
