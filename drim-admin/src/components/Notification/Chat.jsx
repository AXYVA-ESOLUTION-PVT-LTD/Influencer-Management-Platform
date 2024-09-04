import React, { useEffect, useState } from 'react';
import './Chat.css';

const Chat = ({ ticket, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');

  // Dummy messages to simulate a conversation
  const dummyMessages = [
    { id: 1, text: "Hello! How can I assist you today?", sender: "agent" },
    { id: 2, text: "I'm having an issue with my account. Can you help?", sender: "user" },
    { id: 3, text: "Sure! Can you please provide more details about the issue?", sender: "agent" },
    { id: 4, text: "I can't log in, and I keep getting an error message.", sender: "user" },
  ];

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    console.log('Message sent:', message);
    setMessage('');
  };

  return (
    <div className={`chat-modal ${isVisible ? 'show' : ''}`}>
      <div className="modal-header">
        <button className="close-button" onClick={onClose}>×</button>
        <h5>Chat {ticket?.title}</h5>
      </div>
      <div className="modal-body">
        <div className="chat-messages">
          {dummyMessages.map(msg => (
            <div key={msg.id} className={`chat-message ${msg.sender}`}>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input 
            type="text" 
            placeholder="Type a message..." 
            value={message}
            onChange={handleMessageChange}
            className="chat-input"
          />
          <button type="submit" className="chat-send-button">
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
