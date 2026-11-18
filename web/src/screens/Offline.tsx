import { useT } from '../i18n'

export default function Offline({ onRetry }: { onRetry: () => void }) {
  const t = useT()
  return (
    <div className="center-screen">
      <div className="logo-small">ETO</div>
      <h2>{t('offlineTitle')}</h2>
      <p className="muted">{t('offlineText')}</p>
      <button className="btn primary" onClick={onRetry}>
        {t('retry')}
      </button>
    </div>
  )
}
