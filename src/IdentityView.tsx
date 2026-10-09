import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowUpRight, BadgeCheck, BookOpen, Check, MapPin, Plus, Ticket, Trash2, UsersRound, X } from 'lucide-react'
import { experiences, type ExperienceDraft } from './data/discover'
import { cityEvents } from './data/events'
import { demoArchiveEntries, identityBadges, identityProfile, type ArchiveEntry } from './data/identity'
import { youthSpaces } from './data/spaces'
import { loadTickets, persistTickets, type TicketRecord } from './tickets'
import { TicketVault } from './components/TicketVault'
import { pick } from './i18n/localize'
import { useLocale } from './i18n/use-locale'
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
      .map((team) => ({ eventTitle: event.title, teamName: team.name, eventDate: event.date })))
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

function createReflection(note: string) {
  if (/[人朋友同行聊]/.test(note)) return '这次体验里，连接也成为了值得带走的一部分。下次可以记下你们共同注意到的一个细节。'
  if (note.length > 100) return '你留下的不只是结果，还有观察过程。下次可以沿着这个细节，继续探索一点点。'
  return '从一个具体细节开始，就已经是一次出发。下次可以试着多留十分钟，看看还会遇见什么。'
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
  const { locale } = useLocale()
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

  const timeline = [...demoArchiveEntries, ...userEntries].sort((a, b) => b.date.localeCompare(a.date))
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
        location: location.trim().slice(0, 50) || '上海',
        note: trimmedNote.slice(0, 600),
        reflection: createReflection(trimmedNote),
      } : entry))
      setAnnouncement('个人记录已更新')
    } else {
      if (userEntries.length >= maximumEntries) return
      const entry: ArchiveEntry = {
        id: `identity-${Date.now()}`,
        date: localDate(),
        title: trimmedTitle.slice(0, 60),
        location: location.trim().slice(0, 50) || '上海',
        category: experienceDraft?.category ?? 'MY FIELD NOTE / 个人记录',
        note: trimmedNote.slice(0, 600),
        reflection: createReflection(trimmedNote),
        source: 'user',
        ...(experienceDraft ? { relatedExperienceId: experienceDraft.id } : {}),
      }
      setUserEntries((current) => [entry, ...current].slice(0, maximumEntries))
      setAnnouncement('这段经历已加入你的演示档案')
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
    setAnnouncement('这条个人记录已从本地档案移除')
  }

  // 取消票据：只从本机票夹移除这张演示票，不涉及退款或任何订单。
  function cancelTicket(id: string) {
    setTickets((current) => {
      const next = current.filter((ticket) => ticket.id !== id)
      persistTickets(next)
      return next
    })
    setAnnouncement('已取消这张演示票，已从票夹移除')
  }

  return (
    <div className="identity-page">
      <div className="section-meta"><span>IDENTITY / PERSONAL ARCHIVE</span><span>YEARBOOK · {identityProfile.year}</span></div>
      <header className="identity-cover">
        <div className="identity-cover-copy">
          <p className="identity-eyebrow"><span className="identity-live-dot" /> CITY PASSPORT / SHANGHAI</p>
          <h1>走过的地方，<br /><span>正在成为你。</span></h1>
          <p className="identity-cover-line">一份关于真实出发的年度档案。</p>
          <button className="identity-tickets-button" type="button" ref={ticketButtonRef} onClick={() => setTicketsOpen(true)}>
            <Ticket size={15} aria-hidden="true" />我的票据
            <span className="identity-tickets-count">{tickets.length.toString().padStart(2, '0')}</span>
          </button>
          <p className="identity-tickets-note">演示票据存在本机浏览器，不含手机号；票面二维码为占位，不可入场。</p>
        </div>
        <div className="identity-passport-wrap">
          <div className="identity-passport">
            <div className="identity-passport-top"><span>UNSEEN® / CITY PASSPORT</span><span>SH · {identityProfile.year}</span></div>
            <div className="identity-passport-seal">U<span>.</span></div>
            <div className="identity-passport-bottom"><div><span>HOLDER</span><strong>{identityProfile.alias}</strong></div><div><span>FIELD NOTES</span><strong>{yearEntries.length.toString().padStart(2, '0')}</strong></div></div>
          </div>
          <button className="identity-card-link" type="button" onClick={() => setAnnouncement('演示：实体卡的链接入口还没有接入，正式版会在这里打开实体卡页面。')}>
            链接实体卡片 <ArrowUpRight size={13} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="identity-demo-note"><span>DEMO ARCHIVE</span> 示例身份、徽章和过往体验为虚构数据；你新增的个人记录只保存在本机浏览器。</div>

      <section className="identity-badges-section" aria-labelledby="identity-badges-heading">
        <div className="identity-section-heading"><div><p className="identity-eyebrow">01 / YOUR PASSPORT</p><h2 id="identity-badges-heading">一路收下的小小证明。</h2></div><span>{identityBadges.length.toString().padStart(2, '0')} BADGES</span></div>
        <div className="identity-badges-grid">
          {identityBadges.map((badge) => (
            <article className="identity-badge" key={badge.id}>
              <span className="identity-badge-number">{badge.number}</span>
              <span className="identity-badge-mark"><BadgeCheck size={22} strokeWidth={1.4} /></span>
              <h3>{badge.title}</h3>
              <p>{badge.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="identity-profile-grid">
        <section className="identity-interests" aria-labelledby="identity-interests-heading">
          <div className="identity-section-heading"><div><p className="identity-eyebrow">02 / WHAT MOVES YOU</p><h2 id="identity-interests-heading">最近在意的事。</h2></div></div>
          <div className="identity-interest-list">{identityProfile.interests.map((interest, index) => <span key={interest}><b>0{index + 1}</b>{interest}</span>)}</div>
        </section>

        <section className="identity-connections" aria-labelledby="identity-connections-heading">
          <div className="identity-section-heading"><div><p className="identity-eyebrow">03 / PEOPLE ALONG THE WAY</p><h2 id="identity-connections-heading">同行小队。</h2></div><span>{joinedTeams.length.toString().padStart(2, '0')}</span></div>
          {joinedTeams.length ? (
            <div className="identity-connection-list">
              {joinedTeams.map((team) => (
                <article className="identity-connection" key={`${team.eventTitle}-${team.teamName}`}>
                  <span className="identity-connection-mark"><UsersRound size={15} /></span>
                  <div><strong>{team.teamName}</strong><p>{team.eventTitle}</p><span>{team.eventDate} · 演示同行意向</span></div>
                </article>
              ))}
            </div>
          ) : (
            <div className="identity-connections-empty"><p>还没有加入同行小队。</p><button type="button" onClick={onFindEvents}>去活动里找同伴 <ArrowUpRight size={14} /></button></div>
          )}
        </section>
      </div>

      <section className="identity-next-section" aria-labelledby="identity-next-heading">
        <div className="identity-section-heading"><div><p className="identity-eyebrow">04 / STILL IN MOTION</p><h2 id="identity-next-heading">正在路上的事。</h2></div><span>{(plannedExperiences.length + joinedTeams.length + spaceVisitIntents.length).toString().padStart(2, '0')} PLANNED</span></div>
        <div className="identity-next-grid">
          <section className="identity-next-group" aria-labelledby="identity-next-explore-heading">
            <div><p className="identity-eyebrow">EXPLORE / 已选体验</p><h3 id="identity-next-explore-heading">下一次出发</h3></div>
            {plannedExperiences.length ? plannedExperiences.map((experience, index) => (
              <article className="identity-next-item" key={experience.id}>
                <span className="identity-next-index">{(index + 1).toString().padStart(2, '0')}</span>
                <div><strong>{pick(locale, experience.title)}</strong><p>{pick(locale, experience.location)} · {pick(locale, experience.date)} · 计划中</p></div>
                <button type="button" onClick={onFindExplore} aria-label="返回 EXPLORE 查看计划"><ArrowUpRight size={14} /></button>
              </article>
            )) : <p className="identity-next-empty">还没有加入计划的体验。</p>}
          </section>

          <section className="identity-next-group" aria-labelledby="identity-next-events-heading">
            <div><p className="identity-eyebrow">EVENTS / 同行小队</p><h3 id="identity-next-events-heading">一起去现场</h3></div>
            {joinedTeams.length ? joinedTeams.map((team) => (
              <article className="identity-next-item" key={`${team.eventTitle}-${team.teamName}`}>
                <span className="identity-next-index"><UsersRound size={14} /></span>
                <div><strong>{team.teamName}</strong><p>{team.eventTitle} · {team.eventDate} · 意向中</p></div>
                <button type="button" onClick={onFindEvents} aria-label="返回 Events 查看小队"><ArrowUpRight size={14} /></button>
              </article>
            )) : <p className="identity-next-empty">还没有加入活动小队。</p>}
          </section>

          <section className="identity-next-group" aria-labelledby="identity-next-space-heading">
            <div><p className="identity-eyebrow">SPACE / 到访意向</p><h3 id="identity-next-space-heading">准备去看看</h3></div>
            {spaceVisitIntents.length ? spaceVisitIntents.map(({ space, slot }) => (
              <article className="identity-next-item" key={space.id}>
                <span className="identity-next-index"><MapPin size={14} /></span>
                <div><strong>{pick(locale, space.name)}</strong><p>{pick(locale, slot.label)} · {pick(locale, space.district)} · 意向中</p></div>
                <button type="button" onClick={onFindSpace} aria-label="返回 Space 查看预约意向"><ArrowUpRight size={14} /></button>
              </article>
            )) : <p className="identity-next-empty">还没有空间到访意向。</p>}
          </section>
        </div>
        <p className="identity-next-disclosure">这些是尚未完成的本地演示意向，不属于已完成体验记录。</p>
      </section>

      <section className="identity-record-section" aria-labelledby="identity-record-heading">
        <div className="identity-section-heading"><div><p className="identity-eyebrow">05 / WRITE IT INTO YOUR YEAR</p><h2 id="identity-record-heading">给经历留一个位置。</h2></div><BookOpen size={18} /></div>
        <div className="identity-record-layout">
          {experienceDraft && (
            <div className="identity-prefill-banner">
              <div><span>FROM EXPLORE / 演示体验</span><strong>{experienceDraft.title}</strong><p>{experienceDraft.location}</p></div>
              <button type="button" onClick={onExperienceDraftConsumed} aria-label="移除体验关联"><X size={16} /></button>
            </div>
          )}
          <form className="identity-record-form" onSubmit={addEntry}>
            <label htmlFor="identity-entry-title">这次经历叫什么？<input id="identity-entry-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={60} placeholder="例如：在陌生街区散了一会儿步" required /></label>
            <label htmlFor="identity-entry-location">在哪里发生？<input id="identity-entry-location" value={location} onChange={(event) => setLocation(event.target.value)} maxLength={50} placeholder="上海 · 某个街角" /></label>
            <label htmlFor="identity-entry-note">你想记住什么？<textarea id="identity-entry-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={600} placeholder="写下一个细节、一段对话，或当时的心情……" rows={4} required /></label>
            <div className="identity-record-form-bottom">
              <span>{note.length}/600 · 纯文字</span>
              <div>
                {editingEntryId && <button className="identity-cancel-edit" type="button" onClick={cancelEdit}>取消</button>}
                <button className="identity-save-entry" type="submit">{editingEntryId ? <><Check size={16} />保存修改</> : <><Plus size={16} />收进档案</>}</button>
              </div>
            </div>
            <p className="identity-reflection-disclosure">保存后会出现一条本地预设反思提示，不调用真实 AI。</p>
          </form>
          <aside className="identity-record-aside"><span className="identity-record-aside-mark">“</span><p>经历不必惊天动地，<br />被记住就有了形状。</p><span>FIELD NOTE / {identityProfile.city}</span></aside>
        </div>
        <p className="identity-announcement" aria-live="polite">{announcement}</p>
      </section>

      <section className="identity-timeline-section" aria-labelledby="identity-timeline-heading">
        <div className="identity-section-heading"><div><p className="identity-eyebrow">06 / {identityProfile.year} EXPERIENCE ARCHIVE</p><h2 id="identity-timeline-heading">这一年，正在展开。</h2></div><span>{yearEntries.length.toString().padStart(2, '0')} NOTES</span></div>
        <div className="identity-archive-controls">
          <label className="identity-archive-search">查找档案<input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} maxLength={80} placeholder="标题、地点或记录内容" /></label>
          <label className="identity-archive-source">来源<select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value as 'all' | 'user' | 'demo')}><option value="all">全部档案</option><option value="user">我的记录</option><option value="demo">示例档案</option></select></label>
        </div>
        <p className="identity-archive-result-count">显示 {filteredTimeline.length} / {yearEntries.length} 条 · {identityProfile.year}</p>
        {filteredTimeline.length ? (
          <div className="identity-timeline">
            {filteredTimeline.map((entry) => (
              <article className="identity-timeline-entry" key={entry.id}>
                <div className="identity-timeline-date"><span>{entry.date.slice(5, 7)}</span><b>{entry.date.slice(8, 10)}</b><small>{entry.date.slice(0, 4)}</small></div>
                <div className="identity-timeline-marker" />
                <div className="identity-timeline-content">
                  <div className="identity-timeline-topline"><span>{entry.category}</span>{entry.source === 'demo' ? <b>示例档案</b> : <div className="identity-user-entry-actions">{entry.relatedExperienceId && <b>来自 EXPLORE</b>}<button type="button" onClick={() => editEntry(entry)} aria-label={`编辑记录：${entry.title}`}><BookOpen size={14} />编辑</button><button type="button" onClick={() => removeEntry(entry.id)} aria-label={`删除记录：${entry.title}`}><Trash2 size={14} />删除</button></div>}</div>
                  <h3>{entry.title}</h3>
                  <p className="identity-entry-location"><MapPin size={13} />{entry.location}</p>
                  <p className="identity-entry-note">{entry.note}</p>
                  <div className="identity-entry-reflection"><span>REFLECT / 预设提示</span><p>{entry.reflection}</p></div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="identity-timeline-empty"><BookOpen size={21} /><p>{yearEntries.length ? '没有符合条件的档案。' : '今年的档案还空着。'}</p><button type="button" onClick={() => { setSearchQuery(''); setSourceFilter('all') }}>重置搜索</button></div>
        )}
      </section>
      <div className="identity-footer-mark"><span>AS WE WANDER, WE BECOME.</span><span>ARCHIVE / {identityProfile.year}</span></div>

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