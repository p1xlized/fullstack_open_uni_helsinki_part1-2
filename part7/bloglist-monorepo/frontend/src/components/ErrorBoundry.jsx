import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{ padding: "20px", border: "1px solid red", margin: "20px" }}
        >
          <h2>Something went wrong.</h2>
          <p>
            A rendering exception occurred inside the application view layer.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
