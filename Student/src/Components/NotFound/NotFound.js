import React from 'react';
import NotFoundImage from './notfound1.jpeg'; // Import your image file
import './NotFound.css'; // Import the CSS file


const NotFound = () => {
  return (
    <div className="not-found-container">
      <img src={NotFoundImage} alt="404 Not Found" className="not-found-image" />
      <div className="not-found-text">
        <h2>404 Not Found</h2>
        <p>Sorry, You must have details from the scanned application to access the site</p>
      </div>
    </div>
  );
};

export default NotFound;
