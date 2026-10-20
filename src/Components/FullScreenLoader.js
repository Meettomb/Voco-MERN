
function FullScreenLoader({
  message = "Loading...",
  subtitle = ""
}) {
  return (
    <div className="loader-overlay">
      <div className="loader-card">
        <div className="ring"></div>

        <div className="dots">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <h3 className="loader-title">{message}</h3>

        {subtitle && (
          <p className="loader-subtitle">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

export default FullScreenLoader;
