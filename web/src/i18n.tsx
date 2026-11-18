import { createContext, useContext, type ReactNode } from 'react'

export type Lang = 'tr' | 'en'

const strings = {
  tr: {
    checking: 'Bağlantı kontrol ediliyor…',
    offlineTitle: 'İnternet bağlantısı yok',
    offlineText: 'Devam etmek için cihazınızın internete bağlı olduğundan emin olun.',
    retry: 'Tekrar dene',
    loginTitle: 'Gemi Elektrik-Elektronik Zabitleri Forumu',
    loginText: 'Devam etmek için Google hesabınızla giriş yapın.',
    loginGoogle: 'Google ile giriş yap',
    loginDemo: 'Demo olarak devam et',
    loginNotConfigured: 'Firebase henüz yapılandırılmadı. Google girişi için .env dosyasını doldurun.',
    loginError: 'Giriş başarısız oldu. Lütfen tekrar deneyin.',
    welcome: 'Hoş geldin',
    homeIntro: 'Bir başlık seçmek için sağ alttaki menüyü kullan.',
    sections: 'Başlıklar',
    home: 'Ana sayfa',
    menu: 'Menü',
    profile: 'Profil',
    settings: 'Ayarlar',
    language: 'Dil',
    signOut: 'Çıkış yap',
    close: 'Kapat',
    emptySection: 'Bu bölümde henüz konu yok.',
    emptySubsections: 'Bu başlığa henüz alt başlık eklenmedi.',
    bridge: 'Bridge',
    deck: 'Deck',
    accommodation: 'Accommodation',
    engineRoom: 'Engine Room',
  },
  en: {
    checking: 'Checking connection…',
    offlineTitle: 'No internet connection',
    offlineText: 'Make sure your device is connected to the internet to continue.',
    retry: 'Try again',
    loginTitle: 'Electro-Technical Officers Forum',
    loginText: 'Sign in with your Google account to continue.',
    loginGoogle: 'Sign in with Google',
    loginDemo: 'Continue as demo',
    loginNotConfigured: 'Firebase is not configured yet. Fill in the .env file to enable Google sign-in.',
    loginError: 'Sign-in failed. Please try again.',
    welcome: 'Welcome',
    homeIntro: 'Use the menu at the bottom right to pick a section.',
    sections: 'Topics',
    home: 'Home',
    menu: 'Menu',
    profile: 'Profile',
    settings: 'Settings',
    language: 'Language',
    signOut: 'Sign out',
    close: 'Close',
    emptySection: 'No topics in this section yet.',
    emptySubsections: 'No subsections have been added yet.',
    bridge: 'Bridge',
    deck: 'Deck',
    accommodation: 'Accommodation',
    engineRoom: 'Engine Room',
  },
} satisfies Record<Lang, Record<string, string>>

export type StringKey = keyof (typeof strings)['tr']

/** Telefonun / tarayıcının sistem dilini okur. Desteklenmeyen dillerde İngilizceye düşer. */
export function detectSystemLang(): Lang {
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const l of langs) {
    const code = l?.toLowerCase().split('-')[0]
    if (code === 'tr' || code === 'en') return code
  }
  return 'en'
}

const LangContext = createContext<Lang>('en')

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>
}

export function useT() {
  const lang = useContext(LangContext)
  return (key: StringKey) => strings[lang][key]
}

export function useLang() {
  return useContext(LangContext)
}
