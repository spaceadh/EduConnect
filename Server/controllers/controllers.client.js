import admin from 'firebase-admin';
import axios from 'axios';
import { firebaseDatabase } from '../dbfirebase.js'; // Adjust the path as needed

const assignLecturer = async () => {
  try {
    // Fetch all lecturers from the database
    const lecturersSnapshot = await firebaseDatabase.ref('lecturers').once('value');
    const lecturers = lecturersSnapshot.val();

    // Find the lecturer with the minimum number of students
    let minStudents = Infinity;
    let chosenLecturerId = null;
    let chosenLecturerName = null;

    Object.keys(lecturers).forEach(lecturerId => {
      const numStudents = Object.keys(lecturers[lecturerId].students || {}).length;
      if (numStudents < minStudents) {
        minStudents = numStudents;
        chosenLecturerId = lecturerId;
        chosenLecturerName = lecturers[lecturerId].name; // Retrieve lecturer's name
      }
    });

    // If all lecturers have the same number of students, randomly select one
    if (!chosenLecturerId) {
      const lecturerIds = Object.keys(lecturers);
      chosenLecturerId = lecturerIds[Math.floor(Math.random() * lecturerIds.length)];
      chosenLecturerName = lecturers[chosenLecturerId].name; // Retrieve lecturer's name
    }

    // Return the chosen lecturer ID and name
    return { lecturerId: chosenLecturerId, lecturerName: chosenLecturerName };
  } catch (error) {
    console.error('Error assigning lecturer:', error);
    throw error;
  }
};

const AddLecturerController = async (req, res) => {
  try {
    const { firstname, lastname, levelofeducation, email, password } = req.body;

    const name = firstname + ' ' + lastname;
    // Create user with email and password
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name
    });

    // Store user data in Realtime Database
    const lecturerData = {
      lecturerId: userRecord.uid,
      firstname,
      lastname,
      name,
      levelofeducation,
      email
    };

    await firebaseDatabase.ref(`lecturers/${userRecord.uid}`).set(lecturerData);

    // Create a group for the lecturer
    const groupName = `${name} Group`;
    await firebaseDatabase.ref(`groups/${userRecord.uid}`).set({
      groupName
    });

    return res.status(201).json({ message: 'Lecturer added successfully', lecturer: lecturerData });
  } catch (error) {
    console.error('Error in AddLecturerController:', error);
    return res.status(500).json({ error: 'Server Downtime 😭' });
  }
};
const registerUserController = async (req, res) => {
  try {
    const { username, firstname, lastname, regno, email, password } = req.body;

    const fullname = firstname + ' ' + lastname;
    // Create user with email and password
    const userRecord = await admin.auth().createUser({
      email,
      password,
      fullname,
      displayName: username
    });

    // Send email verification
    // await admin.auth().sendEmailVerification(userRecord.uid);

    // Assign a lecturer to the user
    const { lecturerId, lecturerName } = await assignLecturer();

    const groupName = `${lecturerName} Group`;
    // Store user data in Realtime Database
    await firebaseDatabase.ref(`students/${userRecord.uid}`).set({
      studentId:userRecord.uid,
      username,
      firstname,
      lastname,
      regno,
      groupName,
      fullname,
      email,
      lecturerId,
      lecturerName
    });

    // Add student's details to the chosen lecturer's node
    await firebaseDatabase.ref(`lecturers/${lecturerId}/students/${userRecord.uid}`).set({
      fullname,
      userId: userRecord.uid,
      lecturerName,
      regno
    });

    // Add student to the lecturer's group
    await firebaseDatabase.ref(`groups/${lecturerId}`).push(userRecord.uid);

    const userData = {
      studentId: userRecord.uid,
      username,
      firstname,
      lastname,
      regno,
      groupName,
      fullname,
      email,
      lecturerId,
      lecturerName
    };

    console.log(userData);
    return res.status(201).json({ message: 'Student registered successfully', user: userData });
  } catch (error) {
    console.error('Error in registerUserController:', error);
    return res.status(500).json({ error: 'Server Downtime 😭' });
  }
};

const loginUserController = async (req, res) => {
  try {
      console.log(req);

      const { userId } = req.body;

      const snapshot = await firebaseDatabase.ref(`lecturers/${userId}`).once('value');
      let userData = snapshot.val();

      // Remove the "students" field from userData
      delete userData.students;

      // Authenticate a user with Firebase Authentication
      // Return user data to client
      return res.status(200).json({ user: userData });

  } catch (error) {
      console.error('Error in loginUser Controller:', error);
      return res.status(500).json({ error: 'Server Downtime 😭' });
  }
};


const studentListController = async (req, res) => {
  try {
      console.log(req);

      const { userId } = req.body;

      const snapshot = await firebaseDatabase.ref(`lecturers/${userId}`).once('value');
      let userData = snapshot.val();

      // Return user data to client
      return res.status(200).json({ user: userData.students });

  } catch (error) {
      console.error('Error in loginUser Controller:', error);
      return res.status(500).json({ error: 'Server Downtime 😭' });
  }
};

const resetpasswordController = async (req, res) => {
    try {
        const { email } = req.body;

        // Send password reset email using Firebase Authentication
        await admin.auth().sendPasswordResetEmail(email);

        // Respond with success message
        return res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return res.status(500).json({ error: 'Failed to send password reset email. Please try again later.' });
    }
};

const profileUpdateController = async (req, res) => {
  try {
   
    return res.status(201).json({ message: 'Profile Update successfully'});
  } catch (error) {
    console.error('Error in Profile Update Controller:', error);
    return res.status(500).json({ error: 'Server Downtime 😭' });
  }
};


export { registerUserController,loginUserController,resetpasswordController,profileUpdateController,AddLecturerController,studentListController};