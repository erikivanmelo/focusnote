import { useImperativeHandle, forwardRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import './TiptapEditor.scss'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { all, createLowlight } from 'lowlight'

import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
export interface TiptapEditorRef {
    getContent: ()             => string;
    setContent: (text: string) => void;
    focus     : ()             => void;
}

export interface TiptapEditorProps {
    className?: string;
    placeholder?: string;
    id?:string;
}

// create a lowlight instance with all languages loaded
const lowlight = createLowlight(all)

// This is only an example, all supported languages are already loaded above
// but you can also register only specific languages to reduce bundle-size
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)
const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(
    ({ placeholder = "", id = "tiptapEditor", className=""}, ref) => {
        const editor = useEditor({
            extensions: [
                StarterKit,
                Document,
                Paragraph,
                Text,
                Placeholder.configure({ placeholder: placeholder}),
                CodeBlockLowlight.configure({
                    lowlight,
                }),
            ],
            content: "",
        });

        // Process text nodes to preserve newlines in code blocks
        const processTextNodes = (node: Node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.nodeValue || '';
                const lines = text.split('\n');
                
                if (lines.length > 1) {
                    const fragment = document.createDocumentFragment();
                    lines.forEach((line, i) => {
                        if (i > 0) fragment.appendChild(document.createElement('br'));
                        if (line) fragment.appendChild(document.createTextNode(line));
                    });
                    node.parentNode?.replaceChild(fragment, node);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                Array.from(node.childNodes).forEach(processTextNodes);
            }
        };

        // Process code blocks to preserve syntax highlighting and newlines
        const processCodeBlocks = (tempDiv: HTMLElement) => {
            // Get all code blocks from the actual DOM with syntax highlighting
            const languageElements = Array.from(
                document.querySelectorAll(".tiptap pre code[class*='language-']")
            );
            
            // Get code blocks from the temporary div
            const tempElements = Array.from(
                tempDiv.querySelectorAll("code[class*='language-']")
            );

            // Process each code block
            const minLength = Math.min(languageElements.length, tempElements.length);
            for (let i = 0; i < minLength; i++) {
                const clone = languageElements[i].cloneNode(true) as HTMLElement;
                Array.from(clone.childNodes).forEach(processTextNodes);
                tempElements[i].parentNode?.replaceChild(clone, tempElements[i]);
            }
        };

        useImperativeHandle(ref, () => ({
            getContent: () => {
                // Get editor HTML and create a temporary div for manipulation
                const editorHTML = editor?.getHTML() || "";
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = editorHTML;

                // Process code blocks to maintain syntax highlighting and newlines
                processCodeBlocks(tempDiv);

                return tempDiv.innerHTML;
            },
            setContent: (text: string) => editor?.commands.setContent(text),
            focus     : ()             => editor?.commands.focus()
        }));


        return <EditorContent editor={editor} id={id} placeholder={placeholder} className={className}/>;
    }
);

export default TiptapEditor;
