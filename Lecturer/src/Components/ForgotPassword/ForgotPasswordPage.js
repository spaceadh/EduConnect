import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import { useLocation } from 'react-router-dom';
import "../ForgotPassword/ForgotPasswordPage.css";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from '../../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
//import Logo from './kcalogo.jpeg';
import {resetPassword} from '../../apis/auth';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [setIsEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      // Call the API to log in the user
      const data = {
        email
      };
      const response = await resetPassword(data);
      setIsEmailSent(true);
      toast.success('Email reset password-link sent successfully', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      toast.error(`Error sending password reset email.`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setLoading(false);
    } 
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo-image" />
        </div> */}
        <h4>Reset your Password</h4>
        <form onSubmit={handlePasswordReset}>

          <label htmlFor="email">Email:</label>
          <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          <button type="submit">Send me Instructions</button>
        </form>
        <p>
           <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
