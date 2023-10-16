import React from 'react'
import Auth from '../auth/Auth'
import { createNote } from '../api/notes-api'
import { EMPTY_DOC } from '../constants/constants'
import Editor from './Editor'
import { CreateNoteRequest } from '../types/CreateNoteRequest'

interface CreateNoteProps {
    auth: Auth
    history: any
}

export function CreateNote(props: CreateNoteProps) {

    const handleSave = async (title: string = '', content: string = EMPTY_DOC) => {
        try {
            const requesTitle = title ? title : `Notes from ${new Date().toLocaleDateString()}`
            const idToken = props.auth.getIdToken()
            const newNote = await createNote(
                idToken,
                { title: requesTitle, content } as CreateNoteRequest
            )
            props.history.push(`/notes/${newNote.noteId}/edit`)
        } catch {
            alert('Note creation failed')
        }
    }

    const handleDelete = async () => {
        props.history.push('/')
    }

    return <Editor 
                title={''}
                document={EMPTY_DOC}
                onSaveClick={handleSave}
                onDeleteClick={handleDelete} 
            />
}