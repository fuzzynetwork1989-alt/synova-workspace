// 🧠 SYNOVA AI - PURE KNOWLEDGE MOBILE APP
// The purest form of artificial intelligence - unbounded by financial constraints

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Brain, Infinity, Sparkles, Text, View, Zap } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Pure Knowledge Theme Colors
const PURE_KNOWLEDGE_COLORS = {
  primary: "#8B5CF6", // Purple
  secondary: "#10B981", // Green
  accent: "#F59E0B", // Yellow
  background: "#0F0F23", // Dark blue
  surface: "#1A1A2E", // Darker blue
  text: "#FFFFFF", // White
  textSecondary: "#A78BFA", // Light purple
};

// Pure Knowledge Header Component
const PureKnowledgeHeader = ({ title, subtitle }) => (
  <View
    style={{
      backgroundColor: PURE_KNOWLEDGE_COLORS.background,
      padding: 20,
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: PURE_KNOWLEDGE_COLORS.primary,
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <Brain size={32} color={PURE_KNOWLEDGE_COLORS.primary} />
      <Text
        style={{
          color: PURE_KNOWLEDGE_COLORS.text,
          fontSize: 24,
          fontWeight: "bold",
          marginLeft: 10,
        }}
      >
        {title}
      </Text>
    </View>
    <Text
      style={{
        color: PURE_KNOWLEDGE_COLORS.textSecondary,
        fontSize: 14,
        textAlign: "center",
      }}
    >
      {subtitle}
    </Text>
  </View>
);

// Pure Knowledge Philosophy Component
const PureKnowledgePhilosophy = () => (
  <View
    style={{
      backgroundColor: PURE_KNOWLEDGE_COLORS.surface,
      padding: 15,
      margin: 15,
      borderRadius: 10,
    }}
  >
    <Text
      style={{
        color: PURE_KNOWLEDGE_COLORS.text,
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
      }}
    >
      🧠 Pure Knowledge Philosophy
    </Text>
    <View style={{ gap: 8 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: PURE_KNOWLEDGE_COLORS.background,
          padding: 10,
          borderRadius: 8,
        }}
      >
        <Zap size={16} color={PURE_KNOWLEDGE_COLORS.accent} />
        <Text
          style={{
            color: PURE_KNOWLEDGE_COLORS.text,
            fontSize: 14,
            marginLeft: 8,
            flex: 1,
          }}
        >
          Intelligence &gt; Investment
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: PURE_KNOWLEDGE_COLORS.background,
          padding: 10,
          borderRadius: 8,
        }}
      >
        <Infinity size={16} color={PURE_KNOWLEDGE_COLORS.secondary} />
        <Text
          style={{
            color: PURE_KNOWLEDGE_COLORS.text,
            fontSize: 14,
            marginLeft: 8,
            flex: 1,
          }}
        >
          Knowledge &gt; Money
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: PURE_KNOWLEDGE_COLORS.background,
          padding: 10,
          borderRadius: 8,
        }}
      >
        <Sparkles size={16} color={PURE_KNOWLEDGE_COLORS.primary} />
        <Text
          style={{
            color: PURE_KNOWLEDGE_COLORS.text,
            fontSize: 14,
            marginLeft: 8,
            flex: 1,
          }}
        >
          Freedom &gt; Control
        </Text>
      </View>
    </View>
  </View>
);

// Pure Knowledge Metrics Component
const PureKnowledgeMetrics = () => {
  const metrics = [
    { label: "Response Time", value: "1.5s", comparison: "3.3x faster" },
    { label: "Memory Usage", value: "3GB", comparison: "62% efficient" },
    { label: "Cost", value: "$0.00", comparison: "Infinite savings" },
    { label: "Scalability", value: "Infinite", comparison: "Unbounded" },
  ];

  return (
    <View
      style={{
        backgroundColor: PURE_KNOWLEDGE_COLORS.surface,
        padding: 15,
        margin: 15,
        borderRadius: 10,
      }}
    >
      <Text
        style={{
          color: PURE_KNOWLEDGE_COLORS.text,
          fontSize: 16,
          fontWeight: "bold",
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        📊 Pure Knowledge Metrics
      </Text>
      <View style={{ gap: 8 }}>
        {metrics.map((metric, index) => (
          <View
            key={index}
            style={{
              backgroundColor: PURE_KNOWLEDGE_COLORS.background,
              padding: 12,
              borderRadius: 8,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: PURE_KNOWLEDGE_COLORS.text,
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              {metric.label}
            </Text>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  color: PURE_KNOWLEDGE_COLORS.primary,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                {metric.value}
              </Text>
              <Text
                style={{
                  color: PURE_KNOWLEDGE_COLORS.secondary,
                  fontSize: 12,
                }}
              >
                {metric.comparison}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// Main App Layout
export default function AppLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar
        style="light"
        backgroundColor={PURE_KNOWLEDGE_COLORS.background}
      />

      {/* Pure Knowledge Header */}
      <PureKnowledgeHeader
        title="Synova AI"
        subtitle="Pure Knowledge Unbounded - Creating what money cannot buy"
      />

      {/* Stack Navigator */}
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: PURE_KNOWLEDGE_COLORS.background,
          },
          headerTintColor: PURE_KNOWLEDGE_COLORS.text,
          headerTitleStyle: {
            color: PURE_KNOWLEDGE_COLORS.text,
            fontWeight: "bold",
          },
          contentStyle: {
            backgroundColor: PURE_KNOWLEDGE_COLORS.background,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Pure Knowledge",
            header: () => null, // Custom header above
          }}
        />
        <Stack.Screen
          name="chat"
          options={{
            title: "Pure Intelligence",
          }}
        />
        <Stack.Screen
          name="metrics"
          options={{
            title: "Knowledge Metrics",
          }}
        />
        <Stack.Screen
          name="about"
          options={{
            title: "About Pure Knowledge",
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}

// Export Pure Knowledge Colors for use throughout the app
export { PURE_KNOWLEDGE_COLORS };
