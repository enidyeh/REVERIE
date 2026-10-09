import { useEffect, useState } from 'react'
import { ArrowUpRight, CalendarDays, Check, Clock3, MapPin, UsersRound, X } from 'lucide-react'
import { cityEvents, eventsFormats, type CityEvent, type EventTeam } from './data/events'
import { defaultDiscoverPreferences, discoverPreferencesStorageKey, parseDiscoverPreferences, type DiscoverPreferences } from './data/discover'
import PreferenceControls from './components/PreferenceControls'
import './events.css'

const storageKey = 'unseen:events:v1'
const teamIds = new Set(cityEvents.flatMap((event) => event.teams.map((team) => team.id)))

function loadJoinedTeamIds(): string[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    return Array.isArray(saved)
      ? saved.filter((id): id is string => typeof id === 'string' && teamIds.has(id))
      : []
  } catch {
    return []
  }
}

function loadDiscoverPreferences(): DiscoverPreferences {
  try {
    return parseDiscoverPreferences(JSON.parse(localStorage.getItem(discoverPreferencesStorageKey) ?? 'null'))
  } catch {
    return defaultDiscoverPreferences
  }
}

function getEventAvailability(event: CityEvent, joinedTeamIds: string[]) {
  const joinedTeam = event.teams.find((team) => joinedTeamIds.includes(team.id))
  const openTeams = event.teams.filter((team) => team.members < team.capacity).length
  const remainingSeats = event.teams.reduce((count, team) => {
    const joinedMember = joinedTeam?.id === team.id ? 1 : 0
    return count + Math.max(0, team.capacity - team.members - joinedMember)
  }, 0)
  return { joinedTeam, openTeams, remainingSeats }
}

function getPreferenceFitLabels(event: CityEvent, preferences: DiscoverPreferences) {
  const labels: string[] = []
  if (preferences.interest !== 'all') labels.push('兴趣匹配')
  if (preferences.timeLimit !== 'any') labels.push('时长适配')
  if (preferences.company !== 'any') labels.push(event.socialFit === 'both' ? '独自/同行都可' : '出行方式匹配')
  return labels.length ? labels : [event.interest === 'city' ? '城市观察' : event.interest === 'make' ? '动手体验' : '聆听现场']
}

