// components/ProblemSidebar.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mainApi } from '../api';
import './ProblemSidebar.css';

const ProblemSidebar = ({ selectedProblemId, onSelect }) => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      const res = await mainApi.get('/problems');
      setProblems(res.data);
    };
    fetchProblems();
  }, []);

  return (
    <div className="problem-sidebar">
      <h2>Problems</h2>
      <ul>
        {problems.map((p) => (
          <li
            key={p._id}
            className={selectedProblemId === p._id ? 'active' : ''}
          >
            <div className="problem-item">
              <span className="problem-title" onClick={() => onSelect(p._id)}>
                {p.title}
              </span>
              <div className="problem-buttons">
                <Link to={`/chat/${p._id}`} className="sidebar-btn join-chat-btn">💬</Link>
                <Link to={`/code/${p._id}`} className="sidebar-btn code-btn">💻</Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProblemSidebar;
