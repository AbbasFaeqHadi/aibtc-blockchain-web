import express from "express";
import bodyParser from "body-parser";
import { blockchainInstance } from "./blockchain.js"; // Import your blockchain instance
import { Transaction } from "./transaction.js"; // Import the transaction model
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse incoming JSON requests

// Initialize blockchain and server
const startServer = async () => {
  try {
    // Initialize genesis block and sync blockchain with the database
    await blockchainInstance.init();

    // ------------------ API Endpoints ------------------ //

    // Get the full blockchain
    app.get("/api/blockchain", async (req, res) => {
      try {
        // Reload the blockchain from the database to ensure up-to-date data
        await blockchainInstance.loadChainFromDatabase();

        const chain = blockchainInstance.chain.map((block) => block.toJSON());
        res.status(200).json(chain);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch blockchain" });
      }
    });

    // Get the balance of a wallet
    app.get("/api/wallet/:address/balance", async (req, res) => {
      const { address } = req.params;
      try {
        const balance = await blockchainInstance.getBalanceOfAddress(address);
        res.status(200).json({ balance });
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch balance" });
      }
    });

    // Mine pending transactions (mining)
    app.post("/api/mine", async (req, res) => {
      const { rewardAddress } = req.body;

      try {

        if (!rewardAddress) {
          return res.status(400).json({
            success: false,
            message: "Invalid reward address",
          });
        }

        const result = await blockchainInstance.minePendingTransactions(
          rewardAddress
        );

        if (result === "success") {
          return res.status(201).json({
            success: true,
            message: "Block mined successfully.",
          });
        }
        if (result === "no_pending_transactions") {
          return res.status(200).json({
            success: false,
            message: "No pending transactions to mine.",
          });
        }
        if (result === "lock_failed") {
          return res.status(503).json({
            success: false,
            message:
              "Mining is temporarily unavailable, please try again shortly.",
          });
        }
        if (result === "no_unique_transactions") {
          return res.status(200).json({
            success: false,
            message: "No unique pending transactions available for mining.",
          });
        }
      } catch (error) {
        console.error("Error during mining process:", error);
        res.status(500).json({
          success: false,
          error: "Failed to mine block",
          details: error.message,
        });
      }
    });

    // Trace a specific transaction by its hash
    app.get("/api/transaction/:hash", async (req, res) => {
      const { hash } = req.params;

      try {
        const transaction = await Transaction.load(hash); // Load transaction from blockchain
        if (transaction) {
          res.status(200).json(transaction);
        } else {
          res.status(404).json({ error: "Transaction not found" });
        }
      } catch (error) {
        res.status(500).json({
          error: "Failed to fetch transaction",
          details: error.message,
        });
      }
    });

    // Validate a specific transaction by its hash
    app.get("/api/transaction/:hash/validate", async (req, res) => {
      const { hash } = req.params;

      try {
        const transaction = await Transaction.load(hash); // Load the transaction by hash
        if (transaction) {
          const isValid = transaction.isValid(); // Call isValid() to check validity
          res.status(200).json({ isValid }); // Respond with the validation result
        } else {
          res.status(404).json({ error: "Transaction not found" });
        }
      } catch (error) {
        res.status(500).json({
          error: "Failed to validate transaction",
          details: error.message,
        });
      }
    });

    // Create a new transaction with signature
    app.post("/api/transaction", async (req, res) => {
      const {
        fromAddress,
        toAddress,
        amount,
        timestamp,
        signature,
        originTransactionHash,
        publicKey,
      } = req.body;

      // Ensure all required fields are present
      if (
        !fromAddress ||
        !toAddress ||
        !timestamp ||
        !amount ||
        !signature ||
        !publicKey
      ) {
        return res
          .status(400)
          .json({ error: "Missing required transaction fields" });
      }

      try {
        // Initialize default values for fields that are not set until mining
        const blockHash = ""; // Block hash will remain empty until mined
        const indexInBlock = null;

        // Instantiate a new Transaction
        const tx = new Transaction(
          fromAddress,
          toAddress,
          amount,
          timestamp,
          signature,
          blockHash,
          originTransactionHash,
          publicKey,
          indexInBlock
        );

        // Validate the transaction signature and data
        if (!tx.isValid()) {
          return res
            .status(400)
            .json({ error: "Invalid transaction signature" });
        }

        // Check if the transaction already exists in the pending pool
        if (blockchainInstance.transactionPool.has(tx.hash)) {
          return res.status(409).json({
            message: "Transaction already exists in the pending pool",
          });
        }

        await blockchainInstance.addPendingTransaction(tx);

        return res.status(201).json({
          message: "Transaction created",
          tx,
        });
      } catch (error) {
        console.error("Error creating transaction:", error);
        return res.status(500).json({
          error: "Failed to create transaction",
          details: error.message,
        });
      }
    });

    app.get("/api/transactions/pending", async (req, res) => {
      try {
        // Load pending transactions and map each transaction to its JSON representation
        const pendingTransactions = blockchainInstance.pendingTransactions;
        const transactions = pendingTransactions.map((tx) => tx.toJSON());

        res.status(200).json(transactions);
      } catch (error) {
        console.error("Error fetching pending transactions:", error);
        res.status(500).json({ error: "Failed to fetch pending transactions" });
      }
    });

    // Existing imports and code...

    // Get the latest transaction for a specific wallet address
    app.get("/api/wallet/:address/transactions/latest", async (req, res) => {
      const { address } = req.params;

      try {
        const latestTransaction =
          await Transaction.getLatestTransactionForAddress(address);

        if (!latestTransaction) {
          return res
            .status(404)
            .json({ message: "No transactions found for address" });
        }

        res.status(200).json(latestTransaction);
      } catch (error) {
        console.error("Error fetching latest transaction for address:", error);
        res.status(500).json({ error: "Failed to fetch latest transaction" });
      }
    });

    // Get the current blockchain settings (difficulty and mining reward)
    app.get("/api/blockchain/settings", async (req, res) => {
      try {
        const settings = {
          difficulty: blockchainInstance.difficulty,
          miningReward: blockchainInstance.miningReward,
        };
        res.status(200).json(settings);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch blockchain settings" });
      }
    });

    // Update blockchain settings (difficulty, mining reward)
    app.post("/api/blockchain/settings", async (req, res) => {
      const { difficulty, miningReward } = req.body;

      try {
        if (difficulty !== undefined) {
          blockchainInstance.difficulty = difficulty;
        }

        if (miningReward !== undefined) {
          blockchainInstance.miningReward = miningReward;
        }

        res.status(200).json({
          message: "Blockchain settings updated successfully",
        });
      } catch (error) {
        res.status(500).json({
          error: "Failed to update blockchain settings",
          details: error.message,
        });
      }
    });

    // Get transactions for a specific wallet
    app.get("/api/wallet/:address/transactions", async (req, res) => {
      const { address } = req.params;
      try {
        // Fetch all transactions for the wallet address
        const transactions = await blockchainInstance.getTransactionsForAddress(
          address
        );

        res.status(200).json({ transactions });
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch wallet transactions" });
      }
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error initializing blockchain:", error);
  }
};

startServer();
