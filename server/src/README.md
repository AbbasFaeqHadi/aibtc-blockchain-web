# MySQL Database Setup Instructions for AIBTC Blockchain Platform

Follow these instructions to create a MySQL database and the necessary tables to run the AIBTC Blockchain platform.

## Prerequisites

- MySQL Workbench 8.0 CE (or another MySQL client). These instructions use MySQL Workbench 8.0 CE.

## Step 1: Open MySQL Workbench

1. Launch MySQL Workbench 8.0 CE.
2. Connect to your MySQL server using your username and password.

## Step 2: Create the Database and Tables

1. Once connected, open a new SQL editor window.
2. Copy the SQL code below and paste it into the SQL editor window.
3. Run the code to create the database and tables.
4. Refresh by pressing the circular arrows at the left right sidebar.
5. Ensure that the database and tables are created.
6. Set the db.js file to match your MySQL Workbench settings, including username, password, and other properties

```sql
-- SQL script to create the AIBTC blockchain database and tables
CREATE DATABASE IF NOT EXISTS blockchain;
USE blockchain;

CREATE TABLE blocks (
  hash VARCHAR(64) PRIMARY KEY,
  previous_hash VARCHAR(64) NULL, 
  timestamp BIGINT,
  nonce INT,
  difficulty INT,
  merkle_root VARCHAR(64),
  `index` INT UNIQUE, -- Escaped using backticks
  origin_transaction_hash VARCHAR(64) NULL,
  FOREIGN KEY (previous_hash) REFERENCES blocks(hash) ON DELETE CASCADE,
  INDEX idx_previous_hash (`previous_hash`),
  INDEX idx_index (`index`)
);

CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hash VARCHAR(64) UNIQUE,
  from_address VARCHAR(66),
  to_address VARCHAR(66),
  amount DECIMAL(20, 8),
  origin_transaction_hash VARCHAR(64) NULL,
  timestamp BIGINT,
  signature TEXT,
  block_hash VARCHAR(64) NULL,
  public_key VARCHAR(130),
  index_in_block INT, -- Replace semicolon with comma here
  FOREIGN KEY (block_hash) REFERENCES blocks(hash) ON DELETE SET NULL,
  INDEX idx_block_hash (block_hash),
  INDEX idx_from_address (from_address),
  INDEX idx_to_address (to_address)
);

CREATE TABLE pending_transactions (
  hash VARCHAR(64) PRIMARY KEY,
  from_address VARCHAR(66),
  to_address VARCHAR(66),
  amount DECIMAL(20, 8),
  timestamp BIGINT,
  signature TEXT,
  origin_transaction_hash VARCHAR(64),
  INDEX idx_origin_transaction_hash (origin_transaction_hash)
);

CREATE TABLE merkle_nodes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  block_hash VARCHAR(64),
  node_level INT,
  node_index INT,
  node_value VARCHAR(64),
  FOREIGN KEY (block_hash) REFERENCES blocks(hash) ON DELETE CASCADE,
  INDEX idx_block_hash_node (block_hash, node_level, node_index)
);

CREATE TABLE merkle_proof_paths (
  id INT AUTO_INCREMENT PRIMARY KEY,
  block_hash VARCHAR(64),
  transaction_hash VARCHAR(64),
  proof_path TEXT,
  FOREIGN KEY (block_hash) REFERENCES blocks(hash) ON DELETE CASCADE,
  FOREIGN KEY (transaction_hash) REFERENCES transactions(hash) ON DELETE CASCADE,
  INDEX idx_transaction_hash (transaction_hash)
);

CREATE TABLE address_balances (
  address VARCHAR(66) PRIMARY KEY,
  balance DECIMAL(20, 8)
);
