import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import * as uuid from 'uuid'

import { createAttachmentPresignedUrl, updateTodoWithAttachmentUrl } from '../../businessLogic/notes'
import { getUserId } from '../utils'

export const handler = middy(
     async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
          const noteId = event.pathParameters.noteId
      
          const userId = getUserId(event)
          const attachmentId = uuid.v4()
          
          const url = await createAttachmentPresignedUrl(attachmentId)
          await updateTodoWithAttachmentUrl(userId, noteId, attachmentId)

          return {
               statusCode: 200,
               body: JSON.stringify({
                    uploadUrl: url
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
