import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import { getDatabase, get } from 'firebase/database';
import {ref,set} from 'firebase/database';
import { auth,database } from '../../firebase.js';
import { Link } from 'react-router-dom';
import '../Login/Login.css';
import Logo from './kcalogo.jpeg';
import {loginUser} from '../../apis/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const setUserDetails = (userData) => {
    const { firstname,lastname,name,email,lecturerId,levelofeducation } = userData;
    // Create a new object with only the properties you want to keep
    const updatedUserData = {
      firstname,
      lastname,
      name,
      email,
      lecturerId,
      levelofeducation
    }; 
    // Save the trimmed student details to localStorage
    localStorage.setItem('lecturer', JSON.stringify(updatedUserData));
  };  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let userId;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      userId = user.uid;
      console.log(userId);

      const body = {userId};
      const response = await loginUser(body);
      console.log(response.data.user);

      const userData = response.data.user;

      setUserDetails(userData);
    
      toast.success('Welcome Back Lecturer', {
        position: toast.POSITION.TOP_RIGHT,
      });
  
      // Redirect to the dashboard after successful login
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Invalid username or password', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setLoading(false);
    } 
  };
  
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo-image" />
        </div>
        <div className="logo-container">
          <p>Lecturer Portal</p>
        </div>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Username:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}</button>
        </form>
        {/* <p>
          Don't have an account? 
           <Link to="/register">Register</Link>
        </p> */}
        <p>
           <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;