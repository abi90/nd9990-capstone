import { NotesAccess } from '../helpers/notesAcess'
import { NoteItem } from '../models/NoteItem'
import { CreateNoteRequest } from '../requests/CreateNoteRequest'
import { UpdateNoteRequest } from '../requests/UpdateNoteRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import { NoteUpdate } from '../models/NoteUpdate'
import { AttachmentUtils } from '../helpers/attachmentUtils'

const noteAccess = new NotesAccess()
const logger = createLogger('Notes')
const attachmentUtils = new AttachmentUtils()

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

        await noteAccess.createNote(item)
        return item
    } catch (e) {
        logger.log('error', e)
        throw e
    }
}

export const getAllNotesFor = async (userId: string): Promise<NoteItem[]> => {
    try {
        logger.info('get all Notes for user')
        return await noteAccess.getNotesFor(userId)
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
        
        return await noteAccess.getNote(noteId)
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
        await noteAccess.updateNote(noteId, item)
        
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
        
        await noteAccess.deleteNote(noteId)
        return noteId
    } catch (e) {
        logger.log('error', e)
        throw e
    }
}

export const createAttachmentPresignedUrl = async (attachmentId: string): Promise<string | createError.HttpError> => {
    try {
        logger.info('creating attachment presigned url')
        return attachmentUtils.getSignedUrl(attachmentId)
    } catch (e) {
        logger.log('error', e)
        throw e
    }
}

export const updateTodoWithAttachmentUrl = async (userId: string, noteId: string, attachmentId: string): Promise<string | createError.HttpError> => {
    try {
        logger.info('updating note with attachment url')

        if (await isOwner(userId, noteId)) {
            return new createError.Forbidden()
        }
        const attachmentUrl = attachmentUtils.getAttachmentUrl(attachmentId)
        await noteAccess.updateTodoWithAttachmentUrl(noteId, attachmentUrl)
    } catch (e) {
        logger.log('error', e)
        throw e
    }
}

const isOwner = async (userId: string, noteId: string): Promise<boolean> => {
    const item = await noteAccess.getNote(noteId)
    return userId !== item.userId
}