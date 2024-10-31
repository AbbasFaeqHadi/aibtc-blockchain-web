import "./Alert.css";
import PropTypes from "prop-types";

/**
 * Renders a custom alert modal.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.show - Whether to display the alert.
 * @param {function} props.onClose - Function to close the alert.
 * @param {string} props.title - Alert title text.
 * @param {string} props.message - Alert message text.
 * @returns {JSX.Element|null} The rendered alert or null if not visible.
 */
const Alert = ({ show, onClose, title, message }) => {
  if (!show) return null; // Don't render if alert is not shown.

  return (
    <div className="custom-alert-overlay">
      <div className="custom-alert-modal">
        <h2>{title}</h2>
        <div>{message}</div>
        <button onClick={onClose} className="btn btn-primary">
          OK
        </button>
      </div>
    </div>
  );
};

// Define prop types to ensure the component properly validates its inputs.
Alert.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
};

export default Alert;
