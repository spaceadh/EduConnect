import React, { useEffect, useState } from 'react';
import { lazy, Suspense } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../src/Components/Layout/Layout';

// Lazy-loaded components
const RegisterPage = lazy(() => import('./Components/Register/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./Components/ForgotPassword/ForgotPasswordPage'));
const AddLecturerPage = lazy(() => import('./Components/AddLec/AddLecturerPage'));
const LoginPage = lazy(() => import('./Components/Login/Login'));
const Header = lazy(() => import('./Components/Header/Header'));
const NotFound = lazy(() => import('./Components/NotFound/NotFound'));
const OTPVerification = lazy(() => import('./Components/OTP/OTPVerification'));

function extractDetailsFromUrl(url) {
  const urlParts = new URL(url);
  const pathSegments = urlParts.pathname.split('/').filter(segment => segment !== '');

  if (pathSegments.length === 4) {
    const [unitName, venue, formattedDate, currentUserId] = pathSegments;
    return {
      unitName,
      venue,
      formattedDate,
      currentUserId,
    };
  } else {
    console.error('Invalid URL structure');
    return null;
  }
}

function hasValidDetails(extractedDetails) {
  return extractedDetails && extractedDetails.unitName && extractedDetails.venue && extractedDetails.formattedDate && extractedDetails.currentUserId;
}

function App() {
  const [extractedDetails, setExtractedDetails] = useState(null);
  const [showLoginPage, setShowLoginPage] = useState(false);

  useEffect(() => {
    const currentUrl = window.location.href;
    const extractedDetails = extractDetailsFromUrl(currentUrl);
    setExtractedDetails(extractedDetails);
    

    if (hasValidDetails(extractedDetails)) {
      localStorage.setItem('extractedDetails', JSON.stringify(extractedDetails));
      setShowLoginPage(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Layout>
          <Routes>
            {showLoginPage && <Route path="/" element={<LoginPage />} />}

            {hasValidDetails(extractedDetails) && (
              <>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/AddLecturerPage" element={<AddLecturerPage />} />
                <Route path="/home" element={<Header />} />
                <Route path="/OTPVerification" element={<OTPVerification />} />
              </>
            )}

            {!hasValidDetails(extractedDetails) && <Route path="*" element={<NotFound />} />}
          </Routes>
          <ToastContainer />
        </Layout>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;