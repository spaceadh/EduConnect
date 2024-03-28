import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ref, push, set } from 'firebase/database';
import { database } from '../../firebase';
import { format } from 'date-fns';
import './ChatWithLecturers.css'; // Import CSS file for styling

const ChatWithLecturers = ({ userData }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const { studentId, fullname, lecturerId, groupName, lecturerName } = userData;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const url = "http://localhost:5001"; // Update the URL to match your server endpoint
        const response = await axios.get(`${url}/api/messages/retrievemessage/${studentId}/${lecturerId}`);
        console.log(response.data);
        const { messages } = response.data; // Access the messages object
        if (messages) {
          const messageList = Object.values(messages); // Convert messages object to array
          messageList.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          setMessages(messageList);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [studentId, lecturerId]);

  const formatTimestamp = (timestamp) => {
    return format(new Date(timestamp), "yyyy-MM-dd HH:mm:ss");
  };

  const sendMessage = async () => {
    try {
      // Check if the newMessage is not empty
      if (!newMessage.trim()) {
        toast.error('Cannot send empty message', {
          position: toast.POSITION.TOP_RIGHT,
        });
        return; // Exit the function if the message is empty
      }

      const newMsgRef = push(ref(database, `messages/${lecturerId}/${studentId}/messages`));
      const newMsgData = {
        senderId: studentId,
        message: newMessage,
        fullname: fullname,
        timestamp: new Date().toISOString()
      };
      await set(newMsgRef, newMsgData);

      const newMsg = {
        senderId: studentId,
        message: newMessage,
        fullname: fullname,
        timestamp: new Date().toISOString()
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="Chatbot">
      <div className="group-name-container">
        <p>Chat with {lecturerName}</p>
      </div>
      <div className="messages-wrapper">
        {messages.length === 0 ? (
          <div className="no-messages-card">
            <p>You haven't contacted {lecturerName} yet.</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              className={`chat-bubble ${message.senderId === studentId ? "right" : ""}`}
              key={index}
            >
              <div className="chat-bubble__right">
                <p className="user-name">{message.fullname}</p>
                <p className="user-message">{message.message}</p>
                <span className="message-time">
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
              {message.senderId === studentId && <div className="message-divider"></div>}
            </div>
          ))
        )}
      </div>
      <div className="send-message">
        <input
          id="messageInput"
          type="text"
          className="form-input__input"
          placeholder="type message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage} type="button">Send</button>
      </div>
    </div>
  );
};

export default ChatWithLecturers;