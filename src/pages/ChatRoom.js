import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../socket';
import { useAuth } from '../context/AuthContext';
import './ChatRoom.css';
import { mainApi } from '../api';
import CodeEditor from '../components/CodeEditor/CodeEditor';

const ChatRoom = () => {
  const { user } = useAuth();
  const { problemId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [problem, setProblem] = useState(null);
  const [error, setError] = useState('');
  const chatEndRef = useRef(null);
  const [typingUser, setTypingUser] = useState(null);
  const [activeTab, setActiveTab] = useState('chat'); // chat | bookmarks | code

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
    socket.on('userTyping', (data) => {
      setTypingUser(data.user);
      setTimeout(() => setTypingUser(null), 3000);
    });

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
      {/* Navigation Buttons */}
      <div className="chatroom-nav-buttons">
        <button onClick={() => setActiveTab('chat')}>💬 Chat</button>
        <button onClick={() => setActiveTab('bookmarks')}>🔖 Bookmarks</button>
        <button onClick={() => setActiveTab('code')}>💻 Code</button>
      </div>

      {activeTab === 'chat' && (
        <>
          <div className="problem-header">
            {error && <h1 className="error-message-text">{error}</h1>}
            {problem && (
              <>
                <h1>{problem.title}</h1>
                <p>{problem.description}</p>
              </>
            )}
          </div>

          <div className="chat-window">
            <div className="message-list">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`message-bubble ${
                    msg.user === (user?.name || 'Zcoder User') ? 'my-message' : 'other-message'
                  }`}
                >
                  <div className="message-content">
                    <span className="message-text">
                      <strong>{msg.user}:</strong> {msg.text}
                    </span>
                    <span className="timestamp">
                      {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
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
              <button type="submit" disabled={!newMessage.trim()}>
                Send ➤
              </button>
            </form>
          </div>
        </>
      )}

      {activeTab === 'code' && problem && (
        <div className="code-layout">
          <div className="code-problem-panel">
            <h2>{problem.title}</h2>
            <p>{problem.description}</p>
          </div>
          <div className="code-editor-panel">
            <CodeEditor />
          </div>
        </div>
      )}

      {activeTab === 'bookmarks' && (
        <div className="bookmark-placeholder">
          <h2>🔖 Bookmarks will be shown here soon...</h2>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
