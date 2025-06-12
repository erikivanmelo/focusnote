import { Outlet } from 'react-router-dom';
import Menu from './components/Menu';

function App() {
  return (
    <div className="row justify-content-center notes-container">
      <Menu />
      <main className="col-lg-8">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
