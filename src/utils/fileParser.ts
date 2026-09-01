export function parseImportedFile(fileContent: string, fileType: string): string {
  const escaped = fileContent.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  if (fileType === 'text/markdown' || fileType.endsWith('/md')) return escaped.split(/\r?\n/).map((line) => line.startsWith('## ') ? `<h2>${line.slice(3)}</h2>` : line.startsWith('# ') ? `<h1>${line.slice(2)}</h1>` : line.startsWith('- ') || line.startsWith('* ') ? `<ul><li>${line.slice(2)}</li></ul>` : /^\d+\. /.test(line) ? `<ol><li>${line.replace(/^\d+\. /, '')}</li></ol>` : line ? `<p>${line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')}</p>` : '<p></p>').join('')
  return escaped.split(/\r?\n/).map((line) => `<p>${line || '<br>'}</p>`).join('')
}

export async function parseFileToContent(file: File): Promise<{ title: string; content: string }> {
  if (!/\.(txt|md)$/i.test(file.name)) throw new Error('Only .txt and .md files can be imported.')
  const title = file.name.replace(/\.(txt|md)$/i, '').replace(/[-_]+/g, ' ').trim() || 'Imported document'
  const fileContent = await file.text()
  const fileType = file.type || (file.name.toLowerCase().endsWith('.md') ? 'text/markdown' : 'text/plain')
  return { title, content: parseImportedFile(fileContent, fileType) }
}