import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../src/components/ui/theme';
import { XRProvider } from '../src/components/xr/XRManager';

// Pure Knowledge Theme Colors
const PURE_KNOWLEDGE_COLORS = {
  primary: '#8B5CF6',      // Purple
  secondary: '#10B981',    // Green
  accent: '#F59E0B',       // Yellow
  background: '#0F0F23',   // Dark blue
  surface: '#1A1A2E',      // Darker blue
  text: '#FFFFFF',         // White
  textSecondary: '#A78BFA'  // Light purple
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <XRProvider>
        <SafeAreaProvider>
          <StatusBar style="light" backgroundColor={PURE_KNOWLEDGE_COLORS.background} />

          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: PURE_KNOWLEDGE_COLORS.background,
              },
              headerTintColor: PURE_KNOWLEDGE_COLORS.text,
              headerTitleStyle: {
                color: PURE_KNOWLEDGE_COLORS.text,
                fontWeight: 'bold',
              },
              contentStyle: {
                backgroundColor: PURE_KNOWLEDGE_COLORS.background,
              },
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                title: 'Synova AI',
                header: () => null, // Custom header in index
              }}
            />
            <Stack.Screen
              name="chat-enhanced"
              options={{
                title: 'Pure Knowledge Chat',
                headerStyle: {
                  backgroundColor: PURE_KNOWLEDGE_COLORS.primary,
                },
              }}
            />
            <Stack.Screen
              name="agents"
              options={{
                title: 'AI Agents',
              }}
            />
            <Stack.Screen
              name="workspaces"
              options={{
                title: 'Workspaces',
              }}
            />
            <Stack.Screen
              name="settings"
              options={{
                title: 'Settings',
              }}
            />
          </Stack>
        </SafeAreaProvider>
      </XRProvider>
    </ThemeProvider>
  );
}
