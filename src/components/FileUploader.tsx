import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { parseFileToContent } from '../utils/fileParser'

interface FileUploaderProps { editorId: string; onError: (message: string) => void }
export function FileUploader({ editorId, onError }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null); const [uploading, setUploading] = useState(false)
  const importFile = async (file: File) => { setUploading(true); onError(''); try { const { content } = await parseFileToContent(file); const { error } = await supabase.storage.from('document-attachments').upload(`${editorId}/${Date.now()}-${file.name}`, file); if (error) throw error; window.dispatchEvent(new CustomEvent('paperwork:insert-content', { detail: content })) } catch (error) { onError(error instanceof Error ? error.message : 'Could not import file.') } finally { setUploading(false) } }
  return <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const file = event.dataTransfer.files[0]; if (file) importFile(file) }} className="mt-6 flex items-center justify-between gap-3 rounded border border-dashed border-stone-300 bg-stone-50 px-4 py-3"><p className="font-sans text-sm text-stone-600">Drop a .txt or .md file to append it.</p><input ref={inputRef} type="file" accept=".txt,.md,text/plain,text/markdown" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) importFile(file) }} /><button type="button" title="Import text file" disabled={uploading} onClick={() => inputRef.current?.click()} className="rounded p-2 text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"><Upload size={18} /></button></div>
}