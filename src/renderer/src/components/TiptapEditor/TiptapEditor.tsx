import { useImperativeHandle, forwardRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import './TiptapEditor.scss'

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

const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(
    ({ placeholder = "", id = "", className=""}, ref) => {
        const editor = useEditor({
            extensions: [
                StarterKit,
                Placeholder.configure({ placeholder: placeholder}),
            ],
            content: "",
        });

        useImperativeHandle(ref, () => ({
            getContent: ()             => editor?.getHTML() || "",
            setContent: (text: string) => editor?.commands.setContent(text),
            focus     : ()             => editor?.commands.focus()
        }));


        return <EditorContent editor={editor} id={id} placeholder={placeholder} className={"mb-2 " + className}/>;
    }
);

export default TiptapEditor;
