import { useState } from "react";
import { ec as EC } from "elliptic";

const ec = new EC("secp256k1");

const CreateWallet = () => {
  const [wallet, setWallet] = useState(null);

  const hexStringToUint8Array = (hex) => {
    const uint8Array = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      uint8Array[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return uint8Array;
  };

  const createNewWallet = async () => {
    const keyPair = ec.genKeyPair();
    const privateKey = keyPair.getPrivate("hex");
    const publicKey = keyPair.getPublic("hex");

    // Convert the public key to a Uint8Array and hash it using the Web Crypto API
    const publicKeyBuffer = hexStringToUint8Array(publicKey);
    const hashBuffer = await crypto.subtle.digest("SHA-256", publicKeyBuffer);

    // Convert the hash to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    // Truncate the hash to create a shorter address
    const shortAddress = hashHex.slice(0, 30); // Adjust length as needed

    // Save the public key to localStorage
    localStorage.setItem("publicKey", publicKey);

    setWallet({
      privateKey,
      publicKey,
      address: shortAddress,
    });
  };

  return (
    <div className="container mt-4">
      <h1>Create New Wallet</h1>
      <button onClick={createNewWallet} className="btn btn-primary">
        Generate Wallet
      </button>

      {wallet && (
        <div className="mt-4">
          <h3>Your Wallet:</h3>
          <p>
            <strong>Public key:</strong> {wallet.publicKey}
          </p>
          <p>
            <strong>Private Key:</strong> {wallet.privateKey}
          </p>
          <p>
            <strong>Address:</strong> {wallet.address}
          </p>
          <p>
            Save your private key securely. You will need it to sign transactions.
          </p>
        </div>
      )}
    </div>
  );
};

export default CreateWallet;
