import dynamic from 'next/dynamic';

// VoiceIntegration uses browser-only APIs (Web Speech, MediaPipe, AudioContext)
// so it must be loaded client-side only.
const VoiceIntegration = dynamic(
  () => import('../src/components/VoiceIntegration'),
  { ssr: false }
);

export default function Home() {
  const handleCommand = (command) => {
    console.log('Voice command received:', command);
  };

  const handleGesture = (gesture) => {
    console.log('Gesture received:', gesture);
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0f',
      }}
    >
      <VoiceIntegration
        onCommand={handleCommand}
        onGesture={handleGesture}
      />
    </main>
  );
}
