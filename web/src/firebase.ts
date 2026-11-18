import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth'

// Firebase web yapılandırması gizli değildir (tarayıcıya zaten gönderilir).
// Güvenlik Firebase Security Rules ve Authorized domains ile sağlanır.
// İstenirse .env içindeki VITE_FIREBASE_* değişkenleriyle ezilebilir.
const env = import.meta.env
const config = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyCLj72wuEDf8tqw2UM3z3RiVcCGogqI3KU',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'eto-forum.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'eto-forum',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'eto-forum.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1071181835123',
  appId: env.VITE_FIREBASE_APP_ID || '1:1071181835123:web:686186b501bed0fcf47306',
}

/** Firebase yapılandırması mevcut mu? (VITE_DEMO_MODE=1 ile kapatılıp demo girişi açılabilir) */
export const firebaseConfigured =
  env.VITE_DEMO_MODE !== '1' && Boolean(config.apiKey && config.authDomain && config.projectId)

let app: FirebaseApp | null = null
let auth: Auth | null = null

if (firebaseConfigured) {
  app = initializeApp(config)
  auth = getAuth(app)
}

export { app, auth }
export const googleProvider = new GoogleAuthProvider()
