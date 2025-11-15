import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import ace from "ace-builds/src-noconflict/ace";

ace.config.set("basePath", "/ace");

interface CodeEditorProps {
  language: string;
  theme: string;
  value: string;
  onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  theme,
  value,
  onChange,
}) => {
  const [loadedMode, setLoadedMode] = useState("");
  const [loadedTheme, setLoadedTheme] = useState("");

  // ✅ Utility to load external scripts safely
  const loadAceScript = (src: string) => {
    return new Promise<void>((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(`Failed to load ${src}`);
      document.body.appendChild(script);
    });
  };

  // ✅ Lazy-load mode from /public/ace
  useEffect(() => {
    const loadMode = async () => {
      if (language && loadedMode !== language) {
        const modePath = `/ace/mode-${language}.js`;
        try {
          await loadAceScript(modePath);
          setLoadedMode(language);
        } catch (err) {
          console.warn("⚠️ Mode not found:", modePath, err);
        }
      }
    };
    loadMode();
  }, [language]);

  // ✅ Lazy-load theme from /public/ace
  useEffect(() => {
    const loadTheme = async () => {
      if (theme && loadedTheme !== theme) {
        const themePath = `/ace/theme-${theme}.js`;
        try {
          await loadAceScript(themePath);
          setLoadedTheme(theme);
        } catch (err) {
          console.warn("⚠️ Theme not found:", themePath, err);
        }
      }
    };
    loadTheme();
  }, [theme]);

  return (
    <div className="h-full w-full">
      <AceEditor
        mode={language}
        theme={theme}
        name="dynamic-ace-editor"
        width="100%"
        height="100%"
        fontSize={14}
        showPrintMargin={false}
        showGutter={true}
        highlightActiveLine={true}
        value={value}
        onChange={onChange}
        enableBasicAutocompletion={true}
        enableLiveAutocompletion={true}
        enableSnippets={true}
        setOptions={{
          showLineNumbers: true,
          tabSize: 2,
          useWorker: false,
        }}
      />
    </div>
  );
};

export default CodeEditor;
