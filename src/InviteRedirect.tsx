import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

/**
 * InviteRedirect handles deep links for trip invitations.
 *
 * When a user clicks "Open in App" from an email on a device with the app installed,
 * iOS Universal Links intercepts and opens the app directly.
 *
 * When the app is NOT installed (or on desktop), this page:
 * 1. Attempts to open the app via custom URL scheme
 * 2. Shows a fallback with App Store download link
 */
function InviteRedirect() {
  const { token } = useParams<{ token: string }>();

  useEffect(() => {
    if (token) {
      // Try to open the app with the custom URL scheme
      // This works as a fallback for devices where Universal Links didn't trigger
      const appUrl = `nomadcrew://invite/accept/${token}`;

      // Try to open the app
      window.location.href = appUrl;
    }
  }, [token]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f7f7f7',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        maxWidth: '400px'
      }}>
        <h1 style={{ color: '#F46315', marginBottom: '16px' }}>
          NomadCrew
        </h1>
        <p style={{ color: '#333', marginBottom: '24px', lineHeight: 1.6 }}>
          You've been invited to join a trip! Open this link on your mobile device with the NomadCrew app installed.
        </p>

        <div style={{ marginBottom: '20px' }}>
          <a
            href={`nomadcrew://invite/accept/${token}`}
            style={{
              display: 'inline-block',
              padding: '14px 28px',
              backgroundColor: '#F46315',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            Open in NomadCrew App
          </a>
        </div>

        <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px' }}>
          Don't have the app yet?
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="https://apps.apple.com/app/nomadcrew"
            style={{
              display: 'inline-block',
              padding: '12px 20px',
              backgroundColor: '#000',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            App Store
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.nomadcrew.app"
            style={{
              display: 'inline-block',
              padding: '12px 20px',
              backgroundColor: '#3DDC84',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            Google Play
          </a>
        </div>

        <p style={{ color: '#999', fontSize: '12px', marginTop: '24px' }}>
          Invitation token: {token?.substring(0, 8)}...
        </p>
      </div>
    </div>
  );
}

export default InviteRedirect;
