import { Outlet } from 'react-router-dom';
import Menu from './components/Menu';

function App() {
  return (
    <>
      <Menu>
          <Outlet />
      </Menu>
    </>
  );
}

export default App;
