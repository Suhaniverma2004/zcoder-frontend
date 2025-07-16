import React, { useState, useEffect, useCallback, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { githubDark } from '@uiw/codemirror-theme-github';
import { mainApi, codeRunnerApi } from '../api';
import './CodeEditor.css';

const extensions = {
  javascript: javascript({ jsx: true }),
  python: python(),
  cpp: cpp(),
  java: java(),
};

const defaultCode = {
  javascript: 'console.log("Hello, World!");',
  python: 'print("Hello, World!")',
  cpp: '#include <iostream>\nint main() {\n  std::cout << "Hello, World!";\n  return 0;\n}',
  java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}',
};

const CodeEditor = ({ problemId, userId, testCases = [] }) => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [singleOutput, setSingleOutput] = useState('');
  const [evalResults, setEvalResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const saveTimeout = useRef(null);

  useEffect(() => {
    async function fetchCode() {
      const res = await mainApi.get(`/user-code/${problemId}?userId=${userId}`);
      if (res.data && res.data.code) {
        setCode(res.data.code);
        setLanguage(res.data.language);
      } else {
        setCode(defaultCode[language]);
      }
    }
    if (problemId && userId) fetchCode();
  }, [problemId, userId, language]);

  useEffect(() => {
    if (!problemId || !userId) return;
    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      mainApi.post('/user-code/save', { userId, problemId, code, language });
    }, 2000);
    return () => clearTimeout(saveTimeout.current);
  }, [code, language, problemId, userId]);

  const runSingle = async () => {
    setIsLoading(true);
    const res = await codeRunnerApi.post('/api/execute', { language, code });
    setSingleOutput(res.data.output || 'No output or error.');
    setIsLoading(false);
  };

  const runAllTests = async () => {
    setIsLoading(true);
    const res = await codeRunnerApi.post('/api/evaluate', {
      language, code, testCases,
    });
    setEvalResults(res.data.results);
    setIsLoading(false);
  };

  return (
    <div className="code-editor-container">
      <div className="editor-controls">
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          {Object.keys(extensions).map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
        </select>
        <button onClick={runSingle} disabled={isLoading}>▶ Run</button>
        {testCases.length > 0 && (
          <button onClick={runAllTests} disabled={isLoading}>🧪 Run All Tests</button>
        )}
      </div>

      <CodeMirror
        value={code}
        theme={githubDark}
        height="300px"
        extensions={[extensions[language]]}
        onChange={useCallback(v => setCode(v), [])}
      />

      <div className="output-panel">
        <h3>Output</h3>
        <pre>{singleOutput || 'Click "Run" for output'}</pre>
      </div>

      {evalResults.length > 0 && (
        <div className="test-results">
          <h3>Test Case Results</h3>
          <table>
            <thead><tr><th>Input</th><th>Expected</th><th>Output</th><th>Pass?</th></tr></thead>
            <tbody>
              {evalResults.map((r,i) => (
                <tr key={i}>
                  <td>{r.input}</td>
                  <td>{r.expected}</td>
                  <td>{r.output}</td>
                  <td>{r.passed ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
