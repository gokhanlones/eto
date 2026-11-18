import { useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { useLang, useT } from '../i18n'
import { findSection, SECTIONS } from '../sections'

/** Panelin kapanma / açılma animasyon süresi (index.css .sheet transition ile aynı) */
const SHEET_MS = 300

type Sheet = 'none' | 'main' | 'sub'

/** Her sayfada: üstte banner (solda hamburger, ortada ETO), altta bottom bar (ortada Home, sağda bölümler). */
export default function Layout() {
  const t = useT()
  const lang = useLang()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)
  /** Hangi alt panel açık: ana başlıklar mı, seçilen başlığın alt başlıkları mı */
  const [sheet, setSheet] = useState<Sheet>('none')
  /** Paneller arası geçişte (biri inip diğeri yükselirken) arka plan karartması kalsın */
  const [switching, setSwitching] = useState(false)
  const [subSectionId, setSubSectionId] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const sheetOpen = sheet !== 'none'
  const subSection = findSection(subSectionId ?? undefined)

  function closeSheets() {
    clearTimeout(timer.current)
    setSwitching(false)
    setSheet('none')
  }

  /** Açık paneli aşağı indir, ardından diğerini alttan yükselt */
  function switchTo(next: Sheet) {
    clearTimeout(timer.current)
    setSheet('none')
    setSwitching(true)
    timer.current = setTimeout(() => {
      setSwitching(false)
      setSheet(next)
    }, SHEET_MS)
  }

  function openSection(id: string) {
    setSubSectionId(id)
    switchTo('sub')
  }

  function openSubSection(sectionId: string, subId: string) {
    closeSheets()
    navigate(`/section/${sectionId}/${subId}`)
  }

  useEffect(() => () => clearTimeout(timer.current), [])

  // ESC ile kapat
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false)
        clearTimeout(timer.current)
        setSwitching(false)
        setSheet('none')
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
            closeSheets()
            navigate('/')
          }}>
          <HomeIcon />
        </button>
        <button
          className={`icon-btn ${sheetOpen ? 'active' : ''}`}
          aria-label={t('sections')}
          aria-expanded={sheetOpen}
          onClick={() => (sheetOpen || switching ? closeSheets() : setSheet('main'))}
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

      {/* Alttan yükselen paneller */}
      <div className={`backdrop ${sheetOpen || switching ? 'show' : ''}`} onClick={closeSheets} />

      {/* 1. panel: ana başlıklar */}
      <section className={`sheet ${sheet === 'main' ? 'open' : ''}`} aria-hidden={sheet !== 'main'} aria-label={t('sections')}>
        <div className="sheet-handle" />
        <h3 className="sheet-title">{t('sections')}</h3>
        <ul className="sheet-list">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <button className="sheet-item" onClick={() => openSection(s.id)}>
                {t(s.label)}
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* 2. panel: seçilen ana başlığın alt başlıkları */}
      <section
        className={`sheet ${sheet === 'sub' ? 'open' : ''}`}
        aria-hidden={sheet !== 'sub'}
        aria-label={subSection ? t(subSection.label) : undefined}
      >
        <div className="sheet-handle" />
        <div className="sheet-header">
          <button className="sheet-back" onClick={() => switchTo('main')}>
            {t('back')}
          </button>
          <h3 className="sheet-title">{subSection && t(subSection.label)}</h3>
        </div>
        {subSection && subSection.subsections.length === 0 ? (
          <p className="muted sheet-empty">{t('emptySubsections')}</p>
        ) : (
          <ul className="sheet-list">
            {subSection?.subsections.map((sub) => (
              <li key={sub.id}>
                <button className="sheet-item" onClick={() => openSubSection(subSection.id, sub.id)}>
                  {sub.name}
                </button>
              </li>
            ))}
          </ul>
        )}
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
