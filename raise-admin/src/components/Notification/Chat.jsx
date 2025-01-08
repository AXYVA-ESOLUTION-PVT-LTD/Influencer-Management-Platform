import React, { useEffect, useRef, useState } from "react";
import "./Chat.css";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useDispatch, useSelector } from "react-redux";
import { createChats, getChats } from "../../store/chats/actions";
import { format, isToday, isYesterday, parseISO } from "date-fns";

const Chat = ({ type, ticket, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useLocalStorage("user", {});

  const chatMessagesRef = useRef(null);

  const dispatch = useDispatch();

  const { chats, loading, error } = useSelector((state) => state.Chats);

  useEffect(() => {
    setIsVisible(true);
    if (type == "Ticket") {
      dispatch(getChats({type :"Ticket" ,ticketId: ticket._id }));
    } else {
      // get Chats based on TransactionId
      dispatch(getChats({type :"Transaction" , transactionId: ticket._id }));
    }
    return () => {
      setIsVisible(false);
    };
  }, []);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (type == "Ticket") {
      dispatch(createChats({type :"Ticket" ,message, ticketId: ticket._id }));
    } else {
      // dispatch createChats for transaction
      dispatch(createChats({type :"Transaction" , message, transactionId: ticket._id }));
    }
    setMessage("");
  };

  useEffect(() => {
    const timerId = setInterval(() => {
      if (type == "Ticket") {
        dispatch(getChats({type :"Ticket" , ticketId: ticket._id }));
      }
      else{
        dispatch(getChats({type :"Transaction" ,transactionId: ticket._id }));
      }
    }, 1000 * 10);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chats]);

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "dd-MM-yy");
    }
  };

  const formatTime = (dateString) => {
    return format(parseISO(dateString), "h:mm a");
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((msg) => {
      const date = formatDate(msg.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };

  const groupedChats = groupMessagesByDate(chats);

  return (
    <div className={`chat-modal ${isVisible ? "show" : ""}`}>
      <div className="modal-header">
        {type === "Ticket" ? (
          <>
            <h5>Ticket: {ticket.title}</h5>
            <span>
              From: {ticket.from.email} ({ticket.from.firstName})
            </span>
          </>
        ) : type === "Transaction" ? (
          <>
            <h5>Transaction Details</h5>
            <span>
                From : {ticket.influencerId.firstName}{" "}
                {ticket.influencerId.lastName}
            </span>
          </>
        ) : (
          <div>Invalid type</div>
        )}
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="modal-body">
        <div className="chat-messages" ref={chatMessagesRef}>
          {Object.entries(groupedChats).map(([date, messages]) => (
            <React.Fragment key={date}>
              <div className="date-separator">{date}</div>
              {messages.map((msg) => (
                <>
                  <div
                    key={msg._id}
                    className={`chat-message ${
                      msg.sender === user._id ? "sender-msg" : "reciever-msg"
                    }`}
                  >
                    <p>{msg.message}</p>
                  </div>
                  <span
                    className={`message-time ${
                      msg.sender === user._id ? "sender-time" : "receiver-time"
                    }`}
                  >
                    {formatTime(msg.createdAt)}
                  </span>
                </>
              ))}
            </React.Fragment>
          ))}
        </div>
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
  );
};

export default Chat;
