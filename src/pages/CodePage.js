import React from 'react';
import { useParams } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import ProblemDetails from '../components/ProblemDetails';

const CodePage = () => {
  const { problemId } = useParams();

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, overflowY: 'scroll' }}>
        <ProblemDetails problemId={problemId} />
      </div>
      <div style={{ flex: 1 }}>
        <CodeEditor problemId={problemId} />
      </div>
    </div>
  );
};

export default CodePage;
