import admin from 'firebase-admin';
import { firebaseDatabase } from '../dbfirebase.js'; // Adjust the path as needed

export const retrievePastMessage = async (req, res) => {
    try {  
        const { studentId, lecturerId } = req.params;

        // Retrieve past messages from Firebase Realtime Database
        const snapshot = await firebaseDatabase.ref(`messages/${studentId}/${lecturerId}`).once('value');
        const messages = snapshot.val() || [];
    
        // Send the messages as a response
        res.status(200).json({ messages });
    } catch (error) {
      console.error('Error in registerUserController:', error);
      return res.status(500).json({ error: 'Server Downtime 😭' });
    }
};

export const newMessage = async (req, res) => {
    try {
        const { studentId, lecturerId, message } = req.body;
    
        // Save the new message to Firebase Realtime Database
        await firebaseDatabase.ref(`messages/${studentId}/${lecturerId}`).push().set({
            senderId: studentId,
            text: message,
            timestamp: admin.database.ServerValue.TIMESTAMP
        });
        // Send success response
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};
