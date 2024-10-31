// Changed
import { useState, useEffect } from "react";
import BlockView from "../../components/block-view/BlockView";
import TransactionsTable from "../../components/transactions-table/TransactionsTable";
import blockchainService from "../../services/blockchainService";
import "./BlockchainViewer.css";

/**
 * Component that displays a list of blocks in the blockchain
 * and shows transactions within a selected block.
 *
 * @Component
 * @returns {JSX.Element} The rendered blockchain viewer.
 */
const BlockchainViewer = () => {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const fetchedBlocks = await blockchainService.getBlocks();
        setBlocks(fetchedBlocks);
        setSelectedBlock(fetchedBlocks[0]); // Select the first block by default
      } catch (error) {
        console.error("Error fetching blocks:", error);
      }
    };

    fetchBlocks();
  }, []);

  const showTransactions = (block) => {
    setSelectedBlock(block);
  };

  return (
    <div className="container">
      <h1>Blocks on chain</h1>
      <p>
        Each card represents a block on the chain. Click on a block to see the
        transactions stored inside.
      </p>

      <div className="container container-blocks">
        {blocks.map((block, index) => (
          <BlockView
            key={index}
            block={block}
            onClick={() => showTransactions(block)}
            isSelected={block === selectedBlock}
          />
        ))}
      </div>

      <br />
      <br />

      <div className="container">
        <h1>Transactions inside block</h1>
        <TransactionsTable
          transactions={selectedBlock ? selectedBlock.transactions : []}
        />
      </div>
    </div>
  );
};

export default BlockchainViewer;
