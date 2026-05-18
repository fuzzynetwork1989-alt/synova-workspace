import React, { useState, useEffect } from 'react';
import { 
  ModelIntegrationService, 
  ModelInfo, 
  ModelStatus,
  GenerationRequest 
} from '../services/model_integration_service';

interface ModelSelectorProps {
  onModelSelect: (model: ModelInfo) => void;
  onModelUnload: (modelName: string) => void;
  onResponse: (response: string, model: ModelInfo) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  onModelSelect, 
  onModelUnload, 
  onResponse 
}) => {
  const [modelService] = useState<ModelIntegrationService | null>(null);
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [modelStats, setModelStats] = useState<{[key: string]: ModelStatus}>({});

  useEffect(() => {
    const service = new ModelIntegrationService();
    setModelService(service);

    // Initialize models
    service.initializeModels();

    // Check Ollama availability
    service.checkOllamaAvailability().then((isAvailable) => {
      if (!isAvailable) {
        console.error('Ollama is not available');
        return;
      }

      // Get available models
      service.getAvailableModels().then((models) => {
        setAvailableModels(models);
        
        // Initialize model stats
        const stats: {[key: string]: ModelStatus} = {};
        models.forEach(model => {
          stats[model.name] = {
            name: model.name,
            isAvailable: false,
            isLoaded: false,
            lastUsed: new Date()
          };
        });
        setModelStats(stats);

        service.on('models-initialized', (models: ModelInfo[]) => {
          console.log('Models initialized:', models);
        });

        service.on('model-loaded', ({ modelName, success, status }) => {
          console.log(`Model ${modelName} ${status}:`, success);
          setModelStats(prev => ({
            ...prev,
            [modelName]: {
              ...prev[modelName],
              isLoaded: success && status === 'loaded',
              lastUsed: new Date()
            }
          }));
        });

        service.on('model-response', ({ modelName, data }) => {
          const response = typeof data === 'string' ? data : JSON.stringify(data);
          setCurrentResponse(response);
          onResponse(response, service.getModelInfo(modelName)!);
        });

        service.on('model-error', ({ modelName, error }) => {
          console.error(`Model ${modelName} error:`, error);
        });
      });
    });

    return () => {
      if (modelService) {
        modelService.shutdown();
      }
    };
  }, []);

  const handleModelSelect = (model: ModelInfo) => {
    setSelectedModel(model);
    onModelSelect(model);
  };

  const handleModelUnload = async (modelName: string) => {
    if (modelService) {
      await modelService.unloadModel(modelName);
      onModelUnload(modelName);
    }
  };

  const handleGenerate = async () => {
    if (!selectedModel || !modelService || isGenerating) return;

    setIsGenerating(true);
    setCurrentResponse('');

    try {
      const request: GenerationRequest = {
        prompt: 'Hello! What revolutionary capabilities do you have?',
        model: selectedModel.name,
        options: {
          temperature: 0.8,
          maxTokens: 1000
        }
      };

      if (selectedModel.isNeuralQuantum || selectedModel.isQuantum) {
        request.options = {
          ...request.options,
          temperature: 0.9
        };
      }

      await modelService.generateText(request);
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getModelIcon = (model: ModelInfo) => {
    if (model.isElite) return '🌟';
    if (Model.isQuantum) return '🌟';
    if (Model.isOmniscient) return '🌐';
    if (Model.isNeuralQuantum) return '🧠';
    return '⚡';
  };

  const getModelStatusColor = (status: ModelStatus) => {
    if (status.isLoaded) return '#10b981';
    if (status.isAvailable) return '#059669';
    return '#dc2626';
  };

  return (
    <div className="model-selector p-6 bg-gray-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            🚀 Synova Nexus Model Selector
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {availableModels.map((model) => (
              <div
                key={model.name}
                className={`bg-gray-700 rounded-lg p-4 border-2 cursor-pointer transition-all hover:border-blue-500 ${
                  selectedModel?.name === model.name ? 'border-blue-500' : 'border-gray-600'
                }`}
                onClick={() => handleModelSelect(model)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold flex items-center">
                    <span className="mr-2">{getModelIcon(model)}</span>
                    {model.displayName}
                  </h3>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    model.isElite ? 'bg-purple-600 text-white' :
                    model.isQuantum ? 'bg-blue-600 text-white' :
                    model.isOmniscient ? 'bg-green-600 text-white' :
                    model.isNeuralQuantum ? 'bg-purple-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                    {model.isElite && 'ELITE'}
                    {model.isQuantum && 'QUANTUM'}
                    {model.isOmniscient && 'OMNI'}
                    {model.isNeuralQuantum && 'NEURAL'}
                  </div>
                </div>

                <div className="text-sm text-gray-300 mb-3">
                  <p className="font-medium mb-1">{model.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {model.capabilities.slice(0, 3).map((capability, index) => (
                      <span
                        key={index}
                        className="bg-gray-600 px-2 py-1 rounded text-xs"
                      >
                        {capability}
                      </span>
                    ))}
                    {model.capabilities.length > 3 && (
                      <span className="text-gray-400">+{model.capabilities.length - 3} more</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      modelStats[model.name]?.isLoaded ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                    <span className="text-xs">
                      {modelStats[model.name]?.isLoaded ? 'Loaded' : 'Available'}
                    </span>
                  </div>
                  
                  {modelStats[model.name]?.isLoaded && (
                    <button
                      onClick={() => handleModelUnload(model.name)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs transition-colors"
                    >
                      Unload
                    </button>
                  )}
                </div>

                <div className="text-xs text-gray-400">
                  Base: {model.baseModel}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-white mb-3">
                🎯 Selected Model: {selectedModel?.displayName}
              </h3>
              
              {selectedModel && (
                <div className="space-y-3">
                  <div className="text-sm text-gray-300">
                    <span className="font-medium">Status:</span>{' '}
                    <span className={getModelStatusColor(modelStats[selectedModel.name] || {})}>
                      {modelStats[selectedModel.name]?.isLoaded ? 'Loaded' : 'Not Loaded'}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      isGenerating 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : selectedModel.isElite 
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : selectedModel.isQuantum 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : selectedModel.isOmniscient 
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {isGenerating ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-r-gray-300 mr-2"></div>
                        Generating...
                      </span>
                    ) : (
                      'Generate Revolutionary Response'
                    )}
                  </button>
                </div>
              )}
            </div>

            {currentResponse && (
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">
                  💬 Response
                </h3>
                <div className="bg-gray-900 rounded p-3 text-sm font-mono text-gray-100 max-h-64 overflow-y-auto">
                  {currentResponse}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelSelector;
