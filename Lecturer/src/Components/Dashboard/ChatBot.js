import { useState, useEffect } from 'react';
import './ChatApp.css';
import React, { useRef } from "react";
import EduConnectBotIcon from '../img/bot.jpeg';
import { triggerAnswers } from '../apis/triggeranswers.js';

const Chatbot = ({ userData }) => {
  const scroll = useRef(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm the Educonnect Bot! Ask me anything related!",
      sentTime: "just now",
      sender: "EduconnectBot",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isBadQuestion, setisBadQuestion] = useState(false); // New state variable
  const [userMessages, setUserMessages] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSendMessage = async () => {
    if (message.trim() === "") {
      alert("Enter a valid message");
      return;
    }
  
    const userMessage = {
      message,
      direction: 'outgoing',
      sender: 'user',
    };
  

    setMessages((prevMessages) => [...prevMessages, userMessage]);    
    console.log(userMessages);
    setUserMessages((prevUserMessages) => [...prevUserMessages, message]);
    setMessage('');
    scroll.current.scrollIntoView({ behavior: "smooth" });
  
    const isBadQuestion = checkIfBadQuestion(message);
    setisBadQuestion(isBadQuestion);
  
    if (!isBadQuestion) {
      setIsTyping(true);
  
      try {
        const TrainingData = userMessages.map(message => `User: ${message}.`).join(' ');
        const trainmessage = `
        Welcome! your name EduConnect Bot. You assist university students with their academic projects and inquiries.
        Whether they need help with research, writing, formatting, or any other aspect of their project, You are there to lend a hand.
        ${TrainingData ? `To better understand your needs, here's a summary of your recent messages: ${TrainingData}` : "You haven't communicated with me yet. Feel free to start the conversation!"}
        `;


          triggerAnswers(trainmessage).then((response) => {
          setIsTyping(false);
          if (response && response !== "Text not available") {
            const chatGPTResponse = {
              message: response,
              sender: 'EduConnectBot',
            };
            setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);
          } else {
            const errorMessage = {
              message: "Sorry, I cannot process your message due to safety concerns. Please try again with a different query.",
              direction: 'incoming',
              sender: 'EduConnectBot',
            };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
          }
        });
      } catch (error) {
        console.error('Error:', error);
        setIsTyping(false);
      }
    } else {
      const denialMessage = {
        message: "I'm sorry, but I'm programmed to answer only questions with no bad words in it.",
        direction: 'incoming',
        sender: 'EduConnectBot',
      };
  
      setMessages((prevMessages) => [...prevMessages, denialMessage]);
      setIsTyping(false);
    }
  };
    
  const checkIfBadQuestion = (message) => {
    const badKeywords = [
      'damn', 'fuck', 'stupid', 'bastard', 'fool', 'idiot', 'asshole', 'shit',
      'bullshit', 'dick', 'cock', 'pussy', 'cunt', 'ass', 'bitch', 'motherfucker',
      'whore', 'slut', 'prick', 'wanker', 'arsehole', 'jackass', 'douchebag',
      'twat', 'douche', 'son of a bitch', 'bloody hell', 'crap', 'arse', 'fanny',
      'screw you', 'screw off', 'go to hell', 'bugger off', 'sod off', 'wank', 
      'piss off', 'fuck off', 'fudge', 'eff off', 'eff you', 'effing', 'freaking', 
      'frigging', 'frick', 'frack', 'dagnabbit', 'goddamn', 'daggonit'
    ];
    return badKeywords.some((keyword) => message.toLowerCase().includes(keyword));
  }; 

  return (
  <div className="Chatbot">
    {isMobile ? (
      <div className="mobile-chat-container">
        <div className="messages-wrapper">
          {messages?.map((message, index) => (
            <div className={`chat-bubble ${message.sender === 'user' ? "right" : ""}`} key={index}>
              {message.sender !== 'user' && (
                <img
                  className="chat-bubble__left"
                  src={EduConnectBotIcon}
                  alt="EduConnectBot avatar"
                />
              )}
              <div className="chat-bubble__right">
                {message.sender !== 'user' && (
                  <p className="user-name">{message.sender}</p>
                )}
                <p className="user-message">{message.message}</p>
              </div>
              {message.sender === 'user' && <div className="message-divider"></div>}
            </div>
          ))}
        </div>
        <span ref={scroll}></span>
        <div className="send-message">
          <input
            id="messageInput"
            type="text"
            className="form-input__input"
            placeholder="type message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSendMessage} type="button">Send</button>
        </div>
      </div>
    ) : (
      <div className="desktop-chat-container">
        <div className="messages-wrapper">
          {messages?.map((message, index) => (
            <div className={`chat-bubble ${message.sender === 'user' ? "right" : ""}`} key={index}>
              {message.sender !== 'user' && (
                <img
                  className="chat-bubble__left"
                  src={EduConnectBotIcon}
                  alt="EduConnectBot avatar"
                />
              )}
              <div className="chat-bubble__right">
                {message.sender !== 'user' && (
                  <p className="user-name">{message.sender}</p>
                )}
                <p className="user-message">{message.message}</p>
              </div>
              {message.sender === 'user' && <div className="message-divider"></div>}
            </div>
          ))}
        </div>
        <span ref={scroll}></span>
        <div className="send-message">
          <input
            id="messageInput"
            type="text"
            className="form-input__input"
            placeholder="type message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSendMessage} type="button">Send</button>
        </div>
      </div>
    )}

    {isTyping && messages.length > 0 && messages[messages.length - 1].sender === 'EduConnectBot' && (
      <p>Loading...</p>
    )}
  </div>
);
}

export default Chatbot;