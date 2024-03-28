import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function extractDetailsFromUrl(url) {
  const urlParts = new URL(url);
  const pathSegments = urlParts.pathname.split('/').filter(segment => segment !== '');

  if (pathSegments.length === 5) {
    const [unitCode, venue, formattedDate,formattedTime, lecturersUserId] = pathSegments;
    return {
      unitCode,
      venue,
      formattedDate,
      formattedTime,
      lecturersUserId,
    };
  } else {
    console.error('Invalid URL structure');
    toast.error('Invalid URL structure. Please access the portal from the QR Code.', {
      position: toast.POSITION.TOP_RIGHT,
    });
    return null;
  }
}

function hasValidDetails(extractedDetails) {
  return extractedDetails && extractedDetails.unitCode && 
  extractedDetails.venue && extractedDetails.formattedDate && 
  extractedDetails.formattedTime &&
  extractedDetails.lecturersUserId;
}
  
function DecisionMaker() {
    const [extractedDetails, setExtractedDetails] = useState(null);
    const navigate = useNavigate();

  useEffect(() => {
    console.log('DecisionMaker useEffect is running');

    const currentUrl = window.location.href;
    const extractedDetails = extractDetailsFromUrl(currentUrl);
    setExtractedDetails(extractedDetails);

    console.log('Current URL:', currentUrl);
    console.log('Extracted Details:', extractedDetails);

    if (hasValidDetails(extractedDetails)) {
      // If details are valid, navigate to LoginPage
      sessionStorage.setItem('extractedDetails', JSON.stringify(extractedDetails));
      console.log("Extracted Details in storage:",extractedDetails);
      toast.success('URL details found. Redirecting to login...', {
        position: toast.POSITION.TOP_RIGHT,
      });

      console.log('Navigating to /login');

      // Pass the extractedDetails as state to the login route
      navigate('/login', { state: { extractedDetails } });
    } else {
      // If details are not valid, navigate to NotFound
      toast.error('Invalid URL details. Redirecting to not found page.', {
        position: toast.POSITION.TOP_RIGHT,
      });
      //navigate('/login');
      navigate('/not-found');
    }
  }, [navigate]);

  return <div>Loading...</div>;
}

export default DecisionMaker;
