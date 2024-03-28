import React from 'react';
import { useLocation } from 'react-router-dom';
import NotFoundImage from './successPage.jpg';
import './SuccessPage.css';

const SuccessPage = () => {
  const location = useLocation();
  const extractedDetails = location.state?.extractedDetails;

  const { unitCode, venue, formattedDate, formattedTime, lecturersUserId } = extractedDetails || {};

  return (
    <div className="not-found-container">
      <img src={NotFoundImage} alt="404 Not Found" className="not-found-image" />
      <div className="not-found-text">
        <h2>Successfully Marked Attendance for {unitCode}</h2>
        <p>
          on {formattedDate} at {formattedTime}, held in the venue {venue}. Thank you for using Tranquil QRCode Scanner.
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;
