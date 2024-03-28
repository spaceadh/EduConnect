import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ref, push, set } from 'firebase/database';
import { database } from '../../firebase';
import { format } from 'date-fns';
import './ChatWithLecturers.css'; // Import CSS file for styling

const GroupChats = ({ userData }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const { firstname,
      lastname,
      name,
      email,
      lecturerId,
      levelofeducation } = userData;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const url = "http://localhost:5001"; // Update the URL to match your server endpoint
        const response = await axios.get(`${url}/api/groups/retrievemessage/${lecturerId}`);
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
  }, [lecturerId]);

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
  
      const newMsgRef = push(ref(database, `groups/${lecturerId}/messages`));
      const newMsgData = {
        senderId: lecturerId,
        message: newMessage,
        fullname: name,
        timestamp: new Date().toISOString()
      };
      await set(newMsgRef, newMsgData);
  
      const newMsg = {
        senderId: lecturerId,
        message: newMessage,
        fullname: name,
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
        <p>{name} Chats</p>
      </div>
      <div className="messages-wrapper">
        {messages?.map((message, index) => (
          <div
            className={`chat-bubble ${message.senderId === lecturerId ? "right" : ""}`}
            key={index}
          >
            <div className="chat-bubble__right">
              <p className="user-name">{message.fullname}</p>
              <p className="user-message">{message.message}</p>
              <span className="message-time">
                {formatTimestamp(message.timestamp)}
              </span>
            </div>
            {message.senderId === lecturerId && <div className="message-divider"></div>}
          </div>
        ))}
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

export default GroupChats;