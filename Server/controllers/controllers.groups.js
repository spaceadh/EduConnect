import admin from 'firebase-admin';
import { firebaseDatabase } from '../dbfirebase.js'; // Adjust the path as needed

export const groupretrievePastMessage = async (req, res) => {
    try {
        const { lecturerId } = req.params;

        // Fetch past messages from the database
        const pastMessages = await fetchPastMessagesFromDatabase(lecturerId);

        // Send the messages as a response
        res.status(200).json({ messages: pastMessages });
    } catch (error) {
        console.error('Error retrieving past messages:', error);
        return res.status(500).json({ error: 'Failed to retrieve past messages' });
    }
};

export const groupnewMessage = async (req, res) => {
    try {
        const { studentId, lecturerId, message } = req.body;
        
        // Save the new message to the database
        await saveMessageToDatabase(lecturerId, studentId, message);

        // Send success response
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

// Function to fetch past messages from the database
const fetchPastMessagesFromDatabase = async (lecturerId) => {
    const snapshot = await firebaseDatabase.ref(`groups/${lecturerId}/messages`).once('value');
    const messages = snapshot.val() || [];
    
    // Return the fetched messages
    return messages;
};

// Function to save a new message to the database
const saveMessageToDatabase = async (lecturerId, studentId, message) => {
    // Save the new message to Firebase Realtime Database
    await firebaseDatabase.ref(`groups/${lecturerId}/messages`).push().set({
        senderId: studentId,
        text: message,
        timestamp: admin.database.ServerValue.TIMESTAMP
    });
};