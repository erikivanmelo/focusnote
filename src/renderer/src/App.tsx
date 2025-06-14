import { Outlet } from 'react-router-dom';
import Menu from './components/Menu';

function App() {
  return (
    <>
      <Menu />
      <div className="row justify-content-center notes-container">
        <main className="col-lg-8">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;
