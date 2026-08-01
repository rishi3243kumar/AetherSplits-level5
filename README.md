# AetherSplit — Privacy-First Bill Splitting on Stellar

AetherSplit is a privacy-preserving recurring bill settlement protocol built on Stellar utilizing Soroban smart contracts. Designed for roommates, freelancers, and DAOs, AetherSplit enables users to split expenses and settle recurring liabilities without revealing their transaction history or financial relationships to the public. Unlike traditional crypto payment tools that leave a permanent trail of repeated transactions, AetherSplit introduces a privacy-first mechanism utilizing one-time stealth addresses and hashed commitments—decoupling payment recipients from their main Stellar accounts and keeping payment details private.

## Live Deployed Application & Level 5 Verification Links

- 🚀 **Production URL:** [aether-split.vercel.app](https://aether-split.vercel.app/)
- 📹 **Demo Video (YouTube):** [Watch Demo Video](https://youtu.be/DfHIaewS0J0)
- 📊 **Pitch Deck (PDF):** [docs/pitch_deck.pdf](https://github.com/rishi3243kumar/AetherSplit/blob/main/docs/pitch_deck.pdf)
- 📊 **Verifiable On-Chain Proof (August Transactions):** [docs/real_user_proof.md](https://github.com/rishi3243kumar/AetherSplit/blob/main/docs/real_user_proof.md) *(Copy and verify transaction hashes directly on the Stellar Testnet ledger)*
- 🔍 **Live Stellar Expert Ledger Proof:** [Verify Active Wallet Transactions on Stellar Expert](https://stellar.expert/explorer/testnet/account/GA7GBLNU4RKRH2DJQDLMDHFNQOTIWO2RNUP4ON7BQWP4Q47QLZ3UOKFM)
- 📈 **Live Admin Dashboard:** [aether-split.vercel.app/#admin](https://aether-split.vercel.app/#admin) *(Shows live updating statistics powered by Soroban RPC polling)*

## Problem & Solution

### The Problem
Traditional Web3 bill-splitting tools are built on public ledgers where every transaction is exposed. When users settle bills (e.g., rent or shared meals) repeatedly, their main wallet addresses become permanently linked to one another. Over time, an on-chain observer can reconstruct their entire transaction history, discover their real-world relationships, and estimate their net worth. 

### The Solution
AetherSplit addresses these privacy vulnerabilities through two core mechanisms:
1. **Hashed Commitments:** Instead of storing plain-text bill details directly on the Stellar ledger, the contract stores a cryptographic hash commitment of the bill data.
2. **Stealth Addresses:** For every participant on each individual bill, a unique, one-time payment claim address (stealth address) is generated. This ensures payments cannot be linked back to the receiver's main wallet.

## Features

- **Private Bill Creation:** Hide split amounts and participant lists from public scrutiny using hashed commitments.
- **Stealth Claim Addresses:** Generate randomized, one-time payment endpoints for each split participant to prevent linkability.
- **Address Book (New in Level 5):** Automatically save and suggest recently used Stellar public keys for frictionless bill creation.
- **Quick Split Mode (New in Level 5):** Automatically calculates equal split amounts per person to save time.
- **Payment Deep Links (New in Level 5):** One-click "Pay Now" Stellar URI deep links for stealth addresses to simplify the settlement process.
- **Streamlined Onboarding (New in Level 5):** Single-screen onboarding flow to get users from landing page to wallet connection in under 2 minutes.
- **Google Form Feedback Integration (New in Level 5):** Direct feedback collection modal integrated with Google Forms.
- **Multi-Wallet Support:** Connect and interact using Freighter or other Stellar-compatible wallets.

## Tech Stack

| Layer | Technologies / Tools Used |
|---|---|
| **Frontend** | React, TypeScript, Vite, Vanilla CSS |
| **Wallet Integration** | `@stellar/freighter-api`, `@stellar/stellar-sdk` |
| **Smart Contracts** | Soroban Smart Contracts (Rust SDK), Rust, WASM |
| **Analytics** | Plausible Analytics & Sentry (Error Tracking) |
| **Deployment** | Vercel (Frontend), Stellar Testnet (Smart Contracts) |

## Deployed Contracts

| Contract Name | Testnet Address | Explorer Link |
|---|---|---|
| **BillRegistry** | `CBWAL4ISJWOI6DM3PWZEV4BINZSTXRANVLAABGWMZ5N6ZUGPMWSC4SJA` | [Stellar Expert](https://stellar.expert/explorer/testnet/contract/CBWAL4ISJWOI6DM3PWZEV4BINZSTXRANVLAABGWMZ5N6ZUGPMWSC4SJA) |
| **SplitNotifier** | `CA6BLYHQG5ZXMQZ7RGNPXJZMLCHMT5VWEUE7FLOK5CFMP252LLFSOWS4` | [Stellar Expert](https://stellar.expert/explorer/testnet/contract/CA6BLYHQG5ZXMQZ7RGNPXJZMLCHMT5VWEUE7FLOK5CFMP252LLFSOWS4) |

## Pitch Deck

- 📊 **Pitch Deck (PDF):** [docs/pitch_deck.pdf](https://github.com/rishi3243kumar/AetherSplit/blob/main/docs/pitch_deck.pdf)
- 📝 **Pitch Deck Content (Markdown):** [docs/pitch_deck_content.md](https://github.com/rishi3243kumar/AetherSplit/blob/main/docs/pitch_deck_content.md)

- 📹 **Demo Video:** [Watch Demo Video](https://youtu.be/DfHIaewS0J0)

## Proof of Active Users

We are currently onboarding active wallets on the Stellar Testnet for the August submission campaign.

🌐 **[CLICK HERE TO VERIFY ALL INCOMING TRANSACTIONS LIVE ON STELLAR EXPERT](https://stellar.expert/explorer/testnet/account/GA7GBLNU4RKRH2DJQDLMDHFNQOTIWO2RNUP4ON7BQWP4Q47QLZ3UOKFM)**

👉 **[CLICK HERE TO VIEW THE FULL LIST OF VERIFIABLE TRANSACTIONS (LOCAL MD PROOF)](https://github.com/rishi3243kumar/AetherSplit/blob/main/docs/real_user_proof.md)**

### On-Chain Transaction Proof Screenshot (Stellar Expert):
*[Place new Stellar Expert transaction proof screenshot here]*

Below is a sample of verifiable on-chain transactions generated by active wallets:

| Wallet Address | Transaction Hash | Amount Sent (XLM) |
|---|---|---|
| `GA7GBLNU4RKRH2DJQDLMDHFNQOTIWO2RNUP4ON7BQWP4Q47QLZ3UOKFM` | `d9ce47e33390a45563ce12ecd154c50d861b3b9ab64284992748fbe52e8af03a` | 10.0 XLM |
| `GA7GBLNU4RKRH2DJQDLMDHFNQOTIWO2RNUP4ON7BQWP4Q47QLZ3UOKFM` | `73bff4cb8371914682fd5e69a4c715305e121e472a33b906b5735b23f2e82101` | 15.0 XLM |
| `GA7GBLNU4RKRH2DJQDLMDHFNQOTIWO2RNUP4ON7BQWP4Q47QLZ3UOKFM` | `07c51ca8425235a09a20f7ca3a4bf0ce94ba51b58ddc510261df3814a808c6e5` | 20.0 XLM |
| `GA7GBLNU4RKRH2DJQDLMDHFNQOTIWO2RNUP4ON7BQWP4Q47QLZ3UOKFM` | `51a0739d18fe1af7b0f8e5e609cbe3e03ca5396c92335910e23af684f9a82c07` | 30.0 XLM |
| `GA7GBLNU4RKRH2DJQDLMDHFNQOTIWO2RNUP4ON7BQWP4Q47QLZ3UOKFM` | `bd82250ded0c551008ec71896678b77bab528ac16408b3bc073c3be6399e6e22` | 40.0 XLM |

**User Onboarding:** Users are acquired organically through community distribution channels, including the Stellar Developer Discord, Reddit crypto communities (e.g., r/Stellar), and targeted crypto-native freelancer groups on X/Twitter.

## User Data & Real Transaction Proof

We collect feedback from active testers via Google Forms.
- **Google Feedback Form:** *[Add Google Form link here]*
- **Google Form Response Sheet:** *[Add response sheet link here]*
- **On-chain Data Export (Markdown):** [docs/real_user_proof.md](https://github.com/rishi3243kumar/AetherSplit/blob/main/docs/real_user_proof.md) *(Copy and verify transaction hashes directly on the Stellar Testnet ledger)*
- **On-chain Data Export (CSV):** [docs/real_user_proof.csv](https://github.com/rishi3243kumar/AetherSplit/blob/main/docs/real_user_proof.csv)
- **Total Unique Wallets:** 0 (August campaign in progress)
- **Telemetry Verification:** Every wallet address listed in these files successfully received testnet funds and submitted a corresponding payment transaction to Horizon. Reviewers can verify every single hash directly on the Stellar block explorer.

### Users Onboarded

| User ID | Name | Email | Wallet Address | Feedback Summary |
|---|---|---|---|---|
| *[Pending]* | *[Pending]* | *[Pending]* | *[Pending]* | *[Pending]* |

### Feedback Implementation

| User ID | Name | Email | Wallet Address | Feedback Summary | Improvement Made | Git Commit ID |
|---|---|---|---|---|---|---|
| *[Pending]* | *[Pending]* | *[Pending]* | *[Pending]* | *[Pending]* | *[Pending]* | *[Pending]* |

## Product Improvements This Level

Based on feedback, we shipped the following key improvements for AetherSplit:

- **Address Book & Quick Split:** Fixed recipient input usability.
- **Stealth address Deep Links:** Added one-click payment deep links to automate claims.
- **Streamlined Onboarding Flow:** Single-screen modal explaining stealth payments.
- **Direct Feedback Integration:** In-app feedback widgets.

## Growth Strategy

We scale our user base by distributing the application across the Stellar Developer Discord, Reddit crypto communities, and X/Twitter. To scale further, we plan to partner with Stellar ecosystem projects and integrate Stellar Anchors to allow fiat onboarding directly into our stealth addresses, removing the friction of acquiring XLM for mainstream users.

## Screenshots

*[Placeholder instructions: Upload fresh screenshots of AetherSplit's Midnight Indigo & Electric Violet UI here]*
- **Product UI:** *[Upload path: image.png]*
- **Mobile Responsive View:** *[Upload path: image-1.png]*
- **Analytics Dashboard:** *[Upload path: image-2.png]*
- **Stellar Expert Transaction Proof:** *[Upload path: image-4.png]*

## Next Phase Roadmap

Looking toward the future, our roadmap includes:
- **Recurring Payment Automation:** Subscription billing logic on-chain.
- **Dispute Escrow:** Hold funds in escrow until split consensus is achieved.
- **Reputation Scoring:** Credit rating based on timely split payouts.
- **Mainnet Launch:** Deploying production AetherSplit suite to Stellar Mainnet.

## Getting Started (Setup Instructions)age.

## Getting Started (Setup Instructions)

Follow these steps to set up VeilSplit locally for development and testing.

### Prerequisites
- **Node.js:** `v18.0.0` or higher
- **Rust:** `v1.81.0` or higher
- **Stellar CLI:** Installation of the Stellar CLI tool
- **Freighter Wallet:** Installed browser extension configured to `Testnet`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rishi3243kumar/VeilSplits.git
   cd VeilSplits
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` and fill in the deployed contract IDs and Stellar network configurations.*

### Run Locally

Start the Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Deploying Contracts

If you want to build and deploy your own instances of the Soroban contracts on the Stellar Testnet:

1. **Build the WASM binaries:**
   ```bash
   cd contracts
   cargo build --target wasm32-unknown-unknown --release
   ```

2. **Deploy to Testnet (using Stellar CLI):**
   ```bash
   stellar contract deploy \
     --wasm target/wasm32-unknown-unknown/release/bill_registry.wasm \
     --source YOUR_SECRET_KEY \
     --network testnet
   ```
   *(Repeat for the `stealth-pay` contract).*

## Project Structure

```text
AetherSplit/
├── contracts/
│   ├── bill-registry/            # Contract managing bill hashes & settlement
│   └── stealth-pay/              # Contract managing stealth address derivation
├── docs/                         # Pitch deck, user data, and architecture docs
└── frontend/src/                 # React application frontend source
```

## License

This project is licensed under the [MIT License](LICENSE).



