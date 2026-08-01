/**
 * SplitForm Component
 * Allows users to define split parameters and participants.
 */
import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { isValidPublicKey } from '../lib/stellar';

interface SplitFormProps {
  senderAddress: string | null;
  senderBalance: string | null;
  onSendPayments: (recipients: string[], shareAmount: string) => void;
  isSending: boolean;
}

export const SplitForm: React.FC<SplitFormProps> = ({
  senderAddress,
  senderBalance,
  onSendPayments,
  isSending,
}) => {
  const [totalAmount, setTotalAmount] = useState<string>('10');
  const [numPeople, setNumPeople] = useState<number>(3);
  const [includeSender, setIncludeSender] = useState<boolean>(true);
  const [recipients, setRecipients] = useState<string[]>(['']);
  
  // Validation errors state
  const [errors, setErrors] = useState<{
    total?: string;
    people?: string;
    recipients?: string[];
  }>({});

  // Auto-calculate share per person
  const total = parseFloat(totalAmount) || 0;
  const count = numPeople || 1;
  const shareAmount = (total / count).toFixed(7);

  // Automatically adjust recipients list length if they change count or includeSender
  useEffect(() => {
    const expectedRecipientsCount = includeSender ? Math.max(0, numPeople - 1) : numPeople;
    
    setRecipients((prev) => {
      const current = [...prev];
      if (current.length < expectedRecipientsCount) {
        // Add empty fields
        while (current.length < expectedRecipientsCount) {
          current.push('');
        }
      } else if (current.length > expectedRecipientsCount) {
        // Truncate fields
        current.splice(expectedRecipientsCount);
      }
      return current;
    });
  }, [numPeople, includeSender]);

  // Handle adding a recipient manually
  const handleAddRecipient = () => {
    setRecipients([...recipients, '']);
    setNumPeople((prev) => prev + 1);
  };

  // Handle removing a recipient manually
  const handleRemoveRecipient = (index: number) => {
    const nextRecipients = recipients.filter((_, i) => i !== index);
    setRecipients(nextRecipients);
    setNumPeople((prev) => Math.max(1, prev - 1));
  };

  // Handle recipient address change
  const handleRecipientChange = (index: number, value: string) => {
    const nextRecipients = [...recipients];
    nextRecipients[index] = value;
    setRecipients(nextRecipients);
  };

  // Run validation
  const validateForm = () => {
    const nextErrors: typeof errors = {};
    let isValid = true;

    // Validate total amount
    if (total <= 0) {
      nextErrors.total = 'Bill amount must be greater than 0 XLM';
      isValid = false;
    }

    if (senderBalance && total > parseFloat(senderBalance)) {
      nextErrors.total = `Insufficient balance. You need at least ${total} XLM.`;
      isValid = false;
    }

    // Validate number of people
    if (numPeople < 1) {
      nextErrors.people = 'Number of people must be at least 1';
      isValid = false;
    }

    // Validate recipients
    const recipientErrors: string[] = [];
    let hasRecipientError = false;

    recipients.forEach((addr, index) => {
      if (!addr) {
        recipientErrors[index] = 'Wallet address is required';
        hasRecipientError = true;
        isValid = false;
      } else if (!isValidPublicKey(addr)) {
        recipientErrors[index] = 'Invalid Stellar public key format';
        hasRecipientError = true;
        isValid = false;
      } else if (addr === senderAddress) {
        recipientErrors[index] = 'Cannot send payment to your own connected wallet';
        hasRecipientError = true;
        isValid = false;
      } else if (recipients.indexOf(addr) !== index) {
        recipientErrors[index] = 'Duplicate recipient address';
        hasRecipientError = true;
        isValid = false;
      } else {
        recipientErrors[index] = '';
      }
    });

    if (hasRecipientError) {
      nextErrors.recipients = recipientErrors;
    }

    setErrors(nextErrors);
    return isValid;
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSendPayments(recipients, shareAmount);
    }
  };

  // Total required XLM for payments
  const totalPaymentsCost = (parseFloat(shareAmount) * recipients.length).toFixed(7);

  return (
    <div className="panel">
      <div className="panel-head">
        <div className="panel-title">
          <span className="dot" style={{ background: 'var(--gold-bright)', boxShadow: '0 0 8px var(--gold-bright)' }}></span>
          Standard Split Details
        </div>
      </div>

      <form onSubmit={handleSubmit} className="panel-body">
        <div className="field-row">
          {/* Total Bill Input */}
          <div className="field">
            <label htmlFor="totalAmount">Total Bill Amount (XLM)</label>
            <div className="input-wrap">
              <span className="pre">◈</span>
              <input
                id="totalAmount"
                type="number"
                step="any"
                min="0.0000001"
                placeholder="e.g. 50.0"
                value={totalAmount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^\d*\.?\d{0,7}$/.test(val)) {
                    setTotalAmount(val);
                  }
                }}
                disabled={isSending || !senderAddress}
              />
            </div>
            {errors.total && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 600 }}>{errors.total}</span>}
          </div>

          {/* Number of People Input */}
          <div className="field">
            <label htmlFor="numPeople">Number of People to Split With</label>
            <div className="input-wrap">
              <span className="pre">👥</span>
              <input
                id="numPeople"
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 3"
                value={numPeople || ''}
                onChange={(e) => setNumPeople(parseInt(e.target.value) || 0)}
                disabled={isSending || !senderAddress}
              />
            </div>
            {errors.people && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 600 }}>{errors.people}</span>}
          </div>
        </div>

        {/* Include Sender Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          <input
            id="includeSender"
            type="checkbox"
            checked={includeSender}
            onChange={(e) => setIncludeSender(e.target.checked)}
            disabled={isSending || !senderAddress}
            style={{ width: '1.15rem', height: '1.15rem', accentColor: 'var(--gold)', cursor: 'pointer' }}
          />
          <label htmlFor="includeSender" style={{ fontSize: '0.9rem', color: 'var(--paper-dim)', cursor: 'pointer', fontWeight: 500 }}>
            Include myself in the split (I pay my share of {shareAmount} XLM)
          </label>
        </div>

        {/* Dynamic Recipients Input List */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="participants-head">
            <label>Recipient Wallet Addresses ({recipients.length})</label>
            {!includeSender && (
              <button
                type="button"
                onClick={handleAddRecipient}
                disabled={isSending || !senderAddress}
                className="add-participant"
              >
                + Add Recipient
              </button>
            )}
          </div>

          {recipients.map((recipient, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', marginBottom: '0.75rem', width: '100%' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div className="input-wrap">
                  <span className="pre">#{index + 1}</span>
                  <input
                    type="text"
                    placeholder="Recipient Stellar Public Key (starts with G...)"
                    value={recipient}
                    onChange={(e) => handleRecipientChange(index, e.target.value)}
                    disabled={isSending || !senderAddress}
                  />
                </div>
                {(!includeSender || recipients.length > 1) && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRecipient(index)}
                    disabled={isSending || !senderAddress}
                    className="remove-btn"
                    title="Remove Recipient"
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
              {errors.recipients && errors.recipients[index] && (
                <span style={{ color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 600, paddingLeft: '0.5rem', marginTop: '0.25rem', textAlign: 'left' }}>
                  {errors.recipients[index]}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Calculation Summary Panel */}
        <div style={{ background: 'rgba(201,162,75,0.045)', border: '1px solid rgba(201,162,75,0.25)', padding: '1.25rem', borderRadius: '2px', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Each Person's Share:</span>
            <span style={{ fontWeight: 700, color: 'var(--paper)' }}>{shareAmount} XLM</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Number of Recipients:</span>
            <span style={{ fontWeight: 700, color: 'var(--paper)' }}>{recipients.length}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Est. Network Fee:</span>
            <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>
              ~{(0.00001 * recipients.length).toFixed(5)} XLM ({recipients.length} tx)
            </span>
          </div>
          {includeSender && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Sender's Share (Kept):</span>
              <span style={{ fontWeight: 700, color: 'var(--gold-bright)' }}>{shareAmount} XLM</span>
            </div>
          )}
          <div style={{ height: '1px', background: 'var(--line-soft)', margin: '0.75rem 0' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Total Transacted Amount:</span>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--gold-bright)' }}>
              {totalPaymentsCost} XLM
            </span>
          </div>
        </div>

        {/* Action Button */}
        {senderAddress ? (
          <button
            type="submit"
            disabled={isSending || recipients.length === 0}
            className="submit-btn"
          >
            {isSending ? (
              <>
                <div className="spinner" style={{ width: '1.2rem', height: '1.2rem', borderWidth: '2px' }}></div>
                <span>Executing Split Payments...</span>
              </>
            ) : (
              <>
                <span>Send Split Payments</span>
              </>
            )}
          </button>
        ) : (
          <div className="alert alert-warning flex items-center gap-2" style={{ margin: 0 }}>
            <Info size={16} />
            <span>Connect your wallet above to input details and send payments.</span>
          </div>
        )}
      </form>
    </div>
  );
};
