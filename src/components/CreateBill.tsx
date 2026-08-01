/**
 * CreateBill Component
 * Handles parameters and UI for launching private splits on-chain.
 */
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { isValidPublicKey } from '../lib/stellar';
import { useToast } from './Toast';

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: copied ? 'var(--success)' : 'var(--text-secondary)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.35rem',
        borderRadius: '6px',
        marginLeft: '0.5rem',
        flexShrink: 0
      }}
      title="Copy stealth address"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
};

interface CreateBillProps {
  senderAddress: string | null;
  onSendPrivateBill: (recipients: string[], totalAmount: string, isRecurring: boolean) => Promise<any[]>; // returns array of stealth addresses
}

export const CreateBill: React.FC<CreateBillProps> = ({
  senderAddress,
  onSendPrivateBill,
}) => {
  const [totalAmount, setTotalAmount] = useState<string>('10');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recipients, setRecipients] = useState<string[]>(['']);
  const [isSending, setIsSending] = useState(false);
  const [stealthAddresses, setStealthAddresses] = useState<{ recipient: string, address: string }[]>([]);
  
  const { showToast } = useToast();

  const handleAddRecipient = () => setRecipients([...recipients, '']);
  const handleRemoveRecipient = (index: number) => setRecipients(recipients.filter((_, i) => i !== index));
  const handleRecipientChange = (index: number, value: string) => {
    const newRecipients = [...recipients];
    newRecipients[index] = value;
    setRecipients(newRecipients);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderAddress) {
      showToast('Please connect your wallet first', 'error');
      return;
    }
    
    // Basic validation
    if (parseFloat(totalAmount) <= 0) {
      showToast('Amount must be greater than 0', 'error');
      return;
    }
    
    for (const rec of recipients) {
      if (!isValidPublicKey(rec)) {
        showToast(`Invalid public key: ${rec.substring(0, 10)}...`, 'error');
        return;
      }
    }

    setIsSending(true);
    try {
      const generatedAddresses = await onSendPrivateBill(recipients, totalAmount, isRecurring);
      const mapped = recipients.map((r, i) => ({ recipient: r, address: generatedAddresses[i] }));
      setStealthAddresses(mapped);
      showToast('Private Bill created successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to create bill', 'error');
    } finally {
      setIsSending(false);
    }
  };

  if (stealthAddresses.length > 0) {
    return (
      <div className="panel">
        <div className="panel-head">
          <div className="panel-title" style={{ color: 'var(--verdigris-bright)' }}>
            <span className="dot" style={{ background: 'var(--verdigris-bright)', boxShadow: '0 0 8px var(--verdigris-bright)' }}></span>
            Private Bill Created
          </div>
        </div>
        <div className="panel-body">
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '14px', lineHeight: '1.6' }}>
            Share these one-time stealth addresses with the participants. They can claim their funds without exposing their main wallet addresses on-chain.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {stealthAddresses.map((s, idx) => (
              <div key={idx} style={{ background: 'var(--ink-2)', padding: '1rem', borderRadius: '2px', border: '1px solid var(--line-soft)' }}>
                <div className="label-sm" style={{ marginBottom: '0.5rem' }}>Participant {idx + 1} ({s.recipient.substring(0, 6)}...{s.recipient.substring(50)})</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--gold-bright)', wordBreak: 'break-all' }}>
                    {s.address}
                  </span>
                  <CopyButton text={s.address} />
                </div>
              </div>
            ))}
          </div>
          <button className="submit-btn" style={{ background: 'var(--line)', color: 'var(--paper)' }} onClick={() => setStealthAddresses([])}>
            Create Another Bill
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <div className="panel-title">
          <span className="dot" style={{ background: 'var(--gold-bright)', boxShadow: '0 0 8px var(--gold-bright)' }}></span>
          Create Private Bill (AetherSplit)
        </div>
      </div>

      <form onSubmit={handleSubmit} className="panel-body">
        <div className="field-row">
          <div className="field">
            <label htmlFor="totalAmountPrivate">Total Bill Amount (XLM)</label>
            <div className="input-wrap">
              <span className="pre">◈</span>
              <input
                id="totalAmountPrivate"
                type="number"
                step="any"
                min="0.0000001"
                placeholder="e.g. 50.0"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                disabled={isSending || !senderAddress}
              />
            </div>
          </div>

          <div className="field">
            <label>Bill Type</label>
            <div className="radio-row">
              <label className={`radio-opt ${!isRecurring ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="billType"
                  checked={!isRecurring}
                  onChange={() => setIsRecurring(false)}
                  disabled={isSending || !senderAddress}
                />
                One-time
              </label>
              <label className={`radio-opt ${isRecurring ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="billType"
                  checked={isRecurring}
                  onChange={() => setIsRecurring(true)}
                  disabled={isSending || !senderAddress}
                />
                Recurring
              </label>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div className="participants-head">
            <label>Participant Wallet Addresses ({recipients.length})</label>
            <button
              type="button"
              onClick={handleAddRecipient}
              disabled={isSending || !senderAddress}
              className="add-participant"
            >
              + Add Participant
            </button>
          </div>

          {recipients.map((recipient, index) => (
            <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
              <div className="input-wrap">
                <span className="pre">✎</span>
                <input
                  type="text"
                  placeholder="Recipient Stellar Public Key (starts with G...)"
                  value={recipient}
                  onChange={(e) => handleRecipientChange(index, e.target.value)}
                  disabled={isSending || !senderAddress}
                />
              </div>
              {recipients.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveRecipient(index)}
                  disabled={isSending || !senderAddress}
                  className="remove-btn"
                  style={{
                    border: '1px solid var(--line)',
                    background: 'rgba(181,103,79,0.15)',
                    color: 'var(--danger)',
                    borderRadius: '2px',
                    width: '3.2rem',
                    height: '2.8rem',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="privacy-note">
          <div className="seal-ico"></div>
          <div>
            This bill uses <b>hashed commitments</b>. The blockchain only records a hash of the total amount and one-time stealth addresses for participants — the details stay sealed off-chain.
          </div>
        </div>

        <button
          type="submit"
          disabled={isSending || recipients.length === 0 || !senderAddress}
          className="submit-btn"
        >
          {isSending ? (
            <>
              <div className="spinner" style={{ width: '1.2rem', height: '1.2rem', borderWidth: '2px' }}></div>
              <span>Creating Private Bill...</span>
            </>
          ) : (
            <>
              <span>Seal &amp; Create Bill</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
