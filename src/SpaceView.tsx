import { useEffect, useState } from 'react'
import { ArrowUpRight, CalendarDays, Check, Clock3, MapPin, X } from 'lucide-react'
import { defaultDiscoverPreferences, discoverPreferencesStorageKey, parseDiscoverPreferences, type DiscoverPreferences } from './data/discover'
import { youthSpaces, type SpaceVisitSlot, type YouthSpace } from './data/spaces'
import PreferenceControls from './components/PreferenceControls'
import { spaceCopy as copy } from './i18n/space'
import { useLocale } from './i18n/use-locale'
import type { Locale } from './i18n/messages'
import './space.css'

type ReservationIntent = { spaceId: string; slotId: string }

const storageKey = 'unseen:space:v1'
const spacesById = new Map(youthSpaces.map((space) => [space.id, space]))

function loadReservationIntents(): ReservationIntent[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    if (!Array.isArray(saved)) return []

    const seenSpaces = new Set<string>()
    const reservations: ReservationIntent[] = []
    for (const item of saved) {
      if (typeof item !== 'object' || item === null) continue
      const candidate = item as Record<string, unknown>
      if (typeof candidate.spaceId !== 'string' || typeof candidate.slotId !== 'string') continue
      const space = spacesById.get(candidate.spaceId)
      if (!space || seenSpaces.has(space.id) || !space.visitSlots.some((slot) => slot.id === candidate.slotId)) continue
      seenSpaces.add(space.id)
      reservations.push({ spaceId: space.id, slotId: candidate.slotId })
    }
    return reservations
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

function getSpaceFitLabels(space: YouthSpace, preferences: DiscoverPreferences, locale: Locale) {
  const t = (value: { zh: string; en: string }) => (locale === 'en' ? value.en : value.zh)
  const labels: string[] = []
  if (preferences.interest !== 'all') labels.push(t(copy.fitInterest))
  if (preferences.timeLimit !== 'any') labels.push(t(copy.fitTime))
  if (preferences.company !== 'any') labels.push(space.socialFit === 'both' ? t(copy.fitCompanyBoth) : t(copy.fitCompany))
  return labels.length ? labels : [space.interest === 'city' ? t(copy.fitCity) : space.interest === 'make' ? t(copy.fitMake) : t(copy.fitListen)]
}

function SpaceDetails({
  space,
  reservation,
  selectedSlotId,
  onSelectSlot,
  onClose,
  onReserve,
  onCancel,
}: {
  space: YouthSpace
  reservation: ReservationIntent | undefined
  selectedSlotId: string
  onSelectSlot: (slotId: string) => void
  onClose: () => void
  onReserve: (slot: SpaceVisitSlot) => void
  onCancel: () => void
}) {
  const { t } = useLocale()

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const selectedSlot = space.visitSlots.find((slot) => slot.id === selectedSlotId) ?? space.visitSlots[0]
  const reservedSlot = space.visitSlots.find((slot) => slot.id === reservation?.slotId)

  return (
    <div className="space-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="space-dialog" role="dialog" aria-modal="true" aria-labelledby="space-dialog-title">
        <button className="space-dialog-close" type="button" onClick={onClose} aria-label={t(copy.detailClose)}><X size={19} /></button>
        <div className="space-dialog-image"><img src={space.image} alt={t(space.imageAlt)} /></div>
        <div className="space-dialog-content">
          <p className="space-eyebrow">{t(space.category)} <span>/</span> SHANGHAI</p>
          <h2 id="space-dialog-title">{t(space.name)}</h2>
          <p className="space-description">{t(space.description)}</p>
          <div className="space-detail-meta">
            <span><MapPin size={14} />{t(space.address)} · {t(space.district)}</span>
            <span><Clock3 size={14} />{t(space.hours)}</span>
            <span>{t(space.price)}</span>
          </div>
          <div className="space-activities"><p className="space-eyebrow">{t(copy.hereYouCan)}</p><div>{t(space.activities).map((activity) => <span key={activity}>{activity}</span>)}</div></div>
          <div className="space-visit-guide"><p className="space-eyebrow">{t(copy.beforeYouGo)}</p><strong>{t(space.visitDuration)}</strong><p>{t(space.visitGuide)}</p></div>

          {reservation && reservedSlot ? (
            <div className="space-reservation-result" role="status">
              <p className="space-eyebrow"><Check size={13} /> {t(copy.reservedRecorded)}</p>
              <strong>{t(reservedSlot.label)}</strong>
              <p>{t(copy.reservedNote)}</p>
              <button className="space-cancel-action" type="button" onClick={onCancel}>{t(copy.cancelIntent)}</button>
            </div>
          ) : (
            <div className="space-reservation-form">
              <div className="space-time-heading"><div><h3>{t(copy.timeHeading)}</h3></div><CalendarDays size={17} /></div>
              <div className="space-time-options" role="group" aria-label={t(copy.timeGroupLabel)}>
                {space.visitSlots.map((slot) => (
                  <button className={selectedSlotId === slot.id ? 'is-selected' : ''} type="button" key={slot.id} aria-pressed={selectedSlotId === slot.id} onClick={() => onSelectSlot(slot.id)}>{t(slot.label)}</button>
                ))}
              </div>
              <button className="space-primary-action" type="button" disabled={!selectedSlot} onClick={() => selectedSlot && onReserve(selectedSlot)}>{t(copy.submitIntent)} <ArrowUpRight size={16} /></button>
              <p className="space-demo-note">{t(copy.demoNote)}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function SpaceView() {
  const { locale, t } = useLocale()
  const [reservations, setReservations] = useState<ReservationIntent[]>(loadReservationIntents)
  const [preferences, setPreferences] = useState<DiscoverPreferences>(loadDiscoverPreferences)
  const [selectedSpace, setSelectedSpace] = useState<YouthSpace | null>(null)
  const [selectedSlotId, setSelectedSlotId] = useState('')
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(reservations))
    } catch {
      // Keep the current session usable when browser storage is unavailable.
    }
  }, [reservations])

  useEffect(() => {
    try {
      localStorage.setItem(discoverPreferencesStorageKey, JSON.stringify(preferences))
    } catch {
      // Keep the current session usable when browser storage is unavailable.
    }
  }, [preferences])

  const matchingSpaces = youthSpaces.filter((space) => {
    if (preferences.interest !== 'all' && space.interest !== preferences.interest) return false
    if (preferences.timeLimit !== 'any' && space.durationMinutes > Number(preferences.timeLimit)) return false
    if (preferences.company !== 'any' && space.socialFit !== 'both' && space.socialFit !== preferences.company) return false
    return true
  })
  const hasActivePreferences = Object.entries(preferences).some(([key, value]) => value !== defaultDiscoverPreferences[key as keyof DiscoverPreferences])
  const reservedSpaces = reservations.flatMap((reservation) => {
    const space = youthSpaces.find((item) => item.id === reservation.spaceId)
    const slot = space?.visitSlots.find((item) => item.id === reservation.slotId)
    return space && slot ? [{ space, slot }] : []
  })

  function openDetails(space: YouthSpace) {
    setSelectedSpace(space)
    setSelectedSlotId(space.visitSlots[0]?.id ?? '')
  }

  function reserveVisit(slot: SpaceVisitSlot) {
    if (!selectedSpace) return
    setReservations((current) => current.some((reservation) => reservation.spaceId === selectedSpace.id)
      ? current
      : [...current, { spaceId: selectedSpace.id, slotId: slot.id }])
    setAnnouncement(t(copy.announceReserved)(t(selectedSpace.name)))
  }

  function cancelVisit(spaceId: string) {
    setReservations((current) => current.filter((reservation) => reservation.spaceId !== spaceId))
    setAnnouncement(t(copy.announceCancelled))
  }

  return (
    <div className="space-page">
      <section className="space-preferences" aria-label={t(copy.preferencesLabel)}>
        <div className="space-preferences-heading"><p className="space-eyebrow">{t(copy.preferencesEyebrow)}</p>{hasActivePreferences && <button type="button" onClick={() => setPreferences(defaultDiscoverPreferences)}>{t(copy.clearFilters)}</button>}</div>
        <PreferenceControls preferences={preferences} onChange={(key, value) => setPreferences((current) => ({ ...current, [key]: value }))} />
      </section>

      {reservedSpaces.length > 0 && (
        <section className="space-visit-return" aria-label={t(copy.intentsLabel)}>
          <div><p className="space-eyebrow">{t(copy.intentsEyebrow)}</p><span>{t(copy.intentsCount)(reservedSpaces.length)}</span></div>
          <div className="space-visit-return-list">
            {reservedSpaces.map(({ space, slot }) => <button key={space.id} type="button" onClick={() => openDetails(space)}><span>{t(space.name)}</span><b>{t(slot.label)}</b><ArrowUpRight size={14} /></button>)}
          </div>
        </section>
      )}

      <section className="space-list" aria-label={t(copy.listLabel)}>
        {matchingSpaces.map((space, index) => {
          const reservation = reservations.find((entry) => entry.spaceId === space.id)
          const slot = space.visitSlots.find((entry) => entry.id === reservation?.slotId)
          const fitLabels = getSpaceFitLabels(space, preferences, locale)
          return index === 0 ? (
            <article className="space-feature" key={space.id}>
              <button className="space-feature-image" type="button" onClick={() => openDetails(space)} aria-label={t(copy.viewSpaceAria)(t(space.name))}>
                <img src={space.image} alt={t(space.imageAlt)} />
                <span>{t(copy.featureBadge)}</span>
                <b>{t(copy.featureTagline)}</b>
              </button>
              <div className="space-feature-copy">
                <p className="space-eyebrow">{t(space.category)}</p>
                <h3>{t(space.name)}</h3>
                <p className="space-feature-description">{t(space.description)}</p>
                <div className="space-fit-tags">{fitLabels.map((label) => <span key={label}>{label}</span>)}</div>
                <div className="space-feature-meta"><span><MapPin size={14} />{t(space.district)}</span><span><Clock3 size={14} />{t(space.hours)}</span></div>
                {reservation && slot ? <p className="space-booked-label"><Check size={14} />{t(copy.bookedLabel)(t(slot.label))}</p> : <p className="space-price-label">{t(space.price)}</p>}
                <button className="space-primary-action" type="button" onClick={() => openDetails(space)}>{reservation ? t(copy.viewIntent) : t(copy.viewSpaceSlots)} <ArrowUpRight size={16} /></button>
              </div>
            </article>
          ) : (
            <article className="space-listing" key={space.id}>
              <button className="space-listing-image" type="button" onClick={() => openDetails(space)} aria-label={t(copy.viewSpaceAria)(t(space.name))}>
                <img src={space.image} alt={t(space.imageAlt)} /><span>0{index + 1}</span>
              </button>
              <div className="space-listing-copy">
                <p className="space-eyebrow">{t(space.category)}</p>
                <h3>{t(space.name)}</h3>
                <p>{t(space.district)} <i /> {t(space.price)}</p>
                <span className="space-listing-fit">{fitLabels.slice(0, 2).join(' · ')}</span>
                {reservation && slot && <span className="space-listing-reserved"><Check size={12} />{t(copy.bookedLabel)(t(slot.label))}</span>}
              </div>
              <button className="space-listing-action" type="button" onClick={() => openDetails(space)} aria-label={t(copy.viewSlotsAria)(t(space.name))}><ArrowUpRight size={18} /></button>
            </article>
          )
        })}
        {matchingSpaces.length === 0 && (
          <div className="space-no-match">
            <MapPin size={19} />
            <h3>{t(copy.emptyHeading)}</h3>
            <p>{t(copy.emptyBody)}</p>
            <button type="button" onClick={() => setPreferences(defaultDiscoverPreferences)}>{t(copy.emptyAction)}</button>
          </div>
        )}
      </section>
      <p className="space-footnote">{t(copy.footnote)}</p>
      <p className="space-announcement" aria-live="polite">{announcement}</p>

      {selectedSpace && (
        <SpaceDetails
          space={selectedSpace}
          reservation={reservations.find((entry) => entry.spaceId === selectedSpace.id)}
          selectedSlotId={selectedSlotId}
          onSelectSlot={setSelectedSlotId}
          onClose={() => setSelectedSpace(null)}
          onReserve={reserveVisit}
          onCancel={() => cancelVisit(selectedSpace.id)}
        />
      )}
    </div>
  )
}

export default SpaceView