import React, { useState, useEffect, useRef,  useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { githubDark } from '@uiw/codemirror-theme-github';
import './CodeEditor.css';
import { mainApi, codeRunnerApi } from '../api';

const languageExtensions = {
  javascript: javascript({ jsx: true }),
  python: python(),
  cpp: cpp(),
  java: java(),
};

const initialCode = {
  javascript: `console.log("Hello, World!");`,
  python: `print("Hello, World!")`,
  cpp: `#include <iostream>\nint main() {\n  std::cout << "Hello, World!";\n  return 0;\n}`,
  java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}`,
};

const CodeEditor = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(initialCode[language]);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(initialCode[lang]);
    setOutput('');
  };

  const onChange = useCallback((value) => {
    setCode(value);
  }, []);

  const handleRunCode = async () => {
    setIsLoading(true);
    try {
      const res = await codeRunnerApi.post('/api/execute', { language, code });
      setOutput(res.data.output || 'No output or an error occurred.');
    } catch {
      setOutput('Failed to connect to execution server.');
    }
    setIsLoading(false);
  };
  


  return (
    <div className="page-container code-editor-page">
      <div className="editor-controls">
        <h1>Code Playground</h1>
        <div className="controls-right">
          <select
            className="language-selector"
            value={language}
            onChange={handleLanguageChange}
          >
            {Object.keys(languageExtensions).map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
          <button
            className="run-button"
            onClick={handleRunCode}
            disabled={isLoading}
          >
            {isLoading ? 'Running...' : '▶ Run'}
          </button>
        </div>
      </div>

      <div className="editor-layout">
        <div className="editor-panel">
          <div className="codemirror-instance">
            <CodeMirror
              value={code}
              height="100%"
              theme={githubDark}
              extensions={[languageExtensions[language]]}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="output-panel">
          <div className="output-header">Output</div>
          <div className="output-content">
            {output ? <pre>{output}</pre> : <div className="no-output">Click "Run" to see the output.</div>}
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default CodeEditor;
