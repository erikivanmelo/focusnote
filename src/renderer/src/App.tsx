import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Menu from './components/Menu';
import NoteCardList from './components/NoteCardList';

function App() {
    return (
        <>
            <Menu>
                <NoteCardList />
            </Menu>
            <ToastContainer
                className="mt-4"
                position="top-right"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </>
    );
}

export default App;
