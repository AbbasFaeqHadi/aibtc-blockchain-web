import { useState, useEffect } from "react";
import blockchainService from "../../services/blockchainService";

/**
 * Settings component allows users to adjust blockchain difficulty
 * and mining reward settings.
 *
 * @component
 * @returns {JSX.Element} The rendered component for settings form.
 */
const Settings = () => {
  const defaultDifficulty = 1;
  const defaultMiningReward = 100;

  const [difficulty, setDifficulty] = useState(defaultDifficulty); 
  const [miningReward, setMiningReward] = useState(defaultMiningReward);
  const [isLoading, setIsLoading] = useState(false);
  const [difficultyError, setDifficultyError] = useState("");
  const [miningRewardError, setMiningRewardError] = useState("");

  // Fetch the current settings from the backend when the component mounts
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const settings = await blockchainService.getBlockchainSettings();
        setDifficulty(settings.difficulty);
        setMiningReward(settings.miningReward);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching blockchain settings:", error);
        setDifficultyError("Failed to fetch difficulty setting.");
        setMiningRewardError("Failed to fetch mining reward setting.");
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  /**
   * Validates if the value is a valid integer.
   * 
   * @param {string} value - The input value to validate.
   * @returns {boolean} - True if the value is a valid integer, false otherwise.
   */
  const isValidInteger = (value) => {
    return Number.isInteger(parseInt(value, 10)) && /^\d+$/.test(value);
  };

  // Debounce effect for difficulty
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isValidInteger(difficulty)) {
        setDifficultyError("Please enter a valid integer for difficulty.");
      } else {
        setDifficultyError(""); // Clear error if valid
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [difficulty]);

  // Debounce effect for miningReward
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isValidInteger(miningReward)) {
        setMiningRewardError("Please enter a valid integer for mining reward.");
      } else {
        setMiningRewardError(""); // Clear error if valid
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [miningReward]);

  /**
   * Handles the change of the mining difficulty input.
   *
   * @param {Object} event - The event object from the input change.
   */
  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value); // Set directly without parsing
  };

  /**
   * Handles the change of the mining reward input.
   *
   * @param {Object} event - The event object from the input change.
   */
  const handleMiningRewardChange = (event) => {
    setMiningReward(event.target.value); // Set directly without parsing here
  };

  const saveSettings = async (updatedDifficulty, updatedMiningReward) => {
    try {
      await blockchainService.updateBlockchainSettings({
        difficulty: parseInt(updatedDifficulty, 10),
        miningReward: parseInt(updatedMiningReward, 10),
      });
    } catch (error) {
      console.error("Error updating blockchain settings:", error);
      setDifficultyError("Failed to save difficulty.");
      setMiningRewardError("Failed to save mining reward.");
    }
  };

  useEffect(() => {
    if (isValidInteger(difficulty) && isValidInteger(miningReward)) {
      saveSettings(difficulty, miningReward);
    }
  }, [difficulty, miningReward]);

  return (
    <div className="container mt-4">
      <h1>Settings</h1>
      <p>
        Control how the blockchain behaves when new transactions or blocks are
        created. Changes are automatically saved.
      </p>

      {isLoading ? (
        <p>Loading settings...</p>
      ) : (
        <div>
          <div className="form-group mt-4">
            <label>Difficulty</label>
            <input
              type="text"
              className="form-control"
              value={difficulty}
              onChange={handleDifficultyChange}
            />
            {difficultyError && <p style={{ color: "red" }}>{difficultyError}</p>}
            <small className="form-text text-muted">
              Difficulty controls how long the mining process takes. Higher
              numbers will make mining a lot slower!
              <br />
              Default: {defaultDifficulty}
            </small>
          </div>

          <div className="form-group mt-4">
            <label>Mining reward</label>
            <input
              type="text"
              className="form-control"
              value={miningReward}
              onChange={handleMiningRewardChange}
            />
            {miningRewardError && <p style={{ color: "red" }}>{miningRewardError}</p>}
            <small className="form-text text-muted">
              How much coins a miner receives for successfully creating a new
              block for the chain.
              <br />
              Default: {defaultMiningReward}
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
