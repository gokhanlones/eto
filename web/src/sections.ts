import type { StringKey } from './i18n'

export interface SubSection {
  id: string
  /** Teknik terim olduğu için her dilde aynı gösterilir */
  name: string
}

export interface Section {
  id: string
  label: StringKey
  subsections: SubSection[]
}

/**
 * Ana başlıklar (alttan açılan panel) ve her birinin alt başlıkları.
 * Yeni alt başlık eklemek için ilgili ana başlığın subsections listesine satır ekleyin.
 */
export const SECTIONS: Section[] = [
  { id: 'bridge', label: 'bridge', subsections: [] },
  { id: 'deck', label: 'deck', subsections: [] },
  { id: 'accommodation', label: 'accommodation', subsections: [] },
  {
    id: 'engine-room',
    label: 'engineRoom',
    subsections: [
      { id: 'main-engine', name: 'Main Engine' },
      { id: 'auxiliary-engine', name: 'Auxiliary Engine' },
      { id: 'sewage-unit', name: 'Sewage Unit' },
      { id: 'electrical-motor', name: 'Electrical Motor' },
      { id: 'lighting', name: 'Lighting' },
      { id: 'purifier', name: 'Purifier' },
      { id: 'alarm-system', name: 'Alarm System' },
    ],
  },
]

export function findSection(id?: string) {
  return SECTIONS.find((s) => s.id === id)
}
