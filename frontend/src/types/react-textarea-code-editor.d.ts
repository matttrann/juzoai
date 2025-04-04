declare module '@uiw/react-textarea-code-editor' {
  import React from 'react';

  export interface CodeEditorProps {
    value: string;
    language?: string;
    placeholder?: string;
    onChange?: (evt: React.ChangeEvent<HTMLTextAreaElement>) => void;
    padding?: number;
    style?: React.CSSProperties;
    'data-testid'?: string;
    className?: string;
    name?: string;
    readOnly?: boolean;
    disabled?: boolean;
    autoFocus?: boolean;
    minHeight?: number | string;
  }

  const CodeEditor: React.FC<CodeEditorProps>;
  
  export default CodeEditor;
} 