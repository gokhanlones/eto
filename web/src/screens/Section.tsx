import { Navigate, useParams } from 'react-router-dom'
import { useT } from '../i18n'
import { SECTIONS } from '../sections'

export default function Section() {
  const t = useT()
  const { id } = useParams()
  const section = SECTIONS.find((s) => s.id === id)
  if (!section) return <Navigate to="/" replace />

  return (
    <div className="page">
      <h2>
        <span aria-hidden>{section.icon}</span> {t(section.label)}
      </h2>
      <p className="muted">{t('emptySection')}</p>
    </div>
  )
}
