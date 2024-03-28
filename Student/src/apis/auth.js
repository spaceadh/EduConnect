import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// const url = "process.env.REACT_APP_SERVER_URL";
const url = "http://localhost:5001";
// console.log("Url :",url);

export const loginUser = async (body) => {
  try {
    const { userId } = body;
    const response = await axios.post(`${url}/auth/login`, body);
    toast.success('Login successful');
    return response;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      toast.error(error.response.data.error); // Display error message from server
    } else {
      toast.error('Login failed. Please try again later.'); // Generic error message
    }
    throw error;
  }
};

export const studentloginUser = async (body) => {
  try {
    const { userId } = body;
    const response = await axios.post(`${url}/auth/studentlogin`, body);
    toast.success('Login successful');
    return response;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      toast.error(error.response.data.error); // Display error message from server
    } else {
      toast.error('Login failed. Please try again later.'); // Generic error message
    }
    throw error;
  }
};

export const registerUser = async (body) => {
    try {
      const response = await axios.post(`${url}/auth/register`, body);
      toast.success('Registration success. Welcome to KCAU!');
      return response;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error); // Display error message from server
      } else {
        toast.error('Registration failed. Please try again later.'); // Generic error message
      }
      throw error;
    }
};
  
export const resetPassword = async (body) => {
  try {
    const { email } = body 
       
    const response = await axios.post(`${url}/auth/resetpassword`, body);
    // Assuming the API returns an error message in the response if there's an error
    if (response.data.error) {
      toast.error(response.data.error); // Toast the error message
      return; // Return early as there's an error
    }
    toast.success('Password reset successful. Please log in with your new password.');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      toast.error(error.response.data.error); // Toast the error message from the server
    } else {
      toast.error('Failed to reset password. Please try again later.'); // Generic error message
    }
    throw error;
  }
};
export const forgotPassword = async (body) => {
  try {
    const response = await axios.post(`${url}/auth/forgotpassword`, body);
    // Assuming the API returns an error message in the response if there's an error
    if (response.data.error) {
      toast.error(response.data.error); // Toast the error message
      return; // Return early as there's an error
    }
    toast.success('Email sent successfully');
    return response.data; // Return response data if needed
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      toast.error(error.response.data.error); // Toast the error message from server
    } else {
      toast.error('Password Change Failed. Please try again later.'); // Generic error message
    }
    throw error;
  }
};

const EmailMeAPI = (secretKey) =>
  axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: secretKey,
    }
});

export const contactemail = async (user, body) => {
  try {
    const { secretKey, username } = user;

    const emailMeApiInstance = EmailMeAPI(secretKey);
    // console.log('Body:', body);
    const { data } = await emailMeApiInstance.post(`${url}/auth/emailme`, { username, body });
    // const { data } = await EmailMeAPI(secretKey).post(`${url}/auth/emailme`, { username, body });
    return data;
  } catch (error) {
    // console.error('Error in Email:', error);
    toast.error('Please Try Again later,.', error);
    throw error;
  }
};

export const profileupdate = async (user,body) => {
  try {
    const { secretKey, username } = user;

    const withdrawalDetailsApiInstance = EmailMeAPI(secretKey);
    // console.log('Body:', body);
    const data  = await withdrawalDetailsApiInstance.post(`${url}/auth/profileupdate`, { username, body });
    toast.success('Profile update successful');
    return data;
  } catch (error) {
    console.log('Error in Profile update API:', error);
    toast.error('Please Try Again later.');
    throw error;
  }
};