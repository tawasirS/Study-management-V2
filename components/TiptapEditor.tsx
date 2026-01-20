
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";

import {
    Bold, Italic, List, ListOrdered, Heading1, Heading2,
    Table as TableIcon, Link as LinkIcon, Code,
    Type, Quote, SquareCode, Image as ImageIcon
} from "lucide-react";

// Initialize lowlight
const lowlight = createLowlight(common);

interface TiptapEditorProps {
    content: string;
    onChange?: (html: string) => void;
    editable?: boolean;
}

const TiptapEditor = ({ content, onChange, editable = true }: TiptapEditorProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline decoration-blue-300 underline-offset-4 hover:text-blue-800 transition-colors',
                },
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
        ],
        content: content,
        editable: editable,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-lg focus:outline-none min-h-[500px] max-w-none px-4",
            },
        },
        immediatelyRender: false,
    });

    if (!editor) {
        return null;
    }

    const addLink = () => {
        const url = window.prompt("URL");
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const addImage = () => {
        const url = window.prompt("Image URL");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="flex flex-col h-full group/editor">
            {editable && (
                <div className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-20 px-2 py-2 flex gap-1 flex-wrap items-center transition-all duration-300">
                    <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${editor.isActive("heading", { level: 1 }) ? "bg-gray-100 text-blue-600" : "text-gray-500"}`}
                        >
                            <Heading1 size={18} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-gray-100 text-blue-600" : "text-gray-500"}`}
                        >
                            <Heading2 size={18} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().setParagraph().run()}
                            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${editor.isActive("paragraph") ? "bg-gray-100 text-blue-600" : "text-gray-500"}`}
                        >
                            <Type size={18} />
                        </button>
                    </div>

                    <div className="flex items-center gap-1 px-2 border-r border-gray-200">
                        <button
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${editor.isActive("bold") ? "bg-gray-100 text-blue-600" : "text-gray-500"}`}
                        >
                            <Bold size={18} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${editor.isActive("italic") ? "bg-gray-100 text-blue-600" : "text-gray-500"}`}
                        >
                            <Italic size={18} />
                        </button>
                    </div>

                    <div className="flex items-center gap-1 px-2 border-r border-gray-200">
                        <button
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${editor.isActive("bulletList") ? "bg-gray-100 text-blue-600" : "text-gray-500"}`}
                        >
                            <List size={18} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${editor.isActive("orderedList") ? "bg-gray-100 text-blue-600" : "text-gray-500"}`}
                        >
                            <ListOrdered size={18} />
                        </button>
                    </div>

                    <div className="flex items-center gap-1 pl-2">
                        <button
                            onClick={addLink}
                            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${editor.isActive("link") ? "bg-gray-100 text-blue-600" : "text-gray-500"}`}
                        >
                            <LinkIcon size={18} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${editor.isActive("codeBlock") ? "bg-gray-100 text-blue-600" : "text-gray-500"}`}
                        >
                            <SquareCode size={18} />
                        </button>
                        <button
                            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                        >
                            <TableIcon size={18} />
                        </button>
                        <button
                            onClick={addImage}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                        >
                            <ImageIcon size={18} />
                        </button>
                    </div>
                </div>
            )}



            <div className="flex-1 overflow-y-auto pt-6 pb-24">
                <EditorContent editor={editor} />
            </div>

            <style jsx global>{`
                .ProseMirror {
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                    color: #1a1a1a;
                    line-height: 1.8;
                }
                .ProseMirror h1 {
                    font-weight: 800;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    font-size: 2.5rem;
                    letter-spacing: -0.025em;
                }
                .ProseMirror h2 {
                    font-weight: 700;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                    font-size: 1.875rem;
                }
                .ProseMirror p {
                    margin-bottom: 1rem;
                }
                .ProseMirror table {
                    border-collapse: collapse;
                    table-layout: fixed;
                    width: 100%;
                    margin: 1.5rem 0;
                    border: 1px solid #e1e4e8;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .ProseMirror td, .ProseMirror th {
                    min-width: 1em;
                    padding: 10px 12px;
                    vertical-align: top;
                    box-sizing: border-box;
                    position: relative;
                    border: 1px solid #e1e4e8;
                }
                .ProseMirror th {
                    font-weight: bold;
                    text-align: left;
                    background-color: #f8f9fa;
                }
                .ProseMirror pre {
                    background: #f1f3f5;
                    color: #333;
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin: 1.5rem 0;
                    font-family: 'JetBrains Mono', 'Fira Code', monospace;
                    font-size: 0.9rem;
                    border: 1px solid #e9ecef;
                }
                .ProseMirror code {
                    background: rgba(135, 131, 120, 0.15);
                    color: #EB5757;
                    padding: 0.2rem 0.4rem;
                    border-radius: 3px;
                    font-size: 0.85em;
                }
                .ProseMirror img {
                    border-radius: 12px;
                    margin: 2rem 0;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                }
                .ProseMirror blockquote {
                    border-left: 4px solid #e1e4e8;
                    padding-left: 1.5rem;
                    color: #4b5563;
                    font-style: italic;
                    margin: 1.5rem 0;
                }
            `}</style>
        </div>
    );
};

export default TiptapEditor;
