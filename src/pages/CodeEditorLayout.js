import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CodeEditor from './pages/CodeEditor';
import { mainApi } from './api';
import './CodeEditorLayout.css';

const CodeEditorLayout = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      const res = await mainApi.get(`/problems/${id}`);
      setQuestion(res.data);
    };
    fetchQuestion();
  }, [id]);

  return (
    <div className="code-layout">
      <div className="question-panel">
        <h2>{question?.title}</h2>
        <p>{question?.description}</p>
      </div>
      <div className="editor-panel">
        <CodeEditor problemId={id} />
      </div>
    </div>
  );
};

export default CodeEditorLayout;
