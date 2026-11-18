import { useState } from 'react'
import { useAuth } from '../auth'
import { firebaseConfigured } from '../firebase'
import { useT } from '../i18n'

export default function Login() {
  const t = useT()
  const { signInWithGoogle, signInDemo } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)

  async function handleGoogle() {
    setBusy(true)
    setError(false)
    try {
      await signInWithGoogle()
    } catch {
      setError(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="center-screen login">
      <div className="logo-large">ETO</div>
      <h2>{t('loginTitle')}</h2>
      <p className="muted">{t('loginText')}</p>

      <button className="btn google" onClick={handleGoogle} disabled={busy || !firebaseConfigured}>
        {t('loginGoogle')}
      </button>

      {error && <p className="error">{t('loginError')}</p>}

      {!firebaseConfigured && (
        <>
          <p className="note">{t('loginNotConfigured')}</p>
          <button className="btn ghost" onClick={signInDemo}>
            {t('loginDemo')}
          </button>
        </>
      )}
    </div>
  )
}

