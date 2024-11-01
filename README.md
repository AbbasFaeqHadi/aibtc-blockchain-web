# AIBTC Blockchain Platform

Decentralized blockchain platform with peer-to-peer networking, transaction validation, Merkle Tree integration, wallet management, and real-time block mining.

<p align="center">
  <img src="client/src/assets/logo.svg" alt="AIBTC Logo" width="150"/>
</p>

## Features

- **Blockchain Ledger**: Supports adding, verifying, and mining blocks and transactions.
- **Wallet and Transactions**: Provides wallet creation, balance tracking, and secure transaction handling.
- **Pending Transactions**: Displays unmined transactions for monitoring.
- **Blockchain Settings**: Adjustable difficulty and mining rewards.

## Project Structure

### Client
The client is a React application managing the UI, displaying blocks, transactions, and settings.

- **Components**: Modular components like `BlockView`, `TransactionsTable`, and `Alert`.
- **Pages**: Dedicated pages for wallet balance, blockchain view, and transaction creation.
- **Context**: A blockchain provider that wraps around React components to share blockchain data globally.
- **BlockchainService**: A service for accessing blockchain data and functionality.

### Server
The server is a Node.js application using Express.js and WebSocket for API handling and peer-to-peer networking.

- **Blockchain**: The core of blockchain handling, including transaction validation, block mining, and chain replacement.
- **Database**: MySQL is used for persisting blocks, transactions, and wallet balances.
- **P2P Networking**: Manages communication and syncing between peers.
- **Merkle Tree**: Uses Merkle Trees for transaction validation within blocks.

## Installation

### Prerequisites
- Node.js
- MySQL Workbench 8.0 CE

### Setup

1. Clone the repository.
    ```bash
    git clone https://github.com/yourusername/AIBTC-Blockchain.git
    ```

2. **Install Dependencies**:
    - Open two terminals for running the client and server separately.

    In the first terminal:
    ```bash
    cd client
    npm install
    npm run dev
    ```

    In the second terminal:
    ```bash
    cd server
    npm install
    npm run server
    ```

4. **MySQL Database Setup**: Go to the server directory and read the instructions to configure the database.

### API Endpoints

- `GET /api/blockchain`: Fetches the entire blockchain.
- `GET /api/wallet/:address/balance`: Gets wallet balance.
- `POST /api/mine`: Mines pending transactions.
- `POST /api/transaction`: Adds a new transaction.

> For a full list of endpoints, see the source code in `server/src/index.js`.

## Usage

Once the client and server are running:

1. **Access the Homepage**: View blocks and recent transactions
2. **Create Wallet and Transactions**: 
   - Navigate to `Create Wallet` to generate a new wallet.
   - Go to `Create Transaction` to initiate transactions between wallets.
3. **Adjust Blockchain Settings**: Under the `Settings` page, modify difficulty levels and mining rewards as needed.

> **Note:** Since we don't have a faucet wallet implemented, use the pre-funded wallet created with the genesis block to send initial coins to other wallets. This wallet holds 1,000,000.00000000 coins.

### Genesis Wallet Details:
- **Public Key**:  
  `0483a7e4a03c63c19a34f5b6a364fa88a81d44131e80f07477572b9aa16214516a637efc006e783dddc05f751e92527180c40971b8213dcfc4440d2df8da19a64f`
- **Private Key**:  
  `8cfc3ee5576061ec87bd5a3bea1d9ea6a8010a2de0108579fc52d73656586a4e`
- **Address**:  
  `6c7f05cca415fd2073de8ea8853834`

4. **Manage Pending Transactions**: After creating a transaction, it will appear in the pending transactions list.
5. **Mine Transactions**: Choose a miner address and start mining to validate and confirm pending transactions.
6. **View Block**: View the entire mined block by clicking on a block in the blockchain view.
7. **View Wallet Details**: Click on a wallet address to view its balance and transactions.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss changes.

## License

This project is licensed under the MIT License.
