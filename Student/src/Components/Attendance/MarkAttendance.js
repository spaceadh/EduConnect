import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../../firebase';
import { ref, get, set } from 'firebase/database';
import { toast } from 'react-toastify';
import '../Attendance/MarkAttendance.css';
import 'react-toastify/dist/ReactToastify.css';

const MarkAttendance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const extractedDetails = location.state?.extractedDetails;

  const { unitCode, venue, formattedDate, formattedTime, lecturersUserId } =
    extractedDetails || {};

  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);

  // Use useRef to persist RegNo across renders
  const RegNoRef = useRef(null);
  const FirstnameRef = useRef(null);
  const LastnameRef = useRef(null);

  useEffect(() => {
    // Fetch user data when the component mounts
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        setUserId(user.uid);
      } else {
        // User is signed out
        setUserId(null);
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []); // Run this effect once on component mount

  useEffect(() => {
    // Fetch user data when the userId changes
    const fetchData = async () => {
      try {
        const snapshot = await get(ref(database, `Students/${userId}`));
        const userDataFromFirebase = snapshot.val();

        if (userDataFromFirebase) {
          if ('RegNo' in userDataFromFirebase) {
            setUserData(userDataFromFirebase);

            RegNoRef.current = userDataFromFirebase.RegNo;
            FirstnameRef.current = userDataFromFirebase.Firstname;
            LastnameRef.current = userDataFromFirebase.Lastname;
          } else {
            toast.error('RegNo not found in user data');
          }
        } else {
          toast.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    // Fetch data only if userId is not null
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const handleMarkAttendance = () => {
    console.log('Lecturer`s UserId : ', lecturersUserId);

    const firstNameValue = FirstnameRef.current || ""; // Default to empty string if undefined
    const lastNameValue = LastnameRef.current || "";

    set(
      ref(
        database,
        `Lecturers/${lecturersUserId}/Attendance/${unitCode}/${formattedDate}/${RegNoRef.current}`
      ),
      {
        FirstName: firstNameValue,
        LastName: lastNameValue,
        IsPresent: true
      }
    );

    const { username } = userData || {};
    console.log('Username:', username);
    console.log('RegNo:', RegNoRef.current);

    toast.success('Attendance marked successfully ✅');

    navigate('/successPage', { state: { extractedDetails } });
  };

  return (
    <div className="mark-attendance-container">
      <form className="attendance-form">
        <h2 className="mark-attendance-header">
          {RegNoRef.current} Mark attendance for: {unitCode}
        </h2>

        <label htmlFor="unitCode">Unit Code:</label>
        <input type="text" id="unitCode" value={unitCode} readOnly />

        <label htmlFor="venue">Venue:</label>
        <input type="text" id="venue" value={venue} readOnly />

        <label htmlFor="formattedDate">Date:</label>
        <input type="text" id="formattedDate" value={formattedDate} readOnly />

        <label htmlFor="formattedTime">Time:</label>
        <input type="text" id="formattedTime" value={formattedTime} readOnly />

        <button type="button" onClick={handleMarkAttendance}>
          Mark Attendance
        </button>
      </form>
    </div>
  );
};

export default MarkAttendance;
