import React, { useEffect, useState } from "react";
import "./Chat.css";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useDispatch, useSelector } from "react-redux";
import { createChats, getChats } from "../../store/chats/actions";

const Chat = ({ ticket, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useLocalStorage("user", {});

  const dispatch = useDispatch();

  // console.log({ user });
  // Dummy messages to simulate a conversation

  const { chats, loading, error } = useSelector((state) => state.chats);

  useEffect(() => {
    setIsVisible(true);
    dispatch(getChats({ ticketId: ticket._id }));
    return () => {
      setIsVisible(false);
    };
  }, []);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    dispatch(createChats({ message, ticketId: ticket._id }));
    setMessage("");
  };

  useEffect(() => {
    const timerId = setInterval(() => {
      dispatch(getChats({ ticketId: ticket._id }));
    }, 1000 * 10);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className={`chat-modal ${isVisible ? "show" : ""}`}>
      <div className="modal-header">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h5>{ticket?.title}</h5>
      </div>
      <div className="modal-body">
        <div className="chat-messages">
          {chats.map((msg) => (
            <div
              key={msg._id}
              className={`chat-message ${
                msg.sender === user._id ? "sender" : "reciever"
              }`}
            >
              <p>{msg.message}</p>
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
