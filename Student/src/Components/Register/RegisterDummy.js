import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { auth, database } from '../../firebase';
import {createUserWithEmailAndPassword} from 'firebase/auth'
import {ref,set} from 'firebase/database';
import "../Register/RegisterPage.css";
import Logo from './kcalogo.jpeg';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  console.log('Username : ', username);
  const [email, setEmail] = useState('');
  console.log('Email : ', email);
  const [password, setPassword] = useState('');
  console.log('Password : ', password);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const handleRegistration = async (e) => {
    e.preventDefault();
    //const auth = getAuth();
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth,email, password);
      console.log('User credentials:', userCredential);

      // Save user details to the Realtime Database under 'Admin' node
      // await database.ref('Admin').child(userCredential.user.uid).set({
      //   "username": username,
      //   "email": email,
      // });

      set(ref(database,'Admin'),{
        "username": username,
        "email": email,
      })
      
      console.log('User details saved to database');

      // Redirect to the AddLecturerPage after successful registration
      navigate('/AddLecturerPage');

      // You can also perform other actions after successful registration
      console.log('User registered successfully:', userCredential.user);

      // Display a success toast
      toast.success('User registered successfully', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      toast.error(`Error registering user: ${error.message}`, {
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
        <h3>CREATE AN ACCOUNT WITH US</h3>

        <form onSubmit={handleRegistration}>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account ? <Link to="/">Login</Link>
        </p>
        <ToastContainer />
      </div>
    </div>
  );
};

export default RegisterPage;
