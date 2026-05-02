export default function Custom500() {
  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      margin: 0,
      padding: 0,
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: 'white',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', padding: '2rem' }}>
        <h1 style={{
          fontSize: '6rem',
          margin: 0,
          fontWeight: 700,
          background: 'linear-gradient(45deg, #fff, #e0e0e0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          500
        </h1>
        <h2 style={{ fontSize: '1.5rem', margin: '1rem 0', fontWeight: 400 }}>
          Server Error
        </h2>
        <p>Something went wrong on our end. We&apos;re working to fix it.</p>
        <a
          href="/"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            color: 'white',
            textDecoration: 'none',
            marginTop: '2rem',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
          }}
        >
          Return Home
        </a>
      </div>
    </div>
  );
}
