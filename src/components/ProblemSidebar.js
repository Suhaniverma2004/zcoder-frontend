// components/ProblemSidebar.js
import React, { useEffect, useState } from 'react';
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
            onClick={() => onSelect(p._id)}
          >
            {p.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProblemSidebar;
