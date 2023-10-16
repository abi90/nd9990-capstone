import { NotesAccess } from '../helpers/notesAcess'
import { NoteItem } from '../models/NoteItem'
import { CreateNoteRequest } from '../requests/CreateNoteRequest'
import { UpdateNoteRequest } from '../requests/UpdateNoteRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import { NoteUpdate } from '../models/NoteUpdate'

const NoteAccess = new NotesAccess()
const logger = createLogger('Notes')

export const createNote = async (request: CreateNoteRequest, userId: string ): Promise<NoteItem> => {
    try {
        logger.info('creating Note')
        const item: NoteItem = {
            userId,
            noteId: uuid.v4(),
            createdAt: new Date().toISOString(),
            done: false,
            ...request
        } as NoteItem

        await NoteAccess.createNote(item)
        return item
    } catch (e) {
        logger.log('error', e)
        throw e
    }
}

export const getAllNotesFor = async (userId: string): Promise<NoteItem[]> => {
    try {
        logger.info('get all Notes for user')
        return await NoteAccess.getNotesFor(userId)
    } catch (e) {
        logger.info(e)
        logger.log('error', e)
        throw e
    }
}

export const getNote = async (userId: string, noteId: string): Promise<NoteItem | createError.HttpError> => {
    try {
        logger.info(`user ${userId} want to read Note ${noteId}`)

        if (await isOwner(userId, noteId)) {
            return new createError.Forbidden()
        }
        
        return await NoteAccess.getNote(noteId)
    } catch (e) {
        logger.log('error', e)
        throw e
    }
}

export const updateNote = async (request: UpdateNoteRequest, noteId: string, userId: string): Promise<NoteUpdate | createError.HttpError> => {
    try {
        logger.info('updating Note')

        if (await isOwner(userId, noteId)) {
            return new createError.Forbidden()
        }

        const item = { ...request } as NoteUpdate
        await NoteAccess.updateNote(noteId, item)
        
        return item
    } catch (e) {
        logger.log('error', e)
        throw e
    }
}

export const deleteNote = async (userId: string, noteId: string): Promise<string | createError.HttpError> => {
    try {
        logger.info('updating Note')

        if (await isOwner(userId, noteId)) {
            return new createError.Forbidden()
        }
        
        await NoteAccess.deleteNote(noteId)
        return noteId
    } catch (e) {
        logger.log('error', e)
        throw e
    }
}

const isOwner = async (userId: string, noteId: string): Promise<boolean> => {
    const item = await NoteAccess.getNote(noteId)
    return userId !== item.userId
}