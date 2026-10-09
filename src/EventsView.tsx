import { useEffect, useState } from 'react'
import { ArrowUpRight, CalendarDays, Check, Clock3, MapPin, UsersRound, X } from 'lucide-react'
import { cityEvents, eventsFormats, type CityEvent, type EventTeam } from './data/events'
import { defaultDiscoverPreferences, discoverPreferencesStorageKey, parseDiscoverPreferences, type DiscoverPreferences } from './data/discover'
import PreferenceControls from './components/PreferenceControls'
import { eventsCopy as copy } from './i18n/events'
import { useLocale } from './i18n/use-locale'
import type { Locale } from './i18n/messages'
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

function getPreferenceFitLabels(event: CityEvent, preferences: DiscoverPreferences, locale: Locale) {
  const t = (value: { zh: string; en: string }) => (locale === 'en' ? value.en : value.zh)
  const labels: string[] = []
  if (preferences.interest !== 'all') labels.push(t(copy.fitInterest))
  if (preferences.timeLimit !== 'any') labels.push(t(copy.fitTime))
  if (preferences.company !== 'any') labels.push(event.socialFit === 'both' ? t(copy.fitCompanyBoth) : t(copy.fitCompany))
  return labels.length ? labels : [event.interest === 'city' ? t(copy.fitCity) : event.interest === 'make' ? t(copy.fitMake) : t(copy.fitListen)]
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
  const { t } = useLocale()

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
        <button className="event-dialog-close" type="button" onClick={onClose} aria-label={t(copy.detailClose)}><X size={19} /></button>
        <div className="event-dialog-image"><img src={event.image} alt={t(event.imageAlt)} /></div>
        <div className="event-dialog-content">
          <p className="event-eyebrow">{t(event.category)} <span>/</span> SHANGHAI</p>
          <h2 id="event-dialog-title">{t(event.title)}</h2>
          {event.subtitle && <p className="event-subtitle">{t(event.subtitle)}</p>}
          <p className="event-description">{t(event.description)}</p>
          {event.program && (
            <div className="event-program">
              <p className="event-eyebrow">{t(copy.programLabel)}</p>
              <div className="event-program-list">
                {t(event.program).map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>
          )}
          <div className="event-detail-meta">
            <span><CalendarDays size={15} />{t(event.date)}</span>
            <span><MapPin size={15} />{t(event.venue)} · {t(event.district)}</span>
            <span><Clock3 size={15} />{t(event.duration)} · {t(event.price)}</span>
          </div>

          <div className="event-teams-heading">
            <div>
              {t(copy.teamsEyebrow) && <p className="event-eyebrow">{t(copy.teamsEyebrow)}</p>}
              <h3>{t(copy.teamsHeading)}</h3>
            </div>
            <span>{t(copy.teamsCount)(event.teams.length)}</span>
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
                    <h4>{t(team.name)}</h4>
                    <p>{t(team.note)}</p>
                    <span><UsersRound size={13} />{t(copy.membersLine)(memberCount, team.capacity)}</span>
                  </div>
                  <button
                    className={`event-team-action ${isJoined ? 'is-joined' : ''}`}
                    type="button"
                    disabled={disabled}
                    onClick={() => onToggleTeam(team, event.id)}
                  >
                    {isJoined ? <><Check size={15} />{t(copy.leaveSquad)}</> : isFull ? t(copy.squadFull) : joinedElsewhere ? t(copy.joinedOtherSquad) : <>{t(copy.joinSquad)} <ArrowUpRight size={15} /></>}
                  </button>
                </article>
              )
            })}
          </div>
          <p className="event-demo-note">{t(copy.demoNote)}</p>
        </div>
      </section>
    </div>
  )
}

