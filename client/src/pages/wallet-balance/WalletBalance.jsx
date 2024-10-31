import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import blockchainService from "../../services/blockchainService";
import TransactionsTable from "../../components/transactions-table/TransactionsTable";

/**
 * WalletBalance component shows the balance of a specific wallet
 * and lists all transactions associated with it.
 *
 * @component
 * @returns {JSX.Element} The rendered wallet balance component.
 */
const WalletBalance = () => {
  const { address } = useParams(); // Get wallet address from route parameters

  // State to manage wallet details
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const fetchWalletData = async () => {
      setLoading(true);
      setError(null);
      setWalletAddress(address);

      try {
        // Fetch balance and transactions from the backend
        const walletBalance = await blockchainService.getBalanceOfAddress(address);
        const walletTransactions = await blockchainService.getWalletTransactions(address);

        setBalance(walletBalance);
        setTransactions(walletTransactions);
      } catch (err) {
        console.error("Error fetching wallet data:", err);
        setError("Failed to fetch wallet data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [address]);

  if (loading) {
    return <p>Loading wallet details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container">
      <h1>Wallet details</h1>
      <p style={{ wordWrap: "break-word" }}>
        <strong>Address:</strong>
        <br />
        {walletAddress}
      </p>

      <p>
        <strong>Balance:</strong>
        <br />
        {balance}
      </p>

      <hr />

      <h1>Transactions</h1>
      {transactions.length === 0 ? (
        <p>This wallet has made no transactions (yet)</p>
      ) : (
        <TransactionsTable transactions={transactions} />
      )}
    </div>
  );
};

export default WalletBalance;
