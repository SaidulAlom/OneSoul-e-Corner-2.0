'use client';

import Editor from 'react-simple-wysiwyg';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  return <Editor value={value} onChange={(e) => onChange(e.target.value)} />;
};

export default RichTextEditor;
