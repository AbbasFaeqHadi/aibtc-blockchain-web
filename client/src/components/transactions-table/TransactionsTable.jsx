import "./TransactionsTable.css";
import { Link } from "react-router-dom";
import { useBlockchain } from "../../context/BlockchainContext";
import PropTypes from "prop-types";

/**
 * Renders a table of transactions, providing links to wallet details pages for 'from' and 'to' addresses.
 *
 * @param {Object} props - The properties object.
 * @param {Array} props.transactions - An array of transaction objects to display in the table.
 *
 * @returns {JSX.Element} A responsive table of transactions.
 */
const TransactionsTable = ({ transactions = [] }) => {
  const blockchainService = useBlockchain(); // Access blockchain service

  if (!transactions || transactions.length === 0) {
    return <p>No transactions to display.</p>;
  }
  
  return (
    <div className="table-responsive">
      <table className="table table-hover table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">From</th>
            <th scope="col">To</th>
            <th scope="col">Amount</th>
            <th scope="col">Timestamp</th>
            <th scope="col">Valid?</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={index}>
              <td>{index}</td>
              <td className="address-cell">
                {tx.fromAddress ? (
                  <>
                    <Link
                      to={`/wallet/${tx.fromAddress}`}
                      className="address-link"
                    >
                      {tx.fromAddress}
                    </Link>
                    {blockchainService.addressIsFromCurrentUser(
                      tx.fromAddress
                    ) && (
                      <span className="text-muted">
                        <br />
                        <small>(That&apos;s yours!)</small>
                      </span>
                    )}
                  </>
                ) : (
                  "System"
                )}
              </td>
              <td className="address-cell">
                {tx.toAddress ? (
                  <>
                    <Link
                      to={`/wallet/${tx.toAddress}`}
                      className="address-link"
                    >
                      {tx.toAddress}
                    </Link>
                    {blockchainService.addressIsFromCurrentUser(
                      tx.toAddress
                    ) && (
                      <span className="text-muted">
                        <br />
                        <small>(That&apos;s yours!)</small>
                      </span>
                    )}
                  </>
                ) : (
                  "N/A"
                )}
              </td>
              <td>
                {tx.amount}
                {tx.fromAddress === null && (
                  <span className="text-muted">
                    <br />
                    <small>(Block reward)</small>
                  </span>
                )}
              </td>
              <td>
                {tx.timestamp}
                <br />
                <span className="text-muted">
                  <small>{new Date(tx.timestamp).toLocaleString()}</small>
                </span>
              </td>
              <td className="validity-cell">{blockchainService.isTransactionValid(tx.hash) ? "✔️" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

TransactionsTable.propTypes = {
  transactions: PropTypes.array.isRequired,
};

export default TransactionsTable;
