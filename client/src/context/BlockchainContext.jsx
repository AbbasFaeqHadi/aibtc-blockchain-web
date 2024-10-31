import { createContext, useContext } from "react";
import BlockchainService from "../services/blockchainService";
import PropTypes from "prop-types";

/**
 * Context object for BlockchainService.
 *
 * Provides access to blockchain data and functionality across the app.
 * @type {React.Context}
 */
const BlockchainContext = createContext();

/**
 * Provider component for BlockchainContext.
 * This should wrap the parts of the app that need access to the blockchain data.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child components that will have access to the blockchain context.
 *
 * @returns {JSX.Element} The provider component for BlockchainContext.
 */
const BlockchainProvider = ({ children }) => (
  <BlockchainContext.Provider value={BlockchainService}>
    {children}
  </BlockchainContext.Provider>
);

BlockchainProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Customer hook to access BlockchainService from any functional component.
 *
 * @returns {Object} The blockchainService instance for accessing blockchain data and functionality.
 */
const useBlockchain = () => useContext(BlockchainContext);

export { BlockchainProvider, useBlockchain };
