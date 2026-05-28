const PALETTE = [
  '#4f46e5', '#0891b2', '#059669', '#d97706',
  '#dc2626', '#7c3aed', '#db2777', '#0284c7',
]

// Restituzione del Numero Assoluto dal calcolo dal Unicode di ogni Stringa Applicata
function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function useOrderHelpers() {
  const avatarColor  = (name: string)  => PALETTE[hashStr(name)  % PALETTE.length]
  const bookColor    = (title: string) => PALETTE[hashStr(title) % PALETTE.length]
  const initials     = (name: string)  => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const bookInitial  = (title: string) => title[0]?.toUpperCase() ?? '?'

  return { avatarColor, bookColor, initials, bookInitial }
}
