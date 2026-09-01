import { X } from 'lucide-react'
import type { Document } from '../types'

interface DocumentTabsProps {
  documents: Document[]
  selectedId?: string
  onSelect: (document: Document) => void
  onClose: (documentId: string) => void
}

export function DocumentTabs({ documents, selectedId, onSelect, onClose }: DocumentTabsProps) {
  if (documents.length === 0) return null
  return <nav aria-label="Open documents" className="mb-4 flex overflow-x-auto border-b border-stone-200"><div className="flex min-w-max gap-1">{documents.map((document) => <div key={document.id} className={`flex items-center rounded-t px-2 py-2 font-sans text-sm ${document.id === selectedId ? 'bg-white font-semibold text-emerald-900' : 'text-stone-500 hover:bg-stone-100'}`}><button onClick={() => onSelect(document)} className="max-w-44 truncate text-left">{document.title}</button><button title={`Close ${document.title}`} onClick={(event) => { event.stopPropagation(); onClose(document.id) }} className="ml-2 rounded p-0.5 hover:bg-stone-200"><X size={14} /></button></div>)}</div></nav>
}