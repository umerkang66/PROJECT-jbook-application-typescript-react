import { useTypedSelector } from './use-typed-selector';

export const useCommulativeCode = (cellId: string) => {
  return useTypedSelector(state => {
    const { data, order } = state.cells;
    const orderedCells = order.map(id => data[id]);

    const showFunc = `
      import _React from 'react';
      import _ReactDOM from 'react-dom';

      var show = (value) => {
        if (!value) return;
        const root = document.querySelector('#root');

        if (value instanceof Object) {
          if (value.$$typeof && value.props) {
            _ReactDOM.render(value, root);
          } else {
            root.innerHTML = JSON.stringify(value);
          }
        } else {
          root.innerHTML = value;
        }
      };
    `;

    const showFuncNoOp = 'var show = () => {};';
    const commulativeCode = [];

    for (const c of orderedCells) {
      if (c.type === 'code') {
        if (c.id === cellId) commulativeCode.push(showFunc);
        else commulativeCode.push(showFuncNoOp);

        commulativeCode.push(c.content);
      }

      if (c.id === cellId) break;
    }

    return commulativeCode;
  }).join('\n');
};
