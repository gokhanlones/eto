import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth'
import { checkInternet } from './connectivity'
import { detectSystemLang, LangProvider, type Lang } from './i18n'
import Layout from './components/Layout'
import Splash from './screens/Splash'
import Offline from './screens/Offline'
import Login from './screens/Login'
import Home from './screens/Home'
import Section from './screens/Section'
import SubSection from './screens/SubSection'

/** Splash ekranının en az görünme süresi (ms) */
const MIN_SPLASH_MS = 1200

type Boot = { phase: 'checking' } | { phase: 'offline'; lang: Lang } | { phase: 'ready'; lang: Lang }

export default function App() {
  const [boot, setBoot] = useState<Boot>({ phase: 'checking' })

  const runChecks = useCallback(async () => {
    setBoot({ phase: 'checking' })
    const started = Date.now()
    // 1) İnternet bağlantısı  2) Sistem dili
    const online = await checkInternet()
    const lang = detectSystemLang()
    document.documentElement.lang = lang
    const wait = MIN_SPLASH_MS - (Date.now() - started)
    if (wait > 0) await new Promise((r) => setTimeout(r, wait))
    setBoot(online ? { phase: 'ready', lang } : { phase: 'offline', lang })
  }, [])

  useEffect(() => {
    runChecks()
  }, [runChecks])

  if (boot.phase === 'checking') return <Splash />

  return (
    <LangProvider lang={boot.lang}>
      {boot.phase === 'offline' ? (
        <Offline onRetry={runChecks} />
      ) : (
        <AuthProvider>
          <AuthGate />
        </AuthProvider>
      )}
    </LangProvider>
  )
}

function AuthGate() {
  const { user, ready } = useAuth()
  if (!ready) return <Splash />
  if (!user) return <Login />

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="section/:id" element={<Section />} />
          <Route path="section/:id/:subId" element={<SubSection />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
