// Changed
import buffer from "buffer";

const { Buffer } = buffer;
if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

const API_BASE_URL = "http://localhost:3000/api";

class BlockchainService {
  /**
   * Get the current state of the blockchain (all blocks).
   * @returns {Promise<Array>} The array of blocks in the blockchain.
   */
  async getBlocks() {
    try {
      const response = await fetch(`${API_BASE_URL}/blockchain`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching blocks:", error);
      throw error;
    }
  }

  /**
   * Get the balance of a specific address.
   * @param {string} address - The wallet address.
   * @returns {Promise<number>} The balance of the given address.
   */
  async getBalanceOfAddress(address) {
    try {
      const response = await fetch(`${API_BASE_URL}/wallet/${address}/balance`);
      const data = await response.json();
      return data.balance;
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      throw error;
    }
  }

  // Fetch wallet transactions from the backend API
  async getWalletTransactions(address) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/wallet/${address}/transactions`
      );
      const data = await response.json();
      return data.transactions;
    } catch (error) {
      console.error("Error fetching wallet transactions:", error);
      throw error;
    }
  }

  /**
   * Get the list of pending transactions.
   * @returns {Promise<Array>} The array of pending transactions.
   */
  async getPendingTransactions() {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/pending`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching pending transactions:", error);
      throw error;
    }
  }

  /**
   * Fetch the current blockchain settings (difficulty, miningReward).
   * @returns {Promise<Object>} The current blockchain settings.
   */
  async getBlockchainSettings() {
    try {
      const response = await fetch(`${API_BASE_URL}/blockchain/settings`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching blockchain settings:", error);
      throw error;
    }
  }

  /**
   * Update the blockchain settings (difficulty, miningReward).
   * @param {Object} newSettings - The new blockchain settings to update.
   * @returns {Promise<void>}
   */
  async updateBlockchainSettings(newSettings) {
    try {
      const response = await fetch(`${API_BASE_URL}/blockchain/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSettings),
      });

      if (!response.ok) {
        throw new Error("Failed to update blockchain settings");
      }
    } catch (error) {
      console.error("Error updating blockchain settings:", error);
      throw error;
    }
  }

  /**
   * Mine the pending transactions and reward the miner.
   * @param {string} minerAddress - The address that will receive the mining reward.
   * @returns {Promise<void>}
   */
  // blockchainService.js
  async minePendingTransactions(minerAddress) {
    try {
      const response = await fetch(`${API_BASE_URL}/mine`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rewardAddress: minerAddress }),
      });

      const data = await response.json();
      return { success: data.success, message: data.message };
    } catch (error) {
      console.error("Error mining transactions:", error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get the latest transaction for a specific address so that we can set origin transaction hash.
   * @param {string} address - The wallet address.
   * @returns {Promise<Object|null>} The latest transaction or null if none exists.
   */
  async getLatestTransactionForAddress(address) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/wallet/${address}/transactions/latest`
      );

      if (response.status === 404) {
        return null; // No transactions found for this address
      }

      const transaction = await response.json();
      return transaction;
    } catch (error) {
      console.error("Error fetching latest transaction for address:", error);
      throw error;
    }
  }

  /**
   * Add a new transaction to the blockchain.
   * @param {Object} tx - The transaction object.
   * @returns {Promise<void>}
   */
  async addTransaction(tx) {
    try {
      const response = await fetch(`${API_BASE_URL}/transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromAddress: tx.fromAddress,
          toAddress: tx.toAddress,
          amount: tx.amount,
          timestamp: tx.timestamp,
          signature: tx.signature,
          originTransactionHash: tx.originTransactionHash,
          publicKey: tx.publicKey,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add transaction");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  }

  /**
   * Create a new wallet.
   * @returns {Promise<Object>} The wallet object containing public and private keys.
   */
  async createWallet() {
    try {
      const response = await fetch(`${API_BASE_URL}/wallet`, {
        method: "POST",
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating wallet:", error);
      throw error;
    }
  }

  /**
   * Checks if the given address belongs to the currently logged-in user.
   * @param {string} address - The wallet address to check.
   * @returns {boolean} Returns true if the address belongs to the current user.
   */
  addressIsFromCurrentUser(address) {
    return address === this.currentUserAddress;
  }

  /**
   * Check if a transaction is valid by its hash.
   * @param {string} hash - The hash of the transaction.
   * @returns {Promise<boolean>} The validity status of the transaction.
   */
  async isTransactionValid(hash) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/transaction/${hash}/validate`
      );
      const data = await response.json();
      return data.isValid; // Return the validity result
    } catch (error) {
      console.error("Error validating transaction:", error);
      throw error;
    }
  }
}

const blockchainService = new BlockchainService();
export default blockchainService;
