import { useState, useEffect } from "react";
import blockchainService from "../../services/blockchainService";;
import Alert from "../../components/alert/Alert";
import TransactionsTable from "../../components/transactions-table/TransactionsTable";

const PendingTransactions = () => {
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [rewardingAddress, setRewardingAddress] = useState("");
  const [alert, setAlert] = useState({ show: false, title: "", message: "" });

  useEffect(() => {
    const fetchPendingTransactions = async () => {
      try {
        const transactions = await blockchainService.getPendingTransactions();
        setPendingTransactions(transactions);
      } catch (error) {
        console.error("Error fetching pending transactions:", error);
        setAlert({
          show: true,
          title: "Error",
          message: "Failed to fetch pending transactions.",
        });
      }
    };

    fetchPendingTransactions();
  }, []);

  const isAddressValid = (address) =>
    address &&
    /^[a-fA-F0-9]+$/.test(address) && // Check for hexadecimal format
    address.length >= 24 &&
    address.length <= 30;

  const minePendingTransactions = async () => {
    try {
      if (!isAddressValid(rewardingAddress)) {
        setAlert({
          show: true,
          title: "Invalid Rewarding Address",
          message:
            "Please provide a valid rewarding address",
        });
        return;
      }

      const miningResult = await blockchainService.minePendingTransactions(rewardingAddress);

      setAlert({
        show: true,
        title: miningResult.success ? "Success!" : "Mining issue",
        message: miningResult.message,
      });

      const transactions = await blockchainService.getPendingTransactions();
      setPendingTransactions(transactions);
    } catch (error) {
      console.error("Error mining transactions:", error);
      setAlert({
        show: true,
        title: "Error",
        message: "Failed to mine transactions.",
      });
    }
  };

  return (
    <div className="container mt-4">
      <h1>Pending transactions</h1>
      <p className="text-muted">
        These transactions are waiting to be included in the next block.
      </p>

      <TransactionsTable transactions={pendingTransactions} />

      <div className="form-group mt-3">
        <label htmlFor="rewardingAddress">Rewarding Address</label>
        <input
          type="text"
          className="form-control"
          id="rewardingAddress"
          value={rewardingAddress}
          onChange={(e) => setRewardingAddress(e.target.value)}
          placeholder="Enter the address to receive the mining reward"
        />
      </div>

      <button
        className="btn btn-primary mt-3"
        onClick={minePendingTransactions}
      >
        Start mining
      </button>

      <Alert
        show={alert.show}
        onClose={() => {
          setAlert({ ...alert, show: false });
        }}
        title={alert.title}
        message={alert.message}
      />
    </div>
  );
};

export default PendingTransactions;
