// src/pages/CodeEditorLayout.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { mainApi } from '../api';
import CodeEditor from './CodeEditor';
import './CodeEditorLayout.css';

const CodeEditorLayout = () => {
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await mainApi.get(`/problems/${problemId}`);
        setProblem(res.data);
      } catch (err) {
        setError('Failed to load problem');
      }
    };
    fetchProblem();
  }, [problemId]);

  if (error) return <div>{error}</div>;
  if (!problem) return <div>Loading...</div>;

  return (
    <div className="code-layout">
      <div className="code-problem-panel">
        <h2>{problem.title}</h2>
        <p>{problem.description}</p>
      </div>
      <div className="code-editor-panel">
        <CodeEditor problemId={problemId} />
      </div>
    </div>
  );
};

export default CodeEditorLayout;
