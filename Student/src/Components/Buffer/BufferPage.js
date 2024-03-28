// BufferPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BufferPage.css'; // Import the CSS file


const BufferPage = ({ extractedDetails }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Redirect to the home page after 5 seconds
      navigate('/home', { state: { extractedDetails } });
    }, 5000);

    // Clear the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, [navigate, extractedDetails]);

  return (
    <div className="buffer-container">
      <h1>Buffer Page</h1>
      <div className="toast-message">Redirecting to Home Page...</div>
      {/* You can display any additional information or components here */}
    </div>
  );
};

export default BufferPage;
