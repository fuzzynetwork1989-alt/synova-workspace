
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { MODEL_REGISTRY, ModelConfig, getMobileOptimizedModels, getModelsByTier } from '../config/models';

interface ModelSelectorProps {
  selectedModel: string;
  onModelSelect: (modelId: string) => void;
  visible: boolean;
  onClose: () => void;
}

export default function ModelSelector({ selectedModel, onModelSelect, visible, onClose }: ModelSelectorProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'mobile' | 'standard' | 'pro' | 'ultra'>('mobile');

  const getModelsForTab = () => {
    switch (activeTab) {
      case 'mobile':
        return getMobileOptimizedModels();
      case 'standard':
        return getModelsByTier('standard');
      case 'pro':
        return getModelsByTier('pro');
      case 'ultra':
        return getModelsByTier('ultra');
      default:
        return Object.values(MODEL_REGISTRY);
    }
  };

  const renderModelCard = (model: ModelConfig) => (
    <TouchableOpacity
      key={model.id}
      style={[
        styles.modelCard,
        selectedModel === model.id && styles.selectedModelCard
      ]}
      onPress={() => {
        onModelSelect(model.id);
        onClose();
      }}
    >
      <View style={styles.modelHeader}>
        <Text style={styles.modelName}>{model.name}</Text>
        <View style={[
          styles.tierBadge,
          model.tier === 'pro' && styles.proBadge,
          model.tier === 'ultra' && styles.ultraBadge
        ]}>
          <Text style={styles.tierText}>{model.tier.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.modelDescription}>{model.description}</Text>
      <View style={styles.modelInfo}>
        <Text style={styles.infoText}>Context: {model.contextWindow}</Text>
        <Text style={styles.infoText}>Max Tokens: {model.maxTokens}</Text>
      </View>
      {model.mobileOptimized && (
        <View style={styles.mobileOptimizedBadge}>
          <Text style={styles.mobileOptimizedText}>📱 Mobile Optimized</Text>
        </View>
      )}
      {model.requiresInternet && (
        <View style={styles.internetBadge}>
          <Text style={styles.internetText}>🌐 Requires Internet</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Select Model</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
          {(['all', 'mobile', 'standard', 'pro', 'ultra'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView style={styles.modelList}>
          {getModelsForTab().map(renderModelCard)}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0c29',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#302b63',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#ffffff',
  },
  tabContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#302b63',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#24243e',
  },
  activeTab: {
    backgroundColor: '#667eea',
  },
  tabText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#ffffff',
  },
  modelList: {
    flex: 1,
    padding: 15,
  },
  modelCard: {
    backgroundColor: '#24243e',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedModelCard: {
    borderColor: '#667eea',
  },
  modelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#4a5568',
  },
  proBadge: {
    backgroundColor: '#667eea',
  },
  ultraBadge: {
    backgroundColor: '#764ba2',
  },
  tierText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  modelDescription: {
    color: '#a0aec0',
    fontSize: 14,
    marginBottom: 10,
  },
  modelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoText: {
    color: '#718096',
    fontSize: 12,
  },
  mobileOptimizedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#48bb78',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  mobileOptimizedText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  internetBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ed8936',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  internetText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
});
