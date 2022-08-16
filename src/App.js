import { useState, useEffect } from 'react'

import Note from './components/Note'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('a new note...') 
  const [showAll, setShowAll] = useState(true)

  // Get all note from server effect
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => { setNotes(initialNotes) })
  }, [])

  // Create a new note and push to db
  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote("")
      })
  }

  // Update note importance in db
  const toggleImportance = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote  => { setNotes(notes.map(note => note.id !== id ? note : returnedNote)) })
      .catch(error => {
        alert(`The note '${note.content}' was already deleted from the server`)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  // App logic
  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  // HTML output
  return (
    <div>
      <h1>Notes</h1>
      <div>        <button onClick={() => setShowAll(!showAll)}>          show {showAll ? 'important' : 'all' }        </button>      </div>
      <ul>
        {notesToShow.map((note) => 
          <Note 
            key={note.id} 
            note={note} 
            toggleImportance={() => toggleImportance(note.id)} 
          />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>   
    </div>
  )
}

export default App