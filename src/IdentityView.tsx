import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowUpRight, BadgeCheck, BookOpen, Check, MapPin, Plus, Ticket, Trash2, UsersRound, X } from 'lucide-react'
import { experiences, type ExperienceDraft } from './data/discover'
import { cityEvents } from './data/events'
import { demoArchiveEntries, identityBadges, identityProfile, type ArchiveEntry } from './data/identity'
import { youthSpaces } from './data/spaces'
import { loadTickets, persistTickets, type TicketRecord } from './tickets'
import { TicketVault } from './components/TicketVault'
import { identityCopy as copy } from './i18n/identity'
import { useLocale } from './i18n/use-locale'
import { useLocalized } from './i18n/use-localized'
import type { Locale } from './i18n/messages'
import './identity.css'

const storageKey = 'unseen:identity:v1'
const discoverStorageKey = 'unseen:discover:v1'
const eventsStorageKey = 'unseen:events:v1'
const spacesStorageKey = 'unseen:space:v1'
const maximumEntries = 200
type IdentityDraft = ExperienceDraft

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function loadUserEntries(): ArchiveEntry[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    if (!isRecord(saved) || !Array.isArray(saved.entries)) return []

    return saved.entries.flatMap((entry): ArchiveEntry[] => {
      if (!isRecord(entry)) return []
      const { id, date, title, location, category, note, reflection, relatedExperienceId } = entry
      if (typeof id !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(String(date))) return []
      if (typeof title !== 'string' || !title.trim() || typeof note !== 'string' || !note.trim()) return []
      if (typeof location !== 'string' || typeof category !== 'string' || typeof reflection !== 'string') return []
      if (relatedExperienceId !== undefined && typeof relatedExperienceId !== 'string') return []
      return [{
        id,
        date: String(date),
        title: title.slice(0, 60),
        location: location.slice(0, 50),
        category: category.slice(0, 40),
        note: note.slice(0, 600),
        reflection: reflection.slice(0, 220),
        source: 'user',
        ...(typeof relatedExperienceId === 'string' ? { relatedExperienceId } : {}),
      }]
    }).slice(0, maximumEntries)
  } catch {
    return []
  }
}

function loadJoinedTeams() {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(eventsStorageKey) ?? '[]')
    if (!Array.isArray(saved)) return []
    const joinedIds = new Set(saved.filter((id): id is string => typeof id === 'string'))
    return cityEvents.flatMap((event) => event.teams
      .filter((team) => joinedIds.has(team.id))
      .map((team) => ({ id: team.id, eventTitle: event.title, teamName: team.name, eventDate: event.date })))
  } catch {
    return []
  }
}

function loadPlannedExperiences() {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(discoverStorageKey) ?? 'null')
    if (!isRecord(saved) || !Array.isArray(saved.plannedIds)) return []
    const plannedIds = new Set(saved.plannedIds.filter((id): id is string => typeof id === 'string'))
    return experiences.filter((experience) => plannedIds.has(experience.id))
  } catch {
    return []
  }
}

function loadSpaceVisitIntents() {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(spacesStorageKey) ?? '[]')
    if (!Array.isArray(saved)) return []
    return saved.flatMap((item) => {
      if (!isRecord(item) || typeof item.spaceId !== 'string' || typeof item.slotId !== 'string') return []
      const space = youthSpaces.find((entry) => entry.id === item.spaceId)
      const slot = space?.visitSlots.find((entry) => entry.id === item.slotId)
      return space && slot ? [{ space, slot }] : []
    })
  } catch {
    return []
  }
}

function localDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = `${today.getMonth() + 1}`.padStart(2, '0')
  const day = `${today.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 预设反思：中文按关键词与字数判断，英文按关键词与词数判断（英文没有中文字符可用）。
const reflectionKeywords: Record<Locale, RegExp> = {
  zh: /[人朋友同行聊]/,
  en: /\b(friend|friends|people|together|talk|talked|chatted|met|company|someone|others)\b/i,
}

const reflectionWordLimit = 40
const reflectionCharLimit = 100

function createReflection(note: string, locale: Locale, t: <T>(value: { zh: T; en: T }) => T) {
  const connected = reflectionKeywords[locale].test(note)
  const long = locale === 'en' ? note.trim().split(/\s+/).length > reflectionWordLimit : note.length > reflectionCharLimit
  if (connected) return t(copy.reflectionConnected)
  if (long) return t(copy.reflectionObservant)
  return t(copy.reflectionStart)
}

function IdentityView({
  onFindEvents,
  onFindExplore,
  onFindSpace,
  experienceDraft,
  onExperienceDraftConsumed,
  ticketsRequested,
  onTicketsRequestedConsumed,
}: {
  onFindEvents: () => void
  onFindExplore: () => void
  onFindSpace: () => void
  experienceDraft: IdentityDraft | null
  onExperienceDraftConsumed: () => void
  ticketsRequested?: boolean
  onTicketsRequestedConsumed?: () => void
}) {
  const [userEntries, setUserEntries] = useState<ArchiveEntry[]>(loadUserEntries)
  const { locale, t } = useLocale()
  // 示例档案是双语的，按当前语言解析一次；用户自己写的记录永远是写入时的语言。
  const demoEntries = useLocalized(demoArchiveEntries)
  const [joinedTeams] = useState(loadJoinedTeams)
  const [plannedExperiences] = useState(loadPlannedExperiences)
  const [spaceVisitIntents] = useState(loadSpaceVisitIntents)
  // 票据在 DISCOVER 的购票流程里写入本机，这里只读取与切换「确认保存」状态。
  const [tickets, setTickets] = useState<TicketRecord[]>(loadTickets)
  // 从 DISCOVER 的「查看票夹」进来时直接展开票据弹层（与 experienceDraft 同样的“初次渲染即消费”写法）。
  const [ticketsOpen, setTicketsOpen] = useState(ticketsRequested === true)
  const ticketButtonRef = useRef<HTMLButtonElement | null>(null)
  const [title, setTitle] = useState(() => experienceDraft?.title ?? '')
  const [location, setLocation] = useState(() => experienceDraft?.location ?? '')
  const [note, setNote] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sourceFilter, setSourceFilter] = useState<'all' | 'user' | 'demo'>('all')
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ entries: userEntries }))
    } catch {
      // Keep the current session usable when browser storage is unavailable.
    }
  }, [userEntries])

  const timeline: ArchiveEntry[] = [...demoEntries, ...userEntries].sort((a, b) => b.date.localeCompare(a.date))
  const yearEntries = timeline.filter((entry) => entry.date.startsWith(identityProfile.year))
  const filteredTimeline = yearEntries.filter((entry) => {
    if (sourceFilter !== 'all' && entry.source !== sourceFilter) return false
    const query = searchQuery.trim().toLocaleLowerCase()
    return !query || [entry.title, entry.location, entry.category, entry.note].some((field) => field.toLocaleLowerCase().includes(query))
  })

  function addEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedTitle = title.trim()
    const trimmedNote = note.trim()
    if (!trimmedTitle || !trimmedNote) return

    if (editingEntryId) {
      const editingEntry = userEntries.find((entry) => entry.id === editingEntryId)
      if (!editingEntry) return
      setUserEntries((current) => current.map((entry) => entry.id === editingEntryId ? {
        ...entry,
        title: trimmedTitle.slice(0, 60),
        location: location.trim().slice(0, 50) || t(copy.defaultLocation),
        note: trimmedNote.slice(0, 600),
        reflection: createReflection(trimmedNote, locale, t),
      } : entry))
      setAnnouncement(t(copy.announceUpdated))
    } else {
      if (userEntries.length >= maximumEntries) return
      const entry: ArchiveEntry = {
        id: `identity-${Date.now()}`,
        date: localDate(),
        title: trimmedTitle.slice(0, 60),
        location: location.trim().slice(0, 50) || t(copy.defaultLocation),
        category: experienceDraft?.category ?? t(copy.defaultCategory),
        note: trimmedNote.slice(0, 600),
        reflection: createReflection(trimmedNote, locale, t),
        source: 'user',
        ...(experienceDraft ? { relatedExperienceId: experienceDraft.id } : {}),
      }
      setUserEntries((current) => [entry, ...current].slice(0, maximumEntries))
      setAnnouncement(t(copy.announceAdded))
    }

    setEditingEntryId(null)
    setTitle('')
    setLocation('')
    setNote('')
    onExperienceDraftConsumed()
  }

  function editEntry(entry: ArchiveEntry) {
    setEditingEntryId(entry.id)
    setTitle(entry.title)
    setLocation(entry.location)
    setNote(entry.note)
    onExperienceDraftConsumed()
    document.getElementById('identity-record-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function cancelEdit() {
    setEditingEntryId(null)
    setTitle('')
    setLocation('')
    setNote('')
  }

  function removeEntry(id: string) {
    setUserEntries((current) => current.filter((entry) => entry.id !== id))
    if (editingEntryId === id) cancelEdit()
    setAnnouncement(t(copy.announceRemoved))
  }

  // 取消票据：只从本机票夹移除这张演示票，不涉及退款或任何订单。
  function cancelTicket(id: string) {
    setTickets((current) => {
      const next = current.filter((ticket) => ticket.id !== id)
      persistTickets(next)
      return next
    })
    setAnnouncement(t(copy.announceTicketCancelled))
  }

  return (
    <div className="identity-page">
      <div className="section-meta"><span>{t(copy.sectionMetaLeft)}</span><span>{t(copy.sectionMetaRight)(identityProfile.year)}</span></div>
      <header className="identity-cover">
        <div className="identity-cover-copy">
          <p className="identity-eyebrow"><span className="identity-live-dot" /> {t(copy.coverEyebrow)}</p>
          <h1>{t(copy.coverTitleLines)[0]}<br /><span>{t(copy.coverTitleLines)[1]}</span></h1>
          <p className="identity-cover-line">{t(copy.coverLine)}</p>
          <button className="identity-tickets-button" type="button" ref={ticketButtonRef} onClick={() => setTicketsOpen(true)}>
            <Ticket size={15} aria-hidden="true" />{t(copy.ticketsButton)}
            <span className="identity-tickets-count">{tickets.length.toString().padStart(2, '0')}</span>
          </button>
          <p className="identity-tickets-note">{t(copy.ticketsNote)}</p>
        </div>
        <div className="identity-passport-wrap">
          <div className="identity-passport">
            <div className="identity-passport-top"><span>UNSEEN® / CITY PASSPORT</span><span>SH · {identityProfile.year}</span></div>
            <div className="identity-passport-seal">U<span>.</span></div>
            <div className="identity-passport-bottom"><div><span>{t(copy.passportHolder)}</span><strong>{identityProfile.alias}</strong></div><div><span>{t(copy.passportFieldNotes)}</span><strong>{yearEntries.length.toString().padStart(2, '0')}</strong></div></div>
          </div>
          <button className="identity-card-link" type="button" onClick={() => setAnnouncement(t(copy.cardLinkNotice))}>
            {t(copy.cardLink)} <ArrowUpRight size={13} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="identity-demo-note"><span>{t(copy.demoToken)}</span> {t(copy.demoNote)}</div>

      <section className="identity-badges-section" aria-labelledby="identity-badges-heading">
        <div className="identity-section-heading"><div><p className="identity-eyebrow">{t(copy.badgesEyebrow)}</p><h2 id="identity-badges-heading">{t(copy.badgesHeading)}</h2></div><span>{t(copy.badgesCount)(identityBadges.length)}</span></div>
        <div className="identity-badges-grid">
          {identityBadges.map((badge) => (
            <article className="identity-badge" key={badge.id}>
              <span className="identity-badge-number">{badge.number}</span>
              <span className="identity-badge-mark"><BadgeCheck size={22} strokeWidth={1.4} /></span>
              <h3>{t(badge.title)}</h3>
              <p>{t(badge.detail)}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="identity-profile-grid">
        <section className="identity-interests" aria-labelledby="identity-interests-heading">
          <div className="identity-section-heading"><div><p className="identity-eyebrow">{t(copy.interestsEyebrow)}</p><h2 id="identity-interests-heading">{t(copy.interestsHeading)}</h2></div></div>
          <div className="identity-interest-list">{t(identityProfile.interests).map((interest, index) => <span key={interest}><b>0{index + 1}</b>{interest}</span>)}</div>
        </section>

        <section className="identity-connections" aria-labelledby="identity-connections-heading">
          <div className="identity-section-heading"><div><p className="identity-eyebrow">{t(copy.connectionsEyebrow)}</p><h2 id="identity-connections-heading">{t(copy.connectionsHeading)}</h2></div><span>{joinedTeams.length.toString().padStart(2, '0')}</span></div>
          {joinedTeams.length ? (
            <div className="identity-connection-list">
              {joinedTeams.map((team) => (
                <article className="identity-connection" key={team.id}>
                  <span className="identity-connection-mark"><UsersRound size={15} /></span>
                  <div><strong>{t(team.teamName)}</strong><p>{t(team.eventTitle)}</p><span>{t(team.eventDate)} · {t(copy.connectionIntent)}</span></div>
                </article>
              ))}
            </div>
          ) : (
            <div className="identity-connections-empty"><p>{t(copy.connectionsEmpty)}</p><button type="button" onClick={onFindEvents}>{t(copy.findCompanions)} <ArrowUpRight size={14} /></button></div>
          )}
        </section>
      </div>

      <section className="identity-next-section" aria-labelledby="identity-next-heading">
        <div className="identity-section-heading"><div><p className="identity-eyebrow">{t(copy.nextEyebrow)}</p><h2 id="identity-next-heading">{t(copy.nextHeading)}</h2></div><span>{t(copy.nextCount)(plannedExperiences.length + joinedTeams.length + spaceVisitIntents.length)}</span></div>
        <div className="identity-next-grid">
          <section className="identity-next-group" aria-labelledby="identity-next-explore-heading">
            <div><p className="identity-eyebrow">{t(copy.nextExploreEyebrow)}</p><h3 id="identity-next-explore-heading">{t(copy.nextExploreHeading)}</h3></div>
            {plannedExperiences.length ? plannedExperiences.map((experience, index) => (
              <article className="identity-next-item" key={experience.id}>
                <span className="identity-next-index">{(index + 1).toString().padStart(2, '0')}</span>
                <div><strong>{t(experience.title)}</strong><p>{t(experience.location)} · {t(experience.date)} · {t(copy.nextPlannedState)}</p></div>
                <button type="button" onClick={onFindExplore} aria-label={t(copy.backToExploreAria)}><ArrowUpRight size={14} /></button>
              </article>
            )) : <p className="identity-next-empty">{t(copy.nextEmptyExplore)}</p>}
          </section>

          <section className="identity-next-group" aria-labelledby="identity-next-events-heading">
            <div><p className="identity-eyebrow">{t(copy.nextEventsEyebrow)}</p><h3 id="identity-next-events-heading">{t(copy.nextEventsHeading)}</h3></div>
            {joinedTeams.length ? joinedTeams.map((team) => (
              <article className="identity-next-item" key={team.id}>
                <span className="identity-next-index"><UsersRound size={14} /></span>
                <div><strong>{t(team.teamName)}</strong><p>{t(team.eventTitle)} · {t(team.eventDate)} · {t(copy.nextIntentState)}</p></div>
                <button type="button" onClick={onFindEvents} aria-label={t(copy.backToEventsAria)}><ArrowUpRight size={14} /></button>
              </article>
            )) : <p className="identity-next-empty">{t(copy.nextEmptyEvents)}</p>}
          </section>

          <section className="identity-next-group" aria-labelledby="identity-next-space-heading">
            <div><p className="identity-eyebrow">{t(copy.nextSpaceEyebrow)}</p><h3 id="identity-next-space-heading">{t(copy.nextSpaceHeading)}</h3></div>
            {spaceVisitIntents.length ? spaceVisitIntents.map(({ space, slot }) => (
              <article className="identity-next-item" key={space.id}>
                <span className="identity-next-index"><MapPin size={14} /></span>
                <div><strong>{t(space.name)}</strong><p>{t(slot.label)} · {t(space.district)} · {t(copy.nextIntentState)}</p></div>
                <button type="button" onClick={onFindSpace} aria-label={t(copy.backToSpaceAria)}><ArrowUpRight size={14} /></button>
              </article>
            )) : <p className="identity-next-empty">{t(copy.nextEmptySpace)}</p>}
          </section>
        </div>
        <p className="identity-next-disclosure">{t(copy.nextDisclosure)}</p>
      </section>

      <section className="identity-record-section" aria-labelledby="identity-record-heading">
        <div className="identity-section-heading"><div><p className="identity-eyebrow">{t(copy.recordEyebrow)}</p><h2 id="identity-record-heading">{t(copy.recordHeading)}</h2></div><BookOpen size={18} /></div>
        <div className="identity-record-layout">
          {experienceDraft && (
            <div className="identity-prefill-banner">
              <div><span>{t(copy.prefillLabel)}</span><strong>{experienceDraft.title}</strong><p>{experienceDraft.location}</p></div>
              <button type="button" onClick={onExperienceDraftConsumed} aria-label={t(copy.removeDraftAria)}><X size={16} /></button>
            </div>
          )}
          <form className="identity-record-form" onSubmit={addEntry}>
            <label htmlFor="identity-entry-title">{t(copy.formTitle)}<input id="identity-entry-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={60} placeholder={t(copy.formTitlePlaceholder)} required /></label>
            <label htmlFor="identity-entry-location">{t(copy.formLocation)}<input id="identity-entry-location" value={location} onChange={(event) => setLocation(event.target.value)} maxLength={50} placeholder={t(copy.formLocationPlaceholder)} /></label>
            <label htmlFor="identity-entry-note">{t(copy.formNote)}<textarea id="identity-entry-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={600} placeholder={t(copy.formNotePlaceholder)} rows={4} required /></label>
            <div className="identity-record-form-bottom">
              <span>{t(copy.counter)(note.length, 600)}</span>
              <div>
                {editingEntryId && <button className="identity-cancel-edit" type="button" onClick={cancelEdit}>{t(copy.cancelEdit)}</button>}
                <button className="identity-save-entry" type="submit">{editingEntryId ? <><Check size={16} />{t(copy.saveEdit)}</> : <><Plus size={16} />{t(copy.addEntry)}</>}</button>
              </div>
            </div>
            <p className="identity-reflection-disclosure">{t(copy.reflectionDisclosure)}</p>
          </form>
          <aside className="identity-record-aside"><span className="identity-record-aside-mark">“</span><p>{t(copy.asideLines)[0]}<br />{t(copy.asideLines)[1]}</p><span>{t(copy.fieldNoteLabel)} / {t(identityProfile.city)}</span></aside>
        </div>
        <p className="identity-announcement" aria-live="polite">{announcement}</p>
      </section>

      <section className="identity-timeline-section" aria-labelledby="identity-timeline-heading">
        <div className="identity-section-heading"><div><p className="identity-eyebrow">{t(copy.timelineEyebrow)(identityProfile.year)}</p><h2 id="identity-timeline-heading">{t(copy.timelineHeading)}</h2></div><span>{t(copy.timelineCount)(yearEntries.length)}</span></div>
        <div className="identity-archive-controls">
          <label className="identity-archive-search">{t(copy.searchLabel)}<input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} maxLength={80} placeholder={t(copy.searchPlaceholder)} /></label>
          <label className="identity-archive-source">{t(copy.sourceLabel)}<select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value as 'all' | 'user' | 'demo')}><option value="all">{t(copy.sourceAll)}</option><option value="user">{t(copy.sourceUser)}</option><option value="demo">{t(copy.sourceDemo)}</option></select></label>
        </div>
        <p className="identity-archive-result-count">{t(copy.resultCount)(filteredTimeline.length, yearEntries.length, identityProfile.year)}</p>
        {filteredTimeline.length ? (
          <div className="identity-timeline">
            {filteredTimeline.map((entry) => (
              <article className="identity-timeline-entry" key={entry.id}>
                <div className="identity-timeline-date"><span>{entry.date.slice(5, 7)}</span><b>{entry.date.slice(8, 10)}</b><small>{entry.date.slice(0, 4)}</small></div>
                <div className="identity-timeline-marker" />
                <div className="identity-timeline-content">
                  <div className="identity-timeline-topline"><span>{entry.category}</span>{entry.source === 'demo' ? <b>{t(copy.entryDemoBadge)}</b> : <div className="identity-user-entry-actions">{entry.relatedExperienceId && <b>{t(copy.entryFromExplore)}</b>}<button type="button" onClick={() => editEntry(entry)} aria-label={t(copy.editAria)(entry.title)}><BookOpen size={14} />{t(copy.entryEdit)}</button><button type="button" onClick={() => removeEntry(entry.id)} aria-label={t(copy.deleteAria)(entry.title)}><Trash2 size={14} />{t(copy.entryDelete)}</button></div>}</div>
                  <h3>{entry.title}</h3>
                  <p className="identity-entry-location"><MapPin size={13} />{entry.location}</p>
                  <p className="identity-entry-note">{entry.note}</p>
                  <div className="identity-entry-reflection"><span>{t(copy.reflectLabel)}</span><p>{entry.reflection}</p></div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="identity-timeline-empty"><BookOpen size={21} /><p>{yearEntries.length ? t(copy.emptyNoMatch) : t(copy.emptyYear)}</p><button type="button" onClick={() => { setSearchQuery(''); setSourceFilter('all') }}>{t(copy.resetSearch)}</button></div>
        )}
      </section>
      <div className="identity-footer-mark"><span>AS WE WANDER, WE BECOME.</span><span>{t(copy.footerMark)(identityProfile.year)}</span></div>

      {ticketsOpen && (
        <TicketVault
          tickets={tickets}
          onCancelTicket={cancelTicket}
          onClose={() => {
            setTicketsOpen(false)
            onTicketsRequestedConsumed?.()
            // 等弹层卸载的那一帧结束后再把焦点还给入口按钮。
            window.requestAnimationFrame(() => ticketButtonRef.current?.focus())
          }}
        />
      )}
    </div>
  )
}

export default IdentityView