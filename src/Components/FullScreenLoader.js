
function FullScreenLoader() {
  return (
    <div className="loader-overlay">
      <div className="loader-card">
        <div className="ring"></div>

        <div className="dots">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <p>Loading content</p>
      </div>
    </div>
  );
}

export default FullScreenLoader;
