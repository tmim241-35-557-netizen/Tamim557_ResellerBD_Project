// MessageDependencies.jsx - Messaging/notification system context
import React, { createContext, useState, useContext } from 'react';

const MessageContext = createContext();

export function useMessages() {
  return useContext(MessageContext);
}

export function MessageProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addMessage = (message) => {
    const newMessage = {
      id: Date.now(),
      ...message,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [newMessage, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  const markAsRead = (messageId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setMessages((prev) => prev.map((msg) => ({ ...msg, read: true })));
    setUnreadCount(0);
  };

  const getUnreadCount = () => unreadCount;

  const getAllMessages = () => messages;

  const clearMessages = () => {
    setMessages([]);
    setUnreadCount(0);
  };

  const value = {
    messages,
    unreadCount,
    addMessage,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    getAllMessages,
    clearMessages,
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
}