import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import './OTPVerification.css';
const OTPVerification = () => {
  const location = useLocation();
  const extractedDetails = location.state?.extractedDetails;

  console.log('Extracted Details',extractedDetails);

  const navigate = useNavigate();

  const api = axios.create({
    baseURL: 'https://otpserver-oe9j.onrender.com', // Replace with your actual API base URL
  });

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');

  const generateRandomOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  const sendOTP = async (e) => {
    e.preventDefault();

    console.log('Sending OTP...');

    if (!phoneNumber.startsWith('+254')) {
      toast.error('Please enter a valid Kenyan phone number starting with +254.');
      return;
    }

    const generatedOTP = generateRandomOTP();

    console.log('Generated OTP : ', generatedOTP);

    try {
      // Send OTP to the server
      const response = await api.post('/send-otp', {
        phoneNumber: phoneNumber,
        message: `Your OTP is: ${generatedOTP}`,
      });

      console.log('Server response:', response.data);

      // Update state to indicate that OTP has been sent and store the generated OTP
      setOtpSent(true);
      setGeneratedOTP(generatedOTP);
      toast.success('OTP sent successfully.');
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send OTP. Please try again.');
    }
  };

  const verifyOTP = (e) => {
    e.preventDefault();

    // console.log('OTP:', otp, typeof otp);
    // console.log('Generated OTP:', generatedOTP, typeof generatedOTP);

    // Verify OTP using the user-entered OTP and the stored generated OTP
    const isOtpCorrect = otp === String(generatedOTP);

    if (isOtpCorrect) {
      toast.success('OTP verified successfully. Redirecting...');
      navigate('/MarkAttendance', { state: { extractedDetails } });
    } else {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h4>OTP VERIFICATION</h4>
        {!otpSent ? (
          <form onSubmit={sendOTP}>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter phone number +2547xxx"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <button type="submit">SEND OTP</button>
          </form>
        ) : (
          <form onSubmit={verifyOTP}>
            <input
              type="text"
              id="otp"
              name="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit">VERIFY OTP</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default OTPVerification;