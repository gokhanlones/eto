import { Link, Navigate, useParams } from 'react-router-dom'
import { useT } from '../i18n'
import { findSection } from '../sections'

/** Ana başlık sayfası: alt başlıkları listeler. */
export default function Section() {
  const t = useT()
  const { id } = useParams()
  const section = findSection(id)
  if (!section) return <Navigate to="/" replace />

  return (
    <div className="page">
      <h2>{t(section.label)}</h2>
      {section.subsections.length === 0 ? (
        <p className="muted">{t('emptySubsections')}</p>
      ) : (
        <ul className="list">
          {section.subsections.map((sub) => (
            <li key={sub.id}>
              <Link to={`/section/${section.id}/${sub.id}`} className="list-item">
                {sub.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
