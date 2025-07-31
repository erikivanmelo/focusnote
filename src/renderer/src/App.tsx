import { Toaster } from 'react-hot-toast';
import Menu from './components/Menu';
import NoteCardList from './components/NoteCardList';

function App() {
    return (
        <>
            <Menu>
                <NoteCardList />
            </Menu>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 1500,
                    style: {
                        background: '#363636',
                        color: '#fff',
                        marginTop: '30px',
                    },
                }}
            />
        </>
    );
}

export default App;
