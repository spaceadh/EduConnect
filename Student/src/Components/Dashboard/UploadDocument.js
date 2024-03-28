import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { ref, update } from 'firebase/database';
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import {toast} from 'react-toastify';

import { database,storage } from '../../firebase';
import { Card, CardContent, CardActions, Button, Divider, CircularProgress } from '@mui/material';
import UploadFile from '@mui/icons-material/UploadFile';
import './UploadDocument.css'; // Custom CSS for additional styling

const UploadDocument = ({ userData }) => {
  const [proposalFile, setProposalFile] = useState(null);
  const [srsFile, setSRSFile] = useState(null);
  const [sdsFile, setSDSFile] = useState(null);
  const [uploadUrl, setUploadUrl] = useState(''); // State variable for newly uploaded image URL
  const [implementationFile, setImplementationFile] = useState(null);
  const [testPlanFile, setTestPlanFile] = useState(null);
  const [finalDocumentFile, setFinalDocumentFile] = useState(null);
  const [acceptanceStatus, setAcceptanceStatus] = useState({
    proposal: 'Pending',
    srs: 'Pending',
    sds: 'Pending',
    implementation: 'Pending',
    testPlan: 'Pending',
    finalDocument: 'Pending'
  });
  const [isLoading, setIsLoading] = useState(false); // State variable for loading indicator
  const { studentId, fullname, lecturerId,groupName } = userData;

  useEffect(() => {
    const fetchAcceptanceStatus = async () => {
      const documentTypes = ['proposal', 'srs', 'sds', 'implementation', 'testPlan', 'finalDocument'];
  
      try {
        for (const documentType of documentTypes) {
          const url = "http://localhost:5001"
          const response = await axios.get(`${url}/api/retrieveDocStatus/${lecturerId}/${fullname}/${documentType}`);
          if (response.status === 200) {
            const { acceptanceStatus } = response.data; // Assuming your API response contains the acceptance status
            setAcceptanceStatus(prevStatus => ({
              ...prevStatus,
              [documentType]: acceptanceStatus
            }));
          } else {
            console.error(`Failed to fetch acceptance status for ${documentType}`);
            // Handle error if needed
          }
        }
      } catch (error) {
        console.error('Error fetching acceptance status:', error);
        // Handle error if needed
      }
    };
  
    fetchAcceptanceStatus();
  }, [lecturerId, fullname]);

  const handleFileChange = async (event, setter, documentType) => {
    const file = event.target.files[0];
    setter(file);
    handleUpload(file, documentType);
  };  

  const handleUpload = async (file, documentType) => {
    if (!file) return;

    setIsLoading(true); // Set loading state to true

    const imageRef = storageRef(storage, `documents/${lecturerId}/${fullname}/${documentType}`);
      
    uploadBytes(imageRef, file)
          .then((snapshot) => {
            getDownloadURL(snapshot.ref)
              .then((url) => {
                setUploadUrl(url);
                toast.success("Image uploaded successfully!");
                const docRef = ref(database, `Documents/${lecturerId}/${fullname}/${documentType}`);
                update(docRef, { url, acceptance: "Submitted" });
                console.log("Status Changed to submitter");

                // Update acceptance status locally
                setAcceptanceStatus(prevStatus => ({
                  ...prevStatus,
                  [documentType]: "Submitted"
                }));
              })
              .catch((error) => {
                console.error('Failed to get download URL:', error);
                toast.error('Failed to get download URL. Please try again later.');
              })
              .finally(() => {
                setIsLoading(false); // Set loading state to false when handling is done
              });
          })
          .catch((error) => {
            console.error('Failed to upload image:', error);
            toast.error('Failed to upload image. Please try again later.');
            setIsLoading(false); // Set loading state to false when handling is done
          });
  };

  return (
    <div className="upload-document-page">
      <div className="document-section">
      <Card className="document-card">
          <CardContent>
            <label htmlFor="proposal">Proposal</label>
            <input
              type="file"
              id="proposal"
              accept=".pdf" 
              onChange={(e) => handleFileChange(e, setProposalFile, 'proposal')}
              style={{ display: 'none' }} 
            />
            <label htmlFor="proposal">
              <Button variant="contained" component="span" startIcon={<UploadFile />}>
                Select PDF
              </Button>
            </label>
          </CardContent>
          <CardActions>
            {proposalFile && <CircularProgress size={24} className="upload-loader" />}
            <Divider />
            {isLoading ? (
              <CircularProgress size={24} className="upload-loader" />
            ) : (
              <p className="acceptance-status">Acceptance Status: {acceptanceStatus.proposal}</p>
            )}
          </CardActions>
        </Card>

         <Card className="document-card">
          <CardContent>
            <label htmlFor="srs">SRS</label>
            <input
              type="file"
              id="srs"
              accept=".pdf" 
              onChange={(e) => handleFileChange(e, setSRSFile, 'srs')}
              style={{ display: 'none' }} 
            />
            <label htmlFor="srs">
              <Button variant="contained" component="span" startIcon={<UploadFile />}>
                Select PDF
              </Button>
            </label>
          </CardContent>
          <CardActions>
            {srsFile && <CircularProgress size={24} className="upload-loader" />}
            <Divider />
            {isLoading ? (
              <CircularProgress size={24} className="upload-loader" />
            ) : (
              <p className="acceptance-status">Acceptance Status: {acceptanceStatus.srs}</p>
            )}
          </CardActions>
        </Card>

        <Card className="document-card">
          <CardContent>
            <label htmlFor="sds">SDS</label>
            <input
              type="file"
              id="sds"
              accept=".pdf" 
              onChange={(e) => handleFileChange(e, setSDSFile, 'sds')}
              style={{ display: 'none' }} 
            />
            <label htmlFor="sds">
              <Button variant="contained" component="span" startIcon={<UploadFile />}>
                Select PDF
              </Button>
            </label>
          </CardContent>
          <CardActions>
            {sdsFile && <CircularProgress size={24} className="upload-loader" />}
            <Divider />
            {isLoading ? (
              <CircularProgress size={24} className="upload-loader" />
            ) : (
              <p className="acceptance-status">Acceptance Status: {acceptanceStatus.sds}</p>
            )}
          </CardActions>
        </Card>
      </div>
      <div className="document-section">
       <Card className="document-card">
          <CardContent>
            <label htmlFor="implementation">Implementation</label>
            <input
              type="file"
              id="implementation"
              accept=".pdf" 
              onChange={(e) => handleFileChange(e, setImplementationFile, 'implementation')}
              style={{ display: 'none' }} 
            />
            <label htmlFor="implementation">
              <Button variant="contained" component="span" startIcon={<UploadFile />}>
                Select PDF
              </Button>
            </label>
          </CardContent>
          <CardActions>
            {implementationFile && <CircularProgress size={24} className="upload-loader" />}
            <Divider />
            {isLoading ? (
              <CircularProgress size={24} className="upload-loader" />
            ) : (
              <p className="acceptance-status">Acceptance Status: {acceptanceStatus.implementation}</p>
            )}
          </CardActions>
      </Card>
      <Card className="document-card">
          <CardContent>
            <label htmlFor="testPlan">Test Plan</label>
            <input
              type="file"
              id="testPlan"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, setTestPlanFile, 'testPlan')} 
              style={{ display: 'none' }} 
            />
            <label htmlFor="testPlan">
              <Button variant="contained" component="span" startIcon={<UploadFile />}>
                Select PDF
              </Button>
            </label>
          </CardContent>
          <CardActions>
            {testPlanFile && <CircularProgress size={24} className="upload-loader" />}
            <Divider />
            {isLoading ? (
              <CircularProgress size={24} className="upload-loader" />
            ) : (
              <p className="acceptance-status">Acceptance Status: {acceptanceStatus.testPlan}</p>
            )}
          </CardActions>
        </Card>

        <Card className="document-card">
          <CardContent>
            <label htmlFor="finalDocument">Final Document</label>
            <input
              type="file"
              id="finalDocument"
              accept=".pdf" 
              onChange={(e) => handleFileChange(e, setFinalDocumentFile, 'finalDocument')} 
              style={{ display: 'none' }} 
            />
            <label htmlFor="finalDocument">
              <Button variant="contained" component="span" startIcon={<UploadFile />}>
                Select PDF
              </Button>
            </label>
          </CardContent>
          <CardActions>
            {finalDocumentFile && <CircularProgress size={24} className="upload-loader" />}
            <Divider />
            {isLoading ? (
              <CircularProgress size={24} className="upload-loader" />
            ) : (
              <p className="acceptance-status">Acceptance Status: {acceptanceStatus.finalDocument}</p>
            )}
          </CardActions>
        </Card>
      </div>
    </div>
  );
};

export default UploadDocument;