import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { Editor } from './Editor'

const mockEditor = {
  chain: vi.fn(),
  commands: { setContent: vi.fn() },
  getHTML: vi.fn(() => '<p>Initial</p>'),
  isActive: vi.fn(),
}
const tiptapOptions = { current: undefined as undefined | { onUpdate: ({ editor }: { editor: typeof mockEditor }) => void } }

vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn((options) => { tiptapOptions.current = options; return mockEditor }),
  EditorContent: ({ editor }: { editor: typeof mockEditor }) => <div role="textbox" aria-label="Document editor" contentEditable onInput={() => tiptapOptions.current?.onUpdate({ editor })} />,
}))

const documentRecord = { id: 'document-1', title: 'Untitled document', content: '<p></p>', owner_id: 'user-1', created_at: '', updated_at: '' }
const update = vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) }))

vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'user-1' } } } }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      signOut: vi.fn(),
    },
    from: vi.fn((table: string) => ({
      select: vi.fn(() => table === 'documents' ? { order: vi.fn().mockResolvedValue({ data: [], error: null }) } : { eq: vi.fn() }),
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn().mockResolvedValue({ data: documentRecord, error: null }) })) })),
      update,
      delete: vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) })),
    })),
    storage: { from: vi.fn() },
  },
}))

vi.mock('./FileUploader', () => ({ FileUploader: () => null }))
vi.mock('./ShareModal', () => ({ ShareModal: () => null }))

describe('Document editor integration', () => {
  beforeEach(() => {
    update.mockClear()
    mockEditor.isActive.mockReturnValue(false)
    mockEditor.getHTML.mockReturnValue('<p>Updated content</p>')
    const chain = { focus: vi.fn(), toggleBold: vi.fn(), toggleItalic: vi.fn(), toggleUnderline: vi.fn(), toggleHeading: vi.fn(), toggleBulletList: vi.fn(), toggleOrderedList: vi.fn(), run: vi.fn() }
    Object.values(chain).forEach((method) => { if (typeof method === 'function') method.mockReturnValue?.(chain) })
    mockEditor.chain.mockReturnValue(chain)
  })
  afterEach(() => vi.useRealTimers())

  it('creates a document, updates its title locally, and persists the title on blur', async () => {
    render(<App />)
    await screen.findByRole('button', { name: 'New document' })
    fireEvent.click(screen.getByRole('button', { name: 'New document' }))
    const title = await screen.findByRole('textbox', { name: 'Document title' })
    fireEvent.change(title, { target: { value: 'Q3 Strategy Spec' } })
    expect(title).toHaveValue('Q3 Strategy Spec')
    fireEvent.blur(title)
    await waitFor(() => expect(update).toHaveBeenCalledWith({ title: 'Q3 Strategy Spec' }))
  })

  it('runs Tiptap formatting commands and exposes toolbar state selectors', () => {
    render(<Editor documentId="document-1" content="<p>Initial</p>" saveState="idle" onChange={vi.fn()} />)
    expect(screen.getByRole('toolbar', { name: 'Text formatting' })).toBeInTheDocument()
    const bold = screen.getByRole('button', { name: 'Bold' })
    expect(bold).toHaveAttribute('data-active', 'false')
    fireEvent.click(bold)
    expect(mockEditor.chain).toHaveBeenCalled()
    expect(screen.getByTestId('save-status')).toHaveTextContent('Idle')
  })

  it('sends HTML editor updates through the debounced persistence callback', async () => {
    render(<App />)
    await screen.findByRole('button', { name: 'New document' })
    fireEvent.click(screen.getByRole('button', { name: 'New document' }))
    const editor = await screen.findByRole('textbox', { name: 'Document editor' })
    vi.useFakeTimers()
    fireEvent.input(editor)
    await vi.advanceTimersByTimeAsync(800)
    expect(update).toHaveBeenCalledWith({ content: '<p>Updated content</p>' })
  })
})