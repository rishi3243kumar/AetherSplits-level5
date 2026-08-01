# Local Development Setup Guide

To run the AetherSplit workspace locally:

## Prerequisites
- Rust and Cargo (ustup default stable)
- Node.js (v18+) and npm
- Stellar CLI (cargo install --locked stellar-cli)

## Local Deploy Steps
1. Navigate to /contract and compile contracts:
   `ash
   stellar contract build
   `
2. Deploy the generated WASM files to Testnet:
   `ash
   stellar contract deploy --wasm target/wasm32-unknown-unknown/release/bill_registry.wasm --source YOUR_KEY --network testnet
   `
3. Copy the returned contract IDs and configure them in your .env file under VITE_CONTRACT_ID.
4. Run 
pm install and 
pm run dev in the root folder to launch the frontend.
