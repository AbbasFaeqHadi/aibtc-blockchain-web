import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logo.svg";

/**
 * Renders the main navigation bar of the application
 *
 * @returns {JSX.Element} The renderd navigation bar with links to different routes.
 */
function Navbar() {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <div>
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Savjee Logo" className="navbar-logo" />
          AIBTC
        </Link>
      </div>

      <div>
        <Link className="btn btn-outline-light" to="/create/wallet">
          Create wallet
        </Link>
        <Link className="btn btn-outline-light" to="/settings">
          Settings
        </Link>
        <Link
          className="btn btn-outline-light"
          id="new-transaction"
          to="/new/transaction"
        >
          Create transaction
        </Link>
        <Link className="btn btn-outline-light" to="/new/transaction/pending">
          Pending transactions
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
