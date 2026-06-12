/**
 * Synova AI Voice Commands Processor v4.1
 * Advanced command processing and context awareness
 */

class VoiceCommandProcessor {
  constructor(options = {}) {
    this.context = options.context || {};
    this.history = [];
    this.maxHistory = 10;
    this.onCommand = options.onCommand || (() => {});
    this.onError = options.onError || (() => {});
    
    // Command patterns with confidence scoring
    this.patterns = {
      // Blueprint commands
      blueprint: {
        patterns: [
          /show\s+(.+)\s+(blueprint|model|design)/i,
          /create\s+(.+)\s+(blueprint|model|design)/i,
          /generate\s+(.+)\s+(blueprint|model|design)/i,
          /build\s+(.+)/i,
          /design\s+(.+)/i
        ],
        extract: (match) => ({
          type: 'blueprint',
          action: 'generate',
          params: { blueprint_type: this.normalizeBlueprintType(match[1]) },
          confidence: 0.9
        })
      },
      
      // Mode switching
      mode: {
        patterns: [
          /switch\s+to\s+(ar|vr|360)\s+mode/i,
          /(ar|vr|360)\s+mode/i,
          /enable\s+(ar|vr|360)/i,
          /go\s+to\s+(ar|vr|360)/i
        ],
        extract: (match) => ({
          type: 'mode',
          action: 'switch',
          params: { mode: match[1].toLowerCase() },
          confidence: 0.95
        })
      },
      
      // Navigation
      navigation: {
        patterns: [
          /go\s+(back|home|next|previous)/i,
          /(back|home|next|previous)/i,
          /navigate\s+(back|home|next|previous)/i
        ],
        extract: (match) => ({
          type: 'navigation',
          action: match[1].toLowerCase(),
          params: {},
          confidence: 0.85
        })
      },
      
      // Feature control
      features: {
        patterns: [
          /(enable|start|turn on)\s+(voice|gesture|auto|autopilot)/i,
          /(disable|stop|turn off)\s+(voice|gesture|auto|autopilot)/i,
          /(activate|deactivate)\s+(voice|gesture|auto|autopilot)/i
        ],
        extract: (match) => ({
          type: 'feature',
          action: match[1].toLowerCase() === 'enable' || match[1].toLowerCase() === 'start' || match[1].toLowerCase() === 'activate' ? 'enable' : 'disable',
          params: { feature: match[2].toLowerCase() },
          confidence: 0.9
        })
      },
      
      // Help and information
      help: {
        patterns: [
          /help/i,
          /what can you do/i,
          /how do i/i,
          /commands/i,
          /instructions/i
        ],
        extract: () => ({
          type: 'help',
          action: 'show',
          params: {},
          confidence: 1.0
        })
      },
      
      // Customization
      customize: {
        patterns: [
          /change\s+(.+)\s+to\s+(.+)/i,
          /set\s+(.+)\s+to\s+(.+)/i,
          /make\s+(.+)\s+(.+)/i,
          /update\s+(.+)\s+to\s+(.+)/i
        ],
        extract: (match) => ({
          type: 'customize',
          action: 'modify',
          params: { 
            property: match[1].toLowerCase(),
            value: match[2].toLowerCase()
          },
          confidence: 0.8
        })
      },
      
      // Export and sharing
      export: {
        patterns: [
          /export\s+(.+)/i,
          /save\s+(.+)/i,
          /download\s+(.+)/i,
          /share\s+(.+)/i
        ],
        extract: (match) => ({
          type: 'export',
          action: 'export',
          params: { format: match[1].toLowerCase() },
          confidence: 0.85
        })
      }
    };
    
    // Blueprint type normalization
    this.blueprintTypes = {
      'warehouse': 'warehouse',
      'industrial': 'warehouse',
      'factory': 'warehouse',
      'storage': 'warehouse',
      'loft': 'lofts',
      'lofts': 'lofts',
      'apartment': 'lofts',
      'condo': 'lofts',
      'luxury': 'luxury',
      'modern': 'luxury',
      'estate': 'luxury',
      'mansion': 'luxury',
      'house': 'luxury',
      'home': 'luxury'
    };
  }

  normalizeBlueprintType(type) {
    const normalized = type.toLowerCase().trim();
    return this.blueprintTypes[normalized] || 'warehouse';
  }

  process(transcript, context = {}) {
    try {
      const command = this.parseCommand(transcript, context);
      
      // Add to history
      this.addToHistory({
        transcript,
        command,
        timestamp: Date.now(),
        context: { ...this.context }
      });
      
      // Update context
      this.updateContext(command);
      
      // Execute command
      this.executeCommand(command);
      
      return command;
    } catch (error) {
      this.onError(`Command processing failed: ${error.message}`);
      return {
        type: 'error',
        action: 'processing_failed',
        params: { error: error.message },
        confidence: 0
      };
    }
  }

  parseCommand(transcript, context) {
    const text = transcript.toLowerCase().trim();
    let bestMatch = null;
    let highestConfidence = 0;

    // Try each pattern category
    for (const [category, config] of Object.entries(this.patterns)) {
      for (const pattern of config.patterns) {
        const match = text.match(pattern);
        if (match) {
          const command = config.extract(match);
          
          // Apply context awareness
          const contextAwareCommand = this.applyContext(command, context);
          
          if (contextAwareCommand.confidence > highestConfidence) {
            highestConfidence = contextAwareCommand.confidence;
            bestMatch = contextAwareCommand;
          }
        }
      }
    }

    // If no pattern matched, try fuzzy matching
    if (!bestMatch) {
      bestMatch = this.fuzzyMatch(text);
    }

    return bestMatch || {
      type: 'unknown',
      action: 'unrecognized',
      params: { original: transcript },
      confidence: 0.1
    };
  }

