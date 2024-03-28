import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './doc.css';
import { AiOutlineLoading } from 'react-icons/ai'; // Import loading icon

const DocumentViewer = ({ userData }) => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // State variable for loading indicator

  const { lecturerId } = userData;

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true); // Set loading state to true
      try {
        const url = `http://localhost:5001/api/retrievedocstatus/${lecturerId}`;
        const response = await axios.get(`${url}`);
        const { documents } = response.data;
        setDocuments(documents);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setIsLoading(false); // Set loading state to false when fetching is done
      }
    };

    fetchDocuments();
  }, [lecturerId]);

  const handleAccept = async (studentId, docType) => {
    setIsLoading(true); // Set loading state to true
    try {
      await axios.put(`http://localhost:5001/api/updateAcceptance/${lecturerId}/${studentId}/${docType}`, { acceptance: "Accepted" });
      updateAcceptanceLocally(studentId, docType, "Accepted"); // Update acceptance status locally
    } catch (error) {
      console.error('Error accepting document:', error);
    } finally {
      setIsLoading(false); // Set loading state to false when handling is done
    }
  };
  
  const handleDecline = async (studentId, docType) => {
    setIsLoading(true); // Set loading state to true
    try {
      await axios.put(`http://localhost:5001/api/updateAcceptance/${lecturerId}/${studentId}/${docType}`, { acceptance: "Declined" });
      updateAcceptanceLocally(studentId, docType, "Declined"); // Update acceptance status locally
    } catch (error) {
      console.error('Error declining document:', error);
    } finally {
      setIsLoading(false); // Set loading state to false when handling is done
    }
  };

  const updateAcceptanceLocally = (studentId, docType, acceptance) => {
    // Update acceptance status locally
    setDocuments(prevDocuments => {
      const updatedDocuments = { ...prevDocuments };
      updatedDocuments[studentId][docType].acceptance = acceptance;
      return updatedDocuments;
    });
  };

  const handleDownload = (url) => {
    // Implement logic to download document
    window.open(url, '_blank');
  };

  return (
    <div>
      {isLoading && <AiOutlineLoading className="loading-icon" />} {/* Show loading icon if loading */}
      {Object.entries(documents).map(([studentId, studentDocs]) => (
        <div key={studentId} className="card">
          <h3 className="student-name">Student: {studentId}</h3>
          {Object.entries(studentDocs).map(([docType, document]) => (
            <div key={docType} className="document-card">
              <h4 className="document-type">{docType} Document</h4>
              <p className="acceptance-status">Acceptance: {document.acceptance}</p>
              <div className="button-container">
                <button className="accept" onClick={() => handleAccept(studentId, docType)}>Accept</button>
                <button className="decline" onClick={() => handleDecline(studentId, docType)}>Decline</button>
                <button className="download" onClick={() => handleDownload(document.url)}>Download</button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DocumentViewer;