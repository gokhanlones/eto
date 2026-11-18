import type { StringKey } from './i18n'

/** Alt menüden açılan forum bölümleri. Yeni bölüm eklemek için buraya satır ekleyin. */
export const SECTIONS: { id: string; label: StringKey; icon: string }[] = [
  { id: 'bridge', label: 'bridge', icon: '🧭' },
  { id: 'deck', label: 'deck', icon: '⚓' },
  { id: 'accommodation', label: 'accommodation', icon: '🛏️' },
  { id: 'engine-room', label: 'engineRoom', icon: '⚙️' },
]
