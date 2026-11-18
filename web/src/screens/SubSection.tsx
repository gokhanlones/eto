import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import NewTopicCard from '../components/NewTopicCard'
import { useLang, useT } from '../i18n'
import { findSection } from '../sections'
import { subscribeTopics, type Topic } from '../topics'

/** Alt başlık sayfası: konuları listeler, sağ alttaki + ile yeni konu açılır. */
export default function SubSection() {
  const t = useT()
  const lang = useLang()
  const { id, subId } = useParams()
  const section = findSection(id)
  const sub = section?.subsections.find((s) => s.id === subId)
  const [topics, setTopics] = useState<Topic[] | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [composing, setComposing] = useState(false)

  useEffect(() => {
    if (!section || !sub) return
    return subscribeTopics(
      section.id,
      sub.id,
      (list) => {
        setTopics(list)
        setLoadError(false)
      },
      (e) => {
        console.error(e)
        setLoadError(true)
      },
    )
  }, [section, sub])

  if (!section || !sub) return <Navigate to="/" replace />

  const dateFmt = new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' })

  return (
    <div className="page">
      <h2 className="page-path">
        <span className="page-path-parent">{t(section.label)}</span>
        <span className="page-path-sep" aria-hidden>
          &gt;
        </span>
        <span>{sub.name}</span>
      </h2>

      {loadError ? (
        <p className="error">{t('loadError')}</p>
      ) : topics === null ? null : topics.length === 0 ? (
        <p className="muted">{t('emptySection')}</p>
      ) : (
        <ul className="topic-list">
          {topics.map((topic) => (
            <li key={topic.id} className="topic">
              {topic.title && <div className="topic-title">{topic.title}</div>}
              <p className="topic-desc">{topic.description}</p>
              {topic.attachments.length > 0 && (
                <div className="topic-attachments">
                  {topic.attachments.map((a) =>
                    a.kind === 'photo' ? (
                      <a key={a.url} href={a.url} target="_blank" rel="noreferrer">
                        <img src={a.url} alt={a.name} className="topic-photo" />
                      </a>
                    ) : (
                      <a key={a.url} href={a.url} target="_blank" rel="noreferrer" className="topic-file">
                        {a.name}
                      </a>
                    ),
                  )}
                </div>
              )}
              <div className="topic-meta muted small">
                {topic.authorName}
                {topic.createdAt && ` · ${dateFmt.format(topic.createdAt)}`}
              </div>
            </li>
          ))}
        </ul>
      )}

      <button className="fab" aria-label={t('newTopic')} title={t('newTopic')} onClick={() => setComposing(true)}>
        <PlusIcon />
      </button>

      {composing && (
        <NewTopicCard sectionId={section.id} subsectionId={sub.id} onClose={() => setComposing(false)} />
      )}
    </div>
  )
}

const PlusIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
)
