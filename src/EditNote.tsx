import React from 'react'
import { NoteData, Tag } from './App'
import { NoteForm } from './NoteForm'
import { useNote } from './NoteLayout'

type EditNoteProps = {
    onSubmit: (id:string, data: NoteData) => void
    onAddTag: (tag: Tag) => void,
    availableTags: Tag[]
}

export const EditNote = ({ onSubmit, onAddTag, availableTags }: EditNoteProps) => {
  const note = useNote()
  return (
    <div>
        <h1 className='mb-4'>Edit Note</h1>
        <NoteForm 
          onSubmit={data => onSubmit(note.id, data)} 
          onAddTag={onAddTag} 
          availableTags={availableTags} 
          title={note.title}
          body={note.body}
          tags={note.tags}
        />
    </div>
  )
}