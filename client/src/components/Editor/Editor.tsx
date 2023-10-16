import React, { useEffect } from 'react'
import theme from './themes/Theme'
import {$getRoot, $getSelection, EditorState} from 'lexical'
import { LexicalComposer, InitialConfigType } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import ToolbarPlugin from './plugins/ToolbarPlugin'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { ListItemNode, ListNode } from '@lexical/list'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { TRANSFORMERS } from '@lexical/markdown'

import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin'
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin'
import AutoLinkPlugin from './plugins/AutoLinkPlugin'

import { Button, Dropdown, Input, InputOnChangeData } from 'semantic-ui-react'

import { EMPTY_DOC } from '../../constants/constants'

import "./styles.css"

function Placeholder() {
    return <div className="editor-placeholder">Enter some rich text...</div>
}

// @ts-ignore
const editorConfig: InitialConfigType = {
    onError(error) {
        throw error
    },
    theme,
    nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        AutoLinkNode,
        LinkNode
    ]
}

interface EditorProps {
    title?: string
    document?: string
    onSaveClick: (title: string, content: string) => Promise<void>
    onDeleteClick: () => Promise<void>
}

export default function Editor(props: EditorProps) {
    const { 
        title = '',
        document = EMPTY_DOC,
        onSaveClick,
        onDeleteClick
    } = props

    const [editorState, setEditorState] = React.useState<EditorState>(JSON.parse(document))
    const [docTitle, setDocTitle] = React.useState<string>(title)

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>, _: InputOnChangeData) => {
        const newTitle = event.target.value
        setDocTitle(newTitle)
    }

    useEffect(() => {
        setDocTitle(title)
        setEditorState(JSON.parse(document))
    }, [title, document])
    
    return (<div>
        <div className="editor-title">
            <Input className="flex-grow" transparent placeholder='Title...' size="massive" value={docTitle} onChange={handleTitleChange}/>
            <Dropdown icon='bars' simple pointing="top right">
                <Dropdown.Menu>
                    <Dropdown.Item icon='save' text='Save' onClick={() => {
                        // editorState.read(() => {
                        //     const root = $getRoot()
                        //     console.log(root.getTextContent())
                        // })
                        onSaveClick(docTitle, JSON.stringify(editorState))
                    }}/>
                    <Dropdown.Item icon='trash' text='Delete' onClick={() => {
                        onDeleteClick()
                    }}/>
                </Dropdown.Menu>
            </Dropdown>
        </div>
        <LexicalComposer initialConfig={{...editorConfig, editorState: document}}>
            <div className="editor-container">
                <ToolbarPlugin />
                <div className="editor-inner">
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="editor-input" />}
                        placeholder={<Placeholder />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <CodeHighlightPlugin />
                    <ListPlugin />
                    <LinkPlugin />
                    <AutoLinkPlugin />
                    <ListMaxIndentLevelPlugin maxDepth={7} />
                    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                    <OnChangePlugin onChange={(editorState) => setEditorState(editorState)} />
                </div>
            </div>
        </LexicalComposer>
    </div>)
}
