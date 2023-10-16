import React, { useEffect } from 'react'
import Auth from '../auth/Auth'
import { deleteNote, getNote, patchNote } from '../api/notes-api'
import { EMPTY_DOC } from '../constants/constants'
import Editor from './Editor'
import { Note } from '../types/Note'
import { UpdateNoteRequest } from '../types/UpdateNoteRequest'
import Loading from './Loading'

interface EditNoteProps {
    match: {
        params: {
            noteId: string
        }
    }
    auth: Auth
    history: any
}

export function EditNote(props: EditNoteProps) {
    const { noteId } = props.match.params
    const { history } = props
    const idToken = props.auth.getIdToken()

    const [note, setNote] = React.useState<Note>({
        title: '',
        content: EMPTY_DOC
    } as Note)

    const [loading, setLoading] = React.useState<boolean>(true)

    useEffect(() => {
        const fetchNote = async () => {
            const note = await getNote(idToken, noteId)
            setNote(note)
            setLoading(false)
        }
        fetchNote()
    }, [noteId, idToken])

    const handleSave = async (title: string, content: string) => {
        await patchNote(idToken, noteId, {
            title, content
        } as UpdateNoteRequest)
    }

    const handleDelete = async () => {
        await deleteNote(idToken, noteId)
        history.push('/')
    }

    return <>
        {!loading && <Editor 
            title={note.title}
            document={note.content}
            onSaveClick={handleSave}
            onDeleteClick={handleDelete}
        />}
        {loading && <Loading />}
    </>
}