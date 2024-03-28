// UserContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [storedData, setStoredData] = useState({});
  const [student, setUser] = useState(() => {
    // Initialize state from localStorage if available
    const storedUser = localStorage.getItem('student');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('student');
    console.log('Stored user:', storedUser); // Check if the stored user data is retrieved
    const initialUser = storedUser ? JSON.parse(storedUser) : null;
    setUser(initialUser);
  }, []);

  useEffect(() => {
    const localStorageData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      localStorageData[key] = value;
    }
    console.log('localStorageData:', localStorageData); // Log the collected data
    setStoredData(localStorageData);
  }, []);

  const setUserDetails = (userData) => {
    // Destructure the properties you want to keep
    // eslint-disable-next-line camelcase
    const { studentId,username,firstname,lastname,regno,fullname,email,lecturerId,groupName,lecturerName } = userData;
    // Create a new object with only the properties you want to keep
    const updatedUserData = {
      studentId,
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
        
    setUser(updatedUserData);
  
    // Save the trimmed student details to localStorage
    localStorage.setItem('student', JSON.stringify(updatedUserData));
  };
  
  useEffect(() => {
    // Cleanup localStorage on component unmount
    return () => {
      localStorage.removeItem('student');
    };
  }, []);

  return (
    <UserContext.Provider value={{ student, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};