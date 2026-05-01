import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { XRStatus, useXR } from '../../src/components/xr/XRManager';
import { useTheme } from '../../src/components/ui/theme';

export default function XRScreen() {
  const { isXRSupported, isVRSupported, isSessionActive, startXRSession, stopXRSession, xrCapabilities } = useXR();
  const { colors } = useTheme();

  const handleStartSession = async () => {
    const success = await startXRSession();
    if (success) {
      console.log('XR session started successfully');
    } else {
      console.log('Failed to start XR session');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          🥽 XR/VR Experience
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Extended Reality and Virtual Reality support
        </Text>
      </View>

      <XRStatus />

      <View style={[styles.controls, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Session Controls</Text>
        
        <TouchableOpacity
          style={[
            styles.sessionButton,
            {
              backgroundColor: !isSessionActive ? colors.primary : colors.danger,
              opacity: isXRSupported ? 1 : 0.5,
            },
          ]}
          onPress={isSessionActive ? stopXRSession : handleStartSession}
          disabled={!isXRSupported}
        >
          <Text style={[
            styles.sessionButtonText,
            { color: !isSessionActive ? colors.primaryForeground : colors.dangerForeground }
          ]}>
            {isSessionActive ? 'Stop XR Session' : 'Start XR Session'}
          </Text>
        </TouchableOpacity>

        {!isXRSupported && (
          <Text style={[styles.unsupportedText, { color: colors.danger }]}>
            XR/VR is not supported on this device
          </Text>
        )}
      </View>

      <View style={[styles.environments, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Available Environments</Text>
        
        {[
          { id: 'office', name: 'Virtual Office', description: 'Collaborative workspace' },
          { id: 'meeting_room', name: 'Meeting Room', description: 'Team meetings' },
          { id: 'design_studio', name: '3D Design Studio', description: 'Creative work' },
          { id: 'data_viz', name: 'Data Visualization', description: 'Analytics in 3D' },
          { id: 'training_room', name: 'Training Room', description: 'Educational content' },
          { id: 'showroom', name: 'Product Showroom', description: 'Presentations' },
        ].map((env) => (
          <View key={env.id} style={[styles.environmentItem, { borderColor: colors.border }]}>
            <Text style={[styles.environmentName, { color: colors.foreground }]}>{env.name}</Text>
            <Text style={[styles.environmentDescription, { color: colors.mutedForeground }]}>
              {env.description}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.info, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>XR Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.foreground }]}>Device Type:</Text>
          <Text style={[styles.infoValue, { color: colors.mutedForeground }]}>
            {isVRSupported ? 'VR Headset' : 'Mobile AR'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.foreground }]}>WebXR Support:</Text>
          <Text style={[styles.infoValue, { color: xrCapabilities.webXRSupport ? colors.success : colors.danger }]}>
            {xrCapabilities.webXRSupport ? 'Available' : 'Not Available'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.foreground }]}>Hand Tracking:</Text>
          <Text style={[styles.infoValue, { color: xrCapabilities.handTracking ? colors.success : colors.mutedForeground }]}>
            {xrCapabilities.handTracking ? 'Supported' : 'Not Supported'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.foreground }]}>Eye Tracking:</Text>
          <Text style={[styles.infoValue, { color: xrCapabilities.eyeTracking ? colors.success : colors.mutedForeground }]}>
            {xrCapabilities.eyeTracking ? 'Supported' : 'Not Supported'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  controls: {
    margin: 12,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  sessionButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  sessionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  unsupportedText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
  environments: {
    margin: 12,
    padding: 16,
    borderRadius: 8,
  },
  environmentItem: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 8,
  },
  environmentName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  environmentDescription: {
    fontSize: 12,
  },
  info: {
    margin: 12,
    padding: 16,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
  },
});
