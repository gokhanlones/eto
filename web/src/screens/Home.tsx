import { useAuth } from '../auth'
import { useT } from '../i18n'

export default function Home() {
  const t = useT()
  const { user } = useAuth()
  return (
    <div className="page">
      <h2>
        {t('welcome')}, {user?.name}
      </h2>
      <p className="muted">{t('homeIntro')}</p>
    </div>
  )
}
