import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../socket';
import { useAuth } from '../context/AuthContext';
import './ChatRoom.css';
import { mainApi } from '../api';

const ChatRoom = () => {
  const { user } = useAuth();
  const { problemId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [problem, setProblem] = useState(null);
  const [error, setError] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await mainApi.get(`/problems/${problemId}`);
        setProblem(res.data);
      } catch (err) {
        setError("Could not load problem details.");
      }
    };
    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    socket.connect();
    socket.emit('joinRoom', { problemId });

    socket.on('previousMessages', (msgs) => setMessages(msgs));
    socket.on('receiveMessage', (msg) => setMessages(prev => [...prev, msg]));

    return () => {
      socket.off('previousMessages');
      socket.off('receiveMessage');
      socket.disconnect();
    };
  }, [problemId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    socket.emit('sendMessage', {
      room: problemId,
      user: user?.name || 'Zcoder User',
      text: newMessage,
    });
    setNewMessage('');
  };

  return (
    <div className="page-container chat-room-container">
      <div className="problem-header">
        {error && <h1 className="error-message-text">{error}</h1>}
        {problem && <><h1>{problem.title}</h1><p>{problem.description}</p></>}
      </div>

      <div className="chat-window">
        <div className="message-list">
          {messages.map(msg => (
            <div key={msg._id} className={`message-bubble ${msg.user === (user?.name || 'Zcoder User') ? 'my-message' : 'other-message'}`}>
              <strong>{msg.user}</strong>
              <p>{msg.text}</p>
              <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form className="message-input-form" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" disabled={!newMessage.trim()}>Send ➤</button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
