import { useMemo } from 'react'
import { Container } from 'react-bootstrap'
import { Navigate, Route, Routes } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'
import './App.css'
import { EditNote } from './EditNote'
import { NewNote } from './NewNote'
import { Note } from './Note'
import { NoteLayout } from './NoteLayout'
import { NotesList } from './NotesList'
import { useLocalStorage } from './useLocalStorage'

export type Note = {
  id: string
} & NoteData

export type NoteData = {
  title: string,
  body: string,
  tags: Tag[]
}

export type Tag = {
  id: string,
  label: string,
}

export type RawNote = {
  id: string
} & RawNoteData

export type RawNoteData = {
  title: string,
  body: string,
  tagIds: string[]
}

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", [])
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])

  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id)) }
    })
  }, [notes, tags])

  const onCreateNote = ({ tags, ...data }: NoteData) => {
    setNotes((prevNotes) => {
      return [...prevNotes, { ...data, id: uuidV4(), tagIds: tags.map(tag => tag.id) }]
    })
  }

  const onUpdateNote = (id: string, { tags, ...data }: NoteData) => {
    setNotes((prevNotes) => {
      return prevNotes.map(prevNote => {
        if (prevNote.id === id) {
          return { ...prevNote, ...data, tagIds: tags.map(tag => tag.id) }
        } else {
          return prevNote
        }
      })
    })
  }

  const onDeleteNote = (id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id))
  }

  const addTag = (tag: Tag) => {
    setTags(prevTags => [...prevTags, tag])
  }

  const updateTag = (id: string, label: string) => {
    setTags(prevTags => {
      return prevTags.map(tag => {
        if (tag.id === id) {
          return { ...tag, label: label }
        } else {
          return tag
        }
      })
    })
  }

  const deleteTag = (id: string) => {
    setTags(prevTags => prevTags.filter(tag => tag.id !== id))
  }

  return (
    <Container className='my-4'>
      <Routes>
        <Route
          path="/"
          element={
            <NotesList
              availableTags={tags}
              notes={notesWithTags}
              updateTag={updateTag}
              deleteTag={deleteTag}
            />
          }
        />
        <Route path="new" element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags} />} />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDelete={onDeleteNote} />} />
          <Route path="edit" element={<EditNote onSubmit={onUpdateNote} onAddTag={addTag} availableTags={tags} />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  )
}

export default App
