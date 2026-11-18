import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { useLang, useT } from '../i18n'
import { SECTIONS } from '../sections'

/** Her sayfada: üstte banner (solda hamburger, ortada ETO), altta bottom bar (ortada Home, sağda bölümler). */
export default function Layout() {
  const t = useT()
  const lang = useLang()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  // ESC ile kapat
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false)
        setSheetOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="app">
      <header className="topbar">
        <button className="icon-btn" aria-label={t('menu')} onClick={() => setDrawerOpen(true)}>
          <HamburgerIcon />
        </button>
        <div className="topbar-title">ETO</div>
        <span className="icon-btn-spacer" />
      </header>

      <main className="content">
        <Outlet />
      </main>

      <nav className="bottombar">
        <span className="icon-btn-spacer" />
        <button className="home-btn" aria-label={t('home')} onClick={() => {
            setSheetOpen(false)
            navigate('/')
          }}>
          <HomeIcon />
        </button>
        <button
          className={`icon-btn ${sheetOpen ? 'active' : ''}`}
          aria-label={t('sections')}
          aria-expanded={sheetOpen}
          onClick={() => setSheetOpen((o) => !o)}
        >
          <ListIcon />
        </button>
      </nav>

      {/* Sol menü (hamburger) */}
      <div className={`backdrop ${drawerOpen ? 'show' : ''}`} onClick={() => setDrawerOpen(false)} />
      <aside className={`drawer ${drawerOpen ? 'open' : ''}`} aria-hidden={!drawerOpen}>
        <div className="drawer-user">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="" className="avatar" referrerPolicy="no-referrer" />
          ) : (
            <div className="avatar placeholder">{user?.name?.[0] ?? '?'}</div>
          )}
          <div>
            <div className="drawer-name">{user?.name}</div>
            {user?.email && <div className="muted small">{user.email}</div>}
          </div>
        </div>
        <ul className="drawer-list">
          <li>
            <button>{t('profile')}</button>
          </li>
          <li>
            <button>{t('settings')}</button>
          </li>
          <li className="muted small drawer-meta">
            {t('language')}: {lang.toUpperCase()}
          </li>
        </ul>
        <button className="btn ghost signout" onClick={signOut}>
          {t('signOut')}
        </button>
      </aside>

      {/* Alttan yükselen bölümler paneli */}
      <div className={`backdrop ${sheetOpen ? 'show' : ''}`} onClick={() => setSheetOpen(false)} />
      <section className={`sheet ${sheetOpen ? 'open' : ''}`} aria-hidden={!sheetOpen} aria-label={t('sections')}>
        <div className="sheet-handle" />
        <h3 className="sheet-title">{t('sections')}</h3>
        <ul className="sheet-list">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <NavLink to={`/section/${s.id}`} className="sheet-item" onClick={() => setSheetOpen(false)}>
                <span className="sheet-icon" aria-hidden>
                  {s.icon}
                </span>
                {t(s.label)}
              </NavLink>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

const HamburgerIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)
const HomeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l9-8 9 8" />
    <path d="M5 10v10h5v-6h4v6h5V10" />
  </svg>
)
const ListIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M8 6h13M8 12h13M8 18h13" />
    <circle cx="3.5" cy="6" r="1" fill="currentColor" />
    <circle cx="3.5" cy="12" r="1" fill="currentColor" />
    <circle cx="3.5" cy="18" r="1" fill="currentColor" />
  </svg>
)
