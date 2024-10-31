import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import BlockchainViewer from "./pages/blockchain-viewer/BlockchainViewer";
import { BlockchainProvider } from "./context/BlockchainContext";
import Settings from "./pages/settings/Settings";
import CreateTransaction from "./pages/create-transaction/CreateTransaction";
import PendingTransactions from "./pages/pending-transactions/PendingTransactions";
import WalletBalance from "./pages/wallet-balance/WalletBalance";
import CreateWallet from "./pages/create-wallet/CreateWallet";

/**
 * App component serves as the root component of the application.,
 * providing global state management with BlockchainProvider and
 * setting upp routes for different views/pages using React Router.
 *
 * @component
 * @returns {JSX.Element} The rendered component for the app.
 */
const App = () => {
  return (
    <BlockchainProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Display blocks on chain at the root URL */}
          <Route path="/" element={<BlockchainViewer />} />

          {/* Display settings at the '/settings' URL */}
          <Route path="/settings" element={<Settings />} />

          {/* Display create transaction at the '/new/transaction' URL */}
          <Route path="/new/transaction" element={<CreateTransaction />} />

          {/* Display pending transactions at the '/new/transaction/pending' URL */}
          <Route
            path="/new/transaction/pending"
            element={<PendingTransactions />}
          />

          {/* Display wallet balance at the '/wallet/:address' URL */}
          <Route path="/wallet/:address" element={<WalletBalance />} />

          {/* Create wallet at the '/create/wallet' URL */}
          <Route path="/create/wallet" element={<CreateWallet />} />
        </Routes>
      </Router>
    </BlockchainProvider>
  );
};

export default App;
