import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mainApi } from '../api';
import './QuestionListPage.css';

const QuestionListPage = () => {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const [problemsRes, bookmarksRes] = await Promise.all([
          mainApi.get('/api/problems'),
          mainApi.get(`/api/bookmarks/user/${user._id}`)
        ]);
        setProblems(problemsRes.data);
        setBookmarkedIds(new Set(bookmarksRes.data.map(b => b.problem._id)));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleBookmarkClick = async (problemId, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await mainApi.post('/api/bookmarks', {
        userId: user._id,
        problemId
      });
      setBookmarkedIds(prev => new Set(prev).add(problemId));
    } catch (error) {
      console.error('Failed to add bookmark:', error.response?.data?.message || error.message);
    }
  };

  if (isLoading) return <div className="page-container"><p>Loading questions...</p></div>;

  return (
    <div className="page-container">
      <h1>DSA Problem Discussions</h1>
      <p>Select a problem to join the chat, or click the bookmark to save it for later.</p>
      <div className="question-list">
        {problems.map(problem => (
          <Link key={problem._id} to={`/chatroom/${problem.problemId}`} className="question-link-card">
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
              <span className="join-chat-link">Join Chat</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuestionListPage;
