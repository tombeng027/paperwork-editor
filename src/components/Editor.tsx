import { useEffect, useRef } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Heading1, Heading2, Italic, List, ListOrdered, Underline as UnderlineIcon } from 'lucide-react'
import type { SaveState } from '../types'

interface EditorProps { documentId: string; content: string; saveState: SaveState; onChange: (content: string) => void }
export function Editor({ documentId, content, saveState, onChange }: EditorProps) {
  const onChangeRef = useRef(onChange)
  useEffect(() => { onChangeRef.current = onChange }, [onChange])
  const editor = useEditor({ extensions: [StarterKit], content, onUpdate: ({ editor: current }) => onChangeRef.current(current.getHTML()) })
  useEffect(() => { if (editor && editor.getHTML() !== content) editor.commands.setContent(content) }, [documentId])
  useEffect(() => { const append = (event: Event) => editor?.chain().focus().insertContent((event as CustomEvent<string>).detail).run(); window.addEventListener('paperwork:insert-content', append); return () => window.removeEventListener('paperwork:insert-content', append) }, [editor])
  if (!editor) return <p className="font-sans text-sm text-stone-500">Loading editor...</p>
  const tools = [{ label: 'Bold', icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') }, { label: 'Italic', icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') }, { label: 'Underline', icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline') }, { label: 'Heading 1', icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) }, { label: 'Heading 2', icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) }, { label: 'Bulleted list', icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') }, { label: 'Numbered list', icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') }]
  const status = saveState === 'saving' ? 'Saving...' : saveState === 'saved' ? 'Saved to database' : saveState === 'offline' ? 'Saved locally (offline)' : 'Idle'
  return <div><div className="mb-5 flex flex-wrap items-center gap-1 border-b border-stone-200 pb-3">{tools.map(({ label, icon: Icon, action, active }) => <button key={label} title={label} onClick={action} className={`rounded p-2 ${active ? 'bg-emerald-100 text-emerald-900' : 'hover:bg-stone-100'}`}><Icon size={17} /></button>)}<span className={`ml-auto font-sans text-xs ${saveState === 'offline' ? 'text-amber-700' : 'text-stone-500'}`}>{status}</span></div><EditorContent editor={editor} /></div>
}