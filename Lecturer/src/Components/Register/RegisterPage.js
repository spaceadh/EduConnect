import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import "../Register/RegisterPage.css";
import Logo from './kcalogo.jpeg';
import {registerUser} from '../../apis/auth';
import { useUserContext } from '../../UserContext'; 

const RegisterPage = () => {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const [username, setUsername] = useState('');
  const [firstname,setFirstname]= useState('');
  const [lastname,setLastname]=useState('');
  const [loading, setLoading] = useState(false);
  const { setUserDetails } = useUserContext();
  // console.log('Username : ', username);
  const [email, setEmail] = useState('');
  // console.log('Email : ', email);
  const [password, setPassword] = useState('');
  // console.log('Password : ', password);
  const [regno, setRegno] = useState('');
  // console.log('RegNo : ', regno);

  const [confirmpassword,setConfirmPassword] = useState('');

 
  const handleRegistration = async (e) => {
    e.preventDefault();
    if (password !== confirmpassword) {
      toast.error('Password and Confirm Password do not match', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    if (!email.endsWith('@students.kcau.ac.ke')) {
      toast.error('Please use a valid email address ending with @students.kcau.ac.ke', {
        position: toast.POSITION.TOP_RIGHT,
      });
    return;
    }
    try {
      // Call the API to log in the student
      const data = {
        username,
        firstname,
        lastname,
        regno,
        email,
        password
      };
      const response = await registerUser(data);
      console.log("User Context Set: ", response.data);
      setUserDetails(response.data.user);
      console.log("User Context Set: ", response.data.user);
      // You can also perform other actions after successful registration
      navigate('/dashboard', { replace: true });

      toast.success('User registered successfully ✅', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      // Handle login error
      // console.error('Login failed', error);
      toast.error(error);
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
        <h3>Register for proper </h3>

        <form onSubmit={handleRegistration}>

        {/* <label htmlFor="regno">Regno:</label> */}
        <input 
          type="text"
          id="regno" 
          name="regno" 
          placeholder='Registration Number eg 19xxxxx'
          value={regno} 
          maxLength={7} // Limit to 7 characters
          pattern="\d*" // Only allow digits
          onChange={(e) => {
            // Limit input to 7 digits
            const input = e.target.value.slice(0, 7);
            // Update state with only digits
            setRegno(input.replace(/\D/g, '')); 
          }} 
          required 
        />

          {/* <label htmlFor="username">Username:</label> */}
          <input type="text" id="username" 
          name="username"
          placeholder='Username'
          value={username} onChange={(e) => setUsername(e.target.value)} required />

          <input type="text" id="firstname" 
          name="firstname"
          placeholder='Firstname'
          value={firstname} onChange={(e) => setFirstname(e.target.value)} required />

          <input type="text" id="lastname" 
          name="lastname"
          placeholder='Lastname'
          value={lastname} onChange={(e) => setLastname(e.target.value)} required />

          {/* <label htmlFor="email">Email:</label> */}
          <input type="email"
          id="email" 
          name="email" 
          placeholder='Email Address'
          value={email} 
          onChange={(e) => setEmail(e.target.value)} required />

          {/* <label htmlFor="password">Password:</label> */}
          <input type="password" 
          id="password" 
          name="password" 
          placeholder='Password'
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required />

          {/* <label htmlFor="confirmpassword">Confirm Password:</label> */}
          <input type="password" 
          id="confirmpassword" 
          name="confirmpassword" 
          placeholder='Confirm Password'
          value={confirmpassword} 
          onChange={(e) => setConfirmPassword(e.target.value)}
          required />

          <button type="submit">Register</button>
        </form>

        <p>
           <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
