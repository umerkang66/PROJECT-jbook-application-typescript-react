import { useTypedSelector } from '../hooks/use-typed-selector';
import CellListItem from './cell-list-item';

const CellList: React.FC = () => {
  const cells = useTypedSelector(({ cells: { order, data } }) =>
    order.map(id => data[id])
  );

  const renderedCell = cells.map(cell => (
    <CellListItem key={cell.id} cell={cell} />
  ));

  return <div>{renderedCell}</div>;
};

export default CellList;
