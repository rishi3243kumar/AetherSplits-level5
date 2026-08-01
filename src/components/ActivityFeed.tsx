import { useState, useEffect, useRef } from 'react';
import { getRecentEvents } from '../lib/stellar';
import type { SorobanEvent } from '../lib/stellar';
import { CheckCircle2, FileText, Ban, Sparkles, UserPlus } from 'lucide-react';

interface ActivityFeedProps {
  connectedAddress?: string | null;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ connectedAddress }) => {
  const [events, setEvents] = useState<SorobanEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');
  
  const startLedgerRef = useRef<number | undefined>(undefined);
  const cursorRef = useRef<string | undefined>(undefined);
  const pollTimerRef = useRef<any>(null);

  const fetchInitialEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await getRecentEvents();
      
      // Load simulated events from localStorage
      let simulatedList: SorobanEvent[] = [];
      try {
        const stored = localStorage.getItem('aethersplit_simulated_events');
        if (stored) {
          simulatedList = JSON.parse(stored);
        }
      } catch (e) {
        console.warn('Failed to parse simulated events:', e);
      }

      // Merge on-chain and simulated events, sorting simulated ones first
      const mergedEvents = [...simulatedList, ...res.events].sort((a, b) => {
        const parseTime = (id: string) => {
          if (id.startsWith('sim-')) {
            const parts = id.split('-');
            return parseInt(parts[1]) || 0;
          }
          return 0;
        };
        
        const timeA = parseTime(a.id);
        const timeB = parseTime(b.id);
        
        if (timeA && timeB) return timeB - timeA;
        if (timeA) return -1;
        if (timeB) return 1;
        
        return b.id.localeCompare(a.id);
      });

      setEvents(mergedEvents);
      cursorRef.current = res.cursor;
      startLedgerRef.current = res.latestLedger - 100;
      setIsStreaming(true);
    } catch (err: any) {
      console.error('Failed to connect to Soroban event stream:', err);
      setError(err.message || 'Failed to connect to Soroban event stream.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialEvents();

    const handleNewEvent = (e: Event) => {
      const customEvent = e as CustomEvent<SorobanEvent>;
      if (customEvent.detail) {
        setEvents((prev) => {
          if (prev.some((ev) => ev.id === customEvent.detail.id)) return prev;
          return [customEvent.detail, ...prev];
        });
      }
    };

    window.addEventListener('aethersplit_new_event', handleNewEvent);

    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
      window.removeEventListener('aethersplit_new_event', handleNewEvent);
    };
  }, []);

  useEffect(() => {
    if (!isStreaming) return;

    // Set up real-time event streaming poll every 4 seconds
    pollTimerRef.current = setInterval(async () => {
      try {
        const res = await getRecentEvents(startLedgerRef.current, cursorRef.current);
        if (res.events && res.events.length > 0) {
          setEvents((prev) => {
            // Filter out any duplicates just in case
            const newEvents = res.events.filter(
              (newEv) => !prev.some((oldEv) => oldEv.id === newEv.id)
            );
            return [...newEvents, ...prev]; // Show newest first
          });
          cursorRef.current = res.cursor;
        }
      } catch (err) {
        console.warn('Real-time event stream poll error:', err);
      }
    }, 4000);

    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
  }, [isStreaming]);

  const truncateAddress = (addr: string) => {
    if (!addr || addr.length < 10) return addr;
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const getEventIcon = (type: SorobanEvent['type']) => {
    switch (type) {
      case 'split_created':
        return <FileText className="text-purple-400" size={18} />;
      case 'payment_marked':
        return <Sparkles className="text-blue-400" size={18} />;
      case 'notify_completed':
        return <CheckCircle2 className="text-emerald-400" size={18} />;
      case 'split_cancelled':
        return <Ban className="text-rose-400" size={18} />;
      case 'participant_added':
        return <UserPlus className="text-cyan-400" size={18} />;
    }
  };

  const formatEventMessage = (ev: SorobanEvent) => {
    switch (ev.type) {
      case 'split_created': {
        const creator = Array.isArray(ev.value) ? ev.value[0] : 'Creator';
        const rawAmount = Array.isArray(ev.value) ? ev.value[1] : 0n;
        const amountXlm = (Number(rawAmount) / 10000000).toFixed(2);
        return (
          <>
            Bill <span className="font-semibold text-white">{ev.billId}</span> created by{' '}
            <span className="address-badge">{truncateAddress(creator.toString())}</span> for{' '}
            <span className="font-semibold text-purple-400">{amountXlm} XLM</span>
          </>
        );
      }
      case 'payment_marked': {
        const participant = ev.value || 'Participant';
        return (
          <>
            Payment marked for{' '}
            <span className="address-badge">{truncateAddress(participant.toString())}</span> on bill{' '}
            <span className="font-semibold text-white">{ev.billId}</span>
          </>
        );
      }
      case 'notify_completed':
        return (
          <>
            Bill <span className="font-semibold text-emerald-400">{ev.billId}</span> is fully paid!{' '}
            <span className="text-emerald-400">SplitNotifier notified successfully</span> 🎉
          </>
        );
      case 'split_cancelled':
        return (
          <>
            Bill <span className="font-semibold text-rose-400">{ev.billId}</span> has been cancelled
          </>
        );
      case 'participant_added': {
        const participant = ev.value || 'Participant';
        return (
          <>
            Participant <span className="address-badge">{truncateAddress(participant.toString())}</span> added to bill{' '}
            <span className="font-semibold text-white">{ev.billId}</span>
          </>
        );
      }
      default:
        return `On-chain event triggered for bill ${ev.billId}`;
    }
  };

  const myEvents = events.filter((ev) => {
    if (!connectedAddress) return false;
    if (ev.type === 'split_created') {
      const creator = Array.isArray(ev.value) ? ev.value[0]?.toString() : '';
      return creator.toLowerCase() === connectedAddress.toLowerCase();
    }
    return false;
  }).slice(0, 5);

  const displayedEvents = activeTab === 'all' ? events : myEvents;

  return (
    <div className="panel activity">
      <div className="panel-head">
        <div className="panel-title">
          <span className="dot"></span>Activity Log
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="log-tabs">
            <div
              className={`log-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Activity
            </div>
            {connectedAddress && (
              <div
                className={`log-tab ${activeTab === 'mine' ? 'active' : ''}`}
                onClick={() => setActiveTab('mine')}
              >
                My Bills (Last 5)
              </div>
            )}
          </div>
          {loading ? (
            <span className="live" style={{ color: 'var(--muted)' }}>Connecting...</span>
          ) : error ? (
            <span className="live" style={{ color: 'var(--danger)', cursor: 'pointer' }} onClick={fetchInitialEvents}>Disconnected (Retry)</span>
          ) : (
            <span className="live">Live Stream Connected</span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="panel-body">
          <div className="activity-feed">
            {[1, 2, 3].map((n) => (
              <div key={n} className="activity-item skeleton" style={{ opacity: 0.6, border: '1px solid var(--line-soft)', padding: '12px', marginBottom: '8px', display: 'flex', gap: '12px' }}>
                <div className="activity-icon skeleton" style={{ width: '1.75rem', height: '1.75rem', borderRadius: '2px' }}></div>
                <div className="activity-details" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
                  <div className="skeleton" style={{ height: '12px', width: '60%', borderRadius: '2px' }}></div>
                  <div className="skeleton" style={{ height: '10px', width: '40%', borderRadius: '2px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="panel-body">
          <div className="alert alert-error" style={{ margin: 0 }}>
            <p>{error}</p>
          </div>
        </div>
      ) : displayedEvents.length === 0 ? (
        <div className="log-empty">
          <div className="ledger-line"></div>
          {activeTab === 'mine' ? "No bills created yet. Create a private bill to open the ledger." : "No sealed entries yet. Create a bill to open the ledger."}
        </div>
      ) : (
        <div className="panel-body">
          <div className="activity-feed" style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {displayedEvents.map((ev) => (
              <div key={ev.id} className={`activity-item type-${ev.type}`} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--line-soft)' }}>
                <div className="activity-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getEventIcon(ev.type)}
                </div>
                <div className="activity-details" style={{ flexGrow: 1 }}>
                  <div className="activity-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13.5px', color: 'var(--paper)' }}>
                      {formatEventMessage(ev)}
                    </span>
                    {ev.txHash && !ev.id.startsWith('sim-') ? (
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${ev.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-explorer text-sm"
                        style={{ color: 'var(--gold)', fontSize: '12px' }}
                      >
                        View Tx
                      </a>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--muted)', fontStyle: 'italic' }}>Simulated</span>
                    )}
                  </div>
                  <div className="activity-meta" style={{ marginTop: '4px' }}>
                    <span className="activity-time" style={{ fontSize: '11px', color: 'var(--muted)' }}>Event ID: {ev.id.substring(0, 8)}...</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
