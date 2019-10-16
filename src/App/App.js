import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
// import dummyStore from '../dummy-store';
// import {getNotesForFolder, findNote, findFolder} from '../notes-helpers';
import './App.css';
import config from '../config';
import NotefulContext from '../NotefulContext';

class App extends Component {
    state = {
        notes: [],
        folders: []
    };

    componentDidMount() {
        // fake date loading from API call
        // setTimeout(() => this.setState(dummyStore), 600);
        Promise.all([
            fetch(`${config.API_ENDPOINT}/notes`),
            fetch(`${config.API_ENDPOINT}/folders`)
        ])
            .then(([notesRes, folderRes]) => {
                if(!notesRes.ok)
                    return notesRes.json().then(e => Promise.reject(e));
                if(!folderRes.ok)
                    return folderRes.json().then(e => Promise.reject(e));

                return Promise.all([notesRes.json(), folderRes.json() ]);
            })
            .then(([notes, folders]) => {
                this.setState({notes, folders});
            })
            .catch(error => {
                console.error({error})
            });
    }
    
    handleDeleteNote = noteId => {
        this.setState({
            notes: this.state.notes.filter(note => note.id !== noteId)
        });
    };

    renderNavRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListNav}
                    />
                ))}
                <Route path='/note/:noteId' component={NotePageNav} />
                <Route path='/add-folder' component={NoteListNav} />
                <Route path='/add-note' component={NoteListNav} />
            </>
        );
    }

    renderMainRoutes() {
        return (
            <> 
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        // render={routeProps => {
                        //     const {folderId} = routeProps.match.params;
                        //     const notesForFolder = getNotesForFolder(
                        //         notes,
                        //         folderId
                        //     );
                        component={NoteListMain}       
                    />
                ))}
                            {/* return (
                                <NoteListMain
                                    {...routeProps}
                                    notes={notesForFolder}
                                />
                            );
                        }}
                    />
                ))} */}
                    <Route path='/note/:noteId' component={NotePageMain} />
                {/* <Route
                    path="/note/:noteId"
                    render={routeProps => {
                        const {noteId} = routeProps.match.params;
                        const note = findNote(notes, noteId);
                        return <NotePageMain {...routeProps} note={note} />;
                    }}
                /> */}
            </>
        );
    }

    render() {
        const valueContext ={
            notes: this.state.notes,
            folders: this.state.folders,
            deleteNote: this.handleDeleteNote
        };
        
        return (
            <NotefulContext.Provider value={valueContext}>
                <div className="App">
                    <nav className="App__nav">{this.renderNavRoutes()}</nav>
                    <header className="App__header">
                        <h1>
                            <Link to="/">Noteful</Link>{' '}
                            <FontAwesomeIcon icon="check-double" />
                        </h1>
                    </header>
                    <main className="App__main">{this.renderMainRoutes()}</main>
                </div>
            </NotefulContext.Provider>
        );
    }
};

export default App;
