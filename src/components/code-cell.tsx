import { useState, useEffect } from 'react';

import CodeEditor from './code-editor';
import Preview from './preview';
import bundler from '../bundler';
import Resizable from './resizable';

const CodeCell = () => {
  const [input, setInput] = useState('');
  const [debouncedInput, setDebouncedInput] = useState(input);
  const [code, setCode] = useState('');

  // use effect for setting debounced term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedInput(input);
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [input]);

  useEffect(() => {
    const onChangeBundle = async () => {
      const resultCode = await bundler(debouncedInput);
      setCode(resultCode);
    };

    onChangeBundle();
  }, [debouncedInput]);

  return (
    <Resizable direction="vertical">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <Resizable direction="horizontal">
          <CodeEditor initialValue="" onChange={input => setInput(input)} />
        </Resizable>
        <Preview code={code} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
