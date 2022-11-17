import React, { useMemo, useState } from 'react'
import { Badge, Button, Card, Col, Form, Modal, Row, Stack } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ReactSelect from 'react-select'
import { Note, Tag } from './App'
import { EditTagsModal } from './EditTagsModal'
import styles from './NoteList.module.css'

type NoteListProps = {
  availableTags: Tag[]
  notes: Note[]
  deleteTag: (id: string) => void
  updateTag: (id: string, label: string) => void
}

type SimplifiedNote = Omit<Note, 'body'>

type OptionTag = {
  label: string,
  value: string,
}


export const NotesList = ({ availableTags, notes, deleteTag, updateTag }: NoteListProps) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [showModal, setIsShowModal] = useState(false)

  console.log(notes, 'notes')

  const [title, setTitle] = useState("")
  const filteredNotes = useMemo(() => {
    return notes?.filter(note => {
      return (note.title === "" || note.title.toLowerCase().includes(title.toLowerCase()))
        && (selectedTags.length === 0 || selectedTags.every(tag => note.tags.some(noteTag => noteTag.id === tag.id)))
    })
  }, [selectedTags, title, notes])

  const rawTagsToSelect = (tags: Tag[]): OptionTag[] => {
    return tags.map(tag => ({ label: tag.label, value: tag.id }))
  }

  return (
    <>
      <Row className={"align-items-center mb-4"}>
        <Col>
          <h1>Notes</h1>
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to="/new">
              <Button variant="primary">Create</Button>
            </Link>
            <Button variant='outline-secondary' onClick={() => setIsShowModal(true)}>Edit tags</Button>
          </Stack>
        </Col>
      </Row>
      <Form>
        <Row className='mb-4'>
          <Col>
            <Form.Group controlId='title'>
              <Form.Label>Title</Form.Label>
              <Form.Control required value={title} onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>

          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <ReactSelect
                value={rawTagsToSelect(selectedTags)}
                onChange={(tags) => {
                  setSelectedTags(tags.map((tag) => {
                    return { label: tag.label, id: tag.value }
                  }))
                }}
                options={rawTagsToSelect(availableTags)}
                isMulti />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Row sx={1} sm={2} lg={3} xl={4} className="g-3">
        {filteredNotes.map(note => (
          <Col key={note.id}>
            <NoteCard tags={note.tags} title={note.title} id={note.id} />
          </Col>
        ))}
      </Row>
      <EditTagsModal
        show={showModal}
        availableTags={availableTags}
        handleClose={() => setIsShowModal(false)}
        deleteTag={deleteTag}
        updateTag={updateTag}
      />
    </>
  )
}

function NoteCard({ id, title, tags }: SimplifiedNote) {
  return (<Card as={Link} to={`/${id}`} className={`h-100 text-reset text-decoration-none ${styles.card}`}>
    <Card.Body>
      <Stack gap={2} className="align-items-center justify-content-center">
        <span className="fs-5">{title}</span>
      </Stack>
      {tags.length > 0 && (
        <Stack direction='horizontal' gap={1} className="justify-content-center flex-wrap">
          {tags.map(tag => (
            <Badge key={tag.id} className="text-truncate">
              {tag.label}
            </Badge>
          ))}
        </Stack>
      )
      }
    </Card.Body>
  </Card>)
}