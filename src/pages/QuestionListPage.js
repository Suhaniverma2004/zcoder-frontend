import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './QuestionListPage.css';
import { mainApi } from '../api';

const QuestionListPage = () => {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [problemsRes, bookmarksRes] = await Promise.all([
          mainApi.get('/problems'),
          mainApi.get(`/bookmarks/user/${user._id}`)
        ]);
        setProblems(problemsRes.data);
        setBookmarkedIds(new Set(bookmarksRes.data.map(b => b.problem._id)));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [user]);

  const handleBookmarkClick = async (problemId, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await mainApi.post('/bookmarks', {
        userId: user._id,
        problemId: problemId,
      });
      setBookmarkedIds(prev => new Set(prev).add(problemId));
    } catch (error) {
      console.error('Failed to add bookmark:', error);
    }
  };

  const handleJoinChatClick = (e, problemId) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/chatroom/${problemId}`);
  };

  const handleCodeClick = (e, problemId) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/code/${problemId}`);
  };

  if (isLoading) return <div className="page-container"><p>Loading questions...</p></div>;

  return (
    <div className="page-container">
      <h1>DSA Problem Discussions</h1>
      <p>Select a problem to solve or join the discussion.</p>
      <div className="question-list">
        {problems.map((problem) => (
          <div
            key={problem._id}
            className="question-link-card"
            onClick={() => navigate(`/code/${problem.problemId}`)}
          >
            <div className="question-info">
              <h3>{problem.title}</h3>
              <p className="question-topic">{problem.topic}</p>
            </div>
            <div className="question-meta">
              <span className={`difficulty-tag ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
              <button
                className={`bookmark-btn ${bookmarkedIds.has(problem._id) ? 'bookmarked' : ''}`}
                onClick={(e) => handleBookmarkClick(problem._id, e)}
                title={bookmarkedIds.has(problem._id) ? 'Bookmarked' : 'Add Bookmark'}
              >
                🔖
              </button>
              <button className="meta-btn" onClick={(e) => handleJoinChatClick(e, problem.problemId)}>
                🚀 Join Chat
              </button>
              <button className="meta-btn" onClick={(e) => handleCodeClick(e, problem.problemId)}>
                💻 Code
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionListPage;
