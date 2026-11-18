import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut as fbSignOut } from 'firebase/auth'
import { auth, firebaseConfigured, googleProvider } from './firebase'

export interface AppUser {
  uid: string
  name: string
  email: string | null
  photoURL: string | null
  demo?: boolean
}

interface AuthState {
  user: AppUser | null
  /** İlk oturum kontrolü bitti mi? */
  ready: boolean
  signInWithGoogle: () => Promise<void>
  signInDemo: () => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [ready, setReady] = useState(!firebaseConfigured)

  useEffect(() => {
    if (!auth) return
    return onAuthStateChanged(auth, (u) => {
      setUser(
        u ? { uid: u.uid, name: u.displayName ?? u.email ?? 'ETO', email: u.email, photoURL: u.photoURL } : null,
      )
      setReady(true)
    })
  }, [])

  const value: AuthState = {
    user,
    ready,
    async signInWithGoogle() {
      if (!auth) throw new Error('Firebase not configured')
      await signInWithPopup(auth, googleProvider)
    },
    signInDemo() {
      setUser({ uid: 'demo', name: 'Demo ETO', email: null, photoURL: null, demo: true })
    },
    async signOut() {
      if (auth) await fbSignOut(auth)
      setUser(null)
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