  applyContext(command, context) {
    const contextAwareCommand = { ...command };
    
    // Adjust confidence based on context
    if (context.currentMode && command.type === 'mode') {
      if (context.currentMode === command.params.mode) {
        contextAwareCommand.confidence *= 0.5; // Lower confidence if already in that mode
      }
    }
    
    // Boost confidence for contextually relevant commands
    if (context.activeBlueprint && command.type === 'blueprint') {
      contextAwareCommand.confidence *= 1.2;
    }
    
    // Cap confidence at 1.0
    contextAwareCommand.confidence = Math.min(contextAwareCommand.confidence, 1.0);
    
    return contextAwareCommand;
  }

  fuzzyMatch(text) {
    // Simple fuzzy matching for common commands
    const fuzzyPatterns = {
      'show': { type: 'blueprint', action: 'generate', confidence: 0.6 },
      'create': { type: 'blueprint', action: 'generate', confidence: 0.6 },
      'build': { type: 'blueprint', action: 'generate', confidence: 0.6 },
      'ar': { type: 'mode', action: 'switch', params: { mode: 'ar' }, confidence: 0.7 },
      'vr': { type: 'mode', action: 'switch', params: { mode: 'vr' }, confidence: 0.7 },
      'help': { type: 'help', action: 'show', confidence: 0.8 },
      'back': { type: 'navigation', action: 'back', confidence: 0.7 },
      'home': { type: 'navigation', action: 'home', confidence: 0.7 }
    };

    for (const [keyword, command] of Object.entries(fuzzyPatterns)) {
      if (text.includes(keyword)) {
        return { ...command };
      }
    }

    return null;
  }

  executeCommand(command) {
    try {
      // Validate command
      const validatedCommand = this.validateCommand(command);
      
      // Execute based on type
      switch (validatedCommand.type) {
        case 'blueprint':
          this.executeBlueprintCommand(validatedCommand);
          break;
        case 'mode':
          this.executeModeCommand(validatedCommand);
          break;
        case 'navigation':
          this.executeNavigationCommand(validatedCommand);
          break;
        case 'feature':
          this.executeFeatureCommand(validatedCommand);
          break;
        case 'help':
          this.executeHelpCommand(validatedCommand);
          break;
        case 'customize':
          this.executeCustomizeCommand(validatedCommand);
          break;
        case 'export':
          this.executeExportCommand(validatedCommand);
          break;
        default:
          console.warn('Unknown command type:', validatedCommand.type);
      }
      
      this.onCommand(validatedCommand);
    } catch (error) {
      this.onError(`Command execution failed: ${error.message}`);
    }
  }

  validateCommand(command) {
    const validated = { ...command };
    
    // Validate blueprint types
    if (command.type === 'blueprint' && command.params.blueprint_type) {
      const validTypes = Object.keys(this.blueprintTypes);
      if (!validTypes.includes(command.params.blueprint_type)) {
        validated.params.blueprint_type = 'warehouse';
        validated.confidence *= 0.7;
      }
    }
    
    // Validate modes
    if (command.type === 'mode' && command.params.mode) {
      const validModes = ['ar', 'vr', '360'];
      if (!validModes.includes(command.params.mode)) {
        validated.params.mode = 'ar';
        validated.confidence *= 0.7;
      }
    }
    
    return validated;
  }

  executeBlueprintCommand(command) {
    console.log(`🏗️ Generating ${command.params.blueprint_type} blueprint`);
    // Implementation would trigger blueprint generation
  }

  executeModeCommand(command) {
    console.log(`🔄 Switching to ${command.params.mode} mode`);
    // Implementation would switch XR mode
  }

  executeNavigationCommand(command) {
    console.log(`🧭 Navigation: ${command.action}`);
    // Implementation would handle navigation
  }

  executeFeatureCommand(command) {
    console.log(`⚙️ Feature ${command.action}: ${command.params.feature}`);
    // Implementation would toggle features
  }

  executeHelpCommand(command) {
    console.log(`❓ Showing help`);
    // Implementation would show help interface
  }

  executeCustomizeCommand(command) {
    console.log(`🎨 Customizing ${command.params.property} to ${command.params.value}`);
    // Implementation would handle customization
  }

  executeExportCommand(command) {
    console.log(`📤 Exporting as ${command.params.format}`);
    // Implementation would handle export
  }

  addToHistory(entry) {
    this.history.unshift(entry);
    if (this.history.length > this.maxHistory) {
      this.history = this.history.slice(0, this.maxHistory);
    }
  }

  updateContext(command) {
    // Update context based on command
    if (command.type === 'mode') {
      this.context.currentMode = command.params.mode;
    }
    if (command.type === 'blueprint') {
      this.context.activeBlueprint = command.params.blueprint_type;
    }
  }

  getHistory() {
    return this.history;
  }

  getContext() {
    return { ...this.context };
  }

  clearHistory() {
    this.history = [];
  }

  resetContext() {
    this.context = {};
  }
}

export default VoiceCommandProcessor;
