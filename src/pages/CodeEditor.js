import React, { useState, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { php } from '@codemirror/lang-php';
import { markdown } from '@codemirror/lang-markdown';
import { githubDark } from '@uiw/codemirror-theme-github';
import './CodeEditor.css';
import { codeRunnerApi } from '../api';

const languageExtensions = {
  javascript: javascript({ jsx: true }),
  python: python(),
  cpp: cpp(),
  java: java(),
  php: php(),
  markdown: markdown(),
};

const initialCode = {
  javascript: `console.log("Hello, World!");`,
  python: `print("Hello, World!")`,
  cpp: `#include <iostream>\nint main() {\n  std::cout << "Hello, World!";\n  return 0;\n}`,
  java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}`,
  php: `<?php\necho "Hello, World!";\n?>`,
  markdown: `# Hello\nThis is a markdown document.`,
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
    if (language === 'markdown') {
      setOutput('Markdown is not executable.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await codeRunnerApi.post('/execute', { language, code });
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
          <select value={language} onChange={handleLanguageChange}>
            {Object.keys(languageExtensions).map((lang) => (
              <option key={lang} value={lang}>{lang.toUpperCase()}</option>
            ))}
          </select>
          <button onClick={handleRunCode} disabled={isLoading}>
            {isLoading ? 'Running...' : '▶ Run'}
          </button>
        </div>
      </div>

      <div className="editor-layout" style={{ display: 'flex', height: '70vh' }}>
        <div className="editor-panel" style={{ flex: 1, marginRight: '10px' }}>
          <CodeMirror
            value={code}
            height="100%"
            theme={githubDark}
            extensions={[languageExtensions[language]]}
            onChange={onChange}
          />
        </div>
        <div className="output-panel" style={{ flex: 1, backgroundColor: '#111', color: '#fff', padding: '10px' }}>
          <h3>Output</h3>
          <pre>{output || 'Click "Run" to see the output.'}</pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
