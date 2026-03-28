import { GlassButton, GlassCard, HoloSpinner } from '../src/components/index';

export default function Home() {
  return (
    <main className="xr-container">
      <div className="xr-panel">
        <h1 className="text-3xl font-bold holo-text mb-4">
          Synova UI System
        </h1>
        <p className="text-synova-300 mb-6">
          Glassmorphism component library for XR-first applications.
        </p>
        <div className="flex flex-col gap-4">
          <GlassButton variant="primary" glow>
            Get Started
          </GlassButton>
          <GlassButton variant="secondary">
            View Components
          </GlassButton>
        </div>
        <div className="mt-8 flex justify-center">
          <HoloSpinner size="md" />
        </div>
      </div>
    </main>
  );
}
