import { Toaster } from 'react-hot-toast';
import Layout from './layout';
import NoteCardList from './pages/NoteCardList';

function App() {
    return (
        <>
            <Layout>
                <NoteCardList />
            </Layout>
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
