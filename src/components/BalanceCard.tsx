import React from 'react';
import { RefreshCw, ExternalLink, AlertTriangle } from 'lucide-react';

interface BalanceCardProps {
  address: string | null;
  balance: string | null;
  loadingBalance: boolean;
  error: string | null;
  refreshBalance: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  address,
  balance,
  loadingBalance,
  error,
  refreshBalance,
}) => {
  if (!address) {
    return (
      <div className="panel" style={{ minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="panel-body" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', fontFamily: 'var(--font-display)', color: 'var(--paper)' }}>
            Wallet Disconnected
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto', fontSize: '14px', lineHeight: '1.6' }}>
            Connect your Freighter wallet on Stellar Testnet to check your balance, set up recipients, and execute splits.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <div className="panel-title">
          <span className="dot"></span>Your Wallet
        </div>
        <button
          onClick={refreshBalance}
          disabled={loadingBalance}
          className="ghost-btn"
          title="Refresh Balance"
        >
          <RefreshCw size={12} className={loadingBalance ? 'spinner' : ''} style={{ marginRight: '4px' }} />
          <span>Refresh</span>
        </button>
      </div>
      <div className="panel-body">
        <div className="wallet-box">
          <div className="label-sm">Connected Address</div>
          <div className="addr-mono" style={{ fontSize: '12px' }}>{address}</div>
          
          <div className="balance-row">
            <span className="balance-label">XLM Balance</span>
            {loadingBalance ? (
              <span className="balance-val" style={{ opacity: 0.5 }}>Loading...</span>
            ) : error ? (
              <span className="balance-val" style={{ color: 'var(--danger)' }}>0.00 XLM</span>
            ) : (
              <span className="balance-val">
                {balance ? parseFloat(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 7 }) : '0.00'} XLM
              </span>
            )}
          </div>
        </div>

        <div className="empty-wallet">
          <div className="glyph">◇</div>
          Your sealed bills and settlements will appear here once created.
        </div>

        {error && (
          <div className="alert alert-error flex items-start gap-2 mt-4" style={{ margin: '1rem 0 0 0' }}>
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.125rem' }}>
                Account Issue
              </strong>
              <span style={{ fontSize: '0.85rem' }}>
                {error}
              </span>
              <div className="mt-4" style={{ marginTop: '0.5rem' }}>
                <a
                  href={`https://laboratory.stellar.org/#friendbot?addr=${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-explorer"
                  style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fca5a5', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <span>Fund Account with Friendbot</span>
                  <ExternalLink size={12} />
                </a>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.35rem', lineHeight: '1.4' }}>
                  Friendbot is a Testnet funding tool that immediately credits your account with 10,000 test XLM so you can perform splits.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
