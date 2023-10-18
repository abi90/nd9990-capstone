import React from 'react'
import { LexicalComposer, InitialConfigType } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import theme from './themes/Theme'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { Dropdown, Header, Segment, Image } from 'semantic-ui-react'
import { EMPTY_DOC } from '../../constants/constants'

interface PreviewProps {
    title?: string
    document?: string
    attachmentUrl?: string
    onEditClick: () => void
    onAttachmentClick: () => void
    onDeleteClick: () => Promise<void>
}

export const Preview = (props: PreviewProps) => {
    const { 
        title = '',
        document = EMPTY_DOC,
        attachmentUrl = '',
        onEditClick,
        onAttachmentClick,
        onDeleteClick
    } = props
    //@ts-ignore
    const editorConfig = {
        editable: false,
        onError(_: any) {
        },
        theme
    } as InitialConfigType

    return (
        <Segment>
            <div className="">
                
                <div className="display-flex">
                    <Header as="h4" className="flex-grow">{title}</Header>
                    <Dropdown icon='ellipsis vertical' pointing="top right" inline>
                        <Dropdown.Menu>
                            <Dropdown.Item icon='pencil' text='Add Attachment' onClick={onAttachmentClick}/>
                            <Dropdown.Item icon='pencil' text='Edit' onClick={onEditClick}/>
                            <Dropdown.Item icon='trash' text='Delete' onClick={onDeleteClick}/>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <LexicalComposer
                    initialConfig={{...editorConfig, editorState: document}}
                >
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="preview-input" />}
                        placeholder={<></>}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                </LexicalComposer>
                <div className="display-flex">
                    {attachmentUrl && (
                        <Image src={attachmentUrl} size="small" wrapped />
                    )}
                </div>
            </div>
        </Segment>
    );
}
