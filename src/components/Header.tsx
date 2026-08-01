import { useState, useEffect } from 'react';

interface HeaderProps {
  address: string | null;
  connect: () => void;
  disconnect: () => void;
  isConnecting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  address,
  connect,
  disconnect,
  isConnecting,
}) => {
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('theme-light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('theme-light');
      localStorage.setItem('theme', 'dark');
    }
  }, [theme]);

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header style={{ padding: '18px 40px', borderBottom: '1px solid var(--line-soft)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div className="brand">
        <div className="seal-mark">AS</div>
        <div className="brand-name">Aether<em>Split</em></div>
      </div>

      {address ? (
        <div className="nav-right">
          <span className="pill pill-testnet">Stellar Testnet</span>
          <button
            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            className="icon-btn"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            style={{ border: '1px solid var(--line)', background: 'transparent', fontSize: '14px' }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button
            onClick={handleCopy}
            className="pill pill-addr"
            style={{ border: '1px solid var(--line)', cursor: 'pointer', outline: 'none' }}
            title={copied ? "Copied!" : "Copy Address"}
          >
            {copied ? "✓ Copied" : shortenAddress(address)}
          </button>
          <button
            onClick={disconnect}
            className="icon-btn"
            title="Sign out"
            style={{ border: '1px solid var(--line)', background: 'transparent', fontSize: '15px' }}
          >
            ⏻
          </button>
        </div>
      ) : (
        <div className="nav-right">
          <span className="pill pill-testnet">Stellar Testnet</span>
          <button
            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            className="icon-btn"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            style={{ border: '1px solid var(--line)', background: 'transparent', fontSize: '14px' }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button
            onClick={connect}
            disabled={isConnecting}
            className="pill"
            style={{
              background: 'linear-gradient(135deg, var(--gold-bright), var(--gold) 65%, var(--seal))',
              color: '#1a1004',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              padding: '6px 16px'
            }}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      )}
    </header>
  );
};
