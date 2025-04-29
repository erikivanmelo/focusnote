import Note from './components/Note'
import Menu from './components/Menu'

function App() {
    const dt = new Date();
    const tags = ["tag", "otherTag", "exampleTag"];
    const colors = [
        "light",
        "blue",
        "green",
        "yellow",
        "red",
        "purple",
        "pink",
        "orange"
    ];
    return <>
        <Menu />
        <div className="row justify-content-center notes-container" >
            <div className="col-lg-8">
                {colors.map((color, index) => (
                    <Note id={index} datetime={dt} title={`${color} note`} tags={tags} color={color}> 
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
                        At quia nesciunt autem dicta voluptate, id mollitia libero doloribus, possimus animi laudantium? 
                        Ducimus voluptatibus vero corporis voluptas ratione, assumenda odit libero
                    </Note>
                ))}


            </div>
        </div>
    </>
}

export default App;
