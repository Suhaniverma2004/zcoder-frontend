import React, { useState, useEffect } from 'react';
import { mainApi } from '../api';
import './Leaderboard.css';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const res = await mainApi.get('/api/users/leaderboard');
        setUsers(res.data);
      } catch {
        setError('Could not load leaderboard.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboardData();
  }, []);

  if (isLoading) return <div className="page-container"><p>Loading leaderboard...</p></div>;
  if (error) return <div className="page-container"><p className="error-message-text">{error}</p></div>;

  return (
    <div className="page-container">
      <h1>Leaderboard</h1>
      <p>Top performers on the Zcoder platform.</p>
      <div className="leaderboard-table">
        <div className="leaderboard-header">
          <span>Rank</span><span>User</span><span>Questions Solved</span><span>Total Score</span>
        </div>
        {users.map((u, i) => (
          <div key={u._id} className="leaderboard-row">
            <span className="rank">{i + 1}</span>
            <span className="user-name">{u.name}</span>
            <span className="solved-count">{u.solvedCount}</span>
            <span className="total-score">{u.totalScore}</span>
          </div>
        ))}
        {users.length === 0 && <p>No users found on the leaderboard yet.</p>}
      </div>
    </div>
  );
};

export default Leaderboard;
