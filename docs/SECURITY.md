# Security & Privacy Considerations

AetherSplit uses a custom privacy engine:

## 1. Hashed Commitments
Instead of storing bill details in plain text on-chain (such as recipient addresses and exact split amounts), AetherSplit registers a cryptographic hash of the bill data. This ensures no third party can read participant list or split amounts.

## 2. Stealth Addresses
For every recipient, a one-time public key is derived. Senders deposit into this stealth address. Senders cannot link the stealth address to the recipient's main wallet without the shared secret, ensuring recipient identities are never linked on-chain.
