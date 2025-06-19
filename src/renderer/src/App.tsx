import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Menu from './components/Menu';
import UpdateNotifier from './components/UpdateNotifier/UpdateNotifier';

function App() {
  return (
    <>
      <Menu>
        <Container className="py-4">
          <Outlet />
        </Container>
      </Menu>
      <UpdateNotifier />
    </>
  );
}

export default App;
