import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  type Timestamp,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import type { AppUser } from './auth'
import { db, storage } from './firebase'

export interface Attachment {
  name: string
  url: string
  contentType: string
  size: number
  kind: 'photo' | 'file'
}

export interface Topic {
  id: string
  sectionId: string
  subsectionId: string
  title: string
  description: string
  authorId: string
  authorName: string
  createdAt: Date | null
  attachments: Attachment[]
}

export interface NewTopic {
  sectionId: string
  subsectionId: string
  title: string
  description: string
  photos: File[]
  files: File[]
}

/** Tek dosya için üst sınır */
export const MAX_FILE_BYTES = 10 * 1024 * 1024

/* ---------- Demo modu (Firebase yokken) için bellekte saklama ---------- */
const memoryTopics: Topic[] = []
const memoryListeners = new Set<() => void>()

/** Bir alt başlığın konularını canlı olarak dinler; en yeni konu en üstte. */
export function subscribeTopics(
  sectionId: string,
  subsectionId: string,
  onData: (topics: Topic[]) => void,
  onError: (e: Error) => void,
): () => void {
  if (!db) {
    const emit = () =>
      onData(memoryTopics.filter((t) => t.sectionId === sectionId && t.subsectionId === subsectionId))
    emit()
    memoryListeners.add(emit)
    return () => memoryListeners.delete(emit)
  }

  // İki eşitlik filtresi bileşik indeks gerektirmez; sıralama istemcide yapılır.
  const q = query(
    collection(db, 'topics'),
    where('sectionId', '==', sectionId),
    where('subsectionId', '==', subsectionId),
  )
  return onSnapshot(
    q,
    (snap) => {
      const topics = snap.docs.map((d) => {
        const data = d.data()
        return {
          id: d.id,
          sectionId: data.sectionId,
          subsectionId: data.subsectionId,
          title: data.title ?? '',
          description: data.description ?? '',
          authorId: data.authorId,
          authorName: data.authorName ?? '',
          createdAt: (data.createdAt as Timestamp | null)?.toDate() ?? null,
          attachments: data.attachments ?? [],
        } satisfies Topic
      })
      topics.sort((a, b) => (b.createdAt?.getTime() ?? Date.now()) - (a.createdAt?.getTime() ?? Date.now()))
      onData(topics)
    },
    onError,
  )
}

/** Yeni konu oluşturur: önce ekleri Storage'a yükler, sonra konuyu Firestore'a yazar. */
export async function createTopic(input: NewTopic, user: AppUser): Promise<void> {
  const base = {
    sectionId: input.sectionId,
    subsectionId: input.subsectionId,
    title: input.title.trim(),
    description: input.description.trim(),
    authorId: user.uid,
    authorName: user.name,
  }

  if (!db || !storage) {
    const attachments: Attachment[] = [
      ...input.photos.map((f) => localAttachment(f, 'photo')),
      ...input.files.map((f) => localAttachment(f, 'file')),
    ]
    memoryTopics.unshift({ id: crypto.randomUUID(), ...base, createdAt: new Date(), attachments })
    memoryListeners.forEach((l) => l())
    return
  }

  const topicRef = doc(collection(db, 'topics'))
  const attachments: Attachment[] = []
  const all = [
    ...input.photos.map((f) => [f, 'photo'] as const),
    ...input.files.map((f) => [f, 'file'] as const),
  ]
  for (const [file, kind] of all) {
    const path = `topics/${topicRef.id}/${Date.now()}-${file.name}`
    const fileRef = ref(storage, path)
    await uploadBytes(fileRef, file, { contentType: file.type || 'application/octet-stream' })
    attachments.push({
      name: file.name,
      url: await getDownloadURL(fileRef),
      contentType: file.type,
      size: file.size,
      kind,
    })
  }

  await setDoc(topicRef, { ...base, attachments, createdAt: serverTimestamp() })
}

function localAttachment(file: File, kind: Attachment['kind']): Attachment {
  return { name: file.name, url: URL.createObjectURL(file), contentType: file.type, size: file.size, kind }
}
