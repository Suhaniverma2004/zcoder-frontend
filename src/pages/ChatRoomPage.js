import React, { useState, useEffect } from 'react';
import ProblemSidebar from './ProblemSidebar';
import CodeEditor from './CodeEditor';
import ChatRoom from './ChatRoom'; // Keep ChatRoom focused on just chat
import { mainApi } from '../api';
import './ChatRoomPage.css';

const ChatRoomPage = () => {
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    const loadProblem = async () => {
      if (!selectedProblemId) return;
      const res = await mainApi.get(`/problems/${selectedProblemId}`);
      setProblem(res.data);
    };
    loadProblem();
  }, [selectedProblemId]);

  return (
    <div className="chatroom-page">
      <ProblemSidebar selectedProblemId={selectedProblemId} onSelect={setSelectedProblemId} />

      <div className="main-content">
        {problem ? (
          <>
            <div className="problem-details">
              <h1>{problem.title}</h1>
              <p>{problem.description}</p>
            </div>

            <div className="editor-section">
              <CodeEditor problemId={problem._id} />
            </div>

            <div className="chat-section">
              <ChatRoom problemId={problem._id} />
            </div>
          </>
        ) : (
          <div className="no-problem-selected">Select a problem to begin</div>
        )}
      </div>
    </div>
  );
};

export default ChatRoomPage;