function EventsView() {
  const { locale, t } = useLocale()
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
        <p className="event-eyebrow">{t(eventsFormats.label)}</p>
        <ul>
          {t(eventsFormats.items).map((format) => <li key={format}>{format}</li>)}
        </ul>
      </div>
      <section className="events-preferences" aria-label={t(copy.preferencesLabel)}>
        <div className="events-preferences-heading"><p className="event-eyebrow">{t(copy.preferencesEyebrow)}</p>{hasActivePreferences && <button type="button" onClick={() => setPreferences(defaultDiscoverPreferences)}>{t(copy.clearFilters)}</button>}</div>
        <PreferenceControls preferences={preferences} onChange={(key, value) => setPreferences((current) => ({ ...current, [key]: value }))} />
      </section>

      <div className="events-curation-line">
        <span>{t(copy.curationEyebrow)}</span>
        <span>{t(copy.curationCount)(matchingEvents.length, 3)} <i /> {t(copy.squadsTotal)(totalTeams)}</span>
      </div>

      {matchingEvents.length ? matchingEvents.map((event, index) => {
        const availability = getEventAvailability(event, joinedTeamIds)
        const matchLabels = getPreferenceFitLabels(event, preferences, locale)
        return index === 0 ? (
        <article className="event-feature" key={event.id}>
          <button className="event-feature-image" type="button" onClick={() => setSelectedEvent(event)} aria-label={t(copy.viewEventAria)(t(event.title))}>
            <img src={event.image} alt={t(event.imageAlt)} />
            <span className="event-image-index">{t(copy.imageIndex)(index + 1)}</span>
            <span className="event-image-stamp">{t(event.category)}</span>
          </button>
          <div className="event-feature-copy">
            <p className="event-eyebrow">{t(event.category)}</p>
            <h3>{t(event.title)}</h3>
            {event.subtitle && <p className="event-subtitle">{t(event.subtitle)}</p>}
            <div className="event-fit-tags">{matchLabels.map((label) => <span key={label}>{label}</span>)}</div>
            <p className="event-feature-description">{t(event.description)}</p>
            <div className="event-feature-meta"><span><CalendarDays size={14} />{t(event.date)}</span><span><MapPin size={14} />{t(event.district)}</span><span>{t(event.price)}</span></div>
            <div className="event-card-social-proof"><span><UsersRound size={13} />{t(copy.seatsLine)(availability.openTeams, availability.remainingSeats)}</span>{availability.joinedTeam && <b><Check size={12} />{t(copy.joinedLabel)(t(availability.joinedTeam.name))}</b>}</div>
            <button className="event-primary-action" type="button" onClick={() => setSelectedEvent(event)}>{t(copy.viewEventSquads)} <ArrowUpRight size={16} /></button>
          </div>
        </article>
      ) : (
        <article className="event-listing" key={event.id}>
          <button className="event-listing-image" type="button" onClick={() => setSelectedEvent(event)} aria-label={t(copy.viewEventAria)(t(event.title))}>
            <img src={event.image} alt={t(event.imageAlt)} />
            <span>0{index + 1}</span>
          </button>
          <div className="event-listing-copy">
            <p className="event-eyebrow">{t(event.category)}</p>
            <h3>{t(event.title)}</h3>
            <p>{t(event.date)} <i /> {t(event.district)} <i /> {t(event.price)}</p>
            <span className="event-listing-social"><UsersRound size={12} />{t(copy.seatsLineCompact)(availability.openTeams, availability.remainingSeats)}{availability.joinedTeam && t(copy.joinedCompact)(t(availability.joinedTeam.name))}</span>
            <div className="event-fit-tags compact">{matchLabels.slice(0, 2).map((label) => <span key={label}>{label}</span>)}</div>
          </div>
          <button className="event-listing-action" type="button" onClick={() => setSelectedEvent(event)} aria-label={t(copy.openEventAria)(t(event.title))}><ArrowUpRight size={18} /></button>
        </article>
      )}) : (
        <div className="events-no-match">
          <UsersRound size={19} />
          <h3>{t(copy.emptyHeading)}</h3>
          <p>{t(copy.emptyBody)}</p>
          <button type="button" onClick={() => setPreferences(defaultDiscoverPreferences)}>{t(copy.emptyAction)}</button>
        </div>
      )}

      <p className="events-demo-footnote">{t(copy.footnote)}</p>

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