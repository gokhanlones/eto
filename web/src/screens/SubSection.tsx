import { Navigate, useParams } from 'react-router-dom'
import { useT } from '../i18n'
import { findSection } from '../sections'

/** Alt başlık sayfası: ileride konular burada listelenecek. */
export default function SubSection() {
  const t = useT()
  const { id, subId } = useParams()
  const section = findSection(id)
  const sub = section?.subsections.find((s) => s.id === subId)
  if (!section || !sub) return <Navigate to="/" replace />

  return (
    <div className="page">
      <div className="breadcrumb">{t(section.label)}</div>
      <h2>{sub.name}</h2>
      <p className="muted">{t('emptySection')}</p>
    </div>
  )
}
