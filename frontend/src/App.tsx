import NoteCardList from './components/NoteCardList'
import Menu from './components/Menu'
import NoteForm from './components/NoteForm';

function App() {

    return <>
        <Menu />
        <div className="row justify-content-center notes-container" >
            <div className="col-lg-8">
                <NoteForm action="Publish" />
                <hr />
                <NoteCardList />
            </div>
        </div>
    </>
}

export default App;
