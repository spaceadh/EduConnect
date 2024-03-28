import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './studentlist.css';

const StudentList = ({ userData }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudentList = async () => {
      try {
        const response = await axios.post('http://localhost:5001/auth/studentlist', {
          userId: userData.lecturerId
        });
        const { user } = response.data;
        // Convert object values to array
        const studentsArray = Object.values(user);
        setStudents(studentsArray);
      } catch (error) {
        console.error('Error fetching student list:', error);
      }
    };

    fetchStudentList();
  }, [userData.lecturerId]);

  return (
    <div className="student-list">
      <h2>Student List</h2>
      <ul>
        {students.map((student, index) => (
          <li key={index}>
            <p>{index + 1}. Student ID: {student.regno}</p>
            <p>Full Name: {student.fullname}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;