function EventDetails({
  event,
  joinedTeamIds,
  onClose,
  onToggleTeam,
}: {
  event: CityEvent
  joinedTeamIds: string[]
  onClose: () => void
  onToggleTeam: (team: EventTeam, eventId: string) => void
}) {
  useEffect(() => {
    function handleKeyDown(keyEvent: KeyboardEvent) {
      if (keyEvent.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const joinedTeam = event.teams.find((team) => joinedTeamIds.includes(team.id))

  return (
    <div className="event-dialog-backdrop" onMouseDown={(mouseEvent) => { if (mouseEvent.target === mouseEvent.currentTarget) onClose() }}>
      <section className="event-dialog" role="dialog" aria-modal="true" aria-labelledby="event-dialog-title">
        <button className="event-dialog-close" type="button" onClick={onClose} aria-label="关闭活动详情"><X size={19} /></button>
        <div className="event-dialog-image"><img src={event.image} alt={event.imageAlt} /></div>
        <div className="event-dialog-content">
          <p className="event-eyebrow">{event.category} <span>/</span> SHANGHAI</p>
          <h2 id="event-dialog-title">{event.title}</h2>
          {event.subtitle && <p className="event-subtitle">{event.subtitle}</p>}
          <p className="event-description">{event.description}</p>
          {event.program && (
            <div className="event-program">
              <p className="event-eyebrow">PROGRAM / 活动内容</p>
              <div className="event-program-list">
                {event.program.map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>
          )}
          <div className="event-detail-meta">
            <span><CalendarDays size={15} />{event.date}</span>
            <span><MapPin size={15} />{event.venue} · {event.district}</span>
            <span><Clock3 size={15} />{event.duration} · {event.price}</span>
          </div>

          <div className="event-teams-heading">
            <div><p className="event-eyebrow">MEET BEFORE YOU GO</p><h3>看看谁也想去。</h3></div>
            <span>{event.teams.length} 个小队</span>
          </div>
          <div className="event-team-list">
            {event.teams.map((team) => {
              const isJoined = joinedTeamIds.includes(team.id)
              const isFull = team.members >= team.capacity
              const joinedElsewhere = Boolean(joinedTeam && joinedTeam.id !== team.id)
              const memberCount = team.members + (isJoined ? 1 : 0)
              const disabled = !isJoined && (isFull || joinedElsewhere)

              return (
                <article className={`event-team ${isJoined ? 'is-joined' : ''}`} key={team.id}>
                  <div className="event-team-copy">
                    <h4>{team.name}</h4>
                    <p>{team.note}</p>
                    <span><UsersRound size={13} />{memberCount}/{team.capacity} 位同行者</span>
                  </div>
                  <button
                    className={`event-team-action ${isJoined ? 'is-joined' : ''}`}
                    type="button"
                    disabled={disabled}
                    onClick={() => onToggleTeam(team, event.id)}
                  >
                    {isJoined ? <><Check size={15} />退出小队</> : isFull ? '小队已满' : joinedElsewhere ? '已加入其他小队' : <>加入小队 <ArrowUpRight size={15} /></>}
                  </button>
                </article>
              )
            })}
          </div>
          <p className="event-demo-note">虚构活动与小队 · 加入仅用于本地演示，不代表真实报名</p>
        </div>
      </section>
    </div>
  )
}

function EventsView() {
  const [joinedTeamIds, setJoinedTeamIds] = useState<string[]>(loadJoinedTeamIds)
  const [preferences, setPreferences] = useState<DiscoverPreferences>(loadDiscoverPreferences)
  const [selectedEvent, setSelectedEvent] = useState<CityEvent | null>(null)
  const totalTeams = cityEvents.reduce((count, event) => count + event.teams.length, 0)

  const matchingEvents = cityEvents.filter((event) => {
    if (preferences.interest !== 'all' && event.interest !== preferences.interest) return false
    if (preferences.timeLimit !== 'any' && event.durationMinutes > Number(preferences.timeLimit)) return false
    if (preferences.company !== 'any' && event.socialFit !== 'both' && event.socialFit !== preferences.company) return false
    return true
  })
  const hasActivePreferences = Object.entries(preferences).some(([key, value]) => value !== defaultDiscoverPreferences[key as keyof DiscoverPreferences])

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(joinedTeamIds))
    } catch {
      // Keep the current session usable when browser storage is unavailable.
    }
  }, [joinedTeamIds])

  useEffect(() => {
    try {
      localStorage.setItem(discoverPreferencesStorageKey, JSON.stringify(preferences))
    } catch {
      // Keep the current session usable when browser storage is unavailable.
    }
  }, [preferences])

  function toggleTeam(team: EventTeam, eventId: string) {
    setJoinedTeamIds((current) => {
      const currentEvent = cityEvents.find((item) => item.id === eventId)
      const otherTeamJoined = currentEvent?.teams.some((item) => item.id !== team.id && current.includes(item.id))
      if (current.includes(team.id)) return current.filter((id) => id !== team.id)
      if (otherTeamJoined || team.members >= team.capacity) return current
      return [...current, team.id]
    })
  }

  return (
    <div className="events-page">
      {/* 形式清单来自项目方，均为可选形式；只做说明，不可点击、也不筛选列表。 */}
      <div className="events-formats">
        <p className="event-eyebrow">{eventsFormats.label}</p>
        <ul>
          {eventsFormats.items.map((format) => <li key={format}>{format}</li>)}
        </ul>
      </div>
      <section className="events-preferences" aria-label="活动偏好筛选">
        <div className="events-preferences-heading"><p className="event-eyebrow">YOUR WEEK / 本地偏好</p>{hasActivePreferences && <button type="button" onClick={() => setPreferences(defaultDiscoverPreferences)}>清除筛选</button>}</div>
        <PreferenceControls preferences={preferences} onChange={(key, value) => setPreferences((current) => ({ ...current, [key]: value }))} />
      </section>

      <div className="events-curation-line">
        <span>EDITOR'S PICKS / 演示活动</span>
        <span>{matchingEvents.length} / 03 场符合偏好 <i /> {totalTeams} 个同行小队</span>
      </div>

      {matchingEvents.length ? matchingEvents.map((event, index) => {
        const availability = getEventAvailability(event, joinedTeamIds)
        const matchLabels = getPreferenceFitLabels(event, preferences)
        return index === 0 ? (
        <article className="event-feature" key={event.id}>
          <button className="event-feature-image" type="button" onClick={() => setSelectedEvent(event)} aria-label={`查看活动详情：${event.title}`}>
            <img src={event.image} alt={event.imageAlt} />
            <span className="event-image-index">EVENT / 0{index + 1}</span>
            <span className="event-image-stamp">{event.category.split(' / ')[0]}</span>
          </button>
          <div className="event-feature-copy">
            <p className="event-eyebrow">{event.category}</p>
            <h3>{event.title}</h3>
            {event.subtitle && <p className="event-subtitle">{event.subtitle}</p>}
            <div className="event-fit-tags">{matchLabels.map((label) => <span key={label}>{label}</span>)}</div>
            <p className="event-feature-description">{event.description}</p>
            <div className="event-feature-meta"><span><CalendarDays size={14} />{event.date}</span><span><MapPin size={14} />{event.district}</span><span>{event.price}</span></div>
            <div className="event-card-social-proof"><span><UsersRound size={13} />{availability.openTeams} 个小队可加入 · {availability.remainingSeats} 个空位</span>{availability.joinedTeam && <b><Check size={12} />已加入：{availability.joinedTeam.name}</b>}</div>
            <button className="event-primary-action" type="button" onClick={() => setSelectedEvent(event)}>查看活动与小队 <ArrowUpRight size={16} /></button>
          </div>
        </article>
      ) : (
        <article className="event-listing" key={event.id}>
          <button className="event-listing-image" type="button" onClick={() => setSelectedEvent(event)} aria-label={`查看活动详情：${event.title}`}>
            <img src={event.image} alt={event.imageAlt} />
            <span>0{index + 1}</span>
          </button>
          <div className="event-listing-copy">
            <p className="event-eyebrow">{event.category}</p>
            <h3>{event.title}</h3>
            <p>{event.date} <i /> {event.district} <i /> {event.price}</p>
            <span className="event-listing-social"><UsersRound size={12} />{availability.openTeams} 组可加入 · {availability.remainingSeats} 个空位{availability.joinedTeam && ` · 已加入 ${availability.joinedTeam.name}`}</span>
            <div className="event-fit-tags compact">{matchLabels.slice(0, 2).map((label) => <span key={label}>{label}</span>)}</div>
          </div>
          <button className="event-listing-action" type="button" onClick={() => setSelectedEvent(event)} aria-label={`打开活动详情：${event.title}`}><ArrowUpRight size={18} /></button>
        </article>
      )}) : (
        <div className="events-no-match">
          <UsersRound size={19} />
          <h3>这组偏好下还没有合适活动。</h3>
          <p>演示活动数量有限，调整偏好或显示全部活动。</p>
          <button type="button" onClick={() => setPreferences(defaultDiscoverPreferences)}>显示全部活动</button>
        </div>
      )}

      <p className="events-demo-footnote">活动、人名、时间、地点与小队均为虚构演示数据，不代表真实活动。</p>

      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          joinedTeamIds={joinedTeamIds}
          onClose={() => setSelectedEvent(null)}
          onToggleTeam={toggleTeam}
        />
      )}
    </div>
  )
}

export default EventsView