import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
    Button,
    Grid,
    Header,
    Icon,
    Loader
} from 'semantic-ui-react'

import { createNote, deleteNote, getNotes } from '../api/notes-api'
import Auth from '../auth/Auth'
import { Note } from '../types/Note'
import { EMPTY_DOC } from '../constants/constants'
import { Link } from 'react-router-dom'
import { Preview } from './Editor'

interface NotesProps {
    auth: Auth
    history: History
}

interface NotesState {
    notes: Note[]
    newNoteTitle: string
    loadingNotes: boolean
}

export class Notes extends React.PureComponent<NotesProps, NotesState> {
    state: NotesState = {
        notes: [],
        newNoteTitle: '',
        loadingNotes: true
    }

    handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ newNoteTitle: event.target.value })
    }

    onEditButtonClick = (noteId: string) => {
        this.props.history.push(`/notes/${noteId}/edit`)
    }

    onCreateClick = () => { this.props.history.push('/notes/new') }

    onNoteCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
        try {
            const content = EMPTY_DOC
            const newNote = await createNote(this.props.auth.getIdToken(), {
                title: this.state.newNoteTitle,
                content
            })
            this.setState({
                notes: [...this.state.notes, newNote],
                newNoteTitle: ''
            })
        } catch {
            alert('Note creation failed')
        }
    }

    onNoteDelete = async (noteId: string) => {
        try {
            await deleteNote(this.props.auth.getIdToken(), noteId)
            this.setState({
                notes: this.state.notes.filter(note => note.noteId !== noteId)
            })
        } catch {
            alert('Note deletion failed')
        }
    }

    async componentDidMount() {
        try {
            const notes = await getNotes(this.props.auth.getIdToken())
            this.setState({
                notes,
                loadingNotes: false
            })
        } catch (e) {
            alert(`Failed to fetch notes: ${(e as Error).message}`)
        }
    }

    render() {
        return (
            <div>
                <div className="display-flex">
                    <Header as="h1" className="flex-grow">Notes</Header>
                    {this.renderCreateNoteInput()}
                </div>
                {this.renderNotes()}
            </div>
        )
    }

    renderCreateNoteInput() {
        return <Link to="/notes/new">
            <Icon.Group size="large">
                <Icon name='sticky note outline' />
                <Icon corner='top right' name='add' />
            </Icon.Group>
        </Link>
    }

    renderNotes() {
        if (this.state.loadingNotes) {
            return this.renderLoading()
        }

        return this.renderNotesList()
    }

    renderLoading() {
        return (
            <Grid.Row>
                <Loader indeterminate active inline="centered">
                    Loading Notes
                </Loader>
            </Grid.Row>
        )
    }

    renderNotesList() {
        return (<>
            <Grid columns='equal'>
                {this.state.notes.map((note, pos) => {
                    return (
                        <Grid.Column key={note.noteId} mobile={16} tablet={8} computer={4}>
                            <Preview 
                                title={note.title} 
                                document={note.content}
                                onEditClick={() => this.onEditButtonClick(note.noteId)}
                                onDeleteClick={() => this.onNoteDelete(note.noteId)}
                            />
                        </Grid.Column>
                    )
                })}
            </Grid>
            {this.state.notes.length === 0 && <div className="display-flex flex-grow center mts">
                <Button 
                    size="big"
                    className="center"
                    color="teal"
                    onClick={this.onCreateClick}
                >
                    Create a Note
                </Button>
            </div>}
        </>)
    }

    calculateDueDate(): string {
        const date = new Date()
        date.setDate(date.getDate() + 7)

        return dateFormat(date, 'yyyy-mm-dd') as string
    }
}
