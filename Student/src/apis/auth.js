import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const url = "http://localhost:5001";

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