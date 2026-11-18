import { Link, Navigate, useParams } from 'react-router-dom'
import { useT } from '../i18n'
import { findSection } from '../sections'

/** Alt başlık sayfası: ileride konular burada listelenecek. */
export default function SubSection() {
  const t = useT()
  const { id, subId } = useParams()
  const section = findSection(id)
  const sub = section?.subsections.find((s) => s.id === subId)
  if (!section) return <Navigate to="/" replace />
  if (!sub) return <Navigate to={`/section/${section.id}`} replace />

  return (
    <div className="page">
      <Link to={`/section/${section.id}`} className="breadcrumb">
        {t(section.label)}
      </Link>
      <h2>{sub.name}</h2>
      <p className="muted">{t('emptySection')}</p>
    </div>
  )
}
