import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateNote } from '../../businessLogic/notes'
import { UpdateNoteRequest } from '../../requests/UpdateNoteRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const noteId = event.pathParameters.noteId
    const updatedNote: UpdateNoteRequest = JSON.parse(event.body)
    // Note: Update a Note item with the provided id using values in the "updatedNote" object
    
    const userId = getUserId(event)
    const item = await updateNote(updatedNote, noteId, userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        item
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
