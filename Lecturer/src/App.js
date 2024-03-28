import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../src/Components/Layout/Layout';
import AppLayout from './Components/Dashboard/AppLayout';

// Lazy-loaded components
const RegisterPage = lazy(() => import('./Components/Register/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./Components/ForgotPassword/ForgotPasswordPage'));
const LoginPage = lazy(() => import('./Components/Login/Login'));
const NotFound = lazy(() => import('./Components/NotFound/NotFound'));
const ChatWithLecturers = lazy(() => import('./Components/Dashboard/ChatWithLecturers'));
const DocumentViewer = lazy(() => import('./Components/Dashboard/DocumentViewer'));
const GroupChats = lazy(() => import('./Components/Dashboard/groupChats'));

function App() {
  return (
    <Router>
      
        <Layout>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/not-found" element={<NotFound />} />
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />            
              <Route path="/dashboard/*" element={<AppLayout />}>
                <Route path="chat_with_lecturer" element={<ChatWithLecturers />} />
                <Route path="upload_document" element={<DocumentViewer />} />
                <Route path="group_chats" element={<GroupChats />} />
              </Route>
            </Routes>
          </Suspense>
        </Layout>
        <ToastContainer />
    </Router>
  );
}

export default App;
