import NoteCardList from './components/NoteCardList'
import Menu from './components/Menu'
import NoteCreator from './components/NoteCreator';

function App() {

    return <>
        <Menu />
        <div className="row justify-content-center notes-container" >
            <div className="col-lg-8">
                <NoteCreator />
                <hr />
                <NoteCardList />
            </div>
        </div>
    </>
}

export default App;
