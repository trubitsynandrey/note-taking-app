import React, { FormEvent, useRef, useState } from 'react'
import { Button, Col, Form, Row, Stack } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import CreatableReactSelect from 'react-select/creatable'
import { Note, NoteData, Tag } from './App'
import { v4 as uuidV4 } from 'uuid'

type NoteFormProps = {
  onSubmit: (data: NoteData) => void,
  onAddTag: (tag: Tag) => void,
  availableTags: Tag[]
} & Partial<Note>

type OptionTag = {
  label: string,
  value: string,
}

export const NoteForm = ({ onSubmit, onAddTag, availableTags, body = "", title = "", tags = [] }: NoteFormProps) => {
  const titleRef = useRef<HTMLInputElement>(null)
  const areaRef = useRef<HTMLTextAreaElement>(null)
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags)

  const rawTagsToSelect = (tags: Tag[]): OptionTag[] => {
    return tags.map(tag => ({ label: tag.label, value: tag.id }))
  }

  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit({
      title: titleRef.current!.value,
      body: areaRef.current!.value,
      tags: selectedTags,
    })

    navigate("..")
  }
  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group controlId='title'>
              <Form.Label>Title</Form.Label>
              <Form.Control ref={titleRef} required defaultValue={title} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId='tags'>
              <Form.Label>Tags</Form.Label>
              <CreatableReactSelect
                value={rawTagsToSelect(selectedTags)}
                onChange={(tags) => {
                  setSelectedTags(tags.map((tag) => {
                    return { label: tag.label, id: tag.value }
                  }))
                }}
                onCreateOption={
                  label => {
                    const newTag = { id: uuidV4(), label }
                    onAddTag(newTag)
                    setSelectedTags(prev => ([...prev, newTag]))
                  }
                }
                options={rawTagsToSelect(availableTags)}
                isMulti />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId='markdown'>
          <Form.Label>Body</Form.Label>
          <Form.Control required as="textarea" ref={areaRef} rows={15} defaultValue={body} />
        </Form.Group>
        <Stack direction='horizontal' gap={2} className='justify-content-end'>
          <Button type="submit" variant="primary">Save</Button>
          <Link to="..">
            <Button type="button" variant="outline-secondary">Cancel</Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  )
}
