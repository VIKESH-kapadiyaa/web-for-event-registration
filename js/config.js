/* ============================================
   Configuration - Obfuscated Keys
   Note: For true security, use a backend server
   The anon key is designed to be public and
   protected by Supabase RLS policies
   ============================================ */

const _0x1a = 'aHR0cHM6Ly9nb2tsb2NrcnRsdWFlaXBobHF2ei5zdXBhYmFzZS5jbw==';
const _0x2b = 'ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW1kdmEyeHZZMnR5ZEd4MVlXVnBjR2hzY1haNklpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUzTnpBeU1qYzNNREFzSW1WNGNDSTZNakE0TlRnd016Y3dNSDAuVEVYWnpRU1JGYlo5Nm1lZ2xyOXlVUnZ6aS1XWmNPOU9NMjNULWNyZ19TTQ==';

// Decode configuration
function getConfig() {
    try {
        return {
            url: atob(_0x1a),
            key: atob(_0x2b)
        };
    } catch (e) {
        console.error('Config error');
        return null;
    }
}

// Export for use in main.js
window._getSupabaseConfig = getConfig;
