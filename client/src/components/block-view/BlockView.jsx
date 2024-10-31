import "./BlockView.css";
import PropTypes from "prop-types";

/**
 * Renders a card displaying information about a single block in the blockchain.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.block - The block data object.
 * @param {function} props.onClick - Function to handle the click event on the block.
 * @param {boolean} props.isSelected - Indicates if the block is currently selected.
 * @returns {JSX.Element} The rendered block view card.
 */
const BlockView = ({ block, onClick, isSelected }) => {
  // Check if the block is the genesis block.
  // Based on preference, the genesis block may be initialized as a null value or "0".
  const isGenesisBlock = block.previous_hash == null || block.previous_hash === "0";

  return (
    <div className={`card ${isSelected ? "selected" : ""}`} onClick={onClick}>
      <div className="card-body">
        <h5 className="card-title">
          Block {block.index}
          {isGenesisBlock && (
            <small className="text-muted"> (Genesis block)</small>
          )}
        </h5>
      </div>

      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <span>Hash</span>
          <br />
          <div
            className="text-truncate"
            style={{ color: `#${block.hash.substring(0, 6)}` }}
          >
            <small>{block.hash}</small>
          </div>
          <br />
          <span>Hash of previous block</span>
          <br />

          {isGenesisBlock ? (
            <div className="text-truncate" style={{ color: "#000" }}>
              <small>Null/0</small>
            </div>
          ) : (
            <div
              className="text-truncate"
              style={{ color: `#${block.previous_hash.substring(0, 6)}` }}
            >
              <small>{block.previous_hash}</small>
            </div>
          )}
        </li>

        <li className="list-group-item">
          <span>Nonce</span>
          <br />
          <div className="text-truncate text-muted">
            <small>{block.nonce}</small>
          </div>
        </li>

        <li className="list-group-item">
          <span>Merkle Root</span>
          <br />
          <div
            className="text-truncate"
            style={{ color: `#${block.merkle_root.substring(6, 12)}` }}
          >
            <small>{block.merkle_root}</small>
          </div>
        </li>

        <li className="list-group-item">
          <span>Timestamp</span>
          <br />
          <div className="text-truncate text-muted">
            <small>{block.timestamp}</small>
          </div>
        </li>
      </ul>
    </div>
  );
};

BlockView.propTypes = {
  block: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

export default BlockView;
