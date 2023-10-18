import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWSXRay from 'aws-xray-sdk'
import { NoteItem } from '../models/NoteItem'
import { NoteUpdate } from '../models/NoteUpdate'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('NotesAccess')


export class NotesAccess {
    private readonly docClient: DocumentClient
    private readonly NotesTable: string
    private readonly NotesCreateAtIndex: string

    constructor() {
        // @ts-ignore
        this.docClient = new XAWS.DynamoDB.DocumentClient()
        this.NotesTable = process.env.NOTES_TABLE
        this.NotesCreateAtIndex = process.env.NOTES_CREATED_AT_INDEX
    }

    async createNote(item: NoteItem) {
        logger.info('createNote start')
        logger.info(`creating Note for user: ${item.userId}`)
        await this.docClient.put({
            TableName: this.NotesTable,
            Item: item
        }).promise()
        logger.info('createNote end')
    }

    async getNotesFor(userId: string): Promise<NoteItem[]> {
        logger.info(`getNotesFor for ${userId} start`)

        const result = await this.docClient.query({
            TableName: this.NotesTable,
            IndexName: this.NotesCreateAtIndex,
            KeyConditionExpression: '#userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ExpressionAttributeNames: {
                '#userId': 'userId'
            }
        }).promise()

        logger.info(`getNotesFor for ${userId} end`)
        return result.Items as NoteItem[]
    }

    async updateNote(noteId: string, itemUpdate: NoteUpdate) {
        logger.info('updateNote start')
        logger.info(`updating Note: ${noteId}`)
        await this.docClient.update({
            TableName: this.NotesTable,
            Key: { noteId },
            UpdateExpression: 'set #title = :title, #content = :content',
            ExpressionAttributeNames: {
                '#title': 'title',
                '#content': 'content'
            },
            ExpressionAttributeValues: {
                ':title': itemUpdate.title,
                ':content': itemUpdate.content
            }
          }).promise()
        logger.info('updateNote end')
    }

    async deleteNote(noteId: string) {
        logger.info('deleteNote start')
        logger.info(`deleteNote Note: ${noteId}`)
        await this.docClient.delete({
            TableName: this.NotesTable,
            Key: { noteId }
        }).promise()
        logger.info('deleteNote end')
    }

    async getNote(noteId: string): Promise<NoteItem> {
        logger.info('getNote start')
        logger.info(`getNote Note: ${noteId}`)
        const result = await this.docClient.get({
            TableName: this.NotesTable,
            Key: { noteId }
        }).promise()
        logger.info('getNote end')
        return result.Item as NoteItem
    }

    async updateTodoWithAttachmentUrl(noteId: string, attachmentUrl: string) {
        logger.info('updateTodoWithAttachmentUrl start')
        await this.docClient.update({
            TableName: this.NotesTable,
            Key: { noteId },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': attachmentUrl
            }
        }) .promise()
    }

}