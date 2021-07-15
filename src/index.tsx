import * as esbuild from 'esbuild-wasm';
import { ChangeEvent, FC, useEffect, useRef } from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom';

import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const App: FC = (): JSX.Element => {
  const ref = useRef<any>();
  const [input, setinput] = useState('');
  const [code, setCode] = useState('');

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClickHandler = async () => {
    if (!ref.current) return;

    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    setCode(result.outputFiles[0].text);
  };

  const onChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setinput(e.target.value);
  };

  return (
    <div className="app">
      <textarea value={input} onChange={onChangeHandler}></textarea>
      <div>
        <button onClick={onClickHandler}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
