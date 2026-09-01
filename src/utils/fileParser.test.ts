import { describe, expect, it } from 'vitest'
import { parseFileToContent, parseImportedFile } from './fileParser'

describe('parseImportedFile', () => {
  it('turns markdown headings and inline formatting into Tiptap-compatible HTML', () => {
    expect(parseImportedFile('# Plan\n**Important** *note*', 'text/markdown')).toBe('<h1>Plan</h1><p><strong>Important</strong> <em>note</em></p>')
  })
  it('derives an editor title and list content from an imported Markdown file', async () => {
    const file = new File(['# Agenda\n- Discuss launch'], 'launch-notes.md', { type: 'text/markdown' })
    await expect(parseFileToContent(file)).resolves.toEqual({ title: 'launch notes', content: '<h1>Agenda</h1><ul><li>Discuss launch</li></ul>' })
  })
})