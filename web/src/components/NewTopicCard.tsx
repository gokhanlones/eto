import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../auth'
import { useT } from '../i18n'
import { createTopic, MAX_FILE_BYTES } from '../topics'

interface Props {
  sectionId: string
  subsectionId: string
  onClose: () => void
}

/** Konu açma kartı: başlık, açıklama, fotoğraf/dosya ekleme, gönder ve iptal. */
export default function NewTopicCard({ sectionId, subsectionId, onClose }: Props) {
  const t = useT()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const photoInput = useRef<HTMLInputElement>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const titleInput = useRef<HTMLInputElement>(null)

  // Açıklamaya karakter girilmeden gönder aktif olmaz
  const canSend = description.trim().length > 0 && !busy

  useEffect(() => {
    titleInput.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [busy, onClose])

  function addFiles(list: FileList | null, kind: 'photo' | 'file') {
    if (!list) return
    const picked = Array.from(list)
    const tooBig = picked.filter((f) => f.size > MAX_FILE_BYTES)
    const ok = picked.filter((f) => f.size <= MAX_FILE_BYTES)
    setError(tooBig.length ? `${t('fileTooBig')}: ${tooBig.map((f) => f.name).join(', ')}` : null)
    if (kind === 'photo') setPhotos((p) => [...p, ...ok])
    else setFiles((p) => [...p, ...ok])
  }

  async function send() {
    if (!canSend || !user) return
    setBusy(true)
    setError(null)
    try {
      await createTopic({ sectionId, subsectionId, title, description, photos, files }, user)
      onClose()
    } catch (e) {
      console.error(e)
      setError(t('sendError'))
      setBusy(false)
    }
  }

  const attachments = [
    ...photos.map((f, i) => ({ f, remove: () => setPhotos((p) => p.filter((_, j) => j !== i)) })),
    ...files.map((f, i) => ({ f, remove: () => setFiles((p) => p.filter((_, j) => j !== i)) })),
  ]

  return (
    <div className="modal-backdrop" onClick={() => !busy && onClose()}>
      <div
        className="card"
        role="dialog"
        aria-modal="true"
        aria-label={t('newTopic')}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={titleInput}
          className="field field-title"
          placeholder={t('topicTitle')}
          value={title}
          maxLength={120}
          onChange={(e) => setTitle(e.target.value)}
          disabled={busy}
        />
        <textarea
          className="field field-desc"
          placeholder={t('topicDescription')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          disabled={busy}
        />

        <div className="upload-row">
          <button type="button" className="btn-plain" onClick={() => photoInput.current?.click()} disabled={busy}>
            {t('addPhoto')}
          </button>
          <button type="button" className="btn-plain" onClick={() => fileInput.current?.click()} disabled={busy}>
            {t('addFile')}
          </button>
          <input
            ref={photoInput}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              addFiles(e.target.files, 'photo')
              e.target.value = ''
            }}
          />
          <input
            ref={fileInput}
            type="file"
            multiple
            hidden
            onChange={(e) => {
              addFiles(e.target.files, 'file')
              e.target.value = ''
            }}
          />
        </div>

        {attachments.length > 0 && (
          <ul className="attach-list">
            {attachments.map(({ f, remove }, i) => (
              <li key={`${f.name}-${i}`}>
                <span className="attach-name">{f.name}</span>
                <span className="muted small">{formatSize(f.size)}</span>
                <button type="button" className="attach-remove" onClick={remove} disabled={busy} aria-label={t('remove')}>
                  {t('remove')}
                </button>
              </li>
            ))}
          </ul>
        )}

        {error && <p className="error small">{error}</p>}

        <div className="card-actions">
          <button type="button" className="round-btn" onClick={onClose} disabled={busy} aria-label={t('cancel')} title={t('cancel')}>
            <CancelIcon />
          </button>
          <button
            type="button"
            className="round-btn send"
            onClick={send}
            disabled={!canSend}
            aria-label={t('send')}
            title={t('send')}
          >
            {busy ? <span className="spinner" /> : <SendIcon />}
          </button>
        </div>
      </div>
    </div>
  )
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const CancelIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)
const SendIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12l16-8-6 16-2.5-6.5L4 12z" />
  </svg>
)
