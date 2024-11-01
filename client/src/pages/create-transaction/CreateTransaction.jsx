import { useState } from "react";
import { ec as EC } from "elliptic";
import blockchainService from "../../services/blockchainService";
import Alert from "../../components/alert/Alert";
const ec = new EC("secp256k1");

const CreateTransaction = () => {
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [alert, setAlert] = useState({ show: false, title: "", message: "" });

  const handleTransactionCreation = async () => {
    if (!privateKey || !fromAddress || !toAddress || !amount) {
      setAlert({
        show: true,
        title: "Error",
        message: "All fields are required.",
      });
      return;
    }

    if (!isAddressValid(fromAddress) || !isAddressValid(toAddress)) {
      setAlert({
        show: true,
        title: "Error",
        message: "Invalid address format.",
      });
      return;
    }

    if (fromAddress === toAddress) {
      setAlert({
        show: true,
        title: "Error",
        message: "From address and To address cannot be the same.",
      });
      return;
    }

    const keyPair = ec.keyFromPrivate(privateKey);
    const publicKey = keyPair.getPublic("hex");
    const derivedAddress = await deriveAddressFromPublicKey(publicKey);

    if (derivedAddress !== fromAddress) {
      setAlert({
        show: true,
        title: "Error",
        message: "Private key does not match the provided address.",
      });
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setAlert({
        show: true,
        title: "Error",
        message: "Invalid transaction amount.",
      });
      return;
    }

    const senderBalance = await blockchainService.getBalanceOfAddress(
      fromAddress
    );
    if (parseFloat(senderBalance) < amountNum) {
      setAlert({ show: true, title: "Error", message: "Insufficient funds." });
      return;
    }

    // Determine if there is an origin transaction for related transactions
    const latestTransaction =
      await blockchainService.getLatestTransactionForAddress(fromAddress);
    const originTransactionHash = latestTransaction
      ? latestTransaction.originTransactionHash || latestTransaction.hash
      : null;

    const tx = {
      fromAddress,
      toAddress,
      amount: amountNum.toFixed(8), // Ensure consistent decimal format
      originTransactionHash,
      timestamp: Date.now(),
    };

    tx.hash = await calculateTransactionHash(tx);
    tx.signature = keyPair.sign(tx.hash).toDER("hex");
    tx.publicKey = publicKey;

    await blockchainService.addTransaction(tx);

    setAlert({
      show: true,
      title: "Success",
      message: "Transaction created and submitted.",
    });
    resetForm();
  };

  const isAddressValid = (address) =>
    address && address.length >= 24 && address.length <= 30;

  const hexStringToUint8Array = (hex) => {
    // Create a Uint8Array with a length half the hex string length
    // since each byte is represented by 2 hex characters
    const uint8Array = new Uint8Array(hex.length / 2); // Uint8 = 1 byte = 2 hex characters

    // Loop through the hex string, taking 2 characters (1 byte) at a time
    for (let i = 0; i < hex.length; i += 2) {
      // To Convert hex to decimal, parse hex character pairs as an int with base 16
      uint8Array[i / 2] = parseInt(hex.substr(i, 2), 16); 
    }
    return uint8Array; // The Uint8Array representation of the hex string
  };

  const deriveAddressFromPublicKey = async (publicKey) => {
    const publicKeyArray = hexStringToUint8Array(publicKey);
    const hashBuffer = await window.crypto.subtle.digest(
      "SHA-256",
      publicKeyArray
    );
    const hashHex = Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    return hashHex.slice(0, 30); // Truncate as needed
  };

  const calculateTransactionHash = async (transaction) => {
    const encoder = new TextEncoder();
    const originTxHashStr = transaction.originTransactionHash || ""; // If null, set to empty string

    const data = encoder.encode(
      transaction.fromAddress +
        transaction.toAddress +
        transaction.amount +
        originTxHashStr +
        transaction.timestamp
    );

    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashHex = Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    return hashHex;
  };

  const resetForm = () => {
    setFromAddress("");
    setToAddress("");
    setAmount("");
    setPrivateKey("");
  };

  return (
    <div className="container mt-4">
      <h1>Create Transaction</h1>
      <p>Transfer some money to someone securely!</p>

      <div className="form-group mt-3">
        <label htmlFor="fromAddress">From Address</label>
        <input
          type="text"
          className="form-control"
          id="fromAddress"
          value={fromAddress}
          onChange={(e) => setFromAddress(e.target.value)}
        />
        <small className="form-text text-muted">
          This is the address from which the transaction will be sent.
        </small>
      </div>

      <div className="form-group mt-3">
        <label htmlFor="privateKey">Your Private Key (Will not be sent)</label>
        <input
          type="text"
          className="form-control"
          id="privateKey"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
        />
        <small className="form-text text-muted">
          Your private key will be used to derive the public key and sign the
          transaction locally.
        </small>
      </div>

      <div className="form-group mt-3">
        <label htmlFor="toAddress">To Address</label>
        <input
          type="text"
          className="form-control"
          id="toAddress"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
        />
      </div>

      <div className="form-group mt-3">
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          className="form-control"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <button
        onClick={handleTransactionCreation}
        className="btn btn-primary mt-3"
      >
        Sign & Create Transaction
      </button>

      <Alert
        show={alert.show}
        onClose={() => setAlert({ show: false })}
        {...alert}
      />
    </div>
  );
};

export default CreateTransaction;
