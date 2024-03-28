import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createUserWithEmailAndPassword,sendEmailVerification } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../../firebase';
import Logo from './kcalogo.jpeg';
import './AddLecturerPage.css'; // Import your CSS file

const AddLecturerPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [levelOfStudy, setLevelOfStudy] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {

      await createUserWithEmailAndPassword(auth,email, password).then(async(userCredential)=> {
        await sendEmailVerification(userCredential.user).then(()=> {
            console.log("Email verification Sent")
        })
        
        const user = userCredential.user
        
        set(ref(database,'Lecturers'),{
          "FirstName":firstName,
          "LastName":lastName,
          "Email":user.email,
          "emailVerified": user.emailVerified,
          "LevelOfStudy":levelOfStudy,
       })
     });

      navigate('/login');

      toast.success('Lecturer admitted successfully', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      toast.error(`Error adding lecturer user: ${error.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.error('Error registering user:', error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo-image" />
        </div>
        <h3>ADD A LECTURER</h3>

        <form onSubmit={handleRegistration}>
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="levelOfStudy">Level Of Study:</label>
            <input
              type="text"
              id="levelOfStudy"
              name="levelOfStudy"
              value={levelOfStudy}
              onChange={(e) => setLevelOfStudy(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Add Lecturer</button>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default AddLecturerPage;
