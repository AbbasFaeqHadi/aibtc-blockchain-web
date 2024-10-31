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
  const [difficulty, setDifficulty] = useState(1); // Initial default value
  const [miningReward, setMiningReward] = useState(100); // Initial default value
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
        setErrorMessage("Failed to fetch settings.");
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  /**
   * Handles the change of the mining difficulty input.
   *
   * @param {Object} event - The event object from the input change.
   */
  const handleDifficultyChange = async (event) => {
    const newDifficulty = parseInt(event.target.value, 10);
    setDifficulty(newDifficulty);

    try {
      await blockchainService.updateBlockchainSettings({
        difficulty: newDifficulty,
      });
    } catch (error) {
      console.error("Error updating difficulty:", error);
      setErrorMessage("Failed to update difficulty.");
    }
  };

  /**
   * Handles the change of the mining reward input.
   *
   * @param {Object} event - The event object from the input change.
   */
  const handleMiningRewardChange = async (event) => {
    const newMiningReward = parseInt(event.target.value, 10);
    setMiningReward(newMiningReward);

    try {
      await blockchainService.updateBlockchainSettings({
        miningReward: newMiningReward,
      });
    } catch (error) {
      console.error("Error updating mining reward:", error);
      setErrorMessage("Failed to update mining reward.");
    }
  };

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
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          <div className="form-group mt-4">
            <label>Difficulty</label>
            <input
              type="number"
              className="form-control"
              value={difficulty}
              onChange={handleDifficultyChange}
            />
            <small className="form-text text-muted">
              Difficulty controls how long the mining process takes. Higher
              numbers will make mining a lot slower!
              <br />
              Default: 1
            </small>
          </div>

          <div className="form-group mt-4">
            <label>Mining reward</label>
            <input
              type="number"
              className="form-control"
              value={miningReward}
              onChange={handleMiningRewardChange}
            />
            <small className="form-text text-muted">
              How much coins a miner receives for successfully creating a new
              block for the chain.
              <br />
              Default: 100
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
