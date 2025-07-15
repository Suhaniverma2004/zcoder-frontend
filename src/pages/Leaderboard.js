import React, { useState, useEffect } from 'react';
import './Leaderboard.css';
import { mainApi } from '../api';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await mainApi.get('/leaderboard');
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        setError("Could not load leaderboard.");
      }
      setIsLoading(false);
    };
    fetchLeaderboard();
  }, []);

  if (isLoading) return <div className="page-container"><p>Loading leaderboard...</p></div>;
  if (error) return <div className="page-container"><p className="error-message-text">{error}</p></div>;

  return (
    <div className="page-container">
      <h1>Leaderboard</h1>
      <p>Top performers on the Zcoder platform.</p>
      <div className="leaderboard-table">
        <div className="leaderboard-header">
          <span>Rank</span>
          <span>User</span>
          <span>Questions Solved</span>
          <span>Total Score</span>
        </div>
        {users.map((user, index) => (
          <div key={user._id} className="leaderboard-row">
            <span className="rank">{index + 1}</span>
            <span className="user-name">{user.name}</span>
            <span className="solved-count">{user.solvedCount || 0}</span>
            <span className="total-score">{user.totalScore || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;