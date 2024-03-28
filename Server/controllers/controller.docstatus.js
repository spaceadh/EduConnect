import admin from 'firebase-admin';
import { firebaseDatabase } from '../dbfirebase.js'; // Adjust the path as needed

export const retrieveDocStatus = async (req, res) => {
    try {  
        const { fullname, lecturerId,documentType } = req.params;
        // Retrieve acceptance status from Firebase Realtime Database
        const snapshot = await firebaseDatabase.ref(`Documents/${lecturerId}/${fullname}/${documentType}`).once('value');
        // console.log(snapshot);
        const acceptanceStatus = snapshot.val()?.acceptance || 'Pending'; // Default to 'Pending' if acceptance status is not found
        // Send the acceptance status as a response
        res.status(200).json({ acceptanceStatus }); 
    } catch (error) {
      console.error('Error in registerUserController:', error);
      return res.status(500).json({ error: 'Server Downtime 😭' });
    }
};

export const lecturerDocuments = async (req, res) => {
  try {
    const { fullname, lecturerId } = req.params;
    // Retrieve documents for the specified lecturerId from Firebase Realtime Database
    const snapshot = await firebaseDatabase.ref(`Documents/${lecturerId}`).once('value');
    const documents = snapshot.val(); // Get the documents data
    
    // Check if documents exist
    if (documents) {
      res.status(200).json({ documents });
    } else {
      res.status(404).json({ error: 'Documents not found' });
    }
  } catch (error) {
    console.error('Error in lecturerDocuments:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


export const updateAcceptance = async (req, res) => {
  try {
    const { studentId, lecturerId, docType } = req.params;
    const { acceptance } = req.body; // Retrieve new acceptance status from request body
    
    // Update the acceptance status in the database
    await firebaseDatabase.ref(`Documents/${lecturerId}/${studentId}/${docType}`).update({ acceptance });
    
    // Send a success response to the client
    res.status(200).json({ message: 'Acceptance status updated successfully' });
  } catch (error) {
    console.error('Error in updateAcceptance:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
