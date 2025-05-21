import NoteCardList from './components/NoteCardList'
import Menu from './components/Menu'
import NoteCreator from './components/NoteCreator';
import {useGenericQueryNoParams} from './hooks/useGenericQuery';
import tagService from './services/tagService';


function App() {

    const {data: tags} = useGenericQueryNoParams(["tags"], tagService.getAllNames)

    console.log(tags);
    return <>
        <Menu />
        <div className="row justify-content-center notes-container" >
            <div className="col-lg-8">
                <NoteCreator autocompleteTagList={tags}/>
                <hr />

                <NoteCardList/>
                
            </div>
        </div>
    </>
}

export default App;